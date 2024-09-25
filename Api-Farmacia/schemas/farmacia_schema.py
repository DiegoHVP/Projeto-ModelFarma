from pydantic import BaseModel

class FarmaciaBase(BaseModel):
    nome: str
    local: str

    class Config:
        from_attributes = True

class FarmaciaCreate(FarmaciaBase):
    pass

class FarmaciaUpdate(FarmaciaBase):
    pass

class FarmaciaResponse(FarmaciaBase):
    id: int
