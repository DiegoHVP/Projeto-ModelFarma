from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.cliente_model import Cliente as ClienteModel
from schemas.cliente_schema import ClienteCreate, ClienteUpdate, ClienteResponse, ClienteBase
from core.deps import get_session, get_current_cliente
from core.auth import autenticar_cliente, criar_token_acesso
from core.security import gerar_hash_senha

import json

router = APIRouter()

@router.get('/logado', response_model=ClienteResponse)
def get_logado(usuario_logado: ClienteModel = Depends(get_current_cliente)):
    return usuario_logado

@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=ClienteBase)
async def create_client(cliente: ClienteCreate, db: AsyncSession = Depends(get_session)):
    try:
        # Verifica se já existe um cliente com o mesmo CPF
        cliente_existente_query = select(ClienteModel).filter(ClienteModel.cpf == cliente.cpf)
        result = await db.execute(cliente_existente_query)
        cliente_existente = result.scalars().first()

        if cliente_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Já existe um cliente com este CPF"
            )

        # Cria hash da senha antes de armazenar
        senha_hashed = gerar_hash_senha(cliente.senha)
        
        # Serializa lista de alergias se fornecida
        alergias_str = json.dumps(cliente.alergias) if cliente.alergias else "[]"
        
        # Adiciona novo cliente no banco de dados
        novo_cliente = ClienteModel(
            nome=cliente.nome,
            cpf=cliente.cpf,
            telefone=cliente.telefone,
            email=cliente.email,
            alergias=alergias_str,
            cadastro_farmacia=cliente.cadastro_farmacia,
            forma_pagamento=cliente.forma_pagamento,
            senha=senha_hashed,
            sobrenome=cliente.sobrenome
        )

        db.add(novo_cliente)
        await db.commit()
        return cliente
    except Exception as e:
        # Trata outras exceções e retorna um erro genérico
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{cliente_id}", response_model=ClienteResponse)
async def get_client(cliente_id: int, db: AsyncSession = Depends(get_session)):
    query = select(ClienteModel).filter(ClienteModel.id == cliente_id)
    result = await db.execute(query)
    cliente = result.scalars().unique().one_or_none()

    if cliente:
        cliente.alergias = json.loads(cliente.alergias)
        return cliente
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado")

@router.get("/", response_model=List[ClienteResponse])
async def get_all_clients(db: AsyncSession = Depends(get_session)):
    query = select(ClienteModel)
    result = await db.execute(query)
    clientes = result.scalars().unique().all()

    for cliente in clientes:
        cliente.alergias = json.loads(cliente.alergias)

    return clientes

@router.put("/{cliente_id}", response_model=ClienteResponse)
async def update_client(cliente_id: int, cliente: ClienteUpdate, db: AsyncSession = Depends(get_session)):
    query = select(ClienteModel).filter(ClienteModel.id == cliente_id)
    result = await db.execute(query)
    cliente_existente = result.scalars().unique().one_or_none()

    if cliente_existente:
        if cliente.nome:
            cliente_existente.nome = cliente.nome
        if cliente.cpf:
            cliente_existente.cpf = cliente.cpf
        if cliente.telefone:
            cliente_existente.telefone = cliente.telefone
        if cliente.email:
            cliente_existente.email = cliente.email
        if cliente.alergias is not None:
            cliente_existente.alergias = json.dumps(cliente.alergias)
        if cliente.cadastro_farmacia:
            cliente_existente.cadastro_farmacia = cliente.cadastro_farmacia
        if cliente.forma_pagamento:
            cliente_existente.forma_pagamento = cliente.forma_pagamento
        if cliente.sobrenome:
            cliente_existente.sobrenome = cliente.sobrenome

        await db.commit()
        return cliente_existente
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Cliente com ID {cliente_id} não encontrado")

@router.delete("/{cliente_id}", status_code=status.HTTP_202_ACCEPTED)
async def delete_client(cliente_id: int, db: AsyncSession = Depends(get_session)):
    query = select(ClienteModel).filter(ClienteModel.id == cliente_id)
    result = await db.execute(query)
    cliente: ClienteBase = result.scalars().unique().one_or_none()

    if cliente:
        temp_nome = cliente.nome
        await db.delete(cliente)
        await db.commit()
        return f"Cliente {temp_nome} deletado com sucesso"
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado")

# POST Login
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_session)):
    cliente = await autenticar_cliente(cpf=form_data.username, senha=form_data.password, db=db)

    if not cliente:
        raise HTTPException(detail='dados de cliente incorretos',
                            status_code=status.HTTP_400_BAD_REQUEST)
    return JSONResponse(content={'access_token': criar_token_acesso(sub=cliente.cpf, roles=['cliente']),
                                 'token_type': 'bearer'},
                                 status_code=status.HTTP_202_ACCEPTED)
