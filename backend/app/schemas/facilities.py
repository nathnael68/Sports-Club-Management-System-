from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict

class FacilityCreate(BaseModel):
    name: str
    facility_type: str
    location: Optional[str] = None
    capacity: Optional[int] = None
    is_available: bool = True

class FacilityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    facility_type: str
    location: Optional[str] = None
    capacity: Optional[int] = None
    is_available: bool

class FacilityUpdate(BaseModel):
    name: Optional[str] = None
    facility_type: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    is_available: Optional[bool] = None

class EquipmentCreate(BaseModel):
    name: str
    category: Optional[str] = None
    facility_id: Optional[int] = None
    quantity: int = 1
    condition: str = "good"
    last_maintenance: Optional[date] = None

class EquipmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    category: Optional[str] = None
    facility_id: Optional[int] = None
    quantity: int
    condition: str

class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    facility_id: Optional[int] = None
    quantity: Optional[int] = None
    condition: Optional[str] = None
    last_maintenance: Optional[date] = None
