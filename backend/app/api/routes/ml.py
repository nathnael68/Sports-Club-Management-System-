from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role, require_permission
from app.core.roles import Role
from app.db.base import get_db
from app.models import User, MLModel, Athlete
from app.ml import service

router = APIRouter(prefix="/ml", tags=["ml"])


def require_ml_read(
    athlete_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> User:
    from app.core.roles import has_permission

    if has_permission(user.role, "ml:read"):
        return user
    if has_permission(user.role, "ml:read:self"):
        athlete = db.query(Athlete).filter(Athlete.user_id == user.id).first()
        if athlete and athlete.id == athlete_id:
            return user
    raise HTTPException(status_code=403, detail="Insufficient permission for ML access")


@router.post("/train")
def train_models(
    db: Session = Depends(get_db),
    _: User = Depends(require_role(Role.COACH)),
):
    injury = service.train_injury_model(db)
    performance = service.train_performance_model(db)
    return {"injury": injury, "performance": performance}


@router.get("/predict/injury/{athlete_id}")
def predict_injury(
    athlete_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_ml_read),
):
    return service.predict_injury_risk(db, athlete_id)


@router.get("/predict/performance/{athlete_id}")
def predict_performance(
    athlete_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_ml_read),
):
    return service.predict_performance(db, athlete_id)


@router.get("/recommendations/{athlete_id}")
def recommend(
    athlete_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_ml_read),
):
    return service.recommendations(db, athlete_id)


@router.get("/models", response_model=list)
def list_models(
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("ml:read")),
):
    return [
        {
            "id": m.id,
            "name": m.name,
            "model_type": m.model_type,
            "version": m.version,
            "trained_at": m.trained_at,
            "metrics": m.metrics,
        }
        for m in db.query(MLModel).order_by(MLModel.trained_at.desc()).all()
    ]
