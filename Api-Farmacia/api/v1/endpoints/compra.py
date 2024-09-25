from datetime import datetime
import decimal
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import NoResultFound

from models.medicamento_model import Medicamento as MedicamentoModel
from models.compra_model import Compra as CompraModel
from models.compra_medicamentos_model import CompraMedicamento as CompraMedicamentoModel

from schemas.compra_schema import CompraCreate, CompraUpdate, CompraResponse
from schemas.compras_medicamentos_schema import CompraMedicamento

from core.deps import get_session

router = APIRouter()

# POST Compra (Criação de nova compra)
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=CompraCreate)
async def create_compra(compra: CompraCreate, db: AsyncSession = Depends(get_session)):

    # QUANTIDADE E MEDICAMENTOS ESTAO DE ACORDO
    if len(compra.medicamentos_ids) != len(compra.quantidades):
            raise HTTPException(status_code=400, detail="A quantidade de IDs dos medicamentos e quantidade não coincide")
    
    try:
        preco_total = 0
        # Calcular preço total e verificar estoque
        for item, quantidade in zip (compra.medicamentos_ids, compra.quantidades):
            medicamento = await db.get(MedicamentoModel, item)
            if not medicamento:
                raise HTTPException(status_code=404, detail=f"Medicamento com ID {item} não encontrado")
            if quantidade > medicamento.quantidade:
                raise HTTPException(status_code=400, detail=f"Estoque insuficiente para o medicamento com ID {item}")

            preco_total = medicamento.preco * quantidade + preco_total

        
        nova_compra = CompraModel(
            cliente_id=compra.cliente_id,
            preco_total=preco_total
        )

        db.add(nova_compra)
        await db.commit()
        await db.refresh(nova_compra)
        
        # Registrar medicamentos comprados
        for (item, quantidade) in zip(compra.medicamentos_ids, compra.quantidades):
            medicamento = await db.get(MedicamentoModel, item)
            novo_item = CompraMedicamentoModel(
                compra_id = nova_compra.id,
                medicamento_id = item,
                quantidade = quantidade,
               # preco = medicamento.preco
            )
            db.add(novo_item)
            # Atualizar estoque
            medicamento.quantidade -= quantidade
            db.add(medicamento)
        nova_compra: CompraCreate = compra
        await db.commit()
        return nova_compra
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))



