import json
import sqlite3
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from .modelos.modelos import Cliente

# Configuração do JWT
SECRET_KEY = "eyJhbGciOiJIUzI1NiJ9"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 dias

router = APIRouter()
conn = sqlite3.connect("dados_farmacia.db", check_same_thread=False)
cursor = conn.cursor()

# Contexto de Criptografia
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Esquema de autenticação OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verificar_senha(senha, senha_hashed):
    return pwd_context.verify(senha, senha_hashed)

def get_senha_com_hash(password):
    return pwd_context.hash(password)


def criar_token_acesso(data: dict, expirar_tempo: timedelta = None):
    # add tempo de expirar
    user_data = data.copy()

    expire = datetime.utcnow() + expirar_tempo
    user_data.update({"exp": expire})
    token_acess = jwt.encode(user_data, SECRET_KEY, algorithm=ALGORITHM)

    return token_acess

def serialize_list(lst):
    # transforma a lista em uma sequencia de bytes json
    if not lst:
        return "[]"
    return json.dumps(lst)

def deserialize_list(s):
    # transforma uma sequencia de bytes em uma lista
    if not s:
        return []
    try:
        return json.loads(s)
    except json.JSONDecodeError:
        return []


# Verificar Login e retorna token
@router.post("/cliente/token", response_model=dict)
async def login_client(form_data: OAuth2PasswordRequestForm = Depends()):
    query = "SELECT id, nome, cpf, telefone, email, alergias, cadastro_farmacia, forma_pagamento, senha, sobrenome FROM Cliente WHERE cpf = ?"
    cursor.execute(query, (form_data.username,))
    data = cursor.fetchone()

    # verifica não tem cliente
    # ou se a senha esta incorreta
    if not data or not verificar_senha(form_data.password, data[8]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="CPF ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # cria o token
    access_token = criar_token_acesso(
        data={"sub": data[2]},  # CPF do cliente
        expirar_tempo=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Verifica o Token
@router.get("/cliente/me/", response_model=dict)
async def cliente_logado(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # decodificar token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # pega cpf do token
        cpf: str = payload.get("sub")
        if cpf is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Buscar cliente diretamente pelo CPF
    query = "SELECT id, nome, cpf, telefone, email, alergias, cadastro_farmacia, forma_pagamento, sobrenome FROM Cliente WHERE cpf = ?"
    cursor.execute(query, (cpf,))
    data = cursor.fetchone()

    if not data:
        raise credentials_exception

    # Desserializar alergias
    alergias = deserialize_list(data[5])

    return {
        "id": data[0],
        "nome": data[1],
        "cpf": data[2],
        "telefone": data[3],
        "email": data[4],
        "alergias": alergias,
        "cadastro_farmacia": data[6],
        "forma_pagamento": data[7],
        "sobrenome": data[8],
    }



# CRUD
# ENVIAR Cliente
@router.post("/cliente/", status_code=status.HTTP_201_CREATED, response_model=dict)
async def create_client(c: Cliente):
    try:
        senha_hashed = get_senha_com_hash(c.senha)
        alergias_str = serialize_list(c.alergias) if c.alergias else "[]"
        query = """INSERT INTO Cliente
                (nome, cpf, telefone, email, alergias, cadastro_farmacia, forma_pagamento, senha, sobrenome) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"""
        values = (
            c.nome,
            c.cpf,
            c.telefone,
            c.email,
            alergias_str,
            c.cadastro_farmacia,
            c.forma_pagamento,
            senha_hashed,
            c.sobrenome,
        )
        cursor.execute(query, values)
        conn.commit()
        return {"message": f"Cliente {c.nome} foi registrado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# PEGAR CLIENTE POR ID
@router.get("/cliente/{cliente_id}")
async def get_client(cliente_id: int):
    query = "SELECT * FROM Cliente WHERE id = ?"
    cursor.execute(query, (cliente_id,))
    data = cursor.fetchone()
    if not data:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    # Desserializar alergias
    alergias = deserialize_list(data[5])

    client_data = {
        "id": data[0],
        "nome": data[1],
        "cpf": data[2],
        "telefone": data[3],
        "email": data[4],
        "alergias": alergias,
        "cadastro_farmacia": data[6],
        "forma_pagamento": data[7],
    }
    return {"Cliente": client_data}


# PEGAR TODOS OS CLIENTES
@router.get("/cliente/")
async def get_all_clients():
    query = "SELECT * FROM Cliente"
    cursor.execute(query)
    all_data = cursor.fetchall()
    clients_data = [
        {
            "id": data[0],
            "nome": data[1],
            "cpf": data[2],
            "telefone": data[3],
            "email": data[4],
            "alergias": deserialize_list(data[5]),
            "cadastro_farmacia": data[6],
            "forma_pagamento": data[7],
        }
        for data in all_data
    ]
    
    if clients_data:
        return {"Clientes": clients_data}
    else:
        return {"message": "Nenhum cliente registrado"}

# ATUALIZAR CLIENTE POR ID
@router.put("/cliente/{id}")
async def update_client(id: int, c: Cliente):
    verify_query = "SELECT id FROM Cliente WHERE id = ?"
    cursor.execute(verify_query, (id,))
    client_exists = cursor.fetchone()
    if not client_exists:
        raise HTTPException(
            status_code=404, detail=f"Cliente com ID {id} não encontrado"
        )

    alergias_str = serialize_list(c.alergias) if c.alergias else "[]"
    query = """UPDATE Cliente SET 
            nome=?, cpf=?, telefone=?, email=?, alergias=?, 
            cadastro_farmacia=?, forma_pagamento=?
            WHERE id=?"""
    values = (
        c.nome,
        c.cpf,
        c.telefone,
        c.email,
        alergias_str,
        c.cadastro_farmacia,
        c.forma_pagamento,
        id,
    )
    cursor.execute(query, values)
    conn.commit()
    return {"message": f"Cliente {c.nome} foi atualizado"}


# DELETAR CLIENTE POR ID
@router.delete("/cliente/{cliente_id}")
async def delete_client(cliente_id: int):
    query_get_name = "SELECT nome FROM Cliente WHERE id = ?"
    cursor.execute(query_get_name, (cliente_id,))
    data = cursor.fetchone()

    if not data:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    client_name = data[0]
    query_delete = "DELETE FROM Cliente WHERE id = ?"
    cursor.execute(query_delete, (cliente_id,))
    conn.commit()

    return {"message": f"Cliente {client_name} foi removido do sistema"}
