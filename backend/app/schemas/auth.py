"""
Airtel Stadium360 - Authentication & User Schemas
Pydantic models for user registration, login credentials, JWT token payloads,
role update requests, and granular permissions.
"""
from datetime import datetime
from typing import Dict, Optional
from pydantic import BaseModel, ConfigDict, Field


class UserBase(BaseModel):
    email: str = Field(..., description="Corporate email address")
    full_name: str
    role: str = Field("TELECOM_ENGINEER", description="Role: NETWORK_ADMIN, TELECOM_ENGINEER, EXECUTIVE_VIEWER")
    department: str = Field("Airtel Network Operations Centre (NOC)", description="Operating department")
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password with minimum 6 characters")


class UserLogin(BaseModel):
    email: str
    password: str


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None


class RoleUpdateRequest(BaseModel):
    role: str = Field(..., description="Target role: NETWORK_ADMIN, TELECOM_ENGINEER, EXECUTIVE_VIEWER")


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    exp: Optional[int] = None


class UserPermissionsResponse(BaseModel):
    role: str
    is_superuser: bool
    permissions: Dict[str, bool]
