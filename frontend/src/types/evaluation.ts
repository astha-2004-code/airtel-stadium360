/**
 * Airtel Stadium360 - Network Performance Evaluation & Optimization Types
 * Author: ByteForge | NIT Delhi
 */

export interface SiteUtilizationItem {
  site_id: string;
  site_name: string;
  azimuth_deg: number;
  sector_type: string;
  baseline_4g_load_pct: number;
  baseline_5g_load_pct?: number | null;
  proposed_utilization_pct: number;
  simulated_utilization_pct?: number | null;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL' | string;
  intervention: string;
}

export interface NetworkUtilizationMetrics {
  avg_4g_utilization_baseline_pct: number;
  avg_4g_utilization_proposed_pct: number;
  peak_4g_utilization_baseline_pct: number;
  peak_4g_utilization_proposed_pct: number;
  avg_5g_utilization_baseline_pct?: number | null;
  avg_5g_utilization_proposed_pct?: number | null;
  sites_exceeding_80_baseline_count: number;
  sites_exceeding_80_proposed_count: number;
  sites_exceeding_80_baseline_pct: number;
  sites_exceeding_80_proposed_pct: number;
  congested_sites_baseline: number;
  congested_sites_proposed: number;
  congestion_reduction_pct: number;
  site_utilization_matrix: SiteUtilizationItem[];
}

export interface ThroughputPerformanceMetrics {
  avg_4g_speed_baseline_mbps: number;
  avg_4g_speed_proposed_mbps: number;
  avg_5g_speed_baseline_mbps: number;
  avg_5g_speed_proposed_mbps: number;
  peak_phase_speed_deterioration_4g_pct: number;
  peak_phase_speed_deterioration_5g_pct: number;
  users_meeting_target_baseline_pct: number;
  users_meeting_target_proposed_pct: number;
  estimated_demand_gbps: number;
  available_capacity_baseline_gbps: number;
  available_capacity_proposed_gbps: number;
  capacity_improvement_pct: number;
  target_4g_mbps: number;
  target_5g_mbps: number;
}

export interface Site5GConnectivityItem {
  site_id: string;
  site_name: string;
  has_5g: boolean;
  existing_connection_success_rate_pct: number;
  proposed_connection_success_target_pct: number;
  improvement_pct: number;
  deployed_hardware: string;
}

export interface FiveGAccessibilityMetrics {
  existing_connection_success_rate_pct: number;
  proposed_connection_success_target_pct: number;
  accessibility_improvement_pct: number;
  baseline_camping_rate_pct: number;
  proposed_camping_rate_pct: number;
  baseline_sgnb_addition_rate_pct: number;
  proposed_sgnb_addition_rate_pct: number;
  site_connectivity_comparison: Site5GConnectivityItem[];
}

export interface UpiReliabilityMetrics {
  existing_upi_failure_rate_pct: number;
  normal_day_failure_rate_pct: number;
  peak_match_failure_rate_pct: number;
  proposed_simulated_failure_rate_pct: number;
  improvement_pct: number;
  radio_induced_failures_eliminated_pct: number;
  external_bank_failure_rate_pct: number;
  protected_gmv_lakhs: number;
  distinction_notes: string;
}

export interface SiteBackhaulItem {
  site_id: string;
  site_name: string;
  backhaul_type: string;
  available_capacity_gbps: number;
  is_bottleneck: boolean;
  proposed_improvement: string;
  post_deployment_capacity_gbps: number;
  post_deployment_utilization_pct: number;
}

export interface BackhaulPerformanceMetrics {
  sites_backhaul: SiteBackhaulItem[];
  total_baseline_backhaul_capacity_gbps: number;
  total_proposed_backhaul_capacity_gbps: number;
  bottleneck_sites_count: number;
  bottleneck_sites_resolved_count: number;
  total_fibre_deployed_km: number;
}

export interface StrategyComparisonItem {
  strategy_name: string;
  crowd_capacity: number;
  infrastructure_cost_crores: number;
  remaining_reserve_lakhs: number;
  capacity_delivered_gbps: number;
  peak_utilization_pct: number;
  five_g_camping_pct: number;
  upi_failure_pct: number;
  compliance_status: string;
}

export interface FinancialEvaluationMetrics {
  total_infrastructure_cost_lakhs: number;
  total_infrastructure_cost_crores: number;
  budget_limit_crores: number;
  remaining_budget_lakhs: number;
  remaining_budget_crores: number;
  budget_utilization_pct: number;
  cost_per_additional_gbps_lakhs: number;
  cost_per_active_user_inr: number;
  capex_pct: number;
  opex_pct: number;
  cost_effectiveness_rating: string;
  strategy_comparisons: StrategyComparisonItem[];
}

export interface ComponentScore {
  score: number;
  weight_pct: number;
  weighted_contribution: number;
  metric_basis: string;
}

export interface NetworkHealthScore {
  composite_score: number;
  score_label: string;
  rating: 'OPTIMAL' | 'GOOD' | 'FAIR' | 'CRITICAL' | string;
  component_breakdown: Record<string, ComponentScore>;
  scoring_methodology: string;
}

export interface EvaluationOverviewResponse {
  stadium_name: string;
  match_event: string;
  evaluated_capacity: number;
  health_score: NetworkHealthScore;
  utilization: NetworkUtilizationMetrics;
  throughput: ThroughputPerformanceMetrics;
  accessibility: FiveGAccessibilityMetrics;
  reliability: UpiReliabilityMetrics;
  backhaul: BackhaulPerformanceMetrics;
  financial: FinancialEvaluationMetrics;
  is_within_budget: boolean;
  capacity_deficit_gbps: number;
  feasibility_status: string;
}

export interface ScenarioEvaluationState {
  scenario_label: string;
  crowd_capacity: number;
  active_concurrent_users: number;
  throughput_demand_gbps: number;
  deployed_capacity_gbps: number;
  congested_sites_count: number;
  network_utilization_pct: number;
  avg_user_throughput_mbps: number;
  five_g_camping_rate_pct: number;
  upi_failure_rate_pct: number;
  total_investment_crores: number;
  budget_remaining_lakhs: number;
  composite_health_score: number;
  status: string;
}

export interface EvaluationCompareRequest {
  capacity: number;
  airtel_share?: number;
  device_share_5g?: number;
  peak_online_pct?: number;
  target_speed_5g_mbps?: number;
  target_speed_4g_mbps?: number;
  target_utilization?: number;
  cows_deployed?: number;
  small_cells_deployed?: number;
  fibre_distance_km?: number;
  five_g_overlays_count?: number;
}

export interface EvaluationCompareResponse {
  baseline_network: ScenarioEvaluationState;
  proposed_network: ScenarioEvaluationState;
  simulated_scenario: ScenarioEvaluationState;
  key_improvements: {
    congestion_reduction_pct: number;
    capacity_growth_pct: number;
    upi_reliability_gain_pct: number;
    five_g_camping_gain_pct: number;
  };
  newly_infeasible_constraints: string[];
}
