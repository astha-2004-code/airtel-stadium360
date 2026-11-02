export interface SiteUtilizationItem {
  site: string
  load_pct: number
  normal_load_pct: number
  speed_4g_mbps: number
  speed_5g_mbps: number | null
  success_5g_pct: number
  is_congested: boolean
}

export interface DashboardKPIs {
  stadium_capacity: number
  airtel_spectators: number
  spectators_5g_capable: number
  spectators_4g_only: number
  active_airtel_users: number
  active_5g_users: number
  active_4g_users: number
  
  demand_5g_gbps: number
  demand_4g_gbps: number
  total_demand_gbps: number
  required_capacity_gbps: number
  target_utilization_pct: number
  
  network_utilization_pct: number
  total_sites: number
  congested_sites_count: number
  upi_failure_rate_pct: number
  normal_upi_rate_pct: number
  
  total_budget_inr: number
  budget_allocated_inr: number
  budget_remaining_inr: number
  budget_cap_cr: number
  
  health_score: number
  health_status: 'OPTIMAL' | 'WARNING' | 'CRITICAL'
  match_phase: string
  site_utilizations: SiteUtilizationItem[]
}

export interface TrafficSplitPoint {
  phase: string
  time: string
  traffic_4g_pct: number
  traffic_5g_pct: number
  demand_4g_gbps: number
  demand_5g_gbps: number
}

export interface MatchPhaseLoadPoint {
  phase: string
  time: string
  normal_4g_load: number
  match_4g_load: number
  normal_upi_failure: number
  match_upi_failure: number
}

export interface UserSpeedPoint {
  phase: string
  time: string
  normal_4g_speed: number
  match_4g_speed: number
  normal_5g_speed: number | null
  match_5g_speed: number | null
}

export interface UpiFailurePoint {
  phase: string
  time: string
  normal_upi_failure_pct: number
  match_upi_failure_pct: number
  threshold_pct: number
}

export interface CapacityDemandPoint {
  category: string
  current_capacity_gbps: number
  required_capacity_gbps: number
  peak_demand_gbps: number
}

export interface AlertItem {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  site?: string
  timestamp: string
}

export interface ActivityEvent {
  id: string
  type: string
  message: string
  site?: string
  time: string
  status: string
}
