from pytz import timezone

from typing import Optional, List
from datetime import datetime, timedelta

from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from jose import jwt

from models.cliente_model import Cliente as ClienteModel
from models.farmaceutico_model import Farmaceutico as FarmaceuticoModel
from core.configs import settings
from core.security import verificar_senha



oauth2_cliente_schema = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/cliente/login"
)

oauth2_farmaceutico_schema = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/farmaceutico/login"
)

# AUTENTICAR CLIENTE
async def autenticar_cliente(cpf: str, senha: str, db: AsyncSession)-> ClienteModel:
    async with db as session:
        query = select(ClienteModel).filter(ClienteModel.cpf == cpf)
        result = await session.execute(query)
        cliente: ClienteModel = result.scalars().unique().one_or_none()
        if not cliente:
            return None
        
        if not verificar_senha(senha, cliente.senha):
            return None
        return cliente
    

# AUTENTICAR FARMACEUTICO
async def autenticar_farmaceutico(cpf: str, senha: str, db: AsyncSession) -> FarmaceuticoModel:
    async with db as session:
        query = select(FarmaceuticoModel).filter(FarmaceuticoModel.cpf == cpf)
        result = await session.execute(query)
        farmaceutico: FarmaceuticoModel = result.scalars().unique().one_or_none()
        if not farmaceutico:
            return None
        
        if not verificar_senha(senha, farmaceutico.senha):
            return None
        return farmaceutico


# CRIA O TOKEN
def _criar_token(tipo_token: str, tempo_vida: timedelta, sub: str, roles: List[str]) -> str:
    # https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.3
    payload = {}

    rn = timezone('America/Fortaleza')
    expira = datetime.now(tz=rn) + tempo_vida

    payload["type"] = tipo_token # TIPO
    payload["exp"] = expira # EXPIRA EM ...
    payload["iat"] = datetime.now(tz=rn) # DATA DE CRIAÇÃO
    payload["sub"] = str(sub) # PRIMARY KEY (cpf)
    payload["roles"] = roles # PAPEIS

    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.ALGORITHM)


# RETORNA O TOKEN
def criar_token_acesso(sub: str, roles: List[str]) -> str:
    """
    https://jwt.io
    """
    return _criar_token(
        tipo_token='access_token',
        tempo_vida=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        sub=sub,
        roles=roles
    )
