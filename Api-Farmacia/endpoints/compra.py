import sqlite3
import datetime
from fastapi import APIRouter, HTTPException, status
from .modelos.modelos import Compra  # Importa o modelo correto

router = APIRouter()

# Função auxiliar para obter conexão e cursor
def get_db_connection():
    conn = sqlite3.connect("dados_farmacia.db")
    conn.row_factory = sqlite3.Row
    return conn, conn.cursor()

# ADD Compra
@router.post("/compra/", status_code=status.HTTP_201_CREATED)
async def create_compra(compra: Compra):
    conn, cursor = get_db_connection()
    try:
        # Verificar se todos os medicamentos existem e calcular o preço total
        preco_total = 0.0
        for medicamento_id, quantidade in zip(compra.medicamento_ids, compra.quantidade):
            # BUSCO ELES
            cursor.execute("SELECT preco, quantidade FROM Medicamento WHERE id = ?", (medicamento_id,))
            medicamento = cursor.fetchone()
            # SE NAO EXISTE
            if not medicamento:
                raise HTTPException(status_code=404, detail=f"Medicamento com ID {medicamento_id} não encontrado")

            # PEGA PRECO E ESTOQUE
            preco, estoque_atual = medicamento
            # SE SUA QUANTIDADE E MENOR QUE O ESTOQUE
            if quantidade > estoque_atual:
                raise HTTPException(status_code=400, detail=f"Estoque insuficiente para o medicamento com ID {medicamento_id}")

            # ATUALIZA PRECO TOTAL
            preco_total += preco * quantidade


        # Verificar se a 'quantidade' e 'medicamento_ids' têm o mesmo comprimento
        if len(compra.medicamento_ids) != len(compra.quantidade):
            raise HTTPException(status_code=400, detail="A quantidade de IDs dos medicamentos e quantidade não coincide")

        # REGISTRAR COMPRA
        dataSql = datetime.datetime.now().strftime('%Y-%m-%d')
        cursor.execute(
            "INSERT INTO Compra (cliente_id, data_compra, quantidade, preco_total) VALUES (?, ?, ?, ?)",
            (compra.cliente_id, dataSql, sum(compra.quantidade), preco_total)
        )
        compra_id = cursor.lastrowid

        # REGISTRAR A LISTA DE COMPRAS COM id DE COMPRA
        for medicamento_id, quantidade in zip(compra.medicamento_ids, compra.quantidade):
            cursor.execute(
                "INSERT INTO Compra_Medicamento (compra_id, medicamento_id, quantidade) VALUES (?, ?, ?)",
                (compra_id, medicamento_id, quantidade)
            )

            # ARUALIZA O ESTOQUE
            cursor.execute("UPDATE Medicamento SET quantidade = quantidade - ? WHERE id = ?", (quantidade, medicamento_id))
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail=f"Medicamento com ID {medicamento_id} não encontrado ou estoque insuficiente")

        conn.commit()
        return {"message": "Compra registrada com sucesso"}
    except HTTPException as e:
        # Propaga HTTPExceptions diretamente
        raise e
    except Exception as e:
        # Captura outras exceções e fornece detalhes
        conn.rollback()
        return {"error": str(e)}
    finally:
        conn.close()


# GET Compra POR ID
@router.get("/compra/{id}")
async def get_compra(id: int):
    conn, cursor = get_db_connection()
    try:
        query = "SELECT * FROM Compra WHERE id = ?"
        cursor.execute(query, (id,))
        dadosOne = cursor.fetchone()
        if not dadosOne:
            raise HTTPException(status_code=404, detail="Compra não encontrada")
        
        compra_info = {
            "id": dadosOne[0],
            "cliente_id": dadosOne[1],
            "data_compra": dadosOne[2],
            "quantidade": dadosOne[3],
            "preco_total": dadosOne[4]
        }
        
        # Recuperar medicamentos da compra
        cursor.execute("SELECT medicamento_id, quantidade FROM Compra_Medicamento WHERE compra_id = ?", (id,))
        medicamentos = cursor.fetchall()
        compra_info["medicamentos"] = [{"medicamento_id": med[0], "quantidade": med[1]} for med in medicamentos]
        
        return {"Compra": compra_info}
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()

