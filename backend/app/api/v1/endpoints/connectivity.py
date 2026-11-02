"""
Airtel Stadium360 - 5G Connectivity Intelligence Endpoints
Exposes REST APIs for 5G accessibility metrics, EN-DC dual connectivity architecture,
64T64R Massive MIMO 3D beamforming steering, stadium tier coverage mapping,
4G fallback root-cause diagnostics, and Radio Resource Management (RRM) optimization.
"""
from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from backend.app.schemas.connectivity import (
    ConnectivityKpis,
    EndcArchitecture,
    MassiveMimoSector,
    CoverageTier,
    FallbackRootCause,
    RrmRecommendation,
    ConnectivitySimulationRequest,
    ConnectivitySimulationResponse,
)
from backend.app.services.connectivity_engine import connectivity_engine

router = APIRouter()


@router.get("/overview", response_model=ConnectivityKpis)
def get_connectivity_overview(
    capacity: int = Query(100000, ge=10000, le=150000, description="Total stadium spectators"),
):
    """
    Returns 5G accessibility KPIs comparing historical baseline
    against Airtel Stadium360 proposed state.
    """
    return connectivity_engine.get_overview_kpis(capacity=capacity)


@router.get("/endc", response_model=EndcArchitecture)
def get_endc_architecture():
    """
    Returns the detailed 3GPP Rel-15 Option 3x (EN-DC) architecture specification
    with Anchor Shield PRB reservation configuration.
    """
    return connectivity_engine.get_endc_architecture()


@router.get("/beamforming", response_model=List[MassiveMimoSector])
def get_beamforming_sectors():
    """
    Returns sector-by-sector 64T64R Massive MIMO 3D beamforming orientations,
    mechanical/electrical tilts, and targeted stadium bowl tiers.
    """
    return connectivity_engine.get_massive_mimo_sectors()


@router.get("/coverage-tiers", response_model=List[CoverageTier])
def get_coverage_tiers():
    """
    Returns coverage and RF propagation parameters across the 4 physical tiers
    of Narendra Modi Stadium bowl.
    """
    return connectivity_engine.get_coverage_tiers()


@router.get("/fallback-analysis", response_model=List[FallbackRootCause])
def get_fallback_root_causes():
    """
    Returns systematic diagnostic root causes explaining why 5G devices
    stayed camped on 4G in previous events, with deployed engineering mitigations.
    """
    return connectivity_engine.get_fallback_root_causes()


@router.get("/rrm-recommendations", response_model=List[RrmRecommendation])
def get_rrm_recommendations():
    """
    Returns actionable Radio Resource Management (RRM) configurations
    and parameter settings for Airtel optimization teams.
    """
    return connectivity_engine.get_rrm_recommendations()


@router.post("/simulate", response_model=ConnectivitySimulationResponse)
def simulate_connectivity(req: ConnectivitySimulationRequest):
    """
    Simulates 5G connectivity performance under variable operational inputs
    (capacity, anchor PRB reservation %, beam tilt optimization, small cell offload).
    """
    return connectivity_engine.simulate_connectivity(req)
