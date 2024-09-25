import json
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError

from models.medicamento_model import Medicamento as MedicamentoModel
from schemas.medicamento_schema import MedicamentoBase, MedicamentoCreate, MedicamentoUpdate, MedicamentoResponse
from core.deps import get_session

router = APIRouter()

# CREATE Medicamento
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=dict)
async def create_medicamento(m: MedicamentoCreate, db: AsyncSession = Depends(get_session)):
    # SERIALIZE PARA ARMAZENAR VETORES
    alergias_str = json.dumps(m.alergias) if m.alergias else "[]"
    similares_str = json.dumps(m.similares) if m.similares else "[]"
    genericos_str = json.dumps(m.genericos) if m.genericos else "[]"
    
    try:
        novo_medicamento: MedicamentoCreate = MedicamentoModel(
            vencimento=m.vencimento,
            preco=m.preco,
            quantidade=m.quantidade,
            alergias=alergias_str,
            faixa_etaria=m.faixa_etaria,
            mg_ml=m.mg_ml,
            unidade=m.unidade,
            nome=m.nome,
            farmacia_id=m.farmacia_id,
            similares=similares_str,
            genericos=genericos_str,
            reabastecer=m.reabastecer
        )
        db.add(novo_medicamento)
        await db.commit()
        return {"message": "Medicamento criado com sucesso"}
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Erro de integridade. Verifique os dados.")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# GET Medicamento por ID
@router.get("/{id}", response_model=MedicamentoResponse)
async def get_medicamento(id: int, db: AsyncSession = Depends(get_session)):
    query = select(MedicamentoModel).filter(MedicamentoModel.id == id)
    result = await db.execute(query)
    medicamento: MedicamentoBase = result.scalars().unique().one_or_none()

    if medicamento:
        # DESERIALIZE PARA RETORNA VETORES
        medicamento.alergias = json.loads(medicamento.alergias) if medicamento.alergias else "[]"
        medicamento.similares = json.loads(medicamento.similares) if medicamento.similares else "[]"
        medicamento.genericos = json.loads(medicamento.genericos) if medicamento.genericos else "[]"
        return medicamento
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medicamento não encontrado")

# GET Todos os Medicamentos
@router.get("/", response_model=List[MedicamentoResponse])
async def get_all_medicamentos(nome: Optional[str] = None, db: AsyncSession = Depends(get_session)):
    if nome:
        query = select(MedicamentoModel).filter(MedicamentoModel.nome.ilike(f"%{nome}%"))
    else:
        query = select(MedicamentoModel)
    
    result = await db.execute(query)
    medicamentos: MedicamentoBase = result.scalars().unique().all()

    if not medicamentos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nenhum medicamento encontrado")
    for medicamento in medicamentos:
        if medicamento.alergias:
            medicamento.alergias = json.loads(medicamento.alergias)
        if medicamento.similares:
            medicamento.similares = json.loads(medicamento.similares)
        if medicamento.genericos:
            medicamento.genericos = json.loads(medicamento.genericos)

    return medicamentos
    
        

# UPDATE Medicamento por ID
@router.put("/{id}", response_model=MedicamentoUpdate)
async def update_medicamento(id: int, m: MedicamentoUpdate, db: AsyncSession = Depends(get_session)):
    query = select(MedicamentoModel).filter(MedicamentoModel.id == id)
    result = await db.execute(query)
    medicamento_atual: MedicamentoBase = result.scalars().unique().one_or_none()
    if medicamento_atual:
        medicamento_atual.vencimento = m.vencimento if m.vencimento else medicamento_atual.vencimento
        medicamento_atual.preco = m.preco if m.preco else medicamento_atual.preco
        medicamento_atual.quantidade = m.quantidade if m.quantidade else medicamento_atual.quantidade

        medicamento_atual.alergias = json.dumps(m.alergias) if json.dumps(m.alergias) else medicamento_atual.alergias
        
        medicamento_atual.faixa_etaria = m.faixa_etaria if m.faixa_etaria else medicamento_atual.faixa_etaria
        medicamento_atual.mg_ml = m.mg_ml if m.mg_ml else medicamento_atual.mg_ml
        medicamento_atual.unidade = m.unidade if m.unidade else medicamento_atual.unidade
        medicamento_atual.nome = m.nome if m.nome else medicamento_atual.nome
        medicamento_atual.farmacia_id = m.farmacia_id if m.farmacia_id else medicamento_atual.farmacia_id
        
        medicamento_atual.similares = json.dumps(m.similares) if json.dumps(m.similares) else medicamento_atual.similares
        medicamento_atual.genericos = json.dumps(m.genericos) if json.dumps(m.genericos) else medicamento_atual.genericos
        
        medicamento_atual.reabastecer = m.reabastecer if m.reabastecer else medicamento_atual.reabastecer

        await db.commit()
        return medicamento_atual
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Medicamento com ID {id} não encontrado")


# DELETE Medicamento por ID
@router.delete("/{id}", response_model=dict)
async def delete_medicamento(id: int, db: AsyncSession = Depends(get_session)):
    query = select(MedicamentoModel).filter(MedicamentoModel.id == id)
    result = await db.execute(query)
    medicamento = result.scalars().unique().one_or_none()

    if medicamento:
        await db.delete(medicamento)
        await db.commit()
        return {"message": f"Medicamento {medicamento.nome} foi removido do sistema"}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medicamento não encontrado")
