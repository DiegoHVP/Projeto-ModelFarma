from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship, Mapped
from core.configs import settings
from datetime import datetime

from models.farmacia_model import Farmacia



class Medicamento(settings.DBBaseModel):
    __tablename__ = 'medicamento'
    id = Column(Integer, primary_key=True, autoincrement=True)
    vencimento = Column(DateTime)
    preco = Column(Numeric(10, 2))
    quantidade = Column(Integer)
    alergias = Column(String)
    faixa_etaria = Column(String)
    mg_ml = Column(String)
    unidade = Column(String)
    nome = Column(String)
    farmacia_id = Column(Integer, ForeignKey('farmacia.id'))
    similares = Column(String)
    genericos = Column(String)
    reabastecer = Column(Integer)
    data_criacao = Column(DateTime, default=datetime.now)

    farmacia: Mapped['Farmacia'] = relationship('Farmacia')

    similares_rel: Mapped['Medicamento'] = relationship(
        'Medicamento',
        primaryjoin="Medicamento.similares == Medicamento.id",
        foreign_keys=[similares],
        uselist=True
    )
    
    genericos_rel: Mapped['Medicamento'] = relationship(
        'Medicamento',
        primaryjoin="Medicamento.genericos == Medicamento.id",
        foreign_keys=[genericos],
        uselist=True
    )
