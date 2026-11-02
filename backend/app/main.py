import logging
from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.core.database import SessionLocal
from app.api.v1.api import api_router
from app.api.v1.endpoints import evaluation
from app.schemas.health import HealthResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stadium360")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Airtel Stadium360 — AI-powered predictive network optimization and intelligent stadium connectivity platform",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Enforces enterprise security headers across all API responses."""
    SECURITY_HEADERS = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    }

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        for header, value in self.SECURITY_HEADERS.items():
            response.headers[header] = value
        return response


app.add_middleware(SecurityHeadersMiddleware)

# Set all CORS enabled origins
cors_origins = (
    ["*"]
    if settings.ENVIRONMENT == "development"
    else [str(origin) for origin in settings.BACKEND_CORS_ORIGINS]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(evaluation.router, prefix="/api/evaluation", tags=["evaluation"])


@app.get("/", tags=["root"])
def root_redirect():
    return {
        "message": "Welcome to Airtel Stadium360 API",
        "tagline": "Predict. Optimize. Connect.",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }


@app.get("/health", response_model=HealthResponse, tags=["health"])
def quick_health():
    db = SessionLocal()
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    finally:
        db.close()

    return HealthResponse(
        status="ok",
        app_name=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        database_status=db_status
    )


@app.get("/health/ready", tags=["health"])
def readiness_probe(response: Response):
    """Kubernetes / Docker readiness probe."""
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "ready",
            "database": "connected",
            "environment": settings.ENVIRONMENT,
            "version": settings.VERSION,
        }
    except Exception as e:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "not_ready",
            "database": f"unhealthy: {str(e)}",
            "environment": settings.ENVIRONMENT,
        }
    finally:
        db.close()


@app.get("/health/live", tags=["health"])
def liveness_probe():
    """Kubernetes / Docker liveness probe."""
    return {
        "status": "live",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
