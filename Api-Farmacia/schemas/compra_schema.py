from typing import Optional
from pydantic import BaseModel
from datetime import date
from decimal import Decimal

from sqlalchemy import Date, DateTime


class CompraBase(BaseModel):
    cliente_id: Optional[int] = None
    medicamentos_ids: list[int]
    quantidades: list[int]

    class Config:
        from_attributes = True
        
class CompraCreate(CompraBase):
    pass
class CompraUpdate(CompraBase):
    pass

class CompraResponse(CompraBase):
    id: int
    preco_total: float
