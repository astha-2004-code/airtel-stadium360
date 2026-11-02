#!/usr/bin/env bash
# ==============================================================================
# Airtel Stadium360 — Production Deployment Script
# Orchestrates container builds, pre-flight checks, and health probes
# ==============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================================${NC}"
echo -e "${BLUE}  AIRTEL STADIUM360 — PRODUCTION DEPLOYMENT ORCHESTRATOR           ${NC}"
echo -e "${BLUE}  Predict. Optimize. Connect. (Airtel SYNC Competition 2026)        ${NC}"
echo -e "${BLUE}=====================================================================${NC}"

# 1. Pre-flight checks
echo -e "\n${YELLOW}[1/5] Checking deployment prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed or not in PATH.${NC}"
    exit 1
fi

if ! docker compose version &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: docker compose is required but not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose verified.${NC}"

# 2. Environment file check
echo -e "\n${YELLOW}[2/5] Checking environment configuration...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}Notice: .env not found. Initializing from .env.example...${NC}"
    cp .env.example .env
fi
echo -e "${GREEN}✓ Environment configuration (.env) active.${NC}"

# 3. Build & start containers
echo -e "\n${YELLOW}[3/5] Building and launching container services...${NC}"
docker compose down --remove-orphans || true
docker compose build --pull
docker compose up -d

# 4. Healthcheck loop
echo -e "\n${YELLOW}[4/5] Waiting for services to become healthy...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0
HEALTHY=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    RETRY_COUNT=$((RETRY_COUNT+1))
    echo -n "Probing backend health ($RETRY_COUNT/$MAX_RETRIES)... "
    
    if curl -s -f http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}HEALTHY!${NC}"
        HEALTHY=true
        break
    else
        echo -e "${YELLOW}Starting up...${NC}"
        sleep 2
    fi
done

if [ "$HEALTHY" = false ]; then
    echo -e "${RED}Deployment warning: Services took longer than expected to become healthy.${NC}"
    echo -e "Review container logs with: docker compose logs -f"
    exit 1
fi

# 5. Summary & Handover
echo -e "\n${GREEN}=====================================================================${NC}"
echo -e "${GREEN}  ✓ AIRTEL STADIUM360 DEPLOYMENT SUCCESSFUL!                         ${NC}"
echo -e "${GREEN}=====================================================================${NC}"
echo -e "• Frontend Dashboard:   http://localhost:5173 / http://localhost"
echo -e "• Backend REST API:     http://localhost:8000"
echo -e "• API Interactive Docs: http://localhost:8000/docs"
echo -e "• System Health Probe:  http://localhost:8000/health"
echo -e "• Readiness Probe:      http://localhost:8000/health/ready"
echo -e "• Liveness Probe:       http://localhost:8000/health/live"
echo -e "=====================================================================\n"

