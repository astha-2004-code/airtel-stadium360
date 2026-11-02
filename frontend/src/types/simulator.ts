export interface SimulationParams {
  capacity?: number
  airtel_share?: number
  device_share_5g?: number
  peak_online_pct?: number
  target_speed_5g_mbps?: number
  target_speed_4g_mbps?: number
  target_utilization?: number
  budget_cap_crores?: number
  cows_deployed?: number
  small_cells_deployed?: number
  fibre_distance_km?: number
  five_g_overlays_count?: number
}

export interface CascadeStep1 {
  total_spectators: number
  airtel_spectators: number
  spectators_5g_capable: number
  spectators_4g_only: number
}

export interface CascadeStep2 {
  peak_active_airtel_users: number
  peak_online_pct: number
}

export interface CascadeStep3 {
  active_5g_users: number
  active_4g_users: number
}

export interface CascadeStep4 {
  demand_5g_gbps: number
  demand_4g_gbps: number
  total_demand_gbps: number
}

export interface CascadeStep5 {
  required_capacity_gbps: number
  required_5g_gbps: number
  required_4g_gbps: number
}

export interface CascadeStep6 {
  total_deployed_capacity_gbps: number
  required_capacity_gbps: number
  capacity_gap_gbps: number
  status: 'SURPLUS' | 'DEFICIT'
  meets_sla: boolean
}

export interface CascadeStep7 {
  overall_utilization_pct: number
  target_utilization_pct: number
  congested_sites_count: number
}

export interface CascadeStep8 {
  has_backhaul_bottlenecks: boolean
  bottleneck_count: number
}

export interface CascadeStep9 {
  cost_cows_lakhs: number
  cost_small_cells_lakhs: number
  cost_fibre_lakhs: number
  cost_overlays_lakhs: number
  total_cost_lakhs: number
  total_cost_crores: number
  remaining_budget_lakhs: number
  remaining_budget_crores: number
  is_within_budget: boolean
}

export interface CascadeStep10 {
  status: 'FEASIBLE' | 'BUDGET_EXCEEDED' | 'BACKHAUL_BOTTLENECK' | 'CAPACITY_DEFICIT'
  is_feasible: boolean
  reason: string
}

export interface SimulationCascade {
  step_1_airtel_spectators: CascadeStep1
  step_2_active_users: CascadeStep2
  step_3_user_split: CascadeStep3
  step_4_throughput_demand: CascadeStep4
  step_5_required_capacity: CascadeStep5
  step_6_capacity_evaluation: CascadeStep6
  step_7_utilization_metrics: CascadeStep7
  step_8_bottlenecks: CascadeStep8
  step_9_financial_impact: CascadeStep9
  step_10_feasibility: CascadeStep10
}

export interface SiteSimulationItem {
  site_id: string
  type: string
  has_5g: boolean
  backhaul: string
  backhaul_capacity_gbps: number
  usable_capacity_gbps: number
  demand_gbps: number
  utilization_pct: number
  is_backhaul_bottleneck: boolean
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL'
}

export interface SimulationResponse {
  inputs: Record<string, any>
  cascade: SimulationCascade
  site_simulations: SiteSimulationItem[]
}

export interface ComparisonDeltas {
  capacity_spectators: number
  airtel_spectators: number
  active_users: number
  demand_gbps: number
  required_capacity_gbps: number
  deployed_capacity_gbps: number
  utilization_pct: number
  expenditure_crores: number
}

export interface ComparisonResponse {
  baseline: SimulationResponse
  simulated: SimulationResponse
  deltas: ComparisonDeltas
}

export interface PresetScenario {
  id: string
  name: string
  description: string
  params: SimulationParams
}

