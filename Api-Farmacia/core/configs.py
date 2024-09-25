from pathlib import Path
from typing import List, ClassVar
from pydantic_settings import BaseSettings
from sqlalchemy.ext.declarative import declarative_base



class Settings(BaseSettings):
    API_V1_STR: str = '/api/v1'
    
    # SE FOR USAR SQLite
    """ 
    # Configuração para usar SQLite
    arquivo_db: str = 'db/Farma_DB.sqlite'
    folder = Path(arquivo_db).parent
    folder.mkdir(parents=True, exist_ok=True)
    
    # Conexão com SQLite
    DB_URL: str = f'sqlite:///{arquivo_db}'
    """

    import os

    DB_URL: str = os.getenv('DATABASE_URL')
    DBBaseModel: ClassVar = declarative_base()

    """
    import secrets

    token: str = secrets.token_urlsafe(NUMERO)
    # GERA UM JWT_SECRET
    """
    JWT_SECRET: str = 'KEY_PARA_GERAR_JWT'
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    class Config:
        case_sensitive = True


settings: Settings = Settings()
