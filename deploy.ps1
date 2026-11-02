# ==============================================================================
# Airtel Stadium360 — Windows PowerShell Production Deployment Script
# Orchestrates container builds, pre-flight checks, and health probes
# ==============================================================================

[CmdletBinding()]
param(
    [switch]$Production,
    [switch]$Down
)

$ErrorActionPreference = "Stop"

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  AIRTEL STADIUM360 — POWERSHELL DEPLOYMENT ORCHESTRATOR           " -ForegroundColor Cyan
Write-Host "  Predict. Optimize. Connect. (Airtel SYNC Competition 2026)        " -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan

# 1. Pre-flight checks
Write-Host "`n[1/5] Checking deployment prerequisites..." -ForegroundColor Yellow
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Error: Docker is not installed or not available in PATH."
    exit 1
}
Write-Host "✓ Docker CLI verified." -ForegroundColor Green

# 2. Compose file selection
$composeFile = if ($Production) { "docker-compose.prod.yml" } else { "docker-compose.yml" }
Write-Host "`n[2/5] Using orchestration profile: $composeFile" -ForegroundColor Yellow

if ($Down) {
    Write-Host "Tearing down existing deployment..." -ForegroundColor Yellow
    docker compose -f $composeFile down --remove-orphans
    exit 0
}

# 3. Environment file check
if (-not (Test-Path .env)) {
    Write-Host "Notice: .env not found. Initializing from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
}
Write-Host "✓ Environment configuration active." -ForegroundColor Green

# 4. Build & launch
Write-Host "`n[3/5] Building and launching container services..." -ForegroundColor Yellow
docker compose -f $composeFile down --remove-orphans 2>$null
docker compose -f $composeFile build
docker compose -f $composeFile up -d

# 5. Health verification loop
Write-Host "`n[4/5] Probing service health..." -ForegroundColor Yellow
$maxRetries = 25
$retryCount = 0
$healthy = $false

while ($retryCount -lt $maxRetries) {
    $retryCount++
    Write-Host -NoNewline "Probing backend health ($retryCount/$maxRetries)... "
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get -TimeoutSec 3 -ErrorAction SilentlyContinue
        if ($response.status -eq "ok") {
            Write-Host "HEALTHY!" -ForegroundColor Green
            $healthy = $true
            break
        }
    } catch {
        Write-Host "Starting up..." -ForegroundColor Gray
    }
    Start-Sleep -Seconds 2
}

if (-not $healthy) {
    Write-Warning "Services took longer than expected to report healthy. Check 'docker compose logs'."
} else {
    Write-Host "`n=====================================================================" -ForegroundColor Green
    Write-Host "  ✓ AIRTEL STADIUM360 DEPLOYMENT SUCCESSFUL!                         " -ForegroundColor Green
    Write-Host "=====================================================================" -ForegroundColor Green
    Write-Host "• Frontend Dashboard:   http://localhost:5173 / http://localhost"
    Write-Host "• Backend REST API:     http://localhost:8000"
    Write-Host "• API Interactive Docs: http://localhost:8000/docs"
    Write-Host "• Health Probe:         http://localhost:8000/health"
    Write-Host "• Readiness Probe:      http://localhost:8000/health/ready"
    Write-Host "• Liveness Probe:       http://localhost:8000/health/live"
    Write-Host "=====================================================================`n"
}

