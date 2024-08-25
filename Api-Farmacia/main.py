from fastapi import FastAPI
from endpoints import farmaceutico, medicamento, fornecedor, cliente, farmacia, compra
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware


app = FastAPI()

# Configurar as origens permitidas
origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://projetosite-modelfarma.onrender.com", # APENAS PARA TESTES
]

# Adicionar middleware CORS à aplicação
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Permitir todos os métodos HTTP
    allow_headers=["*"],  # Permitir todos os cabeçalhos
)


app.include_router(medicamento.router)
app.include_router(fornecedor.router)
app.include_router(cliente.router)
app.include_router(farmaceutico.router)
app.include_router(farmacia.router)
app.include_router(compra.router)

if __name__ == "__main__":
    from uvicorn import run
    run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
