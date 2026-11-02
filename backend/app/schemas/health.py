from datetime import datetime, timezone
from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str = Field(default="ok")
    app_name: str = Field(default="Airtel Stadium360")
    version: str = Field(default="1.0.0")
    environment: str = Field(default="development")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    database_status: str = Field(default="connected")
