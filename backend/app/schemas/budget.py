"""
Airtel Stadium360 — Financial and Budget Pydantic Schemas
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class BudgetAllocationRequest(BaseModel):
    budget_limit_crores: float = Field(default=4.0, ge=0.5, le=10.0, description="Budget cap in Crores INR")
    cows_count: int = Field(default=4, ge=0, le=15, description="Number of portable COWs deployed")
    small_cells_count: int = Field(default=26, ge=0, le=80, description="Number of in-bowl small cells deployed")
    fibre_km: float = Field(default=0.99, ge=0.0, le=10.0, description="Dark fibre backhaul upgrade distance in km")
    macro_5g_overlays_count: int = Field(default=2, ge=0, le=6, description="Macro 5G Massive MIMO overlays")
    small_cell_5g_overlays_count: int = Field(default=2, ge=0, le=6, description="In-bowl micro 5G overlays")

class AlertInfo(BaseModel):
    severity: str
    message: str

class CostBreakdown(BaseModel):
    cows: float
    small_cells: float
    fibre_backhaul: float
    five_g_overlays: float
    total: float

class CapexOpexSplit(BaseModel):
    capex_lakhs: float
    capex_crores: float
    capex_pct: float
    opex_lakhs: float
    opex_crores: float
    opex_pct: float
    strategic_notes: str

class BudgetSummaryResponse(BaseModel):
    budget_limit_crores: float
    budget_limit_lakhs: float
    total_expenditure_crores: float
    total_expenditure_lakhs: float
    remaining_budget_crores: float
    remaining_budget_lakhs: float
    budget_utilization_pct: float
    is_within_budget: bool
    status: str
    alert: AlertInfo
    breakdown_lakhs: CostBreakdown
    capex_opex_split: CapexOpexSplit

class CostEffectivenessResponse(BaseModel):
    budget_summary: BudgetSummaryResponse
    capacity_added_gbps: float
    cost_per_gbps_lakhs: float
    cost_per_gbps_inr: float
    cost_per_active_user_inr: float
    cost_per_spectator_inr: float
    upi_preservation: Dict[str, Any]
    telecom_roi_score: float
    capital_efficiency_rating: str

class AssetItem(BaseModel):
    asset_id: str
    name: str
    category: str
    type: str
    vendor: str
    specs: str
    capacity_gbps: float
    unit_cost_lakhs: float
    quantity: float
    total_cost_lakhs: float
    location: str
    commission_status: str

class TimelineMilestone(BaseModel):
    milestone_id: str
    phase: str
    title: str
    dates: str
    status: str
    progress_pct: int
    description: str
    deliverables: List[str]
    budget_impact_lakhs: float

