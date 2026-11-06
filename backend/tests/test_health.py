from fastapi import Response
from app.main import app, root_redirect, quick_health, health_database, readiness_probe, liveness_probe
from app.api.v1.endpoints.health import health_check, database_health
from app.core.database import SessionLocal

def test_root_endpoint():
    res = root_redirect()
    assert "Airtel Stadium360" in res["message"]
    assert res["tagline"] == "Predict. Optimize. Connect."

def test_health_endpoint():
    res = quick_health()
    assert res.status == "ok"
    assert res.database_status in ["connected", "healthy"]

def test_health_db_endpoint():
    response = Response()
    res = health_database(response=response)
    assert response.status_code == 200
    assert res["status"] == "healthy"
    assert res["database"] == "connected"
    assert "driver" in res

def test_health_ready_endpoint():
    response = Response()
    res = readiness_probe(response=response)
    assert response.status_code == 200
    assert res["status"] == "ready"
    assert res["database"] == "connected"

def test_routes_registered():
    openapi = app.openapi()
    assert "/api/v1/health" in openapi["paths"]
    assert "/api/v1/health/db" in openapi["paths"]
    assert "/" in openapi["paths"]
    assert "/health" in openapi["paths"]
    assert "/health/db" in openapi["paths"]
