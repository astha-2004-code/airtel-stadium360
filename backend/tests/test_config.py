import os
import pytest
from app.core.config import Settings

def test_default_cors_origins():
    # Clear any env var overrides
    if "BACKEND_CORS_ORIGINS" in os.environ:
        del os.environ["BACKEND_CORS_ORIGINS"]
    s = Settings()
    assert isinstance(s.BACKEND_CORS_ORIGINS, list)
    assert "http://localhost:5173" in s.BACKEND_CORS_ORIGINS

def test_cors_origins_json_array():
    os.environ["BACKEND_CORS_ORIGINS"] = '["https://airtel-stadium360.vercel.app"]'
    s = Settings()
    assert s.BACKEND_CORS_ORIGINS == ["https://airtel-stadium360.vercel.app"]

def test_cors_origins_trailing_slash_stripped():
    os.environ["BACKEND_CORS_ORIGINS"] = '["https://airtel-stadium360.vercel.app/"]'
    s = Settings()
    assert s.BACKEND_CORS_ORIGINS == ["https://airtel-stadium360.vercel.app"]

def test_cors_origins_single_string():
    os.environ["BACKEND_CORS_ORIGINS"] = "https://airtel-stadium360.vercel.app"
    s = Settings()
    assert s.BACKEND_CORS_ORIGINS == ["https://airtel-stadium360.vercel.app"]

def test_cors_origins_comma_separated():
    os.environ["BACKEND_CORS_ORIGINS"] = "https://airtel-stadium360.vercel.app, http://localhost:5173"
    s = Settings()
    assert s.BACKEND_CORS_ORIGINS == [
        "https://airtel-stadium360.vercel.app",
        "http://localhost:5173"
    ]

def test_cors_origins_python_literal_array():
    os.environ["BACKEND_CORS_ORIGINS"] = "['https://airtel-stadium360.vercel.app']"
    s = Settings()
    assert s.BACKEND_CORS_ORIGINS == ["https://airtel-stadium360.vercel.app"]

def test_cors_origins_wildcard():
    os.environ["BACKEND_CORS_ORIGINS"] = "*"
    s = Settings()
    assert s.BACKEND_CORS_ORIGINS == ["*"]

def test_cors_origins_invalid_url():
    os.environ["BACKEND_CORS_ORIGINS"] = "not_a_valid_url"
    with pytest.raises(ValueError):
        Settings()

