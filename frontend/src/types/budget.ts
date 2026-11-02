export interface BudgetAllocationParams {
  budget_limit_crores?: number
  cows_count?: number
  small_cells_count?: number
  fibre_km?: number
  macro_5g_overlays_count?: number
  small_cell_5g_overlays_count?: number
  capacity?: number
  airtel_share?: number
  peak_online_pct?: number
}

export interface AlertInfo {
  severity: 'SUCCESS' | 'INFO' | 'WARNING' | 'CRITICAL'
  message: string
}

export interface CostBreakdown {
  cows: number
  small_cells: number
  fibre_backhaul: number
  five_g_overlays: number
  total: number
}

export interface CapexOpexSplit {
  capex_lakhs: number
  capex_crores: number
  capex_pct: number
  opex_lakhs: number
  opex_crores: number
  opex_pct: number
  strategic_notes: string
}

export interface BudgetSummaryResponse {
  budget_limit_crores: number
  budget_limit_lakhs: number
  total_expenditure_crores: number
  total_expenditure_lakhs: number
  remaining_budget_crores: number
  remaining_budget_lakhs: number
  budget_utilization_pct: number
  is_within_budget: boolean
  status: 'UNDER_BUDGET' | 'APPROACHING_LIMIT' | 'OPTIMAL_COMMITTED' | 'CRITICAL_EXCEEDED'
  alert: AlertInfo
  breakdown_lakhs: CostBreakdown
  capex_opex_split: CapexOpexSplit
}

export interface UpiPreservation {
  estimated_match_transactions: number
  baseline_failed_transactions: number
  optimized_failed_transactions: number
  protected_transactions_count: number
  protected_turnover_gmv_lakhs: number
  protected_turnover_gmv_inr: number
}

export interface CostEffectivenessResponse {
  budget_summary: BudgetSummaryResponse
  capacity_added_gbps: number
  cost_per_gbps_lakhs: number
  cost_per_gbps_inr: number
  cost_per_active_user_inr: number
  cost_per_spectator_inr: number
  upi_preservation: UpiPreservation
  telecom_roi_score: number
  capital_efficiency_rating: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
}

export interface AssetItem {
  asset_id: string
  name: string
  category: 'CapEx' | 'OpEx'
  type: string
  vendor: string
  specs: string
  capacity_gbps: number
  unit_cost_lakhs: number
  quantity: number
  total_cost_lakhs: number
  location: string
  commission_status: string
}

export interface TimelineMilestone {
  milestone_id: string
  phase: string
  title: string
  dates: string
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING'
  progress_pct: number
  description: string
  deliverables: string[]
  budget_impact_lakhs: number
}

