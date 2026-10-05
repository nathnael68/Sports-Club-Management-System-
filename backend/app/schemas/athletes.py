from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

class AthleteCreate(BaseModel):
    email: str
    full_name: str
    password: str
    jersey_number: Optional[int] = Field(None, ge=1, le=99)
    playing_position: Optional[str] = None
    date_of_birth: Optional[date] = None
    height_cm: Optional[float] = Field(None, gt=50, lt=250)
    weight_kg: Optional[float] = Field(None, gt=20, lt=200)
    nationality: Optional[str] = None

    @field_validator('date_of_birth')
    @classmethod
    def date_of_birth_must_be_past(cls, v: Optional[date]) -> Optional[date]:
        if v and v >= date.today():
            raise ValueError('date_of_birth must be in the past')
        return v

class AthleteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    full_name: str
    email: str
    jersey_number: Optional[int] = None
    playing_position: Optional[str] = None
    date_of_birth: Optional[date] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    nationality: Optional[str] = None

class AthleteUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    jersey_number: Optional[int] = Field(None, ge=1, le=99)
    playing_position: Optional[str] = None
    date_of_birth: Optional[date] = None
    height_cm: Optional[float] = Field(None, gt=50, lt=250)
    weight_kg: Optional[float] = Field(None, gt=20, lt=200)
    nationality: Optional[str] = None

    @field_validator('date_of_birth')
    @classmethod
    def date_of_birth_must_be_past(cls, v: Optional[date]) -> Optional[date]:
        if v and v >= date.today():
            raise ValueError('date_of_birth must be in the past')
        return v
