# ==============================================================================
# Airtel Stadium360 — Production Backend Dockerfile
# Multi-stage lean build with non-root security compliance and dynamic port binding
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Builder Stage
# ------------------------------------------------------------------------------
FROM python:3.11-slim AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Build isolated python virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# ------------------------------------------------------------------------------
# Stage 2: Hardened Runtime Stage
# ------------------------------------------------------------------------------
FROM python:3.11-slim AS runner

WORKDIR /app

# Install minimal runtime dependencies (curl for healthchecks, libpq5 for PostgreSQL)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy virtualenv from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV ENVIRONMENT=production

# Security: Create non-root system group and user
RUN groupadd -g 10001 stadium && \
    useradd -u 10001 -g stadium -s /bin/bash -m stadium

# Create data and artifact directories with non-root ownership
RUN mkdir -p /app/data /app/reports && \
    chown -R stadium:stadium /app

# Copy application source code
COPY --chown=stadium:stadium . /app

# Switch to non-root user
USER stadium

# Default port documentation (Render dynamically injects $PORT at runtime)
EXPOSE 8000

# Automated Docker Container Healthcheck targeting dynamic Render port with http://localhost:8000/health fallback
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f "http://localhost:${PORT:-8000}/health" || curl -f "http://localhost:8000/health" || exit 1

# Production application launch with dynamic Render PORT and worker concurrency
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers ${WEB_CONCURRENCY:-2} --proxy-headers --forwarded-allow-ips '*'"]
