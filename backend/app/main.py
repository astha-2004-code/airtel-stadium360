import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.schemas.health import HealthResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stadium360")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Airtel Stadium360 — AI-powered predictive network optimization and intelligent stadium connectivity platform",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development & testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

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
    return HealthResponse(
        status="ok",
        app_name=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        database_status="healthy"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
