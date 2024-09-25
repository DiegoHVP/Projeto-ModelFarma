from core.configs import settings
from sqlalchemy import Column, Integer, String, DateTime

from datetime import datetime


class Farmacia(settings.DBBaseModel):
    __tablename__ = 'farmacia'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String)
    local = Column(String)
    data_criacao = Column(DateTime, default=datetime.now)