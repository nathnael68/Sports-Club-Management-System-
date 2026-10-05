from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_permission
from app.api.crud_utils import register_crud
from app.db.base import get_db
from app.models import Equipment
from app.schemas import EquipmentCreate, EquipmentOut, EquipmentUpdate

router = APIRouter(prefix="/equipment", tags=["equipment"])


@router.post("", response_model=EquipmentOut)
def create_equipment(
    payload: EquipmentCreate,
    db: Session = Depends(get_db),
    _: None = Depends(require_permission("equipment:write")),
):
    e = Equipment(**payload.model_dump())
    db.add(e)
    db.commit()
    db.refresh(e)
    return e


@router.get("", response_model=list[EquipmentOut])
def list_equipment(
    db: Session = Depends(get_db),
    _: None = Depends(require_permission("equipment:read")),
):
    return db.query(Equipment).all()


register_crud(router, Equipment, EquipmentOut, EquipmentUpdate, "equipment")
