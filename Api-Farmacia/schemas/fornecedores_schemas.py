from typing import Optional
from pydantic import BaseModel

class FornecedorBase(BaseModel):
    nome: str
    contato: str
    medicamento_id: Optional[int] = None

    class Config:
        from_attributes = True
        
class FornecedorCreate(FornecedorBase):
    pass

class FornecedorUpdate(FornecedorBase):
    pass

class FornecedorResponse(FornecedorBase):
    id: int
