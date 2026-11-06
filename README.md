# AIRTEL STADIUM360

> **Predict. Optimize. Connect.**  
> Next-Generation AI-Driven 5G Private Network Orchestration & Massive Capacity Optimization Engine for Narendra Modi Stadium (120,000 Spectators).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Neon](https://img.shields.io/badge/Database-Neon%20Serverless-00E599.svg?logo=neon&logoColor=black)](https://neon.tech)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com)
[![SciPy](https://img.shields.io/badge/Optimization-SciPy%20MILP-8CAAE6.svg?logo=scipy&logoColor=white)](https://scipy.org)

---

## 1. Project Introduction

**Airtel Stadium360** is an enterprise telecommunications operations platform engineered for the **Airtel SYNC Competition 2026**. Designed specifically for the world's largest cricket venue—**Narendra Modi Stadium in Ahmedabad**—it solves extreme network congestion during mega-events by predicting spectator data surges, running Mixed-Integer Linear Programming (MILP) optimization within a strict ₹4.00 Crore CapEx/OpEx constraint, guaranteeing mission-critical UPI payments via dedicated 3GPP 5QI QoS slicing, and providing a real-time 3D Stadium Digital Twin.

- **Institution:** National Institute of Technology Delhi (NIT Delhi)
- **Competition:** Airtel SYNC Competition 2026
- **GitHub Repository:** [https://github.com/astha-2004-code/airtel-stadium360](https://github.com/astha-2004-code/airtel-stadium360)

---

## 2. Live Application Link

| Component | Production Deployment URL | Status |
| :--- | :--- | :--- |
| **Web Application (Frontend)** | [https://airtel-stadium360.vercel.app](https://airtel-stadium360.vercel.app) | Production Deployment |
| **FastAPI REST API (Backend)** | [https://airtel-stadium360.onrender.com](https://airtel-stadium360.onrender.com) | Docker on Render |
| **Interactive API Documentation** | [https://airtel-stadium360.onrender.com/docs](https://airtel-stadium360.onrender.com/docs) | Swagger UI Live |
| **Backend Health Endpoint** | [https://airtel-stadium360.onrender.com/health](https://airtel-stadium360.onrender.com/health) | JSON Health Probe |
| **Dedicated Login Portal** | [https://airtel-stadium360.vercel.app/login](https://airtel-stadium360.vercel.app/login) | Authenticated Route |
| **Observer Registration Portal** | [https://airtel-stadium360.vercel.app/register](https://airtel-stadium360.vercel.app/register) | Public Registration |

---

## 3. Demo Login Credentials — Role-Based Access

The platform features pre-seeded demonstration personas enabling competition evaluators and judges to test role-based capabilities in one click:

| Role Persona | Official Email | Password | Access Level & Scope |
| :--- | :--- | :--- | :--- |
| **`NETWORK_ADMIN`** | `admin@airtel.com` | `AirtelNoc@2026` | **Full Administrative Clearance**: Unrestricted access to all 12 modules, user management, role promotions, account activation/deactivation, and final ₹4.00 Cr budget commitment approval. |
| **`TELECOM_ENGINEER`** | `engineer@airtel.com` | `AirtelRf@2026` | **Engineering Operations**: Unrestricted access to RF engineering, Digital Twin, Capacity Engine, SciPy MILP Optimizer, What-If Simulator, 5G beamforming, and QoS tuning. Restricted from user administration and final budget approval. |
| **`EXECUTIVE_VIEWER`** | `viewer@airtel.com` | `AirtelSync@2026` | **Read-Only Auditor**: Access to Command Centre, Digital Twin, Capacity Engine, Evaluation Scorecards, and cryptographically verified PDF/CSV reports. All configuration sliders and administrative actions are locked. |

> [!NOTE]
> **Security Notice**: These credentials are provided exclusively for project demonstration and evaluation. Do not reuse these credentials in production environments. Evaluators can also use the **1-Click Persona Switcher** on the `/login` page or in the navigation header to switch personas instantly without re-typing credentials.

---

## 4. Project Overview

At mega-sporting events such as the ICC Cricket World Cup Final, over 120,000 spectators gather within a 63-acre stadium footprint. During high-intensity moments (e.g. innings break, boundary celebrations, and match climax), data demand increases by 500% to 1,000% within minutes.

Traditional macro cellular deployments fail because:
1. **Downlink/Uplink Spectral Saturation**: Physical resource blocks (PRBs) on macro towers exhaust immediately.
2. **Backhaul Bottlenecks**: Legacy 1G/2G microwave and unoptimized links choke under multi-gigabit user traffic.
3. **Critical Services Failure**: High-volume spectator video streaming and social media uploads cannibalize the shared radio spectrum, causing point-of-sale UPI payment transactions to fail (up to 7.11% failure rate).
4. **Severe 5G-to-4G Fallback**: Insufficient 5G NR signal coverage inside the bowl forces devices to downgrade to already congested LTE carriers.

Airtel Stadium360 delivers an intelligent, full-stack software and network engineering solution to resolve these bottlenecks through predictive AI mathematical modeling, automated constraint optimization, and strict QoS prioritization.

---

## 5. Problem Statement

Based on empirical historical telemetry recorded during a 65,000-spectator benchmark match (`Sync_V1.xlsx`):
- **4G Cell Load**: Exceeded **98.8%** during the innings break across in-bowl sectors.
- **User Downlink Speed**: Plummeted from 15.6 Mbps (normal) down to **0.9 Mbps** (congested).
- **5G Accessibility**: Dropped from 99.2% down to **35.2%** during the innings break due to high blockages.
- **UPI Payment Failure**: Surged from 1.08% to **7.11%**, paralyzing in-stadium food and merchandise concessions.
- **Backhaul Choke Points**: 3 macro towers (M4, M6) and in-bowl small cells (S1, S2) were restricted by 1 Gbps / 2 Gbps backhauls.
- **Budgetary Constraint**: The optimization framework must not exceed **₹4.00 Crore** total investment.

---

## 6. Proposed Solution

Airtel Stadium360 transforms legacy stadium network planning into an automated, closed-loop telemetry and optimization ecosystem:

```
[ Historical Telemetry (Sync_V1.xlsx) ]
                   │
                   ▼
[ 1. Real-Time Demand & Capacity Engine ]
    • Shannon Channel Capacity: C = B · log2(1 + SINR)
    • Erlang-B Traffic Theory: P_b = (A^C / C!) / Σ (A^k / k!)
    • Dynamic Load Scaling for 65k to 120k Spectators
                   │
                   ▼
[ 2. SciPy MILP Deployment Optimizer ]
    • Objective: Maximize Capacity Addition + Coverage Tiers
    • Constraint: Total Cost (COWs + Small Cells + Backhaul) ≤ ₹4.00 Crore
    • Solves Optimal Mix: 4 Cell-on-Wheels (COWs) + 26 In-Bowl Small Cells
                   │
                   ▼
[ 3. 5G NR NSA & 3GPP 5QI QoS Slicing ]
    • 64T64R Massive MIMO 3D Beamforming (3.5 GHz n78)
    • EN-DC Anchor Shield (Band 3 / Band 40)
    • Dedicated PRB Reservation: 5QI 1 (Emergency) & 5QI 65/69 (UPI Payments)
                   │
                   ▼
[ 4. Stadium Digital Twin & Enterprise RBAC ]
    • 8-Site 3D Topographic Geospatial Layout
    • JWT Bearer Token Security with Triple-Role Governance
    • Auditable PDF/CSV Generation with SHA-256 Checksums
```

---

## 7. Key Features

- **Accurate Mathematical Rigor**: Combines Shannon-Hartley capacity modeling, Erlang-B queuing, and 3GPP TS 23.501 5QI QoS standards.
- **Scipy Mixed-Integer Linear Programming**: Automates infrastructure placement to guarantee maximum throughput under the ₹4.00 Crore cap.
- **Dedicated Payment Preservation**: Reduces UPI transaction failures from 7.11% down to **0.08%** via dedicated Radio Resource Management (RRM) PRB allocation.
- **Dynamic 3D Stadium Digital Twin**: Visualizes 8 macro cell sectors, in-bowl small cells, perimeter COWs, coverage heatmaps, and azimuth downtilt vectors.
- **Enterprise Role-Based Access Control**: Strict multi-tenant security protecting sensitive operational parameters with 401/403 status codes and instant 1-click evaluation switching.
- **Live What-If Stress Simulator**: Simulates crowd surges (up to 120,000 spectators), backhaul fiber severances, and transaction spikes in real time.
- **Cryptographic Audit Exports**: Generates official executive summary reports in PDF and raw CSV exports with SHA-256 integrity verification.

---

## 8. Complete Application Modules

Airtel Stadium360 consists of **12 functional application modules**:

### Module 1: Executive Command Centre (`dashboard`)
- Executive dashboard displaying real-time composite Network Health Score (0-100).
- Live match phase selector (Crowd Building Up, Innings Break, Final Over, Post-Match).
- Capacity vs Demand live curves, 4G vs 5G volume splits, and critical congestion alerts.

### Module 2: Stadium Digital Twin (`digital-twin`)
- Interactive geospatial topology model of Narendra Modi Stadium.
- Visualizes 8 macro sites (M1-M6, S1-S2), azimuths, down-tilt angles, and backhaul transmission types.
- Sector-by-sector RF coverage heatmaps and real-time site telemetry drawers.

### Module 3: Capacity & Demand Engine (`demand-capacity`)
- Mathematical formulation breakdown displaying spectral efficiency equations and user throughput demand.
- Dynamic spectator scaling slider (65,000 to 120,000 capacity).
- Real-time spectral efficiency cards comparing baseline 1.6 bps/Hz against proposed 4.8 bps/Hz.

### Module 4: Deployment Optimizer (`optimizer`)
- SciPy-powered Mixed-Integer Linear Programming (MILP) solver.
- Computes optimal deployment mix: **4 Cell-on-Wheels (COWs)** + **26 In-Bowl Small Cells**.
- Perimeter placement map displaying optimal COW positions at Gates 1, 3, 5, and 7.

### Module 5: What-If Simulator (`simulator`)
- Real-time cascade modeler evaluating system resilience under extreme stress.
- Preset stress tests: *Innings Break Peak*, *Fiber Cut Contingency (M1/M2 offline)*, *120k Overcapacity*, and *UPI Surge (15,000 tx/sec)*.
- Live side-by-side comparison showing network health retention.

### Module 6: Budget & Assets Optimizer (`budget`)
- Granular CapEx vs OpEx allocation engine strictly governed by the **₹4.00 Crore budget limit**.
- Complete asset inventory catalog (COWs, Small Cells, 10G Optical Transceivers, Massive MIMO Antennas).
- Milestone deployment timeline and administrator-only budget approval locking.

### Module 7: 5G Intelligence (`connectivity`)
- 5G Non-Standalone (NSA) Option 3x architecture visualizer.
- LTE-NR Dual Connectivity (EN-DC) anchor shield preventing 5G disconnects under load.
- 64T64R Massive MIMO beamforming configuration (30 kHz SCS, 100 MHz bandwidth on 3.5 GHz n78).

### Module 8: UPI & Emergency (`critical-services`)
- 3GPP 5QI QoS slice isolation engine.
- Dedicated 5% PRB reservation for merchant terminals and digital ticketing.
- Payment hop latency breakdown (Device -> gNodeB -> UPF -> Airtel Core -> NPCI Switch).

### Module 9: Access & Security (`auth`)
- Full-stack enterprise authentication and user governance portal.
- Complete 11-module RBAC Matrix highlighting the active persona's clearance.
- Admin User Governance panel: search users, filter by role/status, promote/demote, and toggle active status with last-admin safety protection.

### Module 10: Reports & Exports (`reports`)
- Downloadable Executive Network Assessment Report in high-resolution PDF format (via ReportLab).
- Downloadable CSV data exports: Infrastructure Bill of Materials (BOM), Site Capacity Matrix, and Scenario Comparisons.
- Embedded SHA-256 cryptographic checksums for audit compliance.

### Module 11: Evaluation Centre (`evaluation`)
- Scientific 3-way benchmark comparison engine: *Measured Baseline (Sync_V1.xlsx)* vs *Modelled Target* vs *Live Engine Simulation*.
- Weighted Network Health Scorecards across 5 engineering dimensions (Capacity, Throughput, 5G Accessibility, UPI Reliability, Financial Compliance).

### Module 12: Infrastructure Topology & Site Diagnostics (`network`)
- Micro-level site inspection drawer with real-time hardware status, backhaul fiber capacity, radio frequency band allocations, and raw historical drive-test telemetry.

---

## 9. Role-Based Access Control

Airtel Stadium360 enforces multi-tier access control at both the React frontend and FastAPI backend:

| System Capability | `NETWORK_ADMIN` | `TELECOM_ENGINEER` | `EXECUTIVE_VIEWER` |
| :--- | :---: | :---: | :---: |
| **Command Centre (Dashboard)** | Full Access | Full Access | Read-Only |
| **Stadium Digital Twin** | Full Access | Full Access | Read-Only |
| **Capacity & Demand Engine** | Sliders Unlocked | Sliders Unlocked | Sliders Locked (Read-Only) |
| **Deployment Optimizer (MILP)** | Run & Apply | Run & Apply | Locked (403 Guard) |
| **What-If Scenario Simulator** | Execute Stress Tests | Execute Stress Tests | Locked (403 Guard) |
| **Budget Allocator (Draft)** | Modify Draft | Modify Draft | Locked (403 Guard) |
| **Budget Approval & Lock** | **Authorized** | **Restricted (403)** | **Restricted (403)** |
| **5G Intelligence (EN-DC)** | Full Configuration | Full Configuration | Locked (403 Guard) |
| **UPI & Emergency QoS Tuning** | Modify Slices | Modify Slices | Locked (403 Guard) |
| **User Role Management** | **Authorized** | **Restricted (403)** | **Restricted (403)** |
| **Account Activation/Deactivation**| **Authorized** | **Restricted (403)** | **Restricted (403)** |
| **Reports & Exports (PDF/CSV)** | Generate & Export | Generate & Export | Generate & Export |
| **Evaluation Centre** | Full Access | Full Access | Read-Only |

---

## 10. System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Client (React + TypeScript + Vite)"]
        UI["Airtel Stadium360 UI"]
        AuthCtx["AuthContext & RBAC Guard"]
        Axios["Axios Client (Bearer JWT Interceptor)"]
    end

    subgraph CDN["Edge & CDN"]
        Vercel["Vercel Edge Network"]
    end

    subgraph BackendServer["Backend Application Server (FastAPI on Render)"]
        API["FastAPI 0.115 Engine"]
        Deps["Auth & RoleChecker Dependencies (deps.py)"]
        
        subgraph Services["Core Engineering Services"]
            OptEng["SciPy MILP Optimizer Engine"]
            CapEng["Demand & Capacity Engine"]
            SimEng["What-If Simulator Engine"]
            ConnEng["5G NSA & EN-DC Engine"]
            QosEng["3GPP 5QI UPI QoS Engine"]
            EvalEng["Evaluation & Benchmark Engine"]
            RepEng["ReportLab PDF/CSV Generator"]
        end
    end

    subgraph DataTier["Data & Persistence Tier"]
        NeonDB[("Neon Serverless PostgreSQL 16")]
        SyncData[("Sync_V1.xlsx Historical Dataset")]
    end

    UI --> AuthCtx
    AuthCtx --> Axios
    Vercel -.-> UI
    Axios -- "HTTPS /api/v1 (JWT)" --> API
    API --> Deps
    Deps --> Services
    Services --> NeonDB
    Services --> SyncData
```

---

## 11. Technology Stack

### Frontend Architecture
- **Framework:** React 18.3 with TypeScript 5.6
- **Build Tool:** Vite 6.0 with Rollup bundling
- **Styling:** Tailwind CSS 3.4 with custom Airtel dark theme
- **Visualization:** Recharts 2.13 (telemetry trends, load curves, QoS gauges)
- **Geospatial Mapping:** Leaflet 1.9 & React-Leaflet 4.2
- **Animation & Transitions:** Framer Motion 11.13
- **Icons:** Lucide React 0.460
- **Routing & State:** Native SPA history routing + React Context API

### Backend Architecture
- **Web Framework:** FastAPI 0.115 (Python 3.11 / 3.14 async runtime)
- **ASGI Server:** Uvicorn with multi-worker support
- **Mathematical Modeling:** NumPy 2.0 & Pandas 2.2
- **Constrained Optimization:** SciPy 1.14 (Mixed-Integer Linear Programming - `scipy.optimize.milp`)
- **PDF Generation:** ReportLab 4.2 (vector graphics, audit tables, cryptographic stamps)
- **Data Validation:** Pydantic 2.10 & Pydantic-Settings 2.6
- **Testing Suite:** Pytest 8.3 & AnyIO

### Persistence & Security
- **Database:** PostgreSQL 16 (Hosted on Neon Serverless Cloud)
- **ORM & Migrations:** SQLAlchemy 2.0 & Alembic 1.14
- **Database Driver:** `psycopg2-binary` with SSL connection pooling
- **Authentication:** JWT (JSON Web Tokens) via `python-jose` with HS256 encryption
- **Password Security:** `passlib` with `bcrypt` (12-round salted hashing)

---

## 12. Frontend Architecture

The frontend is structured into modular domains:

```
frontend/src/
├── assets/                  # High-resolution logos, hero assets
├── components/
│   ├── analytics/           # Formula breakdowns, spectral efficiency cards
│   ├── auth/                # Profile drawers, identity modals
│   ├── budget/              # Asset inventory, CapEx/OpEx charts
│   ├── connectivity/        # 5G beamforming visualizer, EN-DC maps
│   ├── critical/            # 5QI QoS slicing, payment latency hops
│   ├── dashboard/           # KPI cards, health gauge, load charts
│   ├── evaluation/          # 3-way comparison, health scorecards
│   ├── layout/              # Header, Sidebar, Persona switcher
│   ├── network/             # Digital Twin, 3D stadium sector drawer
│   ├── optimizer/           # Perimeter COW map, intervention tables
│   └── simulator/           # Live cascade grid, preset stress bars
├── context/
│   └── AuthContext.tsx      # Global JWT state, role permissions, 1-click switcher
├── pages/
│   ├── LoginPage.tsx        # Dedicated /login enterprise portal
│   ├── RegisterPage.tsx     # Dedicated /register observer portal
│   ├── DashboardPage.tsx    # Command Centre (Module 1)
│   ├── DigitalTwinPage.tsx  # Stadium Digital Twin (Module 2)
│   ├── CapacityEnginePage.tsx # Capacity Engine (Module 3)
│   ├── OptimizerPage.tsx    # Deployment Optimizer (Module 4)
│   ├── SimulatorPage.tsx    # What-If Simulator (Module 5)
│   ├── BudgetPage.tsx       # Budget & Assets (Module 6)
│   ├── ConnectivityPage.tsx # 5G Intelligence (Module 7)
│   ├── CriticalServicesPage.tsx # UPI & Emergency (Module 8)
│   ├── AuthManagementPage.tsx   # Access & Security (Module 9)
│   ├── ReportsPage.tsx      # Reports & Exports (Module 10)
│   └── EvaluationPage.tsx   # Evaluation Centre (Module 11)
├── services/                # Axios API client & REST service wrappers
└── types/                   # TypeScript interfaces for all telemetry models
```

---

## 13. Backend Architecture

The backend implements clean dependency injection:

```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py          # Reusable dependencies (get_current_user, RoleChecker)
│   │   └── v1/
│   │       ├── api.py       # Master router aggregating all 12 modules
│   │       └── endpoints/   # Modular endpoint controllers
│   ├── core/
│   │   ├── config.py        # Pydantic Settings (Render-compatible CORS & PORT)
│   │   ├── database.py      # SQLAlchemy SessionLocal, SSL Neon engine
│   │   └── security.py      # Bcrypt hashing, JWT issuance & decoding
│   ├── models/              # SQLAlchemy database entities (User, NetworkSite)
│   ├── schemas/             # Pydantic validation schemas
│   ├── services/            # Pure scientific & engineering computation engines
│   └── main.py              # Application lifecycle, CORS, health checks
├── tests/                   # 110 automated unit and integration tests
├── Dockerfile               # Multi-stage production container
└── requirements.txt         # Pinned production Python dependencies
```

---

## 14. Database Design

Airtel Stadium360 uses Neon Serverless PostgreSQL. Key schema entities include:

```sql
-- User Identity & Role Governance
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'EXECUTIVE_VIEWER' NOT NULL,
    department VARCHAR(100) DEFAULT 'Airtel Network Operations Centre (NOC)',
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_superuser BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Stadium Physical Sites & Sectors
CREATE TABLE network_sites (
    id SERIAL PRIMARY KEY,
    site_id VARCHAR(50) UNIQUE NOT NULL,
    site_type VARCHAR(50) NOT NULL,
    distance_m INTEGER NOT NULL,
    backhaul_type VARCHAR(50) NOT NULL,
    backhaul_capacity_gbps DOUBLE PRECISION NOT NULL,
    has_5g BOOLEAN DEFAULT FALSE NOT NULL,
    azimuth INTEGER NOT NULL,
    description TEXT
);
```

---

## 15. Authentication & Security

1. **Password Hashing**: Passwords are salted and hashed using bcrypt (12 rounds) via `passlib[bcrypt]`. Plain-text passwords are never persisted.
2. **JWT Access Tokens**: Cryptographically signed using HS256 with 60-minute expiration. Payload includes `sub` (email), `role`, and expiration timestamps.
3. **Privilege Escalation Prevention**: Public sign-ups at `/register` are forced to `EXECUTIVE_VIEWER`. Only active `NETWORK_ADMIN` users can promote roles.
4. **Last Administrator Protection**: The system prevents demoting or deactivating the last active `NETWORK_ADMIN`, preventing administrative lockout.
5. **CORS Security**: Robust regex and JSON array parsing in `config.py` supports Render environment variables without wildcard exposure.

---

## 16. API Documentation

Comprehensive Swagger/OpenAPI documentation is available at `/docs`:

| Method | Endpoint | Clearance Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register new user (assigned `EXECUTIVE_VIEWER`) |
| `POST` | `/api/v1/auth/login` | Public | Authenticate credentials and receive Bearer JWT |
| `GET` | `/api/v1/auth/me` | Authenticated | Retrieve authenticated user profile |
| `GET` | `/api/v1/auth/users` | `NETWORK_ADMIN` | List all users with search and filter |
| `PUT` | `/api/v1/auth/users/{id}/role` | `NETWORK_ADMIN` | Promote or reassign user role |
| `PUT` | `/api/v1/auth/users/{id}/status` | `NETWORK_ADMIN` | Activate or deactivate user account |
| `GET` | `/api/v1/dashboard/kpis` | Authenticated | Real-time stadium network KPI metrics |
| `GET` | `/api/v1/network/sites` | Authenticated | List all 8 macro and small cell sites |
| `POST` | `/api/v1/optimizer/optimize` | `TELECOM_ENGINEER` | Execute SciPy MILP placement solver |
| `POST` | `/api/v1/simulator/simulate` | `TELECOM_ENGINEER` | Execute What-If live cascade simulation |
| `POST` | `/api/v1/budget/approve` | `NETWORK_ADMIN` | Approve and commit final ₹4.00 Cr budget plan |
| `GET` | `/api/v1/reports/pdf/network-assessment` | Authenticated | Generate cryptographically signed PDF |
| `GET` | `/health` | Public | Liveness probe returning status code 200 |
| `GET` | `/health/db` | Public | PostgreSQL database readiness probe |

---

## 17. Installation and Setup

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- PostgreSQL 16 (or Neon cloud database account)
- Git

### Local Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/astha-2004-code/airtel-stadium360.git
cd airtel-stadium360

# 2. Setup Backend Virtual Environment
python -m venv backend/venv
# On Windows:
backend\venv\Scripts\activate
# On Linux/macOS:
source backend/venv/bin/activate

# 3. Install Backend Dependencies
pip install -r backend/requirements.txt

# 4. Configure Backend Environment
cp .env.example backend/.env
# Edit backend/.env to configure DATABASE_URL and SECRET_KEY

# 5. Run Backend Server
uvicorn app.main:app --app-dir backend --reload --port 8000

# 6. In a new terminal, install and run Frontend
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 18. Environment Variables

Create `.env` using `.env.example` as a template:

```env
# Application Mode
PROJECT_NAME="Airtel Stadium360"
ENVIRONMENT="production"
DEBUG=False
PORT=8000

# PostgreSQL Connection (Neon Cloud or Local)
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-pooler.c-4.aws.neon.tech/neondb?sslmode=require"

# JWT Authentication
SECRET_KEY="YOUR_SUPER_SECRET_KEY_MINIMUM_32_CHARACTERS_LONG"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS Allowed Origins (JSON Array)
BACKEND_CORS_ORIGINS=["https://airtel-stadium360.vercel.app","http://localhost:5173"]

# Frontend Environment (frontend/.env)
VITE_API_URL="https://airtel-stadium360.onrender.com"
```

---

## 19. Docker Deployment

The application includes a production-grade multi-stage Dockerfile:

```bash
# Build Docker image
docker build -t airtel-stadium360-backend -f backend/Dockerfile .

# Run Docker container
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample.neon.tech/neondb?sslmode=require" \
  -e SECRET_KEY="YOUR_GENERATED_SECRET_KEY" \
  -e BACKEND_CORS_ORIGINS='["https://airtel-stadium360.vercel.app"]' \
  airtel-stadium360-backend
```

---

## 20. Render Backend Deployment

The backend is configured for deployment on Render using Docker:

1. **Service Type:** Web Service
2. **Environment:** Docker
3. **Repository:** `astha-2004-code/airtel-stadium360`
4. **Branch:** `main`
5. **Root Directory:** (Leave blank or set to repository root)
6. **Dockerfile Path:** `backend/Dockerfile`
7. **Environment Variables:**
   - `DATABASE_URL`: Your Neon PostgreSQL connection string with `sslmode=require`
   - `SECRET_KEY`: Random 64-character hex string
   - `BACKEND_CORS_ORIGINS`: `["https://airtel-stadium360.vercel.app"]`
   - `PORT`: Automatically bound by Render

---

## 21. Vercel Frontend Deployment

The frontend is deployed on Vercel:

1. **Framework Preset:** Vite
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Environment Variables:**
   - `VITE_API_URL`: `https://airtel-stadium360.onrender.com`
6. **SPA Routing:** Configured via `frontend/vercel.json` with universal rewrites to `/index.html`.

---

## 22. Screenshots

### Executive Command Centre (Module 1)
![Executive Command Centre](docs/screenshots/dashboard.png)

### Stadium Digital Twin (Module 2)
![Stadium Digital Twin](docs/screenshots/network-map.png)

### Capacity & Demand Engine (Module 3)
![Capacity Engine](docs/screenshots/capacity-planner.png)

### Deployment Optimizer (Module 4)
![Deployment Optimizer](docs/screenshots/optimizer.png)

### What-If Simulator (Module 5)
![What-If Simulator](docs/screenshots/simulator.png)

### Budget & Assets Optimizer (Module 6)
![Budget Planner](docs/screenshots/budget-planner.png)

### Evaluation Centre (Module 11)
![Evaluation Scorecard](docs/screenshots/evaluation.png)

---

## 23. Testing

Airtel Stadium360 includes **110 automated unit and integration tests** with 100% pass rate:

```bash
# Run full backend test suite
pytest backend/tests -v

# Run frontend typecheck and production build
npm --prefix frontend run build
```

### Verified Test Categories
- **Analytics & Math Models**: Shannon-Hartley formulas, Erlang-B blocking, and dynamic crowd scaling.
- **Authentication & RBAC**: Bcrypt hashing, token issuance, 401 unauthenticated enforcement, 403 role-restricted access, role switching, last-admin demote protection, and public sign-up role restrictions.
- **Optimization Algorithms**: MILP constraint compliance, ₹4.00 Cr budget cap, and COW/Small Cell placement.
- **What-If Simulation**: In-bowl cascade modeling, 120,000 crowd surge, and fiber cut contingencies.
- **Critical Services & QoS**: 3GPP 5QI slice definitions, payment hop latencies, and UPI telemetry.
- **Deployment Readiness**: Dockerfile compatibility, health endpoints, CORS origin parsing, and security headers.

---

## 24. Future Enhancements

1. **AI-Driven Predictive Beamforming**: Integrating real-time computer vision feeds of in-stadium crowd densities to dynamically steer Massive MIMO antenna arrays.
2. **Open RAN (O-RAN) Integration**: Interfacing with O-RAN near-RT RIC (RAN Intelligent Controller) via xApps for autonomous dynamic slicing.
3. **Direct Core Integration**: Direct integration with carrier 5G Core Network (AMF/UPF) via 3GPP NEF (Network Exposure Function) APIs.

---

## 25. Contributors

**National Institute of Technology Delhi (NIT Delhi)**  
*Team Airtel SYNC Competition 2026*

- **Astha Jha**  
  GitHub: [@astha-2004-code](https://github.com/astha-2004-code)  
  Email: [231220017@nitdelhi.ac.in](mailto:231220017@nitdelhi.ac.in)

- **Sanya Singh**  
  Email: [231220052@nitdelhi.ac.in](mailto:231220052@nitdelhi.ac.in)

---

## 26. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
