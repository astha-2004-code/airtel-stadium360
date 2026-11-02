"""
Airtel Stadium360 — Optimizer Pydantic Schemas
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class OptimizationRequest(BaseModel):
    budget_limit_crores: float = Field(default=4.0, ge=0.5, le=10.0, description="Maximum budget limit in Crores INR (default ₹4.0 Cr)")
    capacity: int = Field(default=100000, ge=1000, le=150000, description="Stadium capacity")
    airtel_share: float = Field(default=0.40, ge=0.01, le=1.0, description="Airtel subscriber share")
    device_share_5g: float = Field(default=0.70, ge=0.0, le=1.0, description="5G device penetration")
    peak_online_pct: float = Field(default=0.18, ge=0.01, le=1.0, description="Peak simultaneous active %")
    target_speed_5g_mbps: float = Field(default=5.0, ge=0.5, le=100.0, description="5G target speed in Mbps")
    target_speed_4g_mbps: float = Field(default=3.0, ge=0.5, le=50.0, description="4G target speed in Mbps")
    target_utilization: float = Field(default=0.80, ge=0.1, le=1.0, description="Target maximum utilization threshold (default 80%)")
    max_cows_allowed: int = Field(default=6, ge=0, le=15, description="Maximum portable COWs allowed by perimeter space")
    max_small_cells_allowed: int = Field(default=35, ge=0, le=80, description="Maximum in-bowl small cells allowed by mounting structures")

class BudgetSummary(BaseModel):
    budget_limit_crores: float
    budget_limit_lakhs: float
    total_expenditure_lakhs: float
    total_expenditure_crores: float
    remaining_budget_lakhs: float
    remaining_budget_crores: float
    budget_utilization_pct: float
    is_within_budget: bool

class CostBreakdownLakhs(BaseModel):
    cows: float
    small_cells: float
    fiber_backhaul: float
    five_g_overlays: float
    total: float

class RecommendedMix(BaseModel):
    cows_deployed: int
    small_cells_deployed: int
    backhaul_upgrades_count: int
    five_g_overlays_count: int
    upgrades: Dict[str, bool]

class CapacityResults(BaseModel):
    baseline_demand_gbps: float
    required_capacity_80_pct_gbps: float
    original_installed_rf_gbps: float
    added_capacity_gbps: float
    post_deployment_capacity_gbps: float
    post_deployment_utilization_pct: float
    target_utilization_pct: float
    meets_utilization_sla: bool

class SiteIntervention(BaseModel):
    site_id: str
    type: str
    original_backhaul: str
    new_backhaul: str
    original_has_5g: bool
    new_has_5g: bool
    original_capacity_gbps: float
    added_capacity_gbps: float
    final_capacity_gbps: float
    traffic_demand_gbps: float
    final_utilization_pct: float
    status: str
    actions: List[str]

class CowDeployment(BaseModel):
    cow_id: str
    location: str
    azimuth: int
    capacity_gbps: float
    backhaul: str
    spectrum: str
    cost_lakhs: float

class OptimizationResponse(BaseModel):
    status: str
    is_feasible: bool
    solver: str
    budget_summary: BudgetSummary
    cost_breakdown_lakhs: CostBreakdownLakhs
    recommended_mix: RecommendedMix
    capacity_results: CapacityResults
    site_interventions: List[SiteIntervention]
    cow_deployments: List[CowDeployment]
    unresolved_constraints: List[str]
