from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship, Mapped
from core.configs import settings

from datetime import datetime

from .medicamento_model import Medicamento

class Fornecedor(settings.DBBaseModel):
    __tablename__ = 'fornecedores'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String)
    contato = Column(String)
    medicamento_id = Column(Integer, ForeignKey('medicamento.id'))
    data_criacao = Column(DateTime, default= datetime.now)

    medicamento_id_: Mapped['Medicamento'] = relationship('Medicamento')