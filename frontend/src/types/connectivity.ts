/**
 * Airtel Stadium360 - 5G Connectivity Intelligence Types
 */

export interface ConnectivityKpis {
  stadium_capacity: number
  airtel_fans: number
  five_g_device_penetration_pct: number
  five_g_capable_users: number
  baseline_camping_rate_pct: number
  proposed_camping_rate_pct: number
  baseline_sgnb_addition_rate_pct: number
  proposed_sgnb_addition_rate_pct: number
  baseline_median_dl_speed_mbps: number
  proposed_median_dl_speed_mbps: number
  baseline_median_ul_speed_mbps: number
  proposed_median_ul_speed_mbps: number
  baseline_avg_sinr_db: number
  proposed_avg_sinr_db: number
  baseline_scg_drop_rate_pct: number
  proposed_scg_drop_rate_pct: number
  five_g_active_users_baseline: number
  five_g_active_users_proposed: number
  five_g_throughput_delivered_gbps: number
  spectrum_utilization_pct: number
}

export interface EndcNode {
  node_type: string
  technology: string
  spectrum_mhz: number
  frequency_bands: string[]
  duplex_mode: string
  antenna_config: string
  role: string
}

export interface EndcArchitecture {
  architecture_mode: string
  master_node: EndcNode
  secondary_node: EndcNode
  split_bearer_mode: string
  user_plane_transport: string
  control_plane_transport: string
  anchor_shield_active: boolean
  anchor_shield_prb_reservation_pct: number
  sgnb_addition_threshold_dbm: number
  time_to_trigger_ms: number
  hysteresis_db: number
  inter_node_latency_ms: number
}

export interface MassiveMimoSector {
  site_id: string
  site_name: string
  azimuth_deg: number
  mechanical_tilt_deg: number
  electrical_tilt_deg: number
  horizontal_beamwidth_deg: number
  vertical_beamwidth_deg: number
  targeted_tier: string
  mu_mimo_layers: number
  tx_power_watts: number
  predicted_rsrp_dbm: number
  predicted_sinr_db: number
  spectral_efficiency_bps_hz: number
  antenna_spec: string
}

export interface CoverageTier {
  tier_id: string
  tier_name: string
  spectator_capacity: number
  active_five_g_users: number
  mean_distance_m: number
  path_loss_db: number
  baseline_rsrp_dbm: number
  proposed_rsrp_dbm: number
  baseline_sinr_db: number
  proposed_sinr_db: number
  coverage_status: 'OPTIMAL' | 'GOOD' | 'ACCEPTABLE'
  optimal_electrical_tilt_deg: number
  primary_serving_technology: string
}

export interface FallbackRootCause {
  id: string
  name: string
  prevalence_pct: number
  baseline_symptom: string
  telecom_root_cause: string
  engineering_mitigation: string
  mitigation_status: 'RESOLVED' | 'MITIGATED'
}

export interface RrmRecommendation {
  id: string
  category: 'EN-DC' | 'Beamforming' | 'Handover' | 'RRM' | 'Backhaul'
  parameter_name: string
  default_baseline: string
  recommended_setting: string
  technical_rationale: string
  impact_severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  confidence_score: number
}

export interface ConnectivitySimulationRequest {
  stadium_capacity?: number
  anchor_prb_reservation_pct?: number
  beam_tilt_optimization?: boolean
  small_cell_offload_pct?: number
  backhaul_upgrade?: boolean
}

export interface ConnectivitySimulationResponse {
  stadium_capacity: number
  projected_camping_rate_pct: number
  projected_sgnb_success_pct: number
  projected_median_dl_speed_mbps: number
  projected_median_ul_speed_mbps: number
  projected_avg_sinr_db: number
  projected_five_g_throughput_gbps: number
  status: string
  engineering_note: string
}
