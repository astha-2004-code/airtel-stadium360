from fastapi import APIRouter
from app.api.v1.endpoints import health, dashboard, network, analytics

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(network.router, prefix="/network", tags=["network"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

