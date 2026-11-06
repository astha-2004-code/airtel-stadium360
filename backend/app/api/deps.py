"""
Airtel Stadium360 - Authentication & Role-Based Access Control (RBAC) Dependencies
Provides dependency injectors for database sessions, JWT token validation,
and granular role authorization (NETWORK_ADMIN, TELECOM_ENGINEER, EXECUTIVE_VIEWER).
"""
from typing import Generator, List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.services.auth_service import auth_service

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    auto_error=False
)


def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> User:
    """
    Extracts, decodes, and validates current authenticated user from Bearer JWT token.
    Enforces token validity, database existence, active account status, and role consistency.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials or token has expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    user = auth_service.get_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive. Please contact your Airtel NOC administrator."
        )
    return user


class RoleChecker:
    """
    Reusable callable dependency class to enforce role-based access control.
    Returns HTTP 403 Forbidden with clear diagnostic message if user lacks required role.
    """
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        # Superuser always bypasses role checks
        if current_user.is_superuser:
            return current_user
        
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Access denied: operation requires one of {self.allowed_roles} clearance. "
                    f"Current user role: {current_user.role}."
                )
            )
        return current_user


def require_roles(*allowed_roles: str):
    """Factory function returning a role-enforcement dependency."""
    return RoleChecker(list(allowed_roles))


# Specific role dependencies for clean route definitions
get_current_admin = RoleChecker(["NETWORK_ADMIN"])
get_current_engineer_or_admin = RoleChecker(["NETWORK_ADMIN", "TELECOM_ENGINEER"])
get_current_active_user = RoleChecker(["NETWORK_ADMIN", "TELECOM_ENGINEER", "EXECUTIVE_VIEWER"])
