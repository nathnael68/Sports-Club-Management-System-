from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_permission
from app.api.crud_utils import register_crud
from app.db.base import get_db
from app.models import PerformanceRecord, User
from app.schemas import PerformanceCreate, PerformanceOut, PerformanceUpdate

router = APIRouter(prefix="/performance", tags=["performance"])


@router.post("", response_model=PerformanceOut)
def create_performance(
    payload: PerformanceCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("performance:write")),
):
    data = payload.model_dump()
    if not data.get("recorded_at"):
        data["recorded_at"] = date.today()
    rec = PerformanceRecord(**data)
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


@router.get("", response_model=list[PerformanceOut])
def list_performance(
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("performance:read")),
    athlete_id: int | None = None,
):
    q = db.query(PerformanceRecord).order_by(PerformanceRecord.recorded_at.desc())
    if athlete_id:
        q = q.filter(PerformanceRecord.athlete_id == athlete_id)
    return q.all()


register_crud(router, PerformanceRecord, PerformanceOut, PerformanceUpdate, "performance")
