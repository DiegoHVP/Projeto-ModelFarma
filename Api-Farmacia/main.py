from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from core.configs import settings
from api.v1.api import api_router
import os

app = FastAPI(title='ModelFarma - Projeto Modelo de Farmacia')
app.include_router(api_router, prefix=settings.API_V1_STR)
api_url = os.getenv('NEXT_PUBLIC_URL_SITE')

origins = [
    "http://localhost",
    "http://localhost:3000",
    api_url,
]

# Adicionar middleware CORS à aplicação
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Permitir todos os métodos HTTP
    allow_headers=["*"],  # Permitir todos os cabeçalhos
)



if __name__ == '__main__':
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000,
                log_level='info', reload=True)