from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_permission
from app.api.crud_utils import register_crud
from app.db.base import get_db
from app.models import Facility
from app.schemas import FacilityCreate, FacilityOut, FacilityUpdate

router = APIRouter(prefix="/facilities", tags=["facilities"])


@router.post("", response_model=FacilityOut)
def create_facility(
    payload: FacilityCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_permission("facility:write")),
):
    f = Facility(**payload.model_dump())
    db.add(f)
    db.commit()
    db.refresh(f)
    return f


@router.get("", response_model=list[FacilityOut])
def list_facilities(
    db: Session = Depends(get_db),
    _: None = Depends(require_permission("facility:read")),
):
    return db.query(Facility).all()


register_crud(router, Facility, FacilityOut, FacilityUpdate, "facility")