# GET TODAS AS Compras
@router.get("/compra/")
async def get_all_compras():
    conn, cursor = get_db_connection()
    try:
        query = "SELECT * FROM Compra"
        cursor.execute(query)
        dadosAll = cursor.fetchall()
        if not dadosAll:
            raise HTTPException(status_code=404, detail="Nenhuma compra encontrada")
        
        compras_info = []
        for dadosOne in dadosAll:
            compra_info = {
                "id": dadosOne[0],
                "cliente_id": dadosOne[1],
                "data_compra": dadosOne[2],
                "quantidade": dadosOne[3],
                "preco_total": dadosOne[4]
            }

            # Recuperar medicamentos da compra
            cursor.execute("SELECT medicamento_id, quantidade FROM Compra_Medicamento WHERE compra_id = ?", (dadosOne[0],))
            medicamentos = cursor.fetchall()
            compra_info["medicamentos"] = [{"medicamento_id": med[0], "quantidade": med[1]} for med in medicamentos]
            
            compras_info.append(compra_info)
        
        return {"Compras": compras_info}
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()

# ATUALIZAR Compra POR ID
@router.put("/compra/{id}")
async def update_compra(id: int, compra: Compra):
    conn, cursor = get_db_connection()
    try:
        check_query = "SELECT id FROM Compra WHERE id = ?"
        cursor.execute(check_query, (id,))
        compraBool = cursor.fetchone()
        if not compraBool:
            raise HTTPException(status_code=404, detail=f"Compra com ID {id} não encontrada")

        # Verificar se todos os medicamentos existem
        for medicamento_id in compra.medicamento_ids:
            cursor.execute("SELECT * FROM Medicamento WHERE id = ?", (medicamento_id,))
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail=f"Medicamento com ID {medicamento_id} não encontrado")

        # Verificar se o cliente existe (se fornecido)
        if compra.cliente_id is not None:
            cursor.execute("SELECT * FROM Cliente WHERE id = ?", (compra.cliente_id,))
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Cliente informado não encontrado")

        # Atualizar a compra
        dataSql = datetime.datetime.now().strftime('%Y-%m-%d')
        cursor.execute(
            "UPDATE Compra SET cliente_id=?, data_compra=?, quantidade=?, preco_total=? WHERE id=?",
            (compra.cliente_id, dataSql, sum(compra.quantidade), sum(compra.quantidade) * 1.0)  # Ajustar conforme necessário
        )

        # Remover entradas antigas de medicamentos e inserir as novas
        cursor.execute("DELETE FROM Compra_Medicamento WHERE compra_id = ?", (id,))
        for medicamento_id, quantidade in zip(compra.medicamento_ids, compra.quantidade):
            cursor.execute(
                "INSERT INTO Compra_Medicamento (compra_id, medicamento_id, quantidade) VALUES (?, ?, ?)",
                (id, medicamento_id, quantidade)
            )
            
            # Atualizar estoque do medicamento
            cursor.execute("UPDATE Medicamento SET quantidade = quantidade - ? WHERE id = ?", (quantidade, medicamento_id))
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail=f"Medicamento com ID {medicamento_id} não encontrado ou estoque insuficiente")

        conn.commit()
        return {"message": f"Compra com ID {id} foi atualizada"}
    except HTTPException as e:
        raise e
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}
    finally:
        conn.close()

# DELETAR Compra POR ID
@router.delete("/compra/{id}")
async def delete_compra(id: int):
    conn, cursor = get_db_connection()
    try:
        # Verificar se a compra existe
        select_query = "SELECT * FROM Compra WHERE id = ?"
        cursor.execute(select_query, (id,))
        compra_data = cursor.fetchone()
        if not compra_data:
            raise HTTPException(status_code=404, detail=f"Compra com ID {id} não encontrada")

        # Remover medicamentos da compra
        cursor.execute("DELETE FROM Compra_Medicamento WHERE compra_id = ?", (id,))

        # Remover a compra
        query = "DELETE FROM Compra WHERE id = ?"
        cursor.execute(query, (id,))
        conn.commit()
        return {"message": f"Compra com ID {id} foi deletada"}
    except HTTPException as e:
        raise e
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}
    finally:
        conn.close()
