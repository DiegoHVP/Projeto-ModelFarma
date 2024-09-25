from typing import Optional, List
from pydantic import BaseModel

class ClienteBase(BaseModel):
    nome: str
    sobrenome: str
    cpf: str
    telefone: Optional[str] = None
    email: str
    alergias: Optional[List[str]] = None
    cadastro_farmacia: Optional[int] = None
    forma_pagamento: Optional[str] = None
    
    class Config:
        from_attributes = True

class ClienteCreate(ClienteBase):
    nome: str
    cpf: str
    senha: str
    pass

class ClienteUpdate(ClienteBase):
    pass

class ClienteResponse(ClienteBase): 
    id: int

