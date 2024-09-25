from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.farmacia_model import Farmacia as FarmaciaModel
from schemas.farmacia_schema import FarmaciaCreate, FarmaciaUpdate, FarmaciaResponse
from core.deps import get_session

router = APIRouter()

# POST Farmacia
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=FarmaciaResponse)
async def create_farmacia(farmacia: FarmaciaCreate, db: AsyncSession = Depends(get_session)):
    try:
        nova_farmacia = FarmaciaModel(
            nome=farmacia.nome,
            local=farmacia.local
        )
        db.add(nova_farmacia)
        await db.commit()
        return nova_farmacia
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# GET Farmacia por ID
@router.get("/{id}", response_model=FarmaciaResponse)
async def get_farmacia(id: int, db: AsyncSession = Depends(get_session)):
    try:
        query = select(FarmaciaModel).filter(FarmaciaModel.id == id)
        result = await db.execute(query)
        farmacia = result.scalars().one_or_none()

        if not farmacia:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmácia não encontrada")
        
        return farmacia
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# GET Todas as Farmacias
@router.get("/", response_model=List[FarmaciaResponse])
async def get_all_farmacias(db: AsyncSession = Depends(get_session)):
    try:
        query = select(FarmaciaModel)
        result = await db.execute(query)
        farmacias = result.scalars().all()

        if not farmacias:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nenhuma farmácia encontrada")

        return farmacias
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# PUT Farmacia por ID
@router.put("/{id}", response_model=FarmaciaResponse)
async def update_farmacia(id: int, farmacia: FarmaciaUpdate, db: AsyncSession = Depends(get_session)):
    try:
        query = select(FarmaciaModel).filter(FarmaciaModel.id == id)
        result = await db.execute(query)
        farmacia_existente = result.scalars().one_or_none()

        if not farmacia_existente:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmácia não encontrada")

        farmacia_existente.nome = farmacia.nome if farmacia.nome else farmacia_existente.nome
        farmacia_existente.local = farmacia.local if farmacia.local else farmacia_existente.local

        await db.commit()
        return farmacia_existente
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# DELETE Farmacia por ID
@router.delete("/{id}", response_model=dict)
async def delete_farmacia(id: int, db: AsyncSession = Depends(get_session)):
    try:
        query = select(FarmaciaModel).filter(FarmaciaModel.id == id)
        result = await db.execute(query)
        farmacia = result.scalars().one_or_none()

        if not farmacia:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmácia não encontrada")

        await db.delete(farmacia)
        await db.commit()
        return {"message": f"Farmácia {farmacia.nome} foi deletada com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
