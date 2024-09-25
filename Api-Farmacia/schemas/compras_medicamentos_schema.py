import decimal
from pydantic import BaseModel



class CompraMedicamentoBase(BaseModel):
    compra_id: int
    medicamento_id: int
    quantidade: int
    preco: float
    
    class Config:
        from_attributes = True

class CompraMedicamentoCreate(CompraMedicamentoBase):
    pass

class CompraMedicamentoUpdate(CompraMedicamentoBase):
    pass

class CompraMedicamento(CompraMedicamentoBase):
    pass