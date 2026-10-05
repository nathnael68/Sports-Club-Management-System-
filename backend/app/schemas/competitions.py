from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class CompetitionCreate(BaseModel):
    name: str
    opponent: Optional[str] = None
    match_date: datetime
    venue: Optional[str] = None
    result: Optional[str] = None
    our_score: Optional[int] = None
    opponent_score: Optional[int] = None

class CompetitionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    opponent: Optional[str] = None
    match_date: datetime
    result: Optional[str] = None

class CompetitionUpdate(BaseModel):
    name: Optional[str] = None
    opponent: Optional[str] = None
    match_date: Optional[datetime] = None
    venue: Optional[str] = None
    result: Optional[str] = None
    our_score: Optional[int] = None
    opponent_score: Optional[int] = None
