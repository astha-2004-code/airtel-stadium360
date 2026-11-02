"""
Unit and Integration Tests for Module 11: Production Readiness and Deployment
Validates Dockerfiles, Nginx configurations, Docker Compose specifications,
production health/liveness/readiness probes, and environment schemas.
"""
import os
import re
from pathlib import Path
import pytest
from fastapi import Response

from app.main import app, quick_health, readiness_probe, liveness_probe, SecurityHeadersMiddleware
from app.core.config import settings
from app.core.database import SessionLocal


def get_project_root() -> Path:
    """Returns absolute path to the project root directory."""
    return Path(__file__).resolve().parent.parent.parent


def test_backend_dockerfile_production_readiness():
    """Verifies backend Dockerfile multi-stage build, non-root security, and healthcheck."""
    dockerfile_path = get_project_root() / "backend" / "Dockerfile"
    assert dockerfile_path.exists(), "backend/Dockerfile must exist"
    
    content = dockerfile_path.read_text(encoding="utf-8")
    
    # 1. Multi-stage build directives
    assert "FROM python:3.11-slim AS builder" in content
    assert "FROM python:3.11-slim AS runner" in content
    
    # 2. Non-root user compliance
    assert "useradd" in content or "adduser" in content
    assert "USER stadium" in content
    
    # 3. Automated healthcheck directive
    assert "HEALTHCHECK" in content
    assert "http://localhost:8000/health" in content
    
    # 4. Production Uvicorn command with workers
    assert "uvicorn" in content
    assert "--workers" in content


def test_frontend_dockerfile_and_nginx_readiness():
    """Verifies frontend Dockerfile multi-stage build, caching, and healthcheck."""
    dockerfile_path = get_project_root() / "frontend" / "Dockerfile"
    nginx_conf_path = get_project_root() / "frontend" / "nginx.conf"
    
    assert dockerfile_path.exists(), "frontend/Dockerfile must exist"
    assert nginx_conf_path.exists(), "frontend/nginx.conf must exist"
    
    df_content = dockerfile_path.read_text(encoding="utf-8")
    assert "FROM node:20-alpine AS build" in df_content
    assert "FROM nginx:alpine AS production" in df_content or "FROM nginx:alpine" in df_content
    assert "HEALTHCHECK" in df_content
    
    # Nginx Configuration checks
    conf_content = nginx_conf_path.read_text(encoding="utf-8")
    
    # Gzip Compression
    assert "gzip on;" in conf_content
    assert "text/css" in conf_content
    assert "application/javascript" in conf_content
    
    # Enterprise Security Headers
    assert "X-Frame-Options" in conf_content
    assert "X-Content-Type-Options" in conf_content
    assert "X-XSS-Protection" in conf_content
    
    # Static Asset Caching
    assert "location /assets/" in conf_content
    assert "max-age=31536000" in conf_content
    
    # Health Probe & Proxy
    assert "location /healthz" in conf_content
    assert "location /api/" in conf_content
    assert "proxy_pass http://backend:8000;" in conf_content


def test_docker_compose_configurations():
    """Verifies docker-compose.yml and docker-compose.prod.yml service specifications."""
    compose_path = get_project_root() / "docker-compose.yml"
    compose_prod_path = get_project_root() / "docker-compose.prod.yml"
    
    assert compose_path.exists(), "docker-compose.yml must exist"
    assert compose_prod_path.exists(), "docker-compose.prod.yml must exist"
    
    c_content = compose_path.read_text(encoding="utf-8")
    cp_content = compose_prod_path.read_text(encoding="utf-8")
    
    # Services present
    for service in ["db:", "backend:", "frontend:"]:
        assert service in c_content
        assert service in cp_content
        
    # Production compose includes Redis caching
    assert "redis:" in cp_content
    
    # Network segregation in production
    assert "stadium360-internal" in cp_content
    assert "stadium360-public" in cp_content
    
    # Health checks defined
    assert "healthcheck:" in c_content
    assert "healthcheck:" in cp_content


def test_environment_configuration_templates():
    """Verifies .env.example and .env.production.example completeness."""
    env_example = get_project_root() / ".env.example"
    env_prod = get_project_root() / ".env.production.example"
    
    assert env_example.exists(), ".env.example must exist"
    assert env_prod.exists(), ".env.production.example must exist"
    
    e_content = env_example.read_text(encoding="utf-8")
    ep_content = env_prod.read_text(encoding="utf-8")
    
    required_keys = [
        "PROJECT_NAME",
        "DATABASE_URL",
        "SECRET_KEY",
        "ENVIRONMENT",
        "BACKEND_CORS_ORIGINS",
    ]
    for key in required_keys:
        assert key in e_content
        assert key in ep_content


def test_health_endpoints_direct():
    """Verifies /health, /health/ready, and /health/live endpoint responses."""
    # 1. Global health
    res_health = quick_health()
    assert res_health.status == "ok"
    assert res_health.version == settings.VERSION
    assert res_health.database_status in ["connected", "healthy"]
    
    # 2. Readiness probe
    class MockResponse:
        status_code = 200
        
    mock_resp = MockResponse()
    res_ready = readiness_probe(response=mock_resp)
    assert res_ready["status"] == "ready"
    assert res_ready["database"] == "connected"
    
    # 3. Liveness probe
    res_live = liveness_probe()
    assert res_live["status"] == "live"
    assert "Airtel Stadium360" in res_live["app"]


def test_security_headers_middleware():
    """Verifies that enterprise security headers are defined and configured."""
    headers = SecurityHeadersMiddleware.SECURITY_HEADERS
    assert headers.get("X-Content-Type-Options") == "nosniff"
    assert headers.get("X-Frame-Options") == "DENY"
    assert headers.get("X-XSS-Protection") == "1; mode=block"
    assert "max-age=31536000" in headers.get("Strict-Transport-Security", "")


def test_deployment_scripts_present():
    """Verifies deploy.sh and deploy.ps1 deployment scripts exist and are populated."""
    deploy_sh = get_project_root() / "deploy.sh"
    deploy_ps1 = get_project_root() / "deploy.ps1"
    
    assert deploy_sh.exists()
    assert deploy_ps1.exists()
    
    sh_content = deploy_sh.read_text(encoding="utf-8")
    ps1_content = deploy_ps1.read_text(encoding="utf-8")
    
    assert "docker compose" in sh_content
    assert "http://localhost:8000/health" in sh_content
    
    assert "docker compose" in ps1_content
    assert "http://localhost:8000/health" in ps1_content

