import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.core.database import SessionLocal, engine
from app.api.v1.api import api_router
from app.api.v1.endpoints import evaluation
from app.schemas.health import HealthResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stadium360")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes database schema and baseline telemetry if empty (e.g. fresh Neon SQL instance)."""
    db = SessionLocal()
    try:
        from app.services.seed_data import seed_database
        from app.services.auth_service import seed_demo_users_if_needed

        seed_database(db)
        seed_demo_users_if_needed(db)
        logger.info("Database schema and seed records initialized successfully.")
    except Exception as e:
        logger.warning(f"Database initialization notice: {e}")
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Airtel Stadium360 — AI-powered predictive network optimization and intelligent stadium connectivity platform",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
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
cors_origins = [str(origin) for origin in settings.BACKEND_CORS_ORIGINS]
if settings.ENVIRONMENT == "development":
    for local_origin in [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]:
        if local_origin not in cors_origins:
            cors_origins.append(local_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
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
        logger.warning(f"Database health check failed: {e}")
        db_status = "disconnected"
    finally:
        db.close()

    return HealthResponse(
        status="ok",
        app_name=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        database_status=db_status
    )


@app.get("/health/db", tags=["health"])
def health_database(response: Response):
    """Dedicated database connectivity healthcheck endpoint without exposing credentials."""
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "driver": engine.dialect.name
        }
    except Exception as e:
        logger.error(f"Health DB probe error: {e}")
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "unhealthy",
            "database": "disconnected"
        }
    finally:
        db.close()


@app.get("/health/ready", tags=["health"])
def readiness_probe(response: Response):
    """Kubernetes / Docker / Render readiness probe."""
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
        logger.error(f"Readiness probe error: {e}")
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "not_ready",
            "database": "disconnected",
            "environment": settings.ENVIRONMENT,
        }
    finally:
        db.close()


@app.get("/health/live", tags=["health"])
def liveness_probe():
    """Kubernetes / Docker / Render liveness probe."""
    return {
        "status": "live",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
