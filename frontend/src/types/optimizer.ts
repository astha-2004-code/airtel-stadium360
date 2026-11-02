export interface OptimizationParams {
  budget_limit_crores?: number
  capacity?: number
  airtel_share?: number
  device_share_5g?: number
  peak_online_pct?: number
  target_speed_5g_mbps?: number
  target_speed_4g_mbps?: number
  target_utilization?: number
  max_cows_allowed?: number
  max_small_cells_allowed?: number
  prioritize_backhaul?: boolean
}

export interface BudgetSummary {
  budget_limit_crores: number
  budget_limit_lakhs: number
  total_expenditure_lakhs: number
  total_expenditure_crores: number
  remaining_budget_lakhs: number
  remaining_budget_crores: number
  budget_utilization_pct: number
  is_within_budget: boolean
}

export interface CostBreakdownLakhs {
  cows: number
  small_cells: number
  fiber_backhaul: number
  five_g_overlays: number
  total: number
}

export interface RecommendedMix {
  cows_deployed: number
  small_cells_deployed: number
  backhaul_upgrades_count: number
  five_g_overlays_count: number
  upgrades: {
    fiber_m4: boolean
    fiber_m6: boolean
    fiber_s1: boolean
    fiber_s2: boolean
    five_g_m4: boolean
    five_g_m6: boolean
    five_g_s1: boolean
    five_g_s2: boolean
  }
}

export interface CapacityResults {
  baseline_demand_gbps: number
  required_capacity_80_pct_gbps: number
  original_installed_rf_gbps: number
  added_capacity_gbps: number
  post_deployment_capacity_gbps: number
  post_deployment_utilization_pct: number
  target_utilization_pct: number
  meets_utilization_sla: boolean
}

export interface SiteIntervention {
  site_id: string
  type: string
  original_backhaul: string
  new_backhaul: string
  original_has_5g: boolean
  new_has_5g: boolean
  original_capacity_gbps: number
  added_capacity_gbps: number
  final_capacity_gbps: number
  traffic_demand_gbps: number
  final_utilization_pct: number
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL'
  actions: string[]
}

export interface CowDeployment {
  cow_id: string
  location: string
  azimuth: number
  capacity_gbps: number
  backhaul: string
  spectrum: string
  cost_lakhs: number
}

export interface OptimizationResponse {
  status: string
  is_feasible: boolean
  solver: string
  budget_summary: BudgetSummary
  cost_breakdown_lakhs: CostBreakdownLakhs
  recommended_mix: RecommendedMix
  capacity_results: CapacityResults
  site_interventions: SiteIntervention[]
  cow_deployments: CowDeployment[]
  unresolved_constraints: string[]
}

