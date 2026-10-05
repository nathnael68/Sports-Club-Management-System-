from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_permission
from app.api.crud_utils import register_crud
from app.db.base import get_db
from app.models import Attendance, User
from app.schemas import AttendanceCreate, AttendanceOut, AttendanceUpdate

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post("", response_model=AttendanceOut)
def mark_attendance(
    payload: AttendanceCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("attendance:write")),
):
    existing = db.query(Attendance).filter(
        Attendance.athlete_id == payload.athlete_id,
        Attendance.session_id == payload.session_id,
    ).first()
    if existing:
        setattr(existing, "status", payload.status)
        if payload.rpe is not None:
            setattr(existing, "rpe", payload.rpe)
        if payload.minutes_late is not None:
            setattr(existing, "minutes_late", payload.minutes_late)
        db.commit()
        db.refresh(existing)
        return existing
    att = Attendance(**payload.model_dump())
    db.add(att)
    db.commit()
    db.refresh(att)
    return att


@router.get("", response_model=list[AttendanceOut])
def list_attendance(
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("attendance:read")),
    session_id: int | None = None,
):
    q = db.query(Attendance)
    if session_id:
        q = q.filter(Attendance.session_id == session_id)
    return q.all()


register_crud(router, Attendance, AttendanceOut, AttendanceUpdate, "attendance")
