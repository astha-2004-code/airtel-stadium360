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

    def create_user(self, db: Session, user_in: UserCreate) -> User:
        hashed_password = get_password_hash(user_in.password)
        user = User(
            email=user_in.email.lower(),
            full_name=user_in.full_name,
            hashed_password=hashed_password,
            role=user_in.role or "TELECOM_ENGINEER",
            department=user_in.department or "Airtel Network Operations Centre (NOC)",
            phone=user_in.phone,
            is_active=True,
            is_superuser=user_in.role == "NETWORK_ADMIN",
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
        user.role = new_role
        user.is_superuser = (new_role == "NETWORK_ADMIN")
        db.commit()
        db.refresh(user)
        return user

    def list_users(self, db: Session, skip: int = 0, limit: int = 50) -> List[User]:
        return db.query(User).offset(skip).limit(limit).all()


auth_service = AuthService()
