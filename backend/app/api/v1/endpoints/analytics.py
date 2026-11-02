"""
Airtel Stadium360 — Analytics & Capacity Engine API Endpoints
"""

from typing import Dict, Any, List
from typing_extensions import Annotated
from fastapi import APIRouter, Query, Body

from app.schemas.analytics import (
    DemandCalculationRequest,
    DemandCalculationResponse,
    MatchPhaseForecastItem,
)
from app.services.demand_capacity_engine import (
    calculate_network_demand,
    get_match_phase_forecast,
    get_spectral_efficiency_breakdown,
)

router = APIRouter()

@router.get("/calculate", response_model=DemandCalculationResponse)
def get_demand_calculation(
    capacity: Annotated[int, Query(description="Total stadium capacity")] = 100000,
    airtel_share: Annotated[float, Query(description="Airtel subscriber share")] = 0.40,
    device_share_5g: Annotated[float, Query(description="5G device adoption %")] = 0.70,
    peak_online_pct: Annotated[float, Query(description="Peak simultaneous active %")] = 0.18,
    target_speed_5g_mbps: Annotated[float, Query(description="Target 5G speed in Mbps")] = 5.0,
    target_speed_4g_mbps: Annotated[float, Query(description="Target 4G speed in Mbps")] = 3.0,
    target_utilization: Annotated[float, Query(description="Target maximum network utilization")] = 0.80,
) -> Dict[str, Any]:
    """
    Computes master telecom network demand equations via GET parameters.
    """
    return calculate_network_demand(
        capacity=capacity,
        airtel_share=airtel_share,
        device_share_5g=device_share_5g,
        peak_online_pct=peak_online_pct,
        target_speed_5g_mbps=target_speed_5g_mbps,
        target_speed_4g_mbps=target_speed_4g_mbps,
        target_utilization=target_utilization,
    )

@router.post("/calculate", response_model=DemandCalculationResponse)
def post_demand_calculation(
    payload: DemandCalculationRequest = Body(...)
) -> Dict[str, Any]:
    """
    Computes master telecom network demand equations via POST request body.
    """
    return calculate_network_demand(
        capacity=payload.capacity,
        airtel_share=payload.airtel_share,
        device_share_5g=payload.device_share_5g,
        peak_online_pct=payload.peak_online_pct,
        target_speed_5g_mbps=payload.target_speed_5g_mbps,
        target_speed_4g_mbps=payload.target_speed_4g_mbps,
        target_utilization=payload.target_utilization,
    )

@router.get("/site-capacity-breakdown")
def get_site_capacity_breakdown(
    capacity: Annotated[int, Query(description="Total stadium capacity")] = 100000,
    airtel_share: Annotated[float, Query(description="Airtel subscriber share")] = 0.40,
    device_share_5g: Annotated[float, Query(description="5G device adoption %")] = 0.70,
    peak_online_pct: Annotated[float, Query(description="Peak simultaneous active %")] = 0.18,
    target_speed_5g_mbps: Annotated[float, Query(description="Target 5G speed in Mbps")] = 5.0,
    target_speed_4g_mbps: Annotated[float, Query(description="Target 4G speed in Mbps")] = 3.0,
    target_utilization: Annotated[float, Query(description="Target maximum network utilization")] = 0.80,
) -> List[Dict[str, Any]]:
    """
    Returns site-level capacity requirements, delivered capacity, bottlenecks, and deficits.
    """
    result = calculate_network_demand(
        capacity=capacity,
        airtel_share=airtel_share,
        device_share_5g=device_share_5g,
        peak_online_pct=peak_online_pct,
        target_speed_5g_mbps=target_speed_5g_mbps,
        target_speed_4g_mbps=target_speed_4g_mbps,
        target_utilization=target_utilization,
    )
    return result["site_breakdowns"]

@router.get("/spectral-efficiency")
def get_spectral_efficiency() -> Dict[str, Any]:
    """
    Returns theoretical vs practical spectral efficiency metrics and 3GPP channel degradation factors.
    """
    return get_spectral_efficiency_breakdown()

@router.get("/match-phase-forecast", response_model=List[MatchPhaseForecastItem])
def get_match_phases(
    capacity: Annotated[int, Query(description="Total stadium capacity")] = 100000,
    airtel_share: Annotated[float, Query(description="Airtel subscriber share")] = 0.40,
    device_share_5g: Annotated[float, Query(description="5G device adoption %")] = 0.70,
    target_speed_5g_mbps: Annotated[float, Query(description="Target 5G speed in Mbps")] = 5.0,
    target_speed_4g_mbps: Annotated[float, Query(description="Target 4G speed in Mbps")] = 3.0,
) -> List[Dict[str, Any]]:
    """
    Returns demand progression across the four match phases contrasted with historical 65k match baseline.
    """
    return get_match_phase_forecast(
        capacity=capacity,
        airtel_share=airtel_share,
        device_share_5g=device_share_5g,
        target_speed_5g_mbps=target_speed_5g_mbps,
        target_speed_4g_mbps=target_speed_4g_mbps,
    )

@router.get("/capacity-gap-analysis")
def get_capacity_gap_summary(
    capacity: Annotated[int, Query(description="Total stadium capacity")] = 100000,
    airtel_share: Annotated[float, Query(description="Airtel subscriber share")] = 0.40,
    device_share_5g: Annotated[float, Query(description="5G device adoption %")] = 0.70,
    peak_online_pct: Annotated[float, Query(description="Peak simultaneous active %")] = 0.18,
    target_speed_5g_mbps: Annotated[float, Query(description="Target 5G speed in Mbps")] = 5.0,
    target_speed_4g_mbps: Annotated[float, Query(description="Target 4G speed in Mbps")] = 3.0,
    target_utilization: Annotated[float, Query(description="Target maximum network utilization")] = 0.80,
) -> Dict[str, Any]:
    """
    Returns an executive capacity gap summary comparing required capacity vs delivered RF vs backhaul constraints.
    """
    result = calculate_network_demand(
        capacity=capacity,
        airtel_share=airtel_share,
        device_share_5g=device_share_5g,
        peak_online_pct=peak_online_pct,
        target_speed_5g_mbps=target_speed_5g_mbps,
        target_speed_4g_mbps=target_speed_4g_mbps,
        target_utilization=target_utilization,
    )
    return {
        "required_total_gbps": result["capacity_requirements_gbps"]["required_total_at_80_pct"],
        "current_delivered_rf_gbps": result["spectral_efficiency"]["total_practical_rf_capacity_gbps"],
        "overall_capacity_gap_gbps": result["capacity_gap"]["overall_gap_gbps"],
        "total_site_deficit_gbps": result["capacity_gap"]["total_site_deficit_gbps"],
        "congested_sites_count": len([s for s in result["site_breakdowns"] if s["status"] == "CRITICAL"]),
        "backhaul_bottleneck_sites_count": len([s for s in result["site_breakdowns"] if s["is_backhaul_constrained"]]),
        "recommended_action": "Urgent infrastructure deployment required: add 5G Small Cells in-bowl, deploy COWs, and upgrade Microwave/1G backhaul to 10G Fibre."
    }
