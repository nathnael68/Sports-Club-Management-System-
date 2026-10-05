from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api.deps import require_permission, User
from app.db.base import get_db


def register_crud(
    router: APIRouter,
    model,
    out_schema,
    update_schema,
    perm_base: str,
):
    """Register get-by-id, update and delete endpoints on an existing router."""

    item_name = model.__tablename__.rstrip("s")

    @router.get(f"/{{item_id}}", response_model=out_schema)
    def get_item(
        item_id: int,
        db: Session = Depends(get_db),
        _: User = Depends(require_permission(f"{perm_base}:read")),
    ):
        item = db.get(model, item_id)
        if not item:
            raise HTTPException(status_code=404, detail=f"{item_name} not found")
        return item

    @router.put(f"/{{item_id}}", response_model=out_schema)
    def update_item(
        item_id: int,
        payload: update_schema,
        db: Session = Depends(get_db),
        _: User = Depends(require_permission(f"{perm_base}:write")),
    ):
        item = db.get(model, item_id)
        if not item:
            raise HTTPException(status_code=404, detail=f"{item_name} not found")
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(item, key, value)
        db.commit()
        db.refresh(item)
        return item

    @router.delete(f"/{{item_id}}", status_code=204)
    def delete_item(
        item_id: int,
        db: Session = Depends(get_db),
        _: User = Depends(require_permission(f"{perm_base}:write")),
    ):
        item = db.get(model, item_id)
        if not item:
            raise HTTPException(status_code=404, detail=f"{item_name} not found")
        db.delete(item)
        db.commit()
