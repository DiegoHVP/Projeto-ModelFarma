import sqlite3
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from .modelos.modelos import Farmaceutico

# Configuração do JWT
SECRET_KEY = "eyJhbGciOiJIUzI1NiJ9"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60 # 30 dias

router = APIRouter()

def get_db_connection():
    conn = sqlite3.connect("dados_farmacia.db")
    conn.row_factory = sqlite3.Row
    return conn, conn.cursor()

# Contexto de Criptografia
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Esquema de autenticação OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="farmaceutico/token/")

def verificar_senha(senha, senha_hashed):
    return pwd_context.verify(senha, senha_hashed)

def pegar_senha_hashed(senha):
    return pwd_context.hash(senha)

def cria_token_acesso(data: dict, expirar_tempo: timedelta = None):
    dados = data.copy()
    expire = datetime.utcnow() + expirar_tempo
    dados.update({"exp": expire})
    token_acess = jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)
    return token_acess

# Endpoint de Login
@router.post("/farmaceutico/token/", response_model=dict)
async def login_farmaceutico(form_data: OAuth2PasswordRequestForm = Depends()):
    conn, cursor = get_db_connection()
    query = "SELECT matricula, p_nome, cpf, unidade_trabalho, controle_farmacia, senha FROM Farmaceutico WHERE cpf = ?"
    cursor.execute(query, (form_data.username,))
    data = cursor.fetchone()
    
    # SE NAO EXISTE
    # OU SE SENHA NAO ESTA CORRETA
    if not data or not verificar_senha(form_data.password, data[5]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="CPF ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # CRIA O TOKEN
    access_token = cria_token_acesso(
        data={"sub": data[2]},  # CPF do farmaceutico
        expirar_tempo=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Verifica
@router.get("/farmaceutico/me/", response_model=dict)
async def farmaceutico_logado(token: str = Depends(oauth2_scheme)):
    conn, cursor = get_db_connection()
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # DECODIFIQUE
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # PEGA O sub QUE E O CPF NO CASO
        cpf: str = payload.get("sub")
        if cpf is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Buscar farmaceutico diretamente pelo CPF
    query = "SELECT matricula, p_nome, u_nome, cpf, unidade_trabalho, controle_farmacia FROM Farmaceutico WHERE cpf = ?"
    cursor.execute(query, (cpf,))
    data = cursor.fetchone()
    
    if not data:
        raise credentials_exception
    
    return {
        "matricula": data[0],
        "p_nome": data[1],
        "u_nome": data[2],
        "cpf": data[3],
        "unidade_trabalho": data[4],
        "controle_farmacia": data[5],
    }

# CRUD Farmaceutico
# # ADD Farmaceutico
@router.post("/farmaceutico/", status_code=status.HTTP_201_CREATED)
async def create_farmaceutico(farmaceutico: Farmaceutico):
    conn, cursor = get_db_connection()
    try:
        senha_hashed = pegar_senha_hashed(farmaceutico.senha)
        query = """INSERT INTO Farmaceutico 
                (p_nome, u_nome, cpf, unidade_trabalho, controle_farmacia, senha) 
                VALUES (?, ?, ?, ?, ?, ?)"""
        values = (
            farmaceutico.p_nome, farmaceutico.u_nome,
            farmaceutico.cpf, farmaceutico.unidade_trabalho, farmaceutico.controle_farmacia, senha_hashed
        )
        cursor.execute(query, values)
        conn.commit()
        return {"message": f"Farmaceutico {farmaceutico.p_nome} foi cadastrado com sucesso"}
    except Exception as e:
        return {"error": str(e)}

# LER Farmaceutico POR Matricula
@router.get("/farmaceutico/{matricula}")
async def get_farmaceutico(matricula: int):
    conn, cursor = get_db_connection()
    try:
        query = "SELECT * FROM Farmaceutico WHERE matricula = ?"
        cursor.execute(query, (matricula,))
        dadosOne = cursor.fetchone()
        if not dadosOne:
            raise HTTPException(status_code=404, detail="Farmaceutico não encontrado")
        funcionarioDados = {
            "matricula": dadosOne[0],
            "p_nome": dadosOne[1],
            "u_nome": dadosOne[2],
            "cpf": dadosOne[3],
            "unidade_trabalho": dadosOne[4],
            "controle_farmacia": dadosOne[5]
        }
        return {"farmaceutico": funcionarioDados}
    except Exception as e:
        return {"error": str(e)}

# PEGAR TODOS OS farmaceutico
@router.get("/farmaceutico/")
async def getAll_farmaceutico():
    conn, cursor = get_db_connection()
    try:
        query = "SELECT * FROM Farmaceutico"
        cursor.execute(query)
        dadosAll = cursor.fetchall()

        funcionarioDados = []
        for dadosOne in dadosAll:
            tempDados = {
                "matricula": dadosOne[0],
                "p_nome": dadosOne[1],
                "u_nome": dadosOne[2],
                "cpf": dadosOne[3],
                "unidade_trabalho": dadosOne[4],
                "controle_farmacia": dadosOne[5]
            }
            funcionarioDados.append(tempDados)

        if len(funcionarioDados) != 0:
            return {"farmaceutico": funcionarioDados}
        else:
            return {"message": "não há farmaceuticos cadastrados"}

    except Exception as e:
        return {"error": str(e)}

# ATUALIZAR Farmaceutico POR Matricula
@router.put("/farmaceutico/{matricula}")
async def update_farmaceutico(matricula: int, farmaceutico: Farmaceutico):
    conn, cursor = get_db_connection()
    try:
        verificar = "SELECT * FROM Farmaceutico WHERE matricula = ?"
        cursor.execute(verificar, (matricula,))
        farmaceuticoBool = cursor.fetchone()

        if not farmaceuticoBool:
            return {"error": f"Farmaceutico com matricula {matricula} não foi encontrado"}

        query = """UPDATE Farmaceutico SET 
                p_nome=?, u_nome=?, cpf=?, unidade_trabalho=?, controle_farmacia=?
                WHERE matricula=?"""
        values = (
            farmaceutico.p_nome, farmaceutico.u_nome, farmaceutico.cpf,
            farmaceutico.unidade_trabalho, farmaceutico.controle_farmacia, matricula
        )
        cursor.execute(query, values)
        conn.commit()
        return {"message": f"Farmaceutico {farmaceutico.p_nome} foi atualizado"}
    except Exception as e:
        return {"error": str(e)}

# DELETAR Farmaceutico POR Matricula
@router.delete("/farmaceutico/{matricula}")
async def delete_farmaceutico(matricula: int):
    conn, cursor = get_db_connection()
    try:
        getNameQuery = "SELECT p_nome FROM Farmaceutico WHERE matricula = ?" 
        cursor.execute(getNameQuery, (matricula,)) 
        dadosOne = cursor.fetchone()
        
        if not dadosOne:
            return {"message": "Farmaceutico não encontrado"}        
        nomeFuncionario = dadosOne[0]

        query = "DELETE FROM Farmaceutico WHERE matricula = ?"
        cursor.execute(query, (matricula,))
        conn.commit()
        return {"message": f"Farmaceutico {nomeFuncionario} foi deletado do sistema"}
    except Exception as e:
        return {"error": str(e)}
