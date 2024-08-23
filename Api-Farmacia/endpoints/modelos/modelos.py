from typing import Optional
from pydantic import BaseModel

# MODELOS DE ENTIDADES
class Farmacia(BaseModel):
    nome: str
    local: Optional[str] = None

class Medicamento(BaseModel):
    vencimento: Optional[str] = None
    preco: float
    quantidade: Optional[int] = None
    alergias: Optional[list[str]] = None
    faixa_etaria: Optional[str] = None
    mg_ml: Optional[str] = None
    unidade: Optional[str] = None
    nome: str
    farmacia_id: Optional[int] = None
    similares: Optional[list[int]] = None
    genericos: Optional[list[int]] = None
    reabastecer: Optional[int] = None


class Farmaceutico(BaseModel):
    p_nome: str
    u_nome: Optional[str] = None
    cpf: str
    unidade_trabalho: Optional[str] = None
    controle_farmacia: Optional[int] = None
    senha: str

class Fornecedor(BaseModel):
    nome: str
    contato: str
    medicamento_id: Optional[int] = None

class Cliente(BaseModel):
    nome: str
    cpf: str
    telefone: str
    email: Optional[str] = None
    alergias: Optional[str] = None
    cadastro_farmacia: Optional[int] = None
    forma_pagamento: Optional[str] = None
    senha: Optional[str] = None
    sobrenome: Optional[str] = None

class Compra(BaseModel):
    cliente_id: Optional[int]  # O cliente_id é opcional
    medicamento_ids: list[int]  # Lista de IDs dos medicamentos
    quantidade: list[int]  # Lista de quantidades correspondentes aos IDs dos medicamentos
    #preco_total: float# Preço total da compra
