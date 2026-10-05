from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator

class TrainingSessionCreate(BaseModel):
    title: str
    facility_id: Optional[int] = None
    scheduled_at: datetime
    duration_min: int = Field(90, gt=0, le=480)
    intensity: str = "medium"
    focus: Optional[str] = None
    notes: Optional[str] = None

class TrainingSessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    coach_id: int
    facility_id: Optional[int] = None
    scheduled_at: datetime
    duration_min: int
    intensity: str
    focus: Optional[str] = None

class TrainingSessionUpdate(BaseModel):
    title: Optional[str] = None
    facility_id: Optional[int] = None
    scheduled_at: Optional[datetime] = None
    duration_min: Optional[int] = Field(None, gt=0, le=480)
    intensity: Optional[str] = None
    focus: Optional[str] = None
    notes: Optional[str] = None

class AttendanceCreate(BaseModel):
    athlete_id: int
    session_id: int
    status: str = "present"
    minutes_late: int = Field(0, ge=0)
    rpe: Optional[int] = Field(None, ge=1, le=10)

    @model_validator(mode='after')
    def validate_status_and_late(self) -> 'AttendanceCreate':
        if self.status in ("present", "absent"):
            self.minutes_late = 0
        elif self.status == "late" and self.minutes_late <= 0:
            self.minutes_late = 5
        if self.status == "absent":
            self.rpe = None
        return self

class AttendanceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    athlete_id: int
    session_id: int
    status: str
    minutes_late: int
    rpe: Optional[int] = None

class AttendanceUpdate(BaseModel):
    athlete_id: Optional[int] = None
    session_id: Optional[int] = None
    status: Optional[str] = None
    minutes_late: Optional[int] = Field(None, ge=0)
    rpe: Optional[int] = Field(None, ge=1, le=10)
