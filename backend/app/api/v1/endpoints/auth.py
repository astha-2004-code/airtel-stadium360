"""
Airtel Stadium360 - Authentication & User Management Endpoints
Exposes REST APIs for user registration, login, JWT token issuance, profile updates,
role verification, and demo account switching.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_admin, get_current_user
from app.core.database import get_db
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.auth import (
    Token,
    UserCreate,
    UserLogin,
    UserProfileUpdate,
    UserResponse,
)
from app.services.auth_service import DEMO_USERS, auth_service

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    """Registers a new user account and returns an authenticated JWT access token."""
    existing_user = auth_service.get_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists in Airtel Stadium360."
        )
    
    user = auth_service.create_user(db, user_in=user_in)
    access_token = create_access_token(subject=user.email, role=user.role)
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=Token)
def login_user(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """Authenticates credentials and returns a signed JWT access token with role claims."""
    user = auth_service.authenticate(db, login_data=login_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify credentials."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is inactive. Please contact your Airtel NOC administrator."
        )
    
    access_token = create_access_token(subject=user.email, role=user.role)
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Returns the authenticated user's profile details."""
    return UserResponse.model_validate(current_user)


@router.put("/me", response_model=UserResponse)
def update_current_user_profile(
    update_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates user profile details (full name, department, phone)."""
    updated_user = auth_service.update_profile(db, user=current_user, update_data=update_data)
    return UserResponse.model_validate(updated_user)


@router.post("/logout")
def logout_user():
    """Confirms session invalidation."""
    return {"message": "Session invalidated successfully."}


@router.get("/users", response_model=List[UserResponse])
def list_system_users(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin)
):
    """Lists registered users (Restricted to NETWORK_ADMIN role)."""
    users = auth_service.list_users(db, skip=skip, limit=limit)
    return [UserResponse.model_validate(u) for u in users]


@router.get("/demo-accounts")
def get_demo_accounts():
    """Returns list of pre-configured competition demonstration accounts for quick evaluation."""
    return [
        {
            "email": u["email"],
            "full_name": u["full_name"],
            "role": u["role"],
            "department": u["department"],
            "description": (
                "Full operational administrator with budget override and network policy governance"
                if u["role"] == "NETWORK_ADMIN"
                else "Specialized RF engineer with 5G beamforming and capacity planning permissions"
                if u["role"] == "TELECOM_ENGINEER"
                else "Executive stadium inspector with read-only dashboard and audit report access"
            ),
        }
        for u in DEMO_USERS
    ]
