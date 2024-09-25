from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.farmaceutico_model import Farmaceutico as FarmaceuticoModel
from schemas.farmaceutico_schema import FarmaceuticoCreate, FarmaceuticoUpdate, FarmaceuticoResponse, FarmaceuticoBase
from core.deps import get_session, get_current_farmaceutico
from core.auth import autenticar_farmaceutico, criar_token_acesso
from core.security import gerar_hash_senha

router = APIRouter()

@router.get('/logado', response_model=FarmaceuticoBase)
def get_logado(farmaceutico_logado: FarmaceuticoModel = Depends(get_current_farmaceutico)):
    return farmaceutico_logado

@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=dict)
async def create_farmaceutico(farmaceutico: FarmaceuticoCreate, db: AsyncSession = Depends(get_session)):
    try:
        # Verifica se já existe um farmacêutico com o mesmo CPF
        farmaceutico_existente_query = select(FarmaceuticoModel).filter(FarmaceuticoModel.cpf == farmaceutico.cpf)
        result = await db.execute(farmaceutico_existente_query)
        farmaceutico_existente = result.scalars().first()

        if farmaceutico_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Já existe um farmacêutico com este CPF"
            )

        # Cria hash da senha antes de armazenar
        senha_hashed = gerar_hash_senha(farmaceutico.senha)
        
        # Adiciona novo farmacêutico no banco de dados
        novo_farmaceutico = FarmaceuticoModel(
            p_nome=farmaceutico.p_nome,
            u_nome=farmaceutico.u_nome,
            cpf=farmaceutico.cpf,
            unidade_trabalho=farmaceutico.unidade_trabalho,
            controle_farmacia=farmaceutico.controle_farmacia,
            senha=senha_hashed
        )

        db.add(novo_farmaceutico)
        await db.commit()
        return {"message": f"Farmacêutico {farmaceutico.p_nome} foi registrado com sucesso"}

    except HTTPException as he:
        # Levanta a exceção HTTP se o CPF já estiver registrado
        raise he

    except Exception as e:
        # Trata outras exceções e retorna um erro genérico
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{farmaceutico_id}", response_model=FarmaceuticoResponse)
async def get_farmaceutico(farmaceutico_id: int, db: AsyncSession = Depends(get_session)):
    query = select(FarmaceuticoModel).filter(FarmaceuticoModel.matricula == farmaceutico_id)
    result = await db.execute(query)
    farmaceutico = result.scalars().unique().one_or_none()

    if farmaceutico:
        return farmaceutico
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmacêutico não encontrado")

@router.get("/", response_model=List[FarmaceuticoResponse])
async def get_all_farmaceuticos(db: AsyncSession = Depends(get_session)):
    query = select(FarmaceuticoModel)
    result = await db.execute(query)
    farmaceuticos = result.scalars().unique().all()

    return farmaceuticos

@router.put("/{farmaceutico_id}", response_model=FarmaceuticoResponse)
async def update_farmaceutico(farmaceutico_id: int, farmaceutico: FarmaceuticoUpdate, db: AsyncSession = Depends(get_session)):
    query = select(FarmaceuticoModel).filter(FarmaceuticoModel.matricula == farmaceutico_id)
    result = await db.execute(query)
    farmaceutico_existente = result.scalars().unique().one_or_none()

    if farmaceutico_existente:
        if farmaceutico.p_nome:
            farmaceutico_existente.p_nome = farmaceutico.p_nome
        if farmaceutico.u_nome:
            farmaceutico_existente.u_nome = farmaceutico.u_nome
        if farmaceutico.cpf:
            farmaceutico_existente.cpf = farmaceutico.cpf
        if farmaceutico.unidade_trabalho:
            farmaceutico_existente.unidade_trabalho = farmaceutico.unidade_trabalho
        if farmaceutico.controle_farmacia is not None:
            farmaceutico_existente.controle_farmacia = farmaceutico.controle_farmacia

        await db.commit()
        return farmaceutico_existente
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Farmacêutico com ID {farmaceutico_id} não encontrado")

@router.delete("/{farmaceutico_id}", response_model=dict)
async def delete_farmaceutico(farmaceutico_id: int, db: AsyncSession = Depends(get_session)):
    query = select(FarmaceuticoModel).filter(FarmaceuticoModel.matricula == farmaceutico_id)
    result = await db.execute(query)
    farmaceutico = result.scalars().unique().one_or_none()

    if farmaceutico:
        await db.delete(farmaceutico)
        await db.commit()
        return {"message": f"Farmacêutico {farmaceutico.p_nome} foi removido do sistema"}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmacêutico não encontrado")

# POST Login
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_session)):
    farmaceutico = await autenticar_farmaceutico(cpf=form_data.username, senha=form_data.password, db=db)

    if not farmaceutico:
        raise HTTPException(detail='Dados de farmacêutico incorretos',
                            status_code=status.HTTP_400_BAD_REQUEST)
    return JSONResponse(content={'access_token': criar_token_acesso(sub=farmaceutico.cpf, roles=['farmaceutico']),
                                 'token_type': 'bearer'},
                                 status_code=status.HTTP_202_ACCEPTED)
