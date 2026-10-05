from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_permission
from app.api.crud_utils import register_crud
from app.db.base import get_db
from app.models import TrainingSession, User
from app.schemas import TrainingSessionCreate, TrainingSessionOut, TrainingSessionUpdate

router = APIRouter(prefix="/training", tags=["training"])


@router.post("", response_model=TrainingSessionOut)
def create_session(
    payload: TrainingSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("training:write")),
):
    session = TrainingSession(coach_id=current_user.id, **payload.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("", response_model=list[TrainingSessionOut])
def list_sessions(
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("training:read")),
    skip: int = 0,
    limit: int = 100,
):
    return db.query(TrainingSession).order_by(TrainingSession.scheduled_at.desc()).offset(skip).limit(limit).all()


register_crud(router, TrainingSession, TrainingSessionOut, TrainingSessionUpdate, "training")
