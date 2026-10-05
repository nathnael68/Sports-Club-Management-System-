import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.roles import Role
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.base import get_db
from app.models import Athlete, User
from app.schemas import GoogleLoginRequest, Token, UserCreate, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    try:
        role = Role(payload.role)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid role")
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # If creating an athlete user, automatically create default Athlete profile record
    if role == Role.ATHLETE:
        existing_athlete = db.query(Athlete).filter(Athlete.user_id == user.id).first()
        if not existing_athlete:
            db.add(Athlete(user_id=user.id))
            db.commit()

    return user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, str(user.hashed_password)):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer"}


@router.post("/google", response_model=Token)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    """Authenticate or auto-provision a user using a Google OAuth ID token."""
    client_id = settings.GOOGLE_CLIENT_ID
    if not client_id or "YOUR_GOOGLE_CLIENT_ID_HERE" in client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google Client ID is not configured. Please set GOOGLE_CLIENT_ID in backend/.env.",
        )

    try:
        id_info = id_token.verify_oauth2_token(
            payload.id_token,
            google_requests.Request(),
            client_id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google ID token: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Failed to verify Google token: {str(e)}",
        )

    email = id_info.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google token did not contain an email address.",
        )

    email_verified = id_info.get("email_verified", True)
    if not email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account email is not verified.",
        )

    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Auto-provision new athlete account for new Google users
        full_name = id_info.get("name") or email.split("@")[0].capitalize()
        # Generate an unguessable password hash to fulfill non-null constraint
        random_pw = secrets.token_urlsafe(32)
        user = User(
            email=email,
            full_name=full_name,
            hashed_password=get_password_hash(random_pw),
            role=Role.ATHLETE,
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        existing_athlete = db.query(Athlete).filter(Athlete.user_id == user.id).first()
        if not existing_athlete:
            db.add(Athlete(user_id=user.id))
            db.commit()

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user account")

    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user

