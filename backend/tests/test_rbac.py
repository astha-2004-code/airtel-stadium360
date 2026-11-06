"""
Unit and Integration Tests for Module 9: Role-Based Access Control (RBAC)
Tests granular authorization, HTTP 401 unauthenticated enforcement,
HTTP 403 role-restricted access, persona switching, and admin operations.
"""
import pytest
from app.core.database import SessionLocal
from app.models.user import User
from app.services.auth_service import auth_service, DEMO_USERS
from app.core.security import create_access_token, decode_access_token
from app.schemas.auth import UserLogin, RoleUpdateRequest
from app.schemas.budget import BudgetAllocationRequest
from app.schemas.optimizer import OptimizationRequest
from app.schemas.simulator import SimulationRequest
from app.api.deps import get_current_user, get_current_admin, get_current_engineer_or_admin, RoleChecker
from fastapi import HTTPException


@pytest.fixture
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_demo_accounts_seeded_and_roles_intact(db):
    """Verifies that all 3 demo personas exist with their canonical roles."""
    admin = auth_service.get_by_email(db, "admin@airtel.com")
    engineer = auth_service.get_by_email(db, "engineer@airtel.com")
    viewer = auth_service.get_by_email(db, "viewer@airtel.com")

    assert admin is not None
    assert admin.role == "NETWORK_ADMIN"
    assert admin.is_superuser is True

    assert engineer is not None
    assert engineer.role == "TELECOM_ENGINEER"
    assert engineer.is_superuser is False

    assert viewer is not None
    assert viewer.role == "EXECUTIVE_VIEWER"
    assert viewer.is_superuser is False


def test_login_all_three_personas(db):
    """Verifies all 3 demo personas can successfully authenticate."""
    for demo in DEMO_USERS:
        login_data = UserLogin(email=demo["email"], password=demo["password"])
        user = auth_service.authenticate(db, login_data)
        assert user is not None
        assert user.role == demo["role"]
        
        # Test JWT token generation
        token = create_access_token(subject=user.email, role=user.role)
        payload = decode_access_token(token)
        assert payload["sub"] == user.email
        assert payload["role"] == user.role


def test_unauthenticated_request_raises_401(db):
    """Verifies that missing token raises HTTP 401 Unauthorized."""
    with pytest.raises(HTTPException) as exc:
        get_current_user(db=db, token=None)
    assert exc.value.status_code == 401


def test_invalid_token_raises_401(db):
    """Verifies that invalid or malformed token raises HTTP 401 Unauthorized."""
    with pytest.raises(HTTPException) as exc:
        get_current_user(db=db, token="invalid.bearer.token")
    assert exc.value.status_code == 401


def test_role_checker_admin_restriction(db):
    """Verifies that only NETWORK_ADMIN can pass admin-only dependency."""
    admin_checker = RoleChecker(["NETWORK_ADMIN"])

    admin = auth_service.get_by_email(db, "admin@airtel.com")
    engineer = auth_service.get_by_email(db, "engineer@airtel.com")
    viewer = auth_service.get_by_email(db, "viewer@airtel.com")

    # Admin passes
    assert admin_checker(current_user=admin) == admin

    # Engineer fails with 403
    with pytest.raises(HTTPException) as exc1:
        admin_checker(current_user=engineer)
    assert exc1.value.status_code == 403
    assert "NETWORK_ADMIN" in exc1.value.detail

    # Viewer fails with 403
    with pytest.raises(HTTPException) as exc2:
        admin_checker(current_user=viewer)
    assert exc2.value.status_code == 403
    assert "NETWORK_ADMIN" in exc2.value.detail


def test_role_checker_engineer_and_admin_access(db):
    """Verifies that Admin and Engineer pass engineering operations, while Viewer is blocked."""
    eng_checker = RoleChecker(["NETWORK_ADMIN", "TELECOM_ENGINEER"])

    admin = auth_service.get_by_email(db, "admin@airtel.com")
    engineer = auth_service.get_by_email(db, "engineer@airtel.com")
    viewer = auth_service.get_by_email(db, "viewer@airtel.com")

    # Both Admin and Engineer pass
    assert eng_checker(current_user=admin) == admin
    assert eng_checker(current_user=engineer) == engineer

    # Viewer fails with 403
    with pytest.raises(HTTPException) as exc:
        eng_checker(current_user=viewer)
    assert exc.value.status_code == 403
    assert "clearance" in exc.value.detail.lower()


