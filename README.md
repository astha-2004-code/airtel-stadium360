# AIRTEL STADIUM360
### Predict. Optimize. Connect.

An enterprise-grade, AI-powered predictive network optimization and intelligent stadium connectivity platform built for the **Airtel SYNC Competition 2026**.

---

## 🏆 Project Overview

During massive sporting events such as a cricket World Cup final at a 1,00,000-seat stadium, cellular networks experience extreme surges. In previous matches (e.g. 65,000 spectators), the 4G anchor load hit ~99% at the innings break, user throughput dropped from 16 Mbps to 1 Mbps, 5G connection success plummeted to ~35%, and UPI payment failure rates surged from 1% to 7%.

**Airtel Stadium360** provides telecom network planners with an end-to-end intelligence suite to:
- Predict traffic demands for 1,00,000+ spectators.
- Model site-level 4G/5G loads and backhaul bottlenecks across 8 stadium-facing macro and small cell sites.
- Mathematically optimize infrastructure deployment (Cells on Wheels, Small Cells, and Fibre backhaul upgrades) under a strict **₹4 Crore budget cap**.
- Prioritize mission-critical traffic (UPI payments, emergency services).
- Prevent 5G devices from falling back into congested 4G anchor bands.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts, React Leaflet, Framer Motion, Axios, TanStack React Query.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, Pandas, NumPy, SciPy.
- **Database**: PostgreSQL (Production on Neon, SQLite for isolated unit testing).
- **DevOps**: Docker, Docker Compose, Nginx.

---

## 📁 Repository Structure

```
airtel-stadium360/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # Modular API endpoints
│   │   ├── core/            # Configuration & database session
│   │   ├── models/          # SQLAlchemy ORM models
│   │   └── schemas/         # Pydantic validation schemas
│   ├── tests/               # Pytest test suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/      # UI & dashboard components
│   │   ├── services/        # Axios API client
│   │   └── utils/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Local Development

1. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   npm run dev
   ```

3. **Docker**:
   ```bash
   docker-compose up --build
   ```

---

## 🧪 Testing

```bash
# Run backend test suite
pytest -v

# Run frontend production build test
cd frontend && npm run build
```
