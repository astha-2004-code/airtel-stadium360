"""
Airtel Stadium360 — Optimization API Endpoints
"""

from typing import Dict, Any, List
from typing_extensions import Annotated
from fastapi import APIRouter, Query, Body

from app.schemas.optimizer import (
    OptimizationRequest,
    OptimizationResponse,
    SiteIntervention,
    CostBreakdownLakhs,
)
from app.services.optimizer_engine import optimize_stadium_network

router = APIRouter()

@router.get("/recommended", response_model=OptimizationResponse)
def get_recommended_optimization(
    budget_limit_crores: Annotated[float, Query(description="Budget cap in Crores INR")] = 4.0,
    capacity: Annotated[int, Query(description="Total stadium capacity")] = 100000,
    airtel_share: Annotated[float, Query(description="Airtel subscriber share")] = 0.40,
    device_share_5g: Annotated[float, Query(description="5G device adoption %")] = 0.70,
    peak_online_pct: Annotated[float, Query(description="Peak simultaneous active %")] = 0.18,
    target_speed_5g_mbps: Annotated[float, Query(description="Target 5G speed in Mbps")] = 5.0,
    target_speed_4g_mbps: Annotated[float, Query(description="Target 4G speed in Mbps")] = 3.0,
    target_utilization: Annotated[float, Query(description="Target utilization threshold")] = 0.80,
    max_cows_allowed: Annotated[int, Query(description="Max COWs allowed")] = 6,
    max_small_cells_allowed: Annotated[int, Query(description="Max small cells allowed")] = 35,
) -> Dict[str, Any]:
    """
    Returns the optimal deployment mix computed by SciPy MILP solver
    to satisfy capacity requirements under the strict ₹4.00 Crore budget limit.
    """
    return optimize_stadium_network(
        budget_limit_crores=budget_limit_crores,
        capacity=capacity,
        airtel_share=airtel_share,
        device_share_5g=device_share_5g,
        peak_online_pct=peak_online_pct,
        target_speed_5g_mbps=target_speed_5g_mbps,
        target_speed_4g_mbps=target_speed_4g_mbps,
        target_utilization=target_utilization,
        max_cows_allowed=max_cows_allowed,
        max_small_cells_allowed=max_small_cells_allowed,
    )

@router.post("/optimize", response_model=OptimizationResponse)
def post_custom_optimization(
    payload: OptimizationRequest = Body(...)
) -> Dict[str, Any]:
    """
    Executes SciPy MILP optimization with customized constraints and parameters via POST body.
    """
    return optimize_stadium_network(
        budget_limit_crores=payload.budget_limit_crores,
        capacity=payload.capacity,
        airtel_share=payload.airtel_share,
        device_share_5g=payload.device_share_5g,
        peak_online_pct=payload.peak_online_pct,
        target_speed_5g_mbps=payload.target_speed_5g_mbps,
        target_speed_4g_mbps=payload.target_speed_4g_mbps,
        target_utilization=payload.target_utilization,
        max_cows_allowed=payload.max_cows_allowed,
        max_small_cells_allowed=payload.max_small_cells_allowed,
    )

@router.get("/site-recommendations", response_model=List[SiteIntervention])
def get_site_recommendations(
    budget_limit_crores: Annotated[float, Query(description="Budget cap in Crores INR")] = 4.0,
    capacity: Annotated[int, Query(description="Total stadium capacity")] = 100000,
) -> List[Dict[str, Any]]:
    """
    Returns site-by-site upgrade interventions and before/after utilization.
    """
    result = optimize_stadium_network(
        budget_limit_crores=budget_limit_crores,
        capacity=capacity,
    )
    return result["site_interventions"]

@router.get("/cost-breakdown", response_model=CostBreakdownLakhs)
def get_cost_breakdown(
    budget_limit_crores: Annotated[float, Query(description="Budget cap in Crores INR")] = 4.0,
    capacity: Annotated[int, Query(description="Total stadium capacity")] = 100000,
) -> Dict[str, Any]:
    """
    Returns itemized financial costs for COWs, Small cells, Fibre, and 5G upgrades.
    """
    result = optimize_stadium_network(
        budget_limit_crores=budget_limit_crores,
        capacity=capacity,
    )
    return result["cost_breakdown_lakhs"]
