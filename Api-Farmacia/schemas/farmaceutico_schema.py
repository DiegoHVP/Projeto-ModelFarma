from typing import Optional
from pydantic import BaseModel

class FarmaceuticoBase(BaseModel):
    p_nome: str
    u_nome: Optional[str] = None
    cpf: str
    unidade_trabalho: Optional[str] = None
    controle_farmacia: Optional[int] = None

    class Config:
        from_attributes = True

class FarmaceuticoCreate(FarmaceuticoBase):
    senha: str

class FarmaceuticoUpdate(FarmaceuticoBase):
    pass  # Todos os campos são opcionais, exceto senha que não está presente.

class FarmaceuticoResponse(FarmaceuticoBase):
    matricula: int