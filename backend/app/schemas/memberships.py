from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict

class MembershipCreate(BaseModel):
    athlete_id: int
    plan: str = "standard"
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    amount_paid: float = 0.0
    status: str = "active"

class MembershipOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    athlete_id: int
    plan: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    amount_paid: float
    status: str

class MembershipUpdate(BaseModel):
    athlete_id: Optional[int] = None
    plan: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    amount_paid: Optional[float] = None
    status: Optional[str] = None
