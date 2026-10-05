from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_permission
from app.api.crud_utils import register_crud
from app.db.base import get_db
from app.models import Competition
from app.schemas import CompetitionCreate, CompetitionOut, CompetitionUpdate

router = APIRouter(prefix="/competitions", tags=["competitions"])


@router.post("", response_model=CompetitionOut)
def create_competition(
    payload: CompetitionCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_permission("competition:write")),
):
    comp = Competition(**payload.model_dump())
    db.add(comp)
    db.commit()
    db.refresh(comp)
    return comp


@router.get("", response_model=list[CompetitionOut])
def list_competitions(
    db: Session = Depends(get_db),
    _: None = Depends(require_permission("competition:read")),
):
    return db.query(Competition).order_by(Competition.match_date.desc()).all()


register_crud(router, Competition, CompetitionOut, CompetitionUpdate, "competition")
