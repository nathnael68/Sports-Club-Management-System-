from datetime import datetime, date, timezone
from enum import Enum

from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Date, ForeignKey,
    Text, Enum as SAEnum, UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.core.roles import Role


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(Role, values_callable=lambda x: [e.value for e in x]), nullable=False, default=Role.ATHLETE)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    athlete = relationship("Athlete", back_populates="user", uselist=False, cascade="all, delete-orphan")


class PlayingPosition(str, Enum):
    GK = "GK"
    DEF = "DEF"
    MID = "MID"
    FWD = "FWD"


class Athlete(Base):
    __tablename__ = "athletes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    jersey_number = Column(Integer, nullable=True)
    playing_position = Column(SAEnum(PlayingPosition, values_callable=lambda x: [e.value for e in x]), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    nationality = Column(String(100), nullable=True)
    joined_date = Column(Date, default=date.today)
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="athlete")
    attendances = relationship("Attendance", back_populates="athlete", cascade="all, delete-orphan")
    performances = relationship("PerformanceRecord", back_populates="athlete", cascade="all, delete-orphan")
    injuries = relationship("InjuryRecord", back_populates="athlete", cascade="all, delete-orphan")
    memberships = relationship("Membership", back_populates="athlete", cascade="all, delete-orphan")

    @property
    def full_name(self):
        return self.user.full_name if self.user else ""

    @property
    def email(self):
        return self.user.email if self.user else ""


class FacilityType(str, Enum):
    PITCH = "pitch"
    GYM = "gym"
    POOL = "pool"


class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    facility_type = Column(SAEnum(FacilityType, values_callable=lambda x: [e.value for e in x]), nullable=False)
    location = Column(String(255), nullable=True)
    capacity = Column(Integer, nullable=True)
    is_available = Column(Boolean, default=True)


class EquipmentCondition(str, Enum):
    GOOD = "good"
    FAIR = "fair"
    BROKEN = "broken"


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), index=True, nullable=True)
    quantity = Column(Integer, default=1)
    condition = Column(SAEnum(EquipmentCondition, values_callable=lambda x: [e.value for e in x]), default=EquipmentCondition.GOOD)
    last_maintenance = Column(Date, nullable=True)

    facility = relationship("Facility")


class SessionIntensity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TrainingSession(Base):
    __tablename__ = "training_sessions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    coach_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    facility_id = Column(Integer, ForeignKey("facilities.id"), index=True, nullable=True)
    scheduled_at = Column(DateTime, nullable=False)
    duration_min = Column(Integer, default=90)
    intensity = Column(SAEnum(SessionIntensity, values_callable=lambda x: [e.value for e in x]), default=SessionIntensity.MEDIUM)
    focus = Column(String(100), nullable=True)  # endurance, strength, tactics
    notes = Column(Text, nullable=True)

    coach = relationship("User")
    facility = relationship("Facility")
    attendances = relationship("Attendance", back_populates="session", cascade="all, delete-orphan")


class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"


class Attendance(Base):
    __tablename__ = "attendances"
    __table_args__ = (UniqueConstraint("athlete_id", "session_id", name="uq_attendance"),)

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("athletes.id"), index=True, nullable=False)
    session_id = Column(Integer, ForeignKey("training_sessions.id"), index=True, nullable=False)
    status = Column(SAEnum(AttendanceStatus, values_callable=lambda x: [e.value for e in x]), default=AttendanceStatus.PRESENT)
    minutes_late = Column(Integer, default=0)
    rpe = Column(Integer, nullable=True)  # session RPE 1-10 reported by athlete

    athlete = relationship("Athlete", back_populates="attendances")
    session = relationship("TrainingSession", back_populates="attendances")


class CompetitionResult(str, Enum):
    WIN = "win"
    LOSS = "loss"
    DRAW = "draw"


class Competition(Base):
    __tablename__ = "competitions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    opponent = Column(String(255), nullable=True)
    match_date = Column(DateTime, nullable=False)
    venue = Column(String(255), nullable=True)
    result = Column(SAEnum(CompetitionResult, values_callable=lambda x: [e.value for e in x]), nullable=True)
    our_score = Column(Integer, nullable=True)
    opponent_score = Column(Integer, nullable=True)


class PerformanceRecord(Base):
    __tablename__ = "performance_records"

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("athletes.id"), index=True, nullable=False)
    recorded_at = Column(Date, nullable=False, default=date.today)
    session_id = Column(Integer, ForeignKey("training_sessions.id"), index=True, nullable=True)
    competition_id = Column(Integer, ForeignKey("competitions.id"), index=True, nullable=True)

    distance_km = Column(Float, nullable=True)
    top_speed_kmh = Column(Float, nullable=True)
    sprint_count = Column(Integer, nullable=True)
    avg_heart_rate = Column(Float, nullable=True)
    max_heart_rate = Column(Float, nullable=True)
    training_load = Column(Float, nullable=True)  # session load = duration * RPE
    vo2max_est = Column(Float, nullable=True)
    fitness_score = Column(Float, nullable=True)  # composite 0-100
    match_rating = Column(Float, nullable=True)  # 0-10 coach rating

    athlete = relationship("Athlete", back_populates="performances")


class InjurySeverity(str, Enum):
    MINOR = "minor"
    MODERATE = "moderate"
    SEVERE = "severe"


class InjuryRecord(Base):
    __tablename__ = "injury_records"

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("athletes.id"), index=True, nullable=False)
    injury_type = Column(String(100), nullable=False)  # hamstring, ACL, etc.
    body_part = Column(String(100), nullable=True)
    severity = Column(SAEnum(InjurySeverity, values_callable=lambda x: [e.value for e in x]), default=InjurySeverity.MINOR)
    occurred_on = Column(Date, nullable=False)
    returned_on = Column(Date, nullable=True)
    cause = Column(String(100), nullable=True)  # training, match, other
    notes = Column(Text, nullable=True)

    athlete = relationship("Athlete", back_populates="injuries")


class MembershipPlan(str, Enum):
    STANDARD = "standard"
    PREMIUM = "premium"
    JUNIOR = "junior"

class MembershipStatus(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    SUSPENDED = "suspended"


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True, index=True)
    athlete_id = Column(Integer, ForeignKey("athletes.id"), index=True, nullable=False)
    plan = Column(SAEnum(MembershipPlan, values_callable=lambda x: [e.value for e in x]), default=MembershipPlan.STANDARD)
    start_date = Column(Date, default=date.today)
    end_date = Column(Date, nullable=True)
    amount_paid = Column(Float, default=0.0)
    status = Column(SAEnum(MembershipStatus, values_callable=lambda x: [e.value for e in x]), default=MembershipStatus.ACTIVE)

    athlete = relationship("Athlete", back_populates="memberships")


class MLModelType(str, Enum):
    PERFORMANCE = "performance"
    INJURY = "injury"
    RECOMMENDATION = "recommendation"


class MLModel(Base):
    __tablename__ = "ml_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    model_type = Column(SAEnum(MLModelType, values_callable=lambda x: [e.value for e in x]), nullable=False)
    version = Column(String(20), nullable=False)
    metrics = Column(Text, nullable=True)  # JSON string of eval metrics
    trained_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    artifact_path = Column(String(255), nullable=True)

