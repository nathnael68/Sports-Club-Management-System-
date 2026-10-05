from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_permission, require_role
from app.core.security import get_password_hash
from app.db.base import get_db
from app.models import User, Athlete, PerformanceRecord, Attendance, TrainingSession
from app.schemas import (
    AthleteCreate, AthleteOut, AthleteUpdate,
    PerformanceOut, AttendanceOut, TrainingSessionOut,
)

router = APIRouter(prefix="/athletes", tags=["athletes"])


@router.post("", response_model=AthleteOut)
def create_athlete(
    payload: AthleteCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("athlete:write")),
):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
        role="athlete",
    )
    db.add(user)
    db.flush()
    athlete = Athlete(
        user_id=user.id,
        jersey_number=payload.jersey_number,
        playing_position=payload.playing_position,
        date_of_birth=payload.date_of_birth,
        height_cm=payload.height_cm,
        weight_kg=payload.weight_kg,
        nationality=payload.nationality,
    )
    db.add(athlete)
    db.commit()
    db.refresh(athlete)
    return athlete


@router.get("", response_model=list[AthleteOut])
def list_athletes(
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("athlete:read")),
    skip: int = 0,
    limit: int = 100,
):
    return db.query(Athlete).offset(skip).limit(limit).all()


def _current_athlete(db: Session, user: User) -> Athlete:
    athlete = db.query(Athlete).filter(Athlete.user_id == user.id).first()
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete profile not found")
    return athlete


@router.get("/me", response_model=AthleteOut)
def my_profile(
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("athlete:read:self")),
):
    return _current_athlete(db, user)


@router.get("/me/performance", response_model=list[PerformanceOut])
def my_performance(
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("performance:read:self")),
):
    athlete = _current_athlete(db, user)
    return (
        db.query(PerformanceRecord)
        .filter(PerformanceRecord.athlete_id == athlete.id)
        .order_by(PerformanceRecord.recorded_at.desc())
        .all()
    )


@router.get("/me/attendance", response_model=list[AttendanceOut])
def my_attendance(
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("attendance:read:self")),
):
    athlete = _current_athlete(db, user)
    return db.query(Attendance).filter(Attendance.athlete_id == athlete.id).all()


@router.get("/me/training", response_model=list[TrainingSessionOut])
def my_training(
    db: Session = Depends(get_db),
    user: User = Depends(require_permission("training:read:self")),
):
    athlete = _current_athlete(db, user)
    session_ids = [
        a.session_id
        for a in db.query(Attendance).filter(Attendance.athlete_id == athlete.id).all()
    ]
    return (
        db.query(TrainingSession)
        .filter(TrainingSession.id.in_(session_ids))
        .order_by(TrainingSession.scheduled_at.desc())
        .all()
    )


@router.get("/{athlete_id}", response_model=AthleteOut)
def get_athlete(
    athlete_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("athlete:read")),
):
    athlete = db.get(Athlete, athlete_id)
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")
    return athlete


@router.put("/{athlete_id}", response_model=AthleteOut)
def update_athlete(
    athlete_id: int,
    payload: AthleteUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("athlete:write")),
):
    athlete = db.get(Athlete, athlete_id)
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")
    data = payload.model_dump(exclude_unset=True)
    email = data.pop("email", None)
    full_name = data.pop("full_name", None)
    password = data.pop("password", None)
    if email and email != athlete.user.email:
        if db.query(User).filter(User.email == email).first():
            raise HTTPException(status_code=400, detail="Email already registered")
        setattr(athlete.user, "email", email)
    if full_name:
        setattr(athlete.user, "full_name", full_name)
    if password:
        setattr(athlete.user, "hashed_password", get_password_hash(password))
    for key, value in data.items():
        setattr(athlete, key, value)
    db.commit()
    db.refresh(athlete)
    return athlete


@router.delete("/{athlete_id}", status_code=204)
def delete_athlete(
    athlete_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("athlete:write")),
):
    athlete = db.get(Athlete, athlete_id)
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")
    db.delete(athlete)
    db.commit()
