from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, model_validator

class InjuryCreate(BaseModel):
    athlete_id: int
    injury_type: str
    body_part: Optional[str] = None
    severity: str = "minor"
    occurred_on: date
    returned_on: Optional[date] = None
    cause: Optional[str] = None
    notes: Optional[str] = None

    @model_validator(mode='after')
    def check_dates(self):
        if self.occurred_on and self.returned_on:
            if self.returned_on < self.occurred_on:
                raise ValueError('returned_on cannot be earlier than occurred_on')
        return self

class InjuryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    athlete_id: int
    injury_type: str
    body_part: Optional[str] = None
    severity: str
    occurred_on: date
    returned_on: Optional[date] = None

class InjuryUpdate(BaseModel):
    athlete_id: Optional[int] = None
    injury_type: Optional[str] = None
    body_part: Optional[str] = None
    severity: Optional[str] = None
    occurred_on: Optional[date] = None
    returned_on: Optional[date] = None
    cause: Optional[str] = None
    notes: Optional[str] = None

    @model_validator(mode='after')
    def check_dates(self):
        if self.occurred_on and self.returned_on:
            if self.returned_on < self.occurred_on:
                raise ValueError('returned_on cannot be earlier than occurred_on')
        return self
