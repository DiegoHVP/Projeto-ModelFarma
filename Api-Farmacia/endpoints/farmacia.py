import sqlite3
from fastapi import APIRouter, HTTPException, status
from .modelos.modelos import *

router = APIRouter()

conn = sqlite3.connect("dados_farmacia.db")
cursor = conn.cursor()

# CRUD Farmacia
# ADD Farmarcias
@router.post("/farmacia", status_code=status.HTTP_201_CREATED)
async def add_farmacia(farmacia: Farmacia):
    try:
        query = """INSERT INTO Farmacia (nome, local) VALUES (?, ?)"""
        values = (farmacia.nome, farmacia.local)
        cursor.execute(query, values)
        conn.commit()

        return {"message": f"Farmacia {farmacia.nome} foi cadastrada"}
    
    except Exception as e:
        return {"error": str(e)}

# GET Farmacia POR ID
@router.get("/farmacia/{id}")
async def get_farmacia(id: int):
    try:
        query = """SELECT * FROM Farmacia WHERE id = ?"""
        cursor.execute(query, (id,))
        dadosOne = cursor.fetchone()
        if not dadosOne:
            return {"message": "Farmacia não encontrada"}
        farmaciaDados = {
            "id": dadosOne[0],
            "nome": dadosOne[1],
            "local": dadosOne[2]
        }
        return {"farmacia": farmaciaDados}
    
    except Exception as e:
        return {"error": str(e)}

# GET TODAS AS Farmacias
@router.get("/farmacia")
async def getAll_farmacia():
    try:
        query = """SELECT * FROM Farmacia"""
        cursor.execute(query)
        dadosAll = cursor.fetchall()
        FarmaciaDados = []
        for dadosOne in dadosAll:
            tempDados = {
                "id": dadosOne[0],
                "nome": dadosOne[1],
                "local": dadosOne[2]
            }
            FarmaciaDados.append(tempDados)
        if len(FarmaciaDados)!=0:
            return {"farmacias" : FarmaciaDados}
        else:
            return {"message":"não há farmacias cadastradas"}
    
    except Exception as e:
        return {"error": str(e)}

# ATUALIZAR Farmacia POR ID
@router.put("/farmacia/{id}")
async def put_farmacia(id: int, farmacia: Farmacia):
    try:
        verificar= "SELECT id FROM Farmacia WHERE id = ?"
        cursor.execute(verificar, (id,))
        farmaciaBool = cursor.fetchone()

        if not farmaciaBool:
            return {"error": f"Farmacia com ID {id} não foi encontrado"}




        query = """UPDATE Farmacia SET nome=?, local=? WHERE id=?"""
        values = (farmacia.nome, farmacia.local, id)
        cursor.execute(query, values)
        conn.commit()
        return {"message": f"Farmacia {farmacia.nome} foi atualizada com sucesso"}
    
    except Exception as e:
        return {"error": str(e)}

# DELETAR Farmacia POR ID
@router.delete("/farmacia/{id}")
async def delete_farmacia(id: int):
    try:
        query_get_name = "SELECT nome FROM Farmacia WHERE id = ?"
        cursor.execute(query_get_name, (id,))
        dadosOne = cursor.fetchone()

        if not dadosOne:
            return {"message": "Farmacia não encontrada"}

        nomeFarmacia = dadosOne[0]

        query = "DELETE FROM Farmacia WHERE id = ?"
        cursor.execute(query, (id,))
        conn.commit()
        return {"message": f"Farmacia {nomeFarmacia} foi deletada do sistema"}
    
    except Exception as e:
        return {"error": str(e)}
