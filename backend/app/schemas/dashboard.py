from typing import List, Optional
from pydantic import BaseModel, Field

class SiteUtilizationItem(BaseModel):
    site: str
    load_pct: float
    normal_load_pct: float
    speed_4g_mbps: float
    speed_5g_mbps: Optional[float] = None
    success_5g_pct: float
    is_congested: bool

class DashboardKPIsResponse(BaseModel):
    stadium_capacity: int
    airtel_spectators: int
    spectators_5g_capable: int
    spectators_4g_only: int
    active_airtel_users: int
    active_5g_users: int
    active_4g_users: int
    
    demand_5g_gbps: float
    demand_4g_gbps: float
    total_demand_gbps: float
    required_capacity_gbps: float
    target_utilization_pct: int
    
    network_utilization_pct: float
    total_sites: int
    congested_sites_count: int
    upi_failure_rate_pct: float
    normal_upi_rate_pct: float
    
    total_budget_inr: float
    budget_allocated_inr: float
    budget_remaining_inr: float
    budget_cap_cr: float
    
    health_score: int
    health_status: str
    match_phase: str
    site_utilizations: List[SiteUtilizationItem]

class TrafficSplitPoint(BaseModel):
    phase: str
    time: str
    traffic_4g_pct: float
    traffic_5g_pct: float
    demand_4g_gbps: float
    demand_5g_gbps: float

class MatchPhaseLoadPoint(BaseModel):
    phase: str
    time: str
    normal_4g_load: float
    match_4g_load: float
    normal_upi_failure: float
    match_upi_failure: float

class UserSpeedPoint(BaseModel):
    phase: str
    time: str
    normal_4g_speed: float
    match_4g_speed: float
    normal_5g_speed: Optional[float] = None
    match_5g_speed: Optional[float] = None

class UpiFailurePoint(BaseModel):
    phase: str
    time: str
    normal_upi_failure_pct: float
    match_upi_failure_pct: float
    threshold_pct: float = 2.0

class CapacityDemandPoint(BaseModel):
    category: str
    current_capacity_gbps: float
    required_capacity_gbps: float
    peak_demand_gbps: float

class AlertItem(BaseModel):
    id: str
    severity: str  # critical, warning, info
    title: str
    description: str
    site: Optional[str] = None
    timestamp: str

class ActivityEvent(BaseModel):
    id: str
    type: str
    message: str
    site: Optional[str] = None
    time: str
    status: str
