"""
Airtel Stadium360 - Authentication & User Management Service
Handles user registration, credential verification, JWT token issuance,
demo user seeding, role governance, and profile updates.
"""
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.base import Base
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, UserProfileUpdate

# Ensure tables exist
Base.metadata.create_all(bind=engine)


# Standard competition judge demonstration personas
DEMO_USERS = [
    {
        "email": "admin@airtel.com",
        "password": "AirtelNoc@2026",
        "full_name": "Sunil Varma",
        "role": "NETWORK_ADMIN",
        "department": "Airtel Executive NOC Directorate",
        "phone": "+91 98100 12345",
        "is_superuser": True,
    },
    {
        "email": "engineer@airtel.com",
        "password": "AirtelRf@2026",
        "full_name": "Priya Sharma",
        "role": "TELECOM_ENGINEER",
        "department": "Airtel 5G Special Events Planning",
        "phone": "+91 98100 54321",
        "is_superuser": False,
    },
    {
        "email": "viewer@airtel.com",
        "password": "AirtelSync@2026",
        "full_name": "BCCI Stadium Observer",
        "role": "EXECUTIVE_VIEWER",
        "department": "Match Operations & Compliance",
        "phone": "+91 98100 99887",
        "is_superuser": False,
    },
]


def seed_demo_users_if_needed(db: Session):
    """
    Seeds and continuously synchronizes the 3 standard demo users.
    Guarantees canonical credentials and roles match competition requirements.
    """
    for demo in DEMO_USERS:
        existing = db.query(User).filter(User.email == demo["email"]).first()
        if not existing:
            hashed = get_password_hash(demo["password"])
            user = User(
                email=demo["email"],
                full_name=demo["full_name"],
                hashed_password=hashed,
                role=demo["role"],
                department=demo["department"],
                phone=demo.get("phone"),
                is_active=True,
                is_superuser=demo.get("is_superuser", False),
                created_at=datetime.now(timezone.utc),
            )
            db.add(user)
        else:
            # Sync role and superuser status if database drifted
            needs_update = False
            if existing.role != demo["role"]:
                existing.role = demo["role"]
                needs_update = True
            if existing.is_superuser != demo.get("is_superuser", False):
                existing.is_superuser = demo.get("is_superuser", False)
                needs_update = True
            if not existing.is_active:
                existing.is_active = True
                needs_update = True
            # Verify password hash works; rehash if needed
            if not verify_password(demo["password"], existing.hashed_password):
                existing.hashed_password = get_password_hash(demo["password"])
                needs_update = True
            if needs_update:
                db.add(existing)
    db.commit()


class AuthService:
    """Manages user state, authentication workflows, and token generation."""

    def __init__(self):
        # Seed demo users on service instantiation
        db = SessionLocal()
        try:
            seed_demo_users_if_needed(db)
        finally:
            db.close()

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email.lower()).first()

    def get_by_id(self, db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    def create_user(self, db: Session, user_in: UserCreate, allow_privileged_roles: bool = False) -> User:
        hashed_password = get_password_hash(user_in.password)
        
        # Enforce security: public registrations must never receive elevated roles directly
        assigned_role = "EXECUTIVE_VIEWER"
        if allow_privileged_roles and user_in.role in ["NETWORK_ADMIN", "TELECOM_ENGINEER", "EXECUTIVE_VIEWER"]:
            assigned_role = user_in.role

        dept = user_in.department or "Airtel Observer / Guest"
        user = User(
            email=user_in.email.strip().lower(),
            full_name=user_in.full_name.strip(),
            hashed_password=hashed_password,
            role=assigned_role,
            department=dept,
            phone=user_in.phone,
            is_active=True,
            is_superuser=(assigned_role == "NETWORK_ADMIN"),
            created_at=datetime.now(timezone.utc),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def authenticate(self, db: Session, login_data: UserLogin) -> Optional[User]:
        user = self.get_by_email(db, login_data.email)
        if not user:
            return None
        if not verify_password(login_data.password, user.hashed_password):
            return None
        
        # Update last login timestamp
        user.last_login = datetime.now(timezone.utc)
        db.commit()
        db.refresh(user)
        return user

    def update_profile(self, db: Session, user: User, update_data: UserProfileUpdate) -> User:
        if update_data.full_name is not None:
            user.full_name = update_data.full_name
        if update_data.department is not None:
            user.department = update_data.department
        if update_data.phone is not None:
            user.phone = update_data.phone
        db.commit()
        db.refresh(user)
        return user

    def update_role(self, db: Session, user: User, new_role: str) -> User:
        # Prevent demoting the last active administrator
        if user.role == "NETWORK_ADMIN" and new_role != "NETWORK_ADMIN":
            active_admins = db.query(User).filter(
                User.role == "NETWORK_ADMIN",
                User.is_active == True,
                User.id != user.id
            ).count()
            if active_admins == 0:
                raise ValueError("Cannot demote the last active NETWORK_ADMIN in the system.")

        user.role = new_role
        user.is_superuser = (new_role == "NETWORK_ADMIN")
        db.commit()
        db.refresh(user)
        return user

    def update_status(self, db: Session, user: User, is_active: bool) -> User:
        # Prevent deactivating the last active administrator
        if user.role == "NETWORK_ADMIN" and not is_active:
            active_admins = db.query(User).filter(
                User.role == "NETWORK_ADMIN",
                User.is_active == True,
                User.id != user.id
            ).count()
            if active_admins == 0:
                raise ValueError("Cannot deactivate the last active NETWORK_ADMIN in the system.")

        user.is_active = is_active
        db.commit()
        db.refresh(user)
        return user

    def list_users(
        self,
        db: Session,
        search: Optional[str] = None,
        role: Optional[str] = None,
        is_active: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[User]:
        query = db.query(User)
        if search:
            term = f"%{search.strip().lower()}%"
            query = query.filter(
                (User.full_name.ilike(term)) |
                (User.email.ilike(term)) |
                (User.department.ilike(term))
            )
        if role:
            query = query.filter(User.role == role)
        if is_active is not None:
            query = query.filter(User.is_active == is_active)
        return query.order_by(User.id.asc()).offset(skip).limit(limit).all()


auth_service = AuthService()
