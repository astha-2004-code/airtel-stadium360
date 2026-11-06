from typing import List, Union
import json
import ast
from urllib.parse import urlparse
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Airtel Stadium360 API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./stadium360.db"
    
    # Security
    SECRET_KEY: str = "airtel_stadium360_super_secret_competition_key_2026"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    # CORS
    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="after")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        raw_list: List[str] = []
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return []
            if v.startswith("[") and v.endswith("]"):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        raw_list = [str(item).strip() for item in parsed if item]
                    elif isinstance(parsed, str):
                        raw_list = [parsed.strip()]
                except json.JSONDecodeError:
                    try:
                        parsed = ast.literal_eval(v)
                        if isinstance(parsed, list):
                            raw_list = [str(item).strip() for item in parsed if item]
                    except Exception as e:
                        raise ValueError(f"Invalid JSON array in BACKEND_CORS_ORIGINS: {v}") from e
            else:
                raw_list = [item.strip() for item in v.split(",") if item.strip()]
        elif isinstance(v, list):
            raw_list = [str(item).strip() for item in v if item]
        else:
            raise ValueError(f"BACKEND_CORS_ORIGINS must be a list or string, got {type(v)}")

        # Validate and normalize each origin (strip trailing slash, verify scheme)
        validated_origins: List[str] = []
        for origin in raw_list:
            cleaned = origin.rstrip("/")
            if cleaned == "*":
                validated_origins.append("*")
                continue
            parsed = urlparse(cleaned)
            if parsed.scheme not in ("http", "https") or not parsed.netloc:
                raise ValueError(
                    f"Invalid origin URL '{origin}' in BACKEND_CORS_ORIGINS. "
                    "Must be a valid URL with http:// or https:// scheme, or '*'"
                )
            validated_origins.append(cleaned)

        return validated_origins

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
