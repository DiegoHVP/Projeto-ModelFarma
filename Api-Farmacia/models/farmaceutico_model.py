from sqlalchemy import Column, DateTime, Integer, String, Date
from core.configs import settings
from datetime import datetime

class Farmaceutico(settings.DBBaseModel):
    __tablename__ = 'farmaceutico'
    matricula = Column(Integer, primary_key=True, autoincrement=True)
    p_nome = Column(String)
    u_nome = Column(String)
    cpf = Column(String)
    unidade_trabalho = Column(String)
    controle_farmacia = Column(Integer)
    senha = Column(String)
    data_criacao = Column(DateTime, default=datetime.utcnow)