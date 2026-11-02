from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    dashboard,
    network,
    analytics,
    optimizer,
    simulator,
    budget,
    connectivity,
    critical_services,
)

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(network.router, prefix="/network", tags=["network"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(optimizer.router, prefix="/optimizer", tags=["optimizer"])
api_router.include_router(simulator.router, prefix="/simulator", tags=["simulator"])
api_router.include_router(budget.router, prefix="/budget", tags=["budget"])
api_router.include_router(connectivity.router, prefix="/connectivity", tags=["connectivity"])
api_router.include_router(critical_services.router, prefix="/critical-services", tags=["critical-services"])




