from app.main import app, root_redirect
from app.api.v1.endpoints.health import health_check
from app.core.database import SessionLocal

def test_root_endpoint():
    res = root_redirect()
    assert "Airtel Stadium360" in res["message"]
    assert res["tagline"] == "Predict. Optimize. Connect."

def test_health_endpoint():
    db = SessionLocal()
    try:
        res = health_check(db=db)
        assert res.status == "ok"
        assert res.database_status == "connected"
    finally:
        db.close()

def test_routes_registered():
    openapi = app.openapi()
    assert "/api/v1/health" in openapi["paths"]
    assert "/" in openapi["paths"]
    assert "/health" in openapi["paths"]
