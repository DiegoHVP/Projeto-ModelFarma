import sqlite3
from fastapi import APIRouter, HTTPException, status
from .modelos.modelos import *
import json

router = APIRouter()

conn = sqlite3.connect('dados_farmacia.db')
cursor = conn.cursor()

def serialize_list(input_list):
    return json.dumps(input_list) if input_list else '[]'

def deserialize_list(db_value):
    # Verifica se o valor é None ou uma string vazia antes de tentar desserializar
    if db_value is None or db_value == '':
        return []
    try:
        return json.loads(db_value)
    except json.JSONDecodeError:
        # Se o valor não puder ser desserializado, retorna uma lista vazia
        return []

# ADD Medicamento
@router.post("/medicamento/", status_code=status.HTTP_201_CREATED)
async def create_medicamento(m: Medicamento):
    try:
        query = """INSERT INTO Medicamento 
                (vencimento, preco, quantidade, alergias, faixa_etaria, mg_ml, unidade, nome, farmacia_id, similares, genericos, reabastecer) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""
        values = ( 
            m.vencimento, m.preco, m.quantidade,
            serialize_list(m.alergias),  # Serializando a lista como string
            m.faixa_etaria, m.mg_ml,
            m.unidade, m.nome, m.farmacia_id,
            serialize_list(m.similares),  # Serializando a lista como string
            serialize_list(m.genericos),  # Serializando a lista como string
            m.reabastecer
        )
        
        cursor.execute(query, values)
        conn.commit()
        return {"message": "Medicamento criado com sucesso"}
    except Exception as e:
        return {"error": str(e)}

# GET Medicamento por ID
@router.get("/medicamento/{id}")
async def get_medicamento(id: int):
    try:
        query = "SELECT * FROM Medicamento WHERE id = ?"
        cursor.execute(query, (id,))
        dadosOne = cursor.fetchone()

        if not dadosOne:
            raise HTTPException(status_code=404, detail="Medicamento não encontrado")
        
        medicamentoDados = {
            "id": dadosOne[0],
            "nome": dadosOne[8],
            "vencimento": dadosOne[1],
            "preco": dadosOne[2],
            "quantidade": dadosOne[3],
            "alergias": deserialize_list(dadosOne[4]),  # Desserializando a string de volta para uma lista
            "faixa_etaria": dadosOne[5],
            "mg_ml": dadosOne[6],
            "unidade": dadosOne[7],
            "farmacia_id": dadosOne[9],
            "similares": deserialize_list(dadosOne[10]),  # Desserializando a string de volta para uma lista
            "genericos": deserialize_list(dadosOne[11]),  # Desserializando a string de volta para uma lista
            "reabastecer": dadosOne[12]
        }
        return {"Medicamento": medicamentoDados}
    except Exception as e:
        return {"error": str(e)}

# GET Todos os Medicamentos
# Se tive nome busca por medicamentos especificos
@router.get("/medicamento/")
async def get_all_medicamento(nome: Optional[str] = None):
    try:
        if nome:
            query = "SELECT * FROM Medicamento WHERE nome LIKE ?"
            cursor.execute(query, ('%' + nome + '%',))
        else:
            query = "SELECT * FROM Medicamento"
            cursor.execute(query)

        dadosAll = cursor.fetchall()
        
        medicamentosDados = []
        for dadosOne in dadosAll:
            tempDados =  {
                "id": dadosOne[0],
                "nome": dadosOne[8],
                "preco": dadosOne[2],
                "mg_ml": dadosOne[6],
                "vencimento": dadosOne[1],
                "quantidade": dadosOne[3],
                "alergias": deserialize_list(dadosOne[4]),  # Desserializando a string de volta para uma lista
                "faixa_etaria": dadosOne[5],
                "unidade": dadosOne[7],
                "farmacia_id": dadosOne[9],
                "similares": deserialize_list(dadosOne[10]),  # Desserializando a string de volta para uma lista
                "genericos": deserialize_list(dadosOne[11]),  # Desserializando a string de volta para uma lista
                "reabastecer": dadosOne[12]
            }
            medicamentosDados.append(tempDados)

        if len(medicamentosDados) != 0:
            return {"Medicamentos" : medicamentosDados}
        else:
            return {"message":"Não há medicamentos cadastrados"}
        
    except Exception as e:
        return {"error": str(e)}

# UPDATE Medicamento por ID
@router.put("/medicamento/{id}")
async def update_medicamento(id: int, medicamento: Medicamento):
    try:
        verificar = "SELECT id FROM Medicamento WHERE id = ?"
        cursor.execute(verificar, (id,))
        medicamentoBool = cursor.fetchone()

        if not medicamentoBool:
            return {"error": f"Medicamento com ID {id} não encontrado"}

        query = """UPDATE Medicamento SET 
                vencimento=?, preco=?, quantidade=?, alergias=?, faixa_etaria=?, 
                mg_ml=?, unidade=?, nome=?, farmacia_id=?, similares=?, genericos=?, reabastecer=?
                WHERE id=?"""
        values = (
            medicamento.vencimento, medicamento.preco, medicamento.quantidade,
            serialize_list(medicamento.alergias),  # Serializando a lista como string
            medicamento.faixa_etaria, medicamento.mg_ml,
            medicamento.unidade, medicamento.nome, medicamento.farmacia_id,
            serialize_list(medicamento.similares),  # Serializando a lista como string
            serialize_list(medicamento.genericos),  # Serializando a lista como string
            medicamento.reabastecer, id
        )
        cursor.execute(query, values)
        conn.commit()
        return {"message": f"Medicamento {medicamento.nome} foi atualizado"}
    except Exception as e:
        return {"error": str(e)}

# DELETE Medicamento por ID
@router.delete("/medicamento/{id}")
async def delete_medicamento(id: int):
    try:
        query_select = "SELECT * FROM Medicamento WHERE id = ?"
        cursor.execute(query_select, (id,))
        dadosOne = cursor.fetchone()

        if not dadosOne:
            return {"message": "Medicamento não encontrado"}

        nomeMedicamento = dadosOne[8]  # Pega o nome do Medicamento

        query_delete = "DELETE FROM Medicamento WHERE id = ?"
        cursor.execute(query_delete, (id,))
        conn.commit()

        return {"message": f"Medicamento {nomeMedicamento} foi deletado"}
    except Exception as e:
        return {"error": str(e)}
