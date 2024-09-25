from typing import List, Optional
from pydantic import BaseModel
from datetime import date

class MedicamentoBase(BaseModel):
    nome: str
    preco: float
    vencimento: Optional[date] = None
    quantidade: int
    unidade: Optional[str] = None
    faixa_etaria: Optional[str] = None
    mg_ml: Optional[str] = None
    alergias: Optional[List[str]] = []  # Lista de strings para alergias
    farmacia_id: Optional[int] = None
    similares: Optional[List[int]] = []  # Lista de IDs para similares
    genericos: Optional[List[int]] = []  # Lista de IDs para genéricos
    reabastecer: Optional[int] = None

    class Config:
        from_attributes = True
        json_encoders = {
            list: lambda v: ','.join(map(str, v))  # Convertendo lista para string para o banco de dados
        }

class MedicamentoCreate(MedicamentoBase):
    nome: str
    preco: float

class MedicamentoUpdate(MedicamentoBase):
    pass

class MedicamentoResponse(MedicamentoBase):
    id: int
