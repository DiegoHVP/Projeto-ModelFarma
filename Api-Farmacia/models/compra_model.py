from sqlalchemy import Column, DateTime, Integer, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship, Mapped
from core.configs import settings
from datetime import datetime

from .cliente_model import Cliente

class Compra(settings.DBBaseModel):
    __tablename__ = 'compra'
    id = Column(Integer, primary_key=True, autoincrement=True)
    cliente_id = Column(Integer, ForeignKey('cliente.id'))
    data_compra = Column(DateTime, default=datetime.now())
    preco_total = Column(Numeric(10, 2))
        
    cliente_id_: Mapped['Cliente'] = relationship('Cliente')

