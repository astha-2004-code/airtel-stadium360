"""
Unit and Integration Tests for Module 9: Authentication and User Management
Verifies bcrypt password hashing, JWT token generation/decoding, user registration,
login authentication, profile management, and role-based authorization (RBAC).
"""
import pytest
from datetime import timedelta
from fastapi import HTTPException
from app.core.database import SessionLocal
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
)
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, UserProfileUpdate
from app.services.auth_service import auth_service
from app.api.deps import get_current_admin
from app.api.v1.endpoints.auth import (
    register_user,
    login_user,
    get_current_user_profile,
    update_current_user_profile,
    get_demo_accounts,
)


@pytest.fixture
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_password_hashing_and_verification():
    raw_password = "AirtelSecurePassword2026!"
    hashed = get_password_hash(raw_password)
    
    assert hashed != raw_password
    assert hashed.startswith("$2b$") or hashed.startswith("$2a$")
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword123", hashed) is False


def test_jwt_token_generation_and_decode():
    email = "engineer@airtel.com"
    role = "TELECOM_ENGINEER"
    
    token = create_access_token(subject=email, role=role, expires_delta=timedelta(minutes=30))
    assert isinstance(token, str)
    assert len(token) > 20
    
    payload = decode_access_token(token)
    assert payload is not None
    assert payload.get("sub") == email
    assert payload.get("role") == role
    assert "exp" in payload


def test_demo_users_seeded(db):
    admin = auth_service.get_by_email(db, "admin@airtel.com")
    assert admin is not None
    assert admin.role == "NETWORK_ADMIN"
    assert admin.is_superuser is True
    
    # Verify password authentication for demo user
    authenticated = auth_service.authenticate(
        db, UserLogin(email="admin@airtel.com", password="AirtelNoc@2026")
    )
    assert authenticated is not None
    assert authenticated.id == admin.id

    # Verify engineer demo user
    engineer = auth_service.get_by_email(db, "engineer@airtel.com")
    assert engineer is not None
    assert engineer.role == "TELECOM_ENGINEER"


def test_user_registration(db):
    test_email = "new_rf_specialist@airtel.com"
    existing = auth_service.get_by_email(db, test_email)
    if existing:
        db.delete(existing)
        db.commit()

    user_in = UserCreate(
        email=test_email,
        password="ValidPassword@123",
        full_name="Vikram Sethi",
        role="TELECOM_ENGINEER",
        department="5G Coverage Optimization",
        phone="+91 99887 11223"
    )

    token_resp = register_user(user_in=user_in, db=db)
    assert token_resp.access_token is not None
    assert token_resp.user.email == test_email
    assert token_resp.user.full_name == "Vikram Sethi"

    # Test duplicate registration is rejected with HTTP 400
    with pytest.raises(HTTPException) as exc_info:
        register_user(user_in=user_in, db=db)
    assert exc_info.value.status_code == 400


def test_user_login_success_and_failure(db):
    # Valid login
    login_req = UserLogin(email="engineer@airtel.com", password="AirtelRf@2026")
    resp = login_user(login_data=login_req, db=db)
    assert resp.access_token is not None
    assert resp.user.email == "engineer@airtel.com"
    assert resp.user.role == "TELECOM_ENGINEER"

    # Invalid password login
    bad_login = UserLogin(email="engineer@airtel.com", password="WrongPassword!")
    with pytest.raises(HTTPException) as exc_info:
        login_user(login_data=bad_login, db=db)
    assert exc_info.value.status_code == 401


def test_protected_user_profile_and_update(db):
    user = auth_service.get_by_email(db, "engineer@airtel.com")
    profile = get_current_user_profile(current_user=user)
    assert profile.email == "engineer@airtel.com"
    
    # Update profile
    update_req = UserProfileUpdate(
        full_name="Priya Sharma (Sr. RF Lead)",
        department="Airtel Special Operations NOC",
        phone="+91 98100 54321"
    )
    updated = update_current_user_profile(update_data=update_req, current_user=user, db=db)
    assert updated.full_name == "Priya Sharma (Sr. RF Lead)"
    assert updated.department == "Airtel Special Operations NOC"


def test_role_based_access_control(db):
    admin_user = auth_service.get_by_email(db, "admin@airtel.com")
    engineer_user = auth_service.get_by_email(db, "engineer@airtel.com")
    
    # Admin is granted access
    assert get_current_admin(current_user=admin_user) == admin_user
    
    # Engineer is rejected with HTTP 403 Forbidden
    with pytest.raises(HTTPException) as exc_info:
        get_current_admin(current_user=engineer_user)
    assert exc_info.value.status_code == 403


def test_get_demo_accounts_endpoint():
    accounts = get_demo_accounts()
    assert len(accounts) == 3
    emails = [a["email"] for a in accounts]
    assert "admin@airtel.com" in emails
    assert "engineer@airtel.com" in emails
    assert "viewer@airtel.com" in emails
