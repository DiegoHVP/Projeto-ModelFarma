from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship, Mapped
from core.configs import settings
from datetime import datetime
from .farmacia_model import Farmacia

class Cliente(settings.DBBaseModel):
    __tablename__ = 'cliente'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String)
    sobrenome = Column(String)
    cpf = Column(String)
    telefone = Column(String)
    email = Column(String)
    alergias = Column(String)
    cadastro_farmacia = Column(Integer, ForeignKey('farmacia.id'))
    forma_pagamento = Column(String)
    senha = Column(String)

    data_criacao = Column(DateTime, default=datetime.utcnow)
    
    cadastro_farmacia_ : Mapped['Farmacia'] = relationship("Farmacia")

    def __repr__(self):
        return f"Cliente: {self.nome}"