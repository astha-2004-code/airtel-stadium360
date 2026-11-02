"""
Airtel Stadium360 — Scenario Simulator API Endpoints
"""

from typing import Dict, Any, List
from typing_extensions import Annotated
from fastapi import APIRouter, Query, Body

from app.schemas.simulator import (
    SimulationRequest,
    SimulationResponse,
    SimulationComparisonRequest,
    ComparisonResponse,
    PresetScenario,
)
from app.services.simulator_engine import (
    simulate_network_scenario,
    compare_scenarios,
    get_preset_scenarios,
)

router = APIRouter()

@router.get("/simulate", response_model=SimulationResponse)
def get_simulate_scenario(
    capacity: Annotated[int, Query(description="Stadium crowd size")] = 100000,
    airtel_share: Annotated[float, Query(description="Airtel subscriber share")] = 0.40,
    device_share_5g: Annotated[float, Query(description="5G device adoption %")] = 0.70,
    peak_online_pct: Annotated[float, Query(description="Peak simultaneous active %")] = 0.18,
    target_speed_5g_mbps: Annotated[float, Query(description="5G speed target in Mbps")] = 5.0,
    target_speed_4g_mbps: Annotated[float, Query(description="4G speed target in Mbps")] = 3.0,
    target_utilization: Annotated[float, Query(description="Target maximum utilization")] = 0.80,
    budget_cap_crores: Annotated[float, Query(description="Budget cap in Crores INR")] = 4.0,
    cows_deployed: Annotated[int, Query(description="COWs deployed")] = 4,
    small_cells_deployed: Annotated[int, Query(description="Small cells deployed")] = 26,
    fibre_distance_km: Annotated[float, Query(description="Fibre upgrade distance in km")] = 0.99,
    five_g_overlays_count: Annotated[int, Query(description="5G overlays")] = 4,
) -> Dict[str, Any]:
    """
    Executes live scenario simulation with 10-step mathematical cascade via GET parameters.
    """
    return simulate_network_scenario(
        capacity=capacity,
        airtel_share=airtel_share,
        device_share_5g=device_share_5g,
        peak_online_pct=peak_online_pct,
        target_speed_5g_mbps=target_speed_5g_mbps,
        target_speed_4g_mbps=target_speed_4g_mbps,
        target_utilization=target_utilization,
        budget_cap_crores=budget_cap_crores,
        cows_deployed=cows_deployed,
        small_cells_deployed=small_cells_deployed,
        fibre_distance_km=fibre_distance_km,
        five_g_overlays_count=five_g_overlays_count,
    )

@router.post("/simulate", response_model=SimulationResponse)
def post_simulate_scenario(
    payload: SimulationRequest = Body(...)
) -> Dict[str, Any]:
    """
    Executes live scenario simulation with 10-step mathematical cascade via JSON body.
    """
    return simulate_network_scenario(
        capacity=payload.capacity,
        airtel_share=payload.airtel_share,
        device_share_5g=payload.device_share_5g,
        peak_online_pct=payload.peak_online_pct,
        target_speed_5g_mbps=payload.target_speed_5g_mbps,
        target_speed_4g_mbps=payload.target_speed_4g_mbps,
        target_utilization=payload.target_utilization,
        budget_cap_crores=payload.budget_cap_crores,
        cows_deployed=payload.cows_deployed,
        small_cells_deployed=payload.small_cells_deployed,
        fibre_distance_km=payload.fibre_distance_km,
        five_g_overlays_count=payload.five_g_overlays_count,
    )

@router.post("/compare", response_model=ComparisonResponse)
def post_compare_scenarios(
    payload: SimulationComparisonRequest = Body(...)
) -> Dict[str, Any]:
    """
    Compares baseline and simulated scenarios side-by-side, returning metric deltas.
    """
    return compare_scenarios(
        baseline_params=payload.baseline.model_dump(),
        simulated_params=payload.simulated.model_dump(),
    )

@router.get("/presets", response_model=List[PresetScenario])
def get_presets() -> List[Dict[str, Any]]:
    """
    Returns built-in preset scenarios (World Cup Final, 120k Super Crowd, IPL High 5G, Rain Delay, Low Budget).
    """
    return get_preset_scenarios()
