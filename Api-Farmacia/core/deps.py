import datetime
import json
from typing import Dict, Generator, Optional, List

from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel

from core.database import Session
from core.auth import oauth2_cliente_schema, oauth2_farmaceutico_schema
from core.configs import settings
from models.cliente_model import Cliente
from models.farmaceutico_model import Farmaceutico
from schemas.cliente_schema import ClienteBase


# TOKEN
class TokenData(BaseModel):
    cpf: Optional[str] = None
    roles: Optional[List[str]] = None


# GERADOR DE SESSOES
async def get_session() -> Generator:  # type: ignore
    session: AsyncSession = Session()

    try:
        yield session
    finally:
        await session.close()


# PEGAR CLIENTE LOGADO
async def get_current_cliente(
    db: AsyncSession = Depends(get_session), 
    token: str = Depends(oauth2_cliente_schema)
) -> Cliente:
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Não foi possível autenticar a credencial',
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.ALGORITHM],
            options={"verify_aud": False}
        )

        expira_em: int = payload.get("exp") 
        current_time = datetime.datetime.utcnow().timestamp() 

        if expira_em is None or current_time > expira_em:
            # Token expirado
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expirou",
                headers={"WWW-Authenticate": "Bearer"},
            )

        cpf: str = payload.get("sub")
        roles_: List[str] = payload.get("roles")

        if cpf is None:
            raise credential_exception

        token_data = TokenData(cpf=cpf, roles=roles_)

    except JWTError:
        raise credential_exception

    async with db as session:
        cliente_query = select(Cliente).filter(Cliente.cpf == token_data.cpf)
        cliente_result = await session.execute(cliente_query)
        cliente = cliente_result.scalars().unique().one_or_none()

        if cliente is None:
            raise credential_exception

        cliente.alergias = json.loads(cliente.alergias)
        return cliente


# PEGAR FARMACEUTICO LOGADO
async def get_current_farmaceutico(
    db: AsyncSession = Depends(get_session), 
    token: str = Depends(oauth2_farmaceutico_schema)
) -> Farmaceutico:
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Não foi possível autenticar a credencial',
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.ALGORITHM],
            options={"verify_aud": False}
        )

        expira_em: int = payload.get("exp")
        current_time = datetime.datetime.utcnow().timestamp()

        if expira_em is None or current_time > expira_em:
            # Token is expired
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expirou",
                headers={"WWW-Authenticate": "Bearer"},
            )

        cpf: str = payload.get("sub")
        roles_: List[str] = payload.get("roles")

        if cpf is None or ({"farmaceutico"} not in roles_):
            raise credential_exception

        token_data = TokenData(cpf=cpf, roles=roles_)

    except JWTError:
        raise credential_exception

    async with db as session:
        farmaceutico_query = select(Farmaceutico).filter(Farmaceutico.cpf == token_data.cpf)
        farmaceutico_result = await session.execute(farmaceutico_query)
        farmaceutico = farmaceutico_result.scalars().unique().one_or_none()

        if farmaceutico is None:
            raise credential_exception

        return farmaceutico
