from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError

from models.fornecedores_model import Fornecedor as FornecedorModel
from schemas.fornecedores_schemas import FornecedorCreate, FornecedorUpdate, FornecedorResponse
from core.deps import get_session

router = APIRouter()

# CREATE Fornecedor
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=dict)
async def create_fornecedor(fornecedor: FornecedorCreate, db: AsyncSession = Depends(get_session)):
    try:
        novo_fornecedor = FornecedorModel(
            nome=fornecedor.nome,
            contato=fornecedor.contato,
            medicamento_id=fornecedor.medicamento_id
        )
        db.add(novo_fornecedor)
        await db.commit()
        return {"message": f"Fornecedor {fornecedor.nome} foi criado com sucesso"}
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Erro de integridade. Verifique os dados.")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# READ Fornecedor por ID
@router.get("/{id}", response_model=FornecedorResponse)
async def get_fornecedor(id: int, db: AsyncSession = Depends(get_session)):
    query = select(FornecedorModel).filter(FornecedorModel.id == id)
    result = await db.execute(query)
    fornecedor = result.scalars().unique().one_or_none()

    if fornecedor:
        return fornecedor
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fornecedor não encontrado")

# READ todos os Fornecedores
@router.get("/", response_model=List[FornecedorResponse])
async def get_all_fornecedores(db: AsyncSession = Depends(get_session)):
    query = select(FornecedorModel)
    result = await db.execute(query)
    fornecedores = result.scalars().unique().all()

    if fornecedores:
        return fornecedores
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nenhum fornecedor encontrado")

# UPDATE Fornecedor por ID
@router.put("/{id}", response_model=FornecedorResponse)
async def update_fornecedor(id: int, fornecedor: FornecedorUpdate, db: AsyncSession = Depends(get_session)):
    query = select(FornecedorModel).filter(FornecedorModel.id == id)
    result = await db.execute(query)
    fornecedor_existente = result.scalars().unique().one_or_none()

    if fornecedor_existente:
        fornecedor_existente.nome = fornecedor.nome if fornecedor.nome else fornecedor_existente.nome
        fornecedor_existente.contato = fornecedor.contato if fornecedor.contato else fornecedor_existente.contato
        fornecedor_existente.medicamento_id = fornecedor.medicamento_id if fornecedor.medicamento_id else fornecedor_existente.medicamento_id

        await db.commit()
        return fornecedor_existente
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Fornecedor com ID {id} não encontrado")

# DELETE Fornecedor por ID
@router.delete("/{id}", response_model=dict)
async def delete_fornecedor(id: int, db: AsyncSession = Depends(get_session)):
    query = select(FornecedorModel).filter(FornecedorModel.id == id)
    result = await db.execute(query)
    fornecedor = result.scalars().unique().one_or_none()

    if fornecedor:
        await db.delete(fornecedor)
        await db.commit()
        return {"message": f"Fornecedor {fornecedor.nome} foi removido do sistema"}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fornecedor não encontrado")
