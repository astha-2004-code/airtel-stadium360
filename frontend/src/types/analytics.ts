export interface DemandCalculationParams {
  capacity?: number
  airtel_share?: number
  device_share_5g?: number
  peak_online_pct?: number
  target_speed_5g_mbps?: number
  target_speed_4g_mbps?: number
  target_utilization?: number
}

export interface SpectatorCounts {
  total_spectators: number
  airtel_spectators: number
  spectators_5g_capable: number
  spectators_4g_only: number
}

export interface ActiveUserCounts {
  peak_active_airtel_users: number
  active_5g_users: number
  active_4g_users: number
}

export interface ThroughputDemand {
  demand_5g: number
  demand_4g: number
  total_demand: number
}

export interface CapacityRequirements {
  required_total_at_80_pct: number
  required_5g_at_80_pct: number
  required_4g_at_80_pct: number
}

export interface SiteCapacityBreakdown {
  site_id: string
  type: string
  distance_m: number
  has_5g: boolean
  backhaul: string
  backhaul_capacity_gbps: number
  traffic_weight_pct: number
  assigned_active_users: number
  assigned_5g_users: number
  assigned_4g_users: number
  demand_5g_gbps: number
  demand_4g_gbps: number
  total_demand_gbps: number
  required_capacity_80_gbps: number
  delivered_rf_capacity_gbps: number
  usable_capacity_gbps: number
  capacity_deficit_gbps: number
  is_backhaul_constrained: boolean
  utilization_pct: number
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL'
}

export interface SpectralEfficiencyItem {
  tech: string
  frequency: string
  bandwidth_mhz: number
  mimo_config: string
  theoretical_bps_hz: number
  theoretical_macro_gbps: number
  practical_bps_hz: number
  practical_macro_gbps: number
  efficiency_loss_pct: number
  primary_loss_factors: string[]
}

export interface SpectralEfficiencyResponse {
  spectrum_allocation: Record<string, any>
  comparison: SpectralEfficiencyItem[]
  engineering_methodology: {
    standard: string
    confidence_level: string
  }
}

export interface MatchPhaseForecastItem {
  phase: string
  time: string
  active_online_pct: number
  projected_active_users: number
  projected_5g_users: number
  projected_4g_users: number
  projected_demand_gbps: number
  required_capacity_gbps: number
  installed_capacity_gbps: number
  unmitigated_utilization_pct: number
  historical_baseline: {
    4g_load_pct: number
    4g_speed_mbps: number
    5g_speed_mbps: number
    upi_failure_pct: number
  }
  description: string
  risk_level: string
}

export interface DemandCalculationResponse {
  parameters: Record<string, any>
  spectators: SpectatorCounts
  active_users: ActiveUserCounts
  throughput_demand_gbps: ThroughputDemand
  capacity_requirements_gbps: CapacityRequirements
  spectral_efficiency: Record<string, any>
  capacity_gap: {
    total_required_gbps: number
    current_delivered_rf_gbps: number
    overall_gap_gbps: number
    total_site_deficit_gbps: number
  }
  site_breakdowns: SiteCapacityBreakdown[]
}

export interface CapacityGapSummary {
  required_total_gbps: number
  current_delivered_rf_gbps: number
  overall_capacity_gap_gbps: number
  total_site_deficit_gbps: number
  congested_sites_count: number
  backhaul_bottleneck_sites_count: number
  recommended_action: string
}
