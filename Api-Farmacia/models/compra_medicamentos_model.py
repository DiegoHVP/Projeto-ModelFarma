from sqlalchemy import Column, Integer, Numeric, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship, Mapped
from core.configs import settings

from datetime import datetime

from .medicamento_model import Medicamento
from .compra_model import Compra

class CompraMedicamento(settings.DBBaseModel):
    __tablename__ = 'compra_Medicamento'
    compra_id = Column(Integer, ForeignKey('compra.id'), primary_key=True)
    medicamento_id = Column(Integer, ForeignKey('medicamento.id'), primary_key=True)
    quantidade = Column(Integer)
    preco = Column(Numeric(10, 2))
    
    data_criacao = Column(DateTime, default=datetime.now)
    
    compra_id_: Mapped['Compra'] = relationship("Compra")
    medicamento_id_: Mapped['Medicamento'] = relationship("Medicamento")

    def __repr__(self):
        return f"Item integrado a Compra_ID: {self.compra_id}"