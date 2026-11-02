"""
Airtel Stadium360 - Network Performance Evaluation & Optimization Schemas
Defines structured evaluation metrics, site-level telemetry matrices,
3-way comparative benchmarks, and internal health scoring models.
"""
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class SiteUtilizationItem(BaseModel):
    site_id: str
    site_name: str
    azimuth_deg: int
    sector_type: str
    baseline_4g_load_pct: float
    baseline_5g_load_pct: Optional[float] = None
    proposed_utilization_pct: float
    simulated_utilization_pct: Optional[float] = None
    status: str
    intervention: str


class NetworkUtilizationMetrics(BaseModel):
    avg_4g_utilization_baseline_pct: float
    avg_4g_utilization_proposed_pct: float
    peak_4g_utilization_baseline_pct: float
    peak_4g_utilization_proposed_pct: float
    avg_5g_utilization_baseline_pct: Optional[float] = None
    avg_5g_utilization_proposed_pct: Optional[float] = None
    sites_exceeding_80_baseline_count: int
    sites_exceeding_80_proposed_count: int
    sites_exceeding_80_baseline_pct: float
    sites_exceeding_80_proposed_pct: float
    congested_sites_baseline: int
    congested_sites_proposed: int
    congestion_reduction_pct: float
    site_utilization_matrix: List[SiteUtilizationItem]


class ThroughputPerformanceMetrics(BaseModel):
    avg_4g_speed_baseline_mbps: float
    avg_4g_speed_proposed_mbps: float
    avg_5g_speed_baseline_mbps: float
    avg_5g_speed_proposed_mbps: float
    peak_phase_speed_deterioration_4g_pct: float
    peak_phase_speed_deterioration_5g_pct: float
    users_meeting_target_baseline_pct: float
    users_meeting_target_proposed_pct: float
    estimated_demand_gbps: float
    available_capacity_baseline_gbps: float
    available_capacity_proposed_gbps: float
    capacity_improvement_pct: float
    target_4g_mbps: float = 3.0
    target_5g_mbps: float = 5.0


class Site5GConnectivityItem(BaseModel):
    site_id: str
    site_name: str
    has_5g: bool
    existing_connection_success_rate_pct: float
    proposed_connection_success_target_pct: float
    improvement_pct: float
    deployed_hardware: str


class FiveGAccessibilityMetrics(BaseModel):
    existing_connection_success_rate_pct: float
    proposed_connection_success_target_pct: float
    accessibility_improvement_pct: float
    baseline_camping_rate_pct: float
    proposed_camping_rate_pct: float
    baseline_sgnb_addition_rate_pct: float
    proposed_sgnb_addition_rate_pct: float
    site_connectivity_comparison: List[Site5GConnectivityItem]


class UpiReliabilityMetrics(BaseModel):
    existing_upi_failure_rate_pct: float
    normal_day_failure_rate_pct: float
    peak_match_failure_rate_pct: float
    proposed_simulated_failure_rate_pct: float
    improvement_pct: float
    radio_induced_failures_eliminated_pct: float
    external_bank_failure_rate_pct: float
    protected_gmv_lakhs: float
    distinction_notes: str


class SiteBackhaulItem(BaseModel):
    site_id: str
    site_name: str
    backhaul_type: str
    available_capacity_gbps: float
    is_bottleneck: bool
    proposed_improvement: str
    post_deployment_capacity_gbps: float
    post_deployment_utilization_pct: float


class BackhaulPerformanceMetrics(BaseModel):
    sites_backhaul: List[SiteBackhaulItem]
    total_baseline_backhaul_capacity_gbps: float
    total_proposed_backhaul_capacity_gbps: float
    bottleneck_sites_count: int
    bottleneck_sites_resolved_count: int
    total_fibre_deployed_km: float


class StrategyComparisonItem(BaseModel):
    strategy_name: str
    crowd_capacity: int
    infrastructure_cost_crores: float
    remaining_reserve_lakhs: float
    capacity_delivered_gbps: float
    peak_utilization_pct: float
    five_g_camping_pct: float
    upi_failure_pct: float
    compliance_status: str


class FinancialEvaluationMetrics(BaseModel):
    total_infrastructure_cost_lakhs: float
    total_infrastructure_cost_crores: float
    budget_limit_crores: float = 4.0
    remaining_budget_lakhs: float
    remaining_budget_crores: float
    budget_utilization_pct: float
    cost_per_additional_gbps_lakhs: float
    cost_per_active_user_inr: float
    capex_pct: float
    opex_pct: float
    cost_effectiveness_rating: str
    strategy_comparisons: List[StrategyComparisonItem]


class ComponentScore(BaseModel):
    score: float
    weight_pct: float
    weighted_contribution: float
    metric_basis: str


class NetworkHealthScore(BaseModel):
    composite_score: float
    score_label: str = "Airtel Stadium360 Internal Evaluation Score"
    rating: str
    component_breakdown: Dict[str, ComponentScore]
    scoring_methodology: str


class EvaluationOverviewResponse(BaseModel):
    stadium_name: str = "Narendra Modi Stadium, Motera, Ahmedabad"
    match_event: str = "ICC Men's Cricket World Cup Final 2026"
    evaluated_capacity: int
    health_score: NetworkHealthScore
    utilization: NetworkUtilizationMetrics
    throughput: ThroughputPerformanceMetrics
    accessibility: FiveGAccessibilityMetrics
    reliability: UpiReliabilityMetrics
    backhaul: BackhaulPerformanceMetrics
    financial: FinancialEvaluationMetrics
    is_within_budget: bool
    capacity_deficit_gbps: float
    feasibility_status: str


class ScenarioEvaluationState(BaseModel):
    scenario_label: str
    crowd_capacity: int
    active_concurrent_users: int
    throughput_demand_gbps: float
    deployed_capacity_gbps: float
    congested_sites_count: int
    network_utilization_pct: float
    avg_user_throughput_mbps: float
    five_g_camping_rate_pct: float
    upi_failure_rate_pct: float
    total_investment_crores: float
    budget_remaining_lakhs: float
    composite_health_score: float
    status: str


class EvaluationCompareRequest(BaseModel):
    capacity: int = Field(100000, ge=10000, le=150000)
    airtel_share: float = Field(0.40, ge=0.10, le=1.0)
    device_share_5g: float = Field(0.70, ge=0.10, le=1.0)
    peak_online_pct: float = Field(0.18, ge=0.01, le=0.50)
    target_speed_5g_mbps: float = Field(5.0, ge=1.0, le=50.0)
    target_speed_4g_mbps: float = Field(3.0, ge=0.5, le=20.0)
    target_utilization: float = Field(0.80, ge=0.50, le=0.95)
    cows_deployed: int = Field(4, ge=0, le=10)
    small_cells_deployed: int = Field(26, ge=0, le=50)
    fibre_distance_km: float = Field(0.99, ge=0.0, le=5.0)
    five_g_overlays_count: int = Field(4, ge=0, le=8)


class EvaluationCompareResponse(BaseModel):
    baseline_network: ScenarioEvaluationState
    proposed_network: ScenarioEvaluationState
    simulated_scenario: ScenarioEvaluationState
    key_improvements: Dict[str, Any]
    newly_infeasible_constraints: List[str]