def test_viewer_read_only_restriction_on_budget_approval(db):
    """Verifies that EXECUTIVE_VIEWER and TELECOM_ENGINEER cannot approve budgets."""
    from app.api.v1.endpoints.budget import approve_budget_plan
    
    req = BudgetAllocationRequest(cows_count=4, small_cells_count=26)
    admin = auth_service.get_by_email(db, "admin@airtel.com")
    engineer = auth_service.get_by_email(db, "engineer@airtel.com")

    # Admin approves successfully
    approved = approve_budget_plan(payload=req, admin_user=admin)
    assert approved["status"] == "APPROVED_BY_ADMIN"

    # Non-admin passing to get_current_admin throws 403
    with pytest.raises(HTTPException) as exc:
        get_current_admin(current_user=engineer)
    assert exc.value.status_code == 403


def test_admin_update_user_role(db):
    """Verifies that an admin can update another user's role."""
    from app.api.v1.endpoints.auth import update_user_role

    admin = auth_service.get_by_email(db, "admin@airtel.com")
    engineer = auth_service.get_by_email(db, "engineer@airtel.com")
    
    # Temporarily update engineer's role
    res = update_user_role(
        user_id=engineer.id,
        payload=RoleUpdateRequest(role="TELECOM_ENGINEER"),
        db=db,
        admin_user=admin
    )
    assert res.role == "TELECOM_ENGINEER"


def test_registration_security_prevents_role_escalation(db):
    """Verifies that public registration automatically assigns EXECUTIVE_VIEWER even if elevated role requested."""
    from app.api.v1.endpoints.auth import register_user
    from app.schemas.auth import UserCreate

    test_email = "malicious_actor@test.com"
    existing = auth_service.get_by_email(db, test_email)
    if existing:
        db.delete(existing)
        db.commit()

    # User attempts to request NETWORK_ADMIN
    user_in = UserCreate(
        email=test_email,
        password="StrongPassword2026!",
        full_name="Attacker Trying Elevation",
        role="NETWORK_ADMIN",
        department="External Organization"
    )

    token_resp = register_user(user_in=user_in, db=db)
    assert token_resp.user.role == "EXECUTIVE_VIEWER"
    assert token_resp.user.is_superuser is False

    # Clean up
    created_user = auth_service.get_by_email(db, test_email)
    if created_user:
        db.delete(created_user)
        db.commit()


def test_admin_cannot_demote_or_deactivate_last_admin(db):
    """Verifies that the system prevents demoting or deactivating the last active NETWORK_ADMIN."""
    from app.api.v1.endpoints.auth import update_user_role, update_user_status
    from app.schemas.auth import UserStatusUpdate

    admin = auth_service.get_by_email(db, "admin@airtel.com")
    assert admin is not None

    # Ensure there is only 1 active admin during this check
    other_admins = db.query(User).filter(
        User.role == "NETWORK_ADMIN",
        User.is_active == True,
        User.id != admin.id
    ).all()
    for oa in other_admins:
        oa.role = "TELECOM_ENGINEER"
        db.add(oa)
    db.commit()

    # Attempt to demote the sole admin
    with pytest.raises(HTTPException) as exc1:
        update_user_role(
            user_id=admin.id,
            payload=RoleUpdateRequest(role="EXECUTIVE_VIEWER"),
            db=db,
            admin_user=admin
        )
    assert exc1.value.status_code == 400
    assert "last active NETWORK_ADMIN" in exc1.value.detail

    # Attempt to deactivate the sole admin
    with pytest.raises(HTTPException) as exc2:
        update_user_status(
            user_id=admin.id,
            payload=UserStatusUpdate(is_active=False),
            db=db,
            admin_user=admin
        )
    assert exc2.value.status_code == 400
    assert "last active NETWORK_ADMIN" in exc2.value.detail


def test_user_status_deactivation_and_login_prevention(db):
    """Verifies deactivating a user prevents login with HTTP 403."""
    from app.api.v1.endpoints.auth import update_user_status, login_user
    from app.schemas.auth import UserStatusUpdate, UserCreate

    test_email = "temp_user_test@airtel.com"
    existing = auth_service.get_by_email(db, test_email)
    if existing:
        db.delete(existing)
        db.commit()

    user = auth_service.create_user(
        db,
        UserCreate(
            email=test_email,
            password="SamplePassword123!",
            full_name="Temporary User"
        )
    )

    admin = auth_service.get_by_email(db, "admin@airtel.com")

    # Deactivate the user
    update_user_status(
        user_id=user.id,
        payload=UserStatusUpdate(is_active=False),
        db=db,
        admin_user=admin
    )

    # Attempt login - must fail with 403 Forbidden
    with pytest.raises(HTTPException) as exc:
        login_user(
            login_data=UserLogin(email=test_email, password="SamplePassword123!"),
            db=db
        )
    assert exc.value.status_code == 403
    assert "inactive" in exc.value.detail.lower()

    # Clean up
    db.delete(user)
    db.commit()

