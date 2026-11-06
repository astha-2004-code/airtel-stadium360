import logging
from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db, engine
from app.core.config import settings
from app.schemas.health import HealthResponse

logger = logging.getLogger("stadium360.health")
router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        logger.warning(f"Database health check warning: {e}")
        db_status = "disconnected"
        
    return HealthResponse(
        status="ok",
        app_name=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        database_status=db_status
    )

@router.get("/health/db")
def database_health(response: Response, db: Session = Depends(get_db)):
    """Dedicated database connectivity healthcheck without exposing credentials."""
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "driver": engine.dialect.name
        }
    except Exception as e:
        logger.error(f"Database health check error: {e}")
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "unhealthy",
            "database": "disconnected"
        }

@router.get("/ready")
def readiness_check(response: Response, db: Session = Depends(get_db)):
    """Kubernetes / Docker readiness probe: verifies database connectivity and engine readiness."""
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "ready",
            "database": "connected",
            "environment": settings.ENVIRONMENT,
            "version": settings.VERSION,
        }
    except Exception as e:
        logger.error(f"Readiness check error: {e}")
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "not_ready",
            "database": "disconnected",
            "environment": settings.ENVIRONMENT,
        }

@router.get("/live")
def liveness_check():
    """Kubernetes / Docker liveness probe: verifies process is alive and responsive."""
    return {
        "status": "live",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }
