"""
Airtel Stadium360 — Analytics Pydantic Schemas
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class DemandCalculationRequest(BaseModel):
    capacity: int = Field(default=100000, ge=1000, le=150000, description="Total stadium capacity")
    airtel_share: float = Field(default=0.40, ge=0.01, le=1.0, description="Airtel subscriber share (default 40%)")
    device_share_5g: float = Field(default=0.70, ge=0.0, le=1.0, description="5G device adoption percentage (default 70%)")
    peak_online_pct: float = Field(default=0.18, ge=0.01, le=1.0, description="Peak simultaneous active percentage (default 18%)")
    target_speed_5g_mbps: float = Field(default=5.0, ge=0.5, le=100.0, description="Target speed per 5G user in Mbps (default 5)")
    target_speed_4g_mbps: float = Field(default=3.0, ge=0.5, le=50.0, description="Target speed per 4G user in Mbps (default 3)")
    target_utilization: float = Field(default=0.80, ge=0.1, le=1.0, description="Target maximum network utilization (default 80%)")

class SpectatorCounts(BaseModel):
    total_spectators: int
    airtel_spectators: int
    spectators_5g_capable: int
    spectators_4g_only: int

class ActiveUserCounts(BaseModel):
    peak_active_airtel_users: int
    active_5g_users: int
    active_4g_users: int

class ThroughputDemand(BaseModel):
    demand_5g: float
    demand_4g: float
    total_demand: float

class CapacityRequirements(BaseModel):
    required_total_at_80_pct: float
    required_5g_at_80_pct: float
    required_4g_at_80_pct: float

class SiteCapacityBreakdown(BaseModel):
    site_id: str
    type: str
    distance_m: int
    has_5g: bool
    backhaul: str
    backhaul_capacity_gbps: float
    traffic_weight_pct: float
    assigned_active_users: int
    assigned_5g_users: int
    assigned_4g_users: int
    demand_5g_gbps: float
    demand_4g_gbps: float
    total_demand_gbps: float
    required_capacity_80_gbps: float
    delivered_rf_capacity_gbps: float
    usable_capacity_gbps: float
    capacity_deficit_gbps: float
    is_backhaul_constrained: bool
    utilization_pct: float
    status: str

class DemandCalculationResponse(BaseModel):
    parameters: Dict[str, Any]
    spectators: SpectatorCounts
    active_users: ActiveUserCounts
    throughput_demand_gbps: ThroughputDemand
    capacity_requirements_gbps: CapacityRequirements
    spectral_efficiency: Dict[str, Any]
    capacity_gap: Dict[str, Any]
    site_breakdowns: List[SiteCapacityBreakdown]

class MatchPhaseForecastItem(BaseModel):
    phase: str
    time: str
    active_online_pct: float
    projected_active_users: int
    projected_5g_users: int
    projected_4g_users: int
    projected_demand_gbps: float
    required_capacity_gbps: float
    installed_capacity_gbps: float
    unmitigated_utilization_pct: float
    historical_baseline: Dict[str, Any]
    description: str
    risk_level: str

