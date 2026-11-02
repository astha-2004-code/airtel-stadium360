"""
Airtel Stadium360 — Scenario Simulator Pydantic Schemas
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class SimulationRequest(BaseModel):
    capacity: int = Field(default=100000, ge=1000, le=150000, description="Stadium crowd size")
    airtel_share: float = Field(default=0.40, ge=0.01, le=1.0, description="Airtel subscriber share")
    device_share_5g: float = Field(default=0.70, ge=0.0, le=1.0, description="5G device penetration")
    peak_online_pct: float = Field(default=0.18, ge=0.01, le=1.0, description="Peak simultaneous active %")
    target_speed_5g_mbps: float = Field(default=5.0, ge=0.5, le=100.0, description="5G target speed in Mbps")
    target_speed_4g_mbps: float = Field(default=3.0, ge=0.5, le=50.0, description="4G target speed in Mbps")
    target_utilization: float = Field(default=0.80, ge=0.1, le=1.0, description="Target maximum utilization threshold (default 80%)")
    budget_cap_crores: float = Field(default=4.0, ge=0.5, le=10.0, description="Budget cap in Crores INR")
    cows_deployed: int = Field(default=4, ge=0, le=15, description="Number of portable COWs deployed")
    small_cells_deployed: int = Field(default=26, ge=0, le=80, description="Number of in-bowl small cells deployed")
    fibre_distance_km: float = Field(default=0.99, ge=0.0, le=10.0, description="Fibre backhaul upgrade distance in km")
    five_g_overlays_count: int = Field(default=4, ge=0, le=8, description="Number of 5G active antenna overlays")

class SimulationResponse(BaseModel):
    inputs: Dict[str, Any]
    cascade: Dict[str, Any]
    site_simulations: List[Dict[str, Any]]

class SimulationComparisonRequest(BaseModel):
    baseline: SimulationRequest
    simulated: SimulationRequest

class ComparisonResponse(BaseModel):
    baseline: SimulationResponse
    simulated: SimulationResponse
    deltas: Dict[str, Any]

class PresetScenario(BaseModel):
    id: str
    name: str
    description: str
    params: Dict[str, Any]
