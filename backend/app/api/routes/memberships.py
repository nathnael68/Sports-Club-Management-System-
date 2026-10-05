from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_permission
from app.api.crud_utils import register_crud
from app.db.base import get_db
from app.models import Membership
from app.schemas import MembershipCreate, MembershipOut, MembershipUpdate

router = APIRouter(prefix="/memberships", tags=["memberships"])


@router.post("", response_model=MembershipOut)
def create_membership(
    payload: MembershipCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_permission("membership:write")),
):
    data = payload.model_dump()
    if not data.get("start_date"):
        data["start_date"] = date.today()
    m = Membership(**data)
    db.add(m)
    db.commit()
    db.refresh(m)
    return m


@router.get("", response_model=list[MembershipOut])
def list_memberships(
    db: Session = Depends(get_db),
    _: None = Depends(require_permission("membership:read")),
):
    return db.query(Membership).all()


register_crud(router, Membership, MembershipOut, MembershipUpdate, "membership")
