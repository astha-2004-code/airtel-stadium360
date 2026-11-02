"""
Airtel Stadium360 - User Database Model
SQLAlchemy model for enterprise authentication, role-based authorization,
and operations department assignment.
"""
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="TELECOM_ENGINEER", nullable=False)
    department = Column(String(100), default="Airtel Network Operations Centre (NOC)")
    phone = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_login = Column(DateTime, nullable=True)
