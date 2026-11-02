# Airtel Stadium360 — Production Deployment & Operations Guide

> **Official Deployment Runbook for Airtel SYNC Competition 2026**  
> Predict. Optimize. Connect. — Narendra Modi Stadium, Motera, Ahmedabad

---

## 1. System Architecture Topology

The production architecture implements defense-in-depth security, high-throughput caching, and containerized microservices isolated across public and internal network tiers:

```mermaid
graph TD
    User["Spectator / NOC Engineer / Judge"] -->|HTTPS / WSS (Port 443)| Nginx["Nginx Reverse Proxy & Static CDN<br/>(stadium360-frontend:80)"]
    
    subgraph Public Tier
        Nginx -->|Static Assets (Gzip, 1y Cache)| Dist["React 18 + Vite Dist Assets"]
        Nginx -->|Reverse Proxy /api/v1| Backend["FastAPI Telemetry Core<br/>(stadium360-backend:8000)<br/>4x Uvicorn Workers"]
    end

    subgraph Internal Tier [Isolated stadium360-internal Network]
        Backend -->|Session / Telemetry Cache| Redis["Redis 7 In-Memory Cache<br/>(LRU Eviction 512MB)"]
        Backend -->|ACID Persistence & Audit Trail| DB[("PostgreSQL 15 Cluster<br/>(200 Connections, 512MB Shared)")]
        Backend -->|MILP Optimizer Engine| Scipy["SciPy MILP Solver"]
        Backend -->|ReportLab Generation| PDFEngine["Audit PDF & CSV Engine"]
    end

    style Nginx fill:#E40000,stroke:#333,stroke-width:2px,color:#fff
    style Backend fill:#131B2E,stroke:#E40000,stroke-width:2px,color:#fff
    style DB fill:#047857,stroke:#333,stroke-width:2px,color:#fff
    style Redis fill:#DC2626,stroke:#333,stroke-width:2px,color:#fff
```

---

## 2. Infrastructure Sizing & Requirements

Recommended hardware footprint to sustain **100,000 live stadium spectators** (40,000 concurrent Airtel subscribers and 7,200 active peak UEs):

| Tier / Component | Minimum (Staging / Demo) | Recommended Production (Match Day) | Enterprise Cloud Profile |
| :--- | :--- | :--- | :--- |
| **Host VM / Instance** | 4 vCPU, 8 GB RAM | 8 vCPU, 16 GB RAM | AWS `c6i.2xlarge` / Azure `D8s_v5` |
| **FastAPI Backend** | 2 vCPU, 2 GB RAM (2 workers) | 4 vCPU, 4 GB RAM (4–8 workers) | Container limits: 2.0 CPU, 2048 MB |
| **PostgreSQL 15** | 1 vCPU, 2 GB RAM (50 conns) | 2 vCPU, 4 GB RAM (200 conns) | SSD storage with 3,000 IOPS |
| **Redis 7 Cache** | 0.5 vCPU, 512 MB RAM | 1 vCPU, 1 GB RAM | Persistent AOF + RDB snapshots |
| **Nginx Frontend** | 0.5 vCPU, 256 MB RAM | 1 vCPU, 512 MB RAM | Worker connections: 4,096 |
| **Operating System** | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 22.04 LTS / RHEL 9 | Docker Engine 24.0+ & Compose v2 |

---

## 3. Quickstart Deployment Guide

### Option A: Standard Deployment (Local & Staging Evaluation)

```bash
# 1. Clone repository
git clone https://github.com/airtel-sync/airtel-stadium360.git
cd airtel-stadium360

# 2. Initialize environment configuration
cp .env.example .env

# 3. Launch with automated deployment script (Linux/macOS)
chmod +x deploy.sh
./deploy.sh

# Or on Windows PowerShell:
.\deploy.ps1
```

### Option B: Hardened Production Deployment

```bash
# 1. Copy production environment template
cp .env.production.example .env

# 2. Configure cryptographically secure production keys in .env
# SECRET_KEY=$(openssl rand -hex 32)
# POSTGRES_PASSWORD=$(openssl rand -hex 16)

# 3. Launch hardened multi-tier stack
docker compose -f docker-compose.prod.yml up -d --build

# 4. Verify running health status
docker compose -f docker-compose.prod.yml ps
```

---

## 4. Container Health & Readiness Probes

Airtel Stadium360 implements 3GPP-grade Kubernetes/Docker healthcheck probes:

| Probe Endpoint | Purpose | Target Response | Recovery Action on Failure |
| :--- | :--- | :--- | :--- |
| `GET /health` | Global application health status | `200 OK` (JSON payload) | Restart container if unresponsive |
| `GET /health/ready` | Readiness probe (verifies database) | `200 OK` (`ready`) or `503 Unavailable` | Traffic withheld until DB initializes |
| `GET /health/live` | Process liveness check | `200 OK` (`live`) | Container terminated if deadlocked |
| `GET /healthz` (Nginx) | Frontend web server status | `200 OK` (`healthy\n`) | Nginx container recycled |

---

## 5. Security & Compliance Controls

1. **Non-Root Execution**: Backend runs under dedicated UID `10001` (`stadium:stadium`).
2. **Enterprise HTTP Headers**:
   - `X-Frame-Options: SAMEORIGIN` / `DENY` (prevents clickjacking)
   - `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
   - `X-XSS-Protection: 1; mode=block`
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
   - `Referrer-Policy: strict-origin-when-cross-origin`
3. **CORS Governance**: Strict origin validation (`BACKEND_CORS_ORIGINS`) prevents unauthorized cross-origin requests in production.
4. **Network Segregation**: PostgreSQL and Redis containers reside on `stadium360-internal` with no exposed external ports.

---

## 6. Zero-Downtime Rolling Update Strategy

```bash
# Step 1: Pull updated source code
git pull origin main

# Step 2: Build new container images in background
docker compose -f docker-compose.prod.yml build --no-cache

# Step 3: Rolling replacement of backend workers
docker compose -f docker-compose.prod.yml up -d --no-deps --build backend

# Step 4: Verify health of backend before updating frontend
curl -f http://localhost:8000/health/ready

# Step 5: Rolling replacement of frontend web server
docker compose -f docker-compose.prod.yml up -d --no-deps --build frontend
```

---

## 7. Backup & Disaster Recovery Procedures

### Database Snapshot Backup

```bash
# Create timestamped SQL dump
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker exec -t stadium360-prod-db pg_dump -U airtel_admin airtel_stadium360 | gzip > /backups/stadium360_db_${TIMESTAMP}.sql.gz
```

### Database Restore

```bash
# Restore from backup snapshot
gunzip -c /backups/stadium360_db_YYYYMMDD_HHMMSS.sql.gz | docker exec -i stadium360-prod-db psql -U airtel_admin airtel_stadium360
```

