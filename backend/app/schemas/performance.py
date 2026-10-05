from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator

class PerformanceCreate(BaseModel):
    athlete_id: int
    recorded_at: Optional[date] = None
    session_id: Optional[int] = None
    competition_id: Optional[int] = None
    distance_km: Optional[float] = Field(None, ge=0)
    top_speed_kmh: Optional[float] = Field(None, ge=0)
    sprint_count: Optional[int] = Field(None, ge=0)
    avg_heart_rate: Optional[float] = Field(None, gt=30, lt=250)
    max_heart_rate: Optional[float] = Field(None, gt=30, lt=250)
    training_load: Optional[float] = Field(None, ge=0)
    vo2max_est: Optional[float] = Field(None, ge=10, le=90)
    fitness_score: Optional[float] = Field(None, ge=0, le=100)
    match_rating: Optional[float] = Field(None, ge=0, le=10)

    @model_validator(mode='after')
    def check_heart_rates(self):
        if self.avg_heart_rate and self.max_heart_rate:
            if self.avg_heart_rate > self.max_heart_rate:
                raise ValueError('Average heart rate cannot exceed max heart rate')
        return self

class PerformanceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    athlete_id: int
    recorded_at: date
    distance_km: Optional[float] = None
    top_speed_kmh: Optional[float] = None
    training_load: Optional[float] = None
    fitness_score: Optional[float] = None
    match_rating: Optional[float] = None

class PerformanceUpdate(BaseModel):
    athlete_id: Optional[int] = None
    recorded_at: Optional[date] = None
    session_id: Optional[int] = None
    competition_id: Optional[int] = None
    distance_km: Optional[float] = Field(None, ge=0)
    top_speed_kmh: Optional[float] = Field(None, ge=0)
    sprint_count: Optional[int] = Field(None, ge=0)
    avg_heart_rate: Optional[float] = Field(None, gt=30, lt=250)
    max_heart_rate: Optional[float] = Field(None, gt=30, lt=250)
    training_load: Optional[float] = Field(None, ge=0)
    vo2max_est: Optional[float] = Field(None, ge=10, le=90)
    fitness_score: Optional[float] = Field(None, ge=0, le=100)
    match_rating: Optional[float] = Field(None, ge=0, le=10)

    @model_validator(mode='after')
    def check_heart_rates(self):
        if self.avg_heart_rate and self.max_heart_rate:
            if self.avg_heart_rate > self.max_heart_rate:
                raise ValueError('Average heart rate cannot exceed max heart rate')
        return self