# GET Compra por ID
@router.get("/{id}", response_model=dict)
async def get_compra(id: int, db: AsyncSession = Depends(get_session)):
    try:
        # Selecionar a compra associada ao id
        query = select(CompraModel).filter(CompraModel.id == id)
        result = await db.execute(query)
        compra: CompraResponse = result.scalars().one_or_none()

        if not compra:
            raise HTTPException(status_code=404, detail="Nenhuma compra encontrada")

        compra_info = []
        # Selecionar medicamentos associados a cada compra
        query_medicamentos = select(CompraMedicamentoModel).filter(CompraMedicamentoModel.compra_id == compra.id)
        result_medicamentos = await db.execute(query_medicamentos)
        medicamentos = result_medicamentos.scalars().all()

        # Criar o dicionário de informações da compra
        compra_info = {
            "id": compra.id,
            "cliente_id": compra.cliente_id,
            "data_compra": compra.data_compra,
            "quantidade": sum([med.quantidade for med in medicamentos]),
            "preco_total": compra.preco_total,
            "medicamentos": [
                {
                    "medicamento_id": med.medicamento_id,
                    "quantidade": med.quantidade
                }
                for med in medicamentos
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    

    return compra_info




# GET Todas as Compras
# GET todas as compras com detalhes de medicamentos
@router.get("/", response_model=dict)
async def get_all_compras(db: AsyncSession = Depends(get_session)):
    try:
        # Selecionar todas as compras
        query = select(CompraModel)
        result = await db.execute(query)
        compras = result.scalars().all()

        if not compras:
            raise HTTPException(status_code=404, detail="Nenhuma compra encontrada")

        compras_info = []
        for compra in compras:
            # Selecionar medicamentos associados a cada compra
            query_medicamentos = select(CompraMedicamentoModel).filter(CompraMedicamentoModel.compra_id == compra.id)
            result_medicamentos = await db.execute(query_medicamentos)
            medicamentos = result_medicamentos.scalars().all()

            # Criar o dicionário de informações da compra
            compra_info_ = {
                "id": compra.id,
                "cliente_id": compra.cliente_id,
                "data_compra": compra.data_compra,
                "quantidade": sum([med.quantidade for med in medicamentos]),
                "preco_total": compra.preco_total,
                "medicamentos": [
                    {
                        "medicamento_id": med.medicamento_id,
                        "quantidade": med.quantidade
                    }
                    for med in medicamentos
                ]
            }
            compras_info.append(compra_info_)

        return {"Compras": compras_info}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# PUT Compra por ID (Atualização de uma compra existente)
@router.put("/{id}", response_model=CompraResponse)
async def update_compra(id: int, compra: CompraUpdate, db: AsyncSession = Depends(get_session)):
    try:
        query = select(CompraModel).filter(CompraModel.id == id)
        result = await db.execute(query)
        compra_existente = result.scalars().one_or_none()

        if not compra_existente:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compra não encontrada")

        # Atualizar os dados da compra
        compra_existente.cliente_id = compra.cliente_id if compra.cliente_id else compra_existente.cliente_id
        compra_existente.data_compra = compra.data_compra if compra.data_compra else compra_existente.data_compra
        compra_existente.quantidade = sum(item.quantidade for item in compra.itens)

        # Recalcular preço total e verificar estoque
        preco_total = 0.0
        for item in compra.itens:
            medicamento = await db.get(MedicamentoModel, item.medicamento_id)
            if not medicamento:
                raise HTTPException(status_code=404, detail=f"Medicamento com ID {item.medicamento_id} não encontrado")
            if item.quantidade > medicamento.quantidade:
                raise HTTPException(status_code=400, detail=f"Estoque insuficiente para o medicamento com ID {item.medicamento_id}")

            preco_total += medicamento.preco * item.quantidade
            medicamento.quantidade -= item.quantidade

        compra_existente.preco_total = preco_total
        await db.commit()
        return compra_existente
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# DELETE Compra por ID
@router.delete("/{id}")
async def delete_compra(id: int, db: AsyncSession = Depends(get_session)):
    try:
        query = select(CompraModel).filter(CompraModel.id == id)
        result = await db.execute(query)
        compra = result.scalars().one_or_none()

        if not compra:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compra não encontrada")

        await db.delete(compra)
        await db.commit()
        return {"message": f"Compra com ID {id} foi deletada com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# GET Compras por Cliente ID
@router.get("/minhascompras/{cliente_id}")
async def get_compras_cliente(cliente_id: int, db: AsyncSession = Depends(get_session)):
    try:

        # SELECIONA TODAS COMPRAS DO CLIENTE
        query = select(CompraModel).filter(CompraModel.cliente_id == cliente_id)
        result = await db.execute(query)
        compras: CompraResponse = result.scalars().all()

        if not compras:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Nenhuma compra encontrada para o cliente com ID {cliente_id}")
        
        # ORGANIZA AS COMPRAS COM OS ITEMS
        compras_cliente = []
        # PARA CADA COMPRA
        for compra in compras:

            # SELECIONA TODAS LISTAS DE ITEMS DA COMPRA
            query_medicamentos = select(CompraMedicamentoModel).filter(CompraMedicamentoModel.compra_id == compra.id)
            result_medicamentos = await db.execute(query_medicamentos)
            medicamentos = result_medicamentos.scalars().all()


            compra_info = {
                    "id": compra.id,
                    "cliente_id": compra.cliente_id,
                    "data_compra": compra.data_compra,
                    "quantidade": sum([med.quantidade for med in medicamentos]),
                    "preco_total": compra.preco_total,
                    "medicamentos": [
                        {
                            "medicamento_id": med.medicamento_id,
                            "quantidade": med.quantidade
                        }
                        for med in medicamentos
                    ]
                }
            compras_cliente.append(compra_info)

        return {"Compras": compras_cliente}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
