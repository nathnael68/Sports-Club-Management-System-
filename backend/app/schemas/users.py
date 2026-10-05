from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.core.roles import Role

class UserBase(BaseModel):
    email: str
    full_name: str
    role: Role = Role.ATHLETE
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: Optional[datetime] = None

class UserRoleUpdate(BaseModel):
    role: Role

class UserStatusUpdate(BaseModel):
    is_active: bool
