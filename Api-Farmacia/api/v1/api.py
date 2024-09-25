from fastapi import APIRouter

from api.v1.endpoints import cliente
from api.v1.endpoints import compra
from api.v1.endpoints import farmaceutico
from api.v1.endpoints import farmacia
from api.v1.endpoints import fornecedor
from api.v1.endpoints import medicamento

api_router = APIRouter()

api_router.include_router(cliente.router, prefix='/cliente', tags=['Cliente'])
api_router.include_router(farmaceutico.router, prefix='/farmaceutico', tags=['Farmaceutico'])
api_router.include_router(fornecedor.router, prefix='/fornecedor', tags=['Fornecedor'] )
api_router.include_router(medicamento.router, prefix='/medicamento', tags=['Medicamento'])
api_router.include_router(compra.router, prefix='/compra', tags=['Compra'])
api_router.include_router(farmacia.router, prefix='/farmacia', tags=["Farmacia"])

