from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_permission
from app.api.crud_utils import register_crud
from app.db.base import get_db
from app.models import InjuryRecord, User
from app.schemas import InjuryCreate, InjuryOut, InjuryUpdate

router = APIRouter(prefix="/injuries", tags=["injuries"])


@router.post("", response_model=InjuryOut)
def create_injury(
    payload: InjuryCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("injury:write")),
):
    rec = InjuryRecord(**payload.model_dump())
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


@router.get("", response_model=list[InjuryOut])
def list_injuries(
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("injury:read")),
    athlete_id: int | None = None,
):
    q = db.query(InjuryRecord).order_by(InjuryRecord.occurred_on.desc())
    if athlete_id:
        q = q.filter(InjuryRecord.athlete_id == athlete_id)
    return q.all()


register_crud(router, InjuryRecord, InjuryOut, InjuryUpdate, "injury")
