/**
 * Airtel Stadium360 - Critical Services & UPI Protection Types
 */

export interface UpiReliabilityKpis {
  stadium_capacity: number
  total_match_transactions: number
  peak_transactions_per_minute: number
  total_gmv_lakhs: number
  baseline_upi_failure_rate_pct: number
  proposed_upi_failure_rate_pct: number
  baseline_radio_induced_failures: number
  proposed_radio_induced_failures: number
  external_bank_failures: number
  gmv_protected_lakhs: number
  transactions_saved: number
  baseline_ran_latency_ms: number
  proposed_ran_latency_ms: number
  baseline_packet_loss_pct: number
  proposed_packet_loss_pct: number
}

export interface QosSliceDefinition {
  slice_id: string
  service_name: string
  traffic_type: string
  five_qi: number
  qci_lte: number
  resource_type: string
  priority_level: number
  packet_delay_budget_ms: number
  packet_error_rate: string
  prb_reservation_pct: number
  dscp_marking: string
  preemption_capability: string
  active_status: string
}

export interface PaymentHopLatency {
  hop_number: number
  hop_name: string
  entity_owner: string
  baseline_latency_ms: number
  proposed_latency_ms: number
  variance_jitter_ms: number
  bottleneck_risk: 'CRITICAL' | 'MODERATE' | 'LOW'
  technical_description: string
}

export interface SiteUpiTelemetry {
  site_id: string
  site_name: string
  primary_merchants: string
  estimated_tx_volume: number
  baseline_failure_rate_pct: number
  proposed_failure_rate_pct: number
  baseline_failed_tx: number
  proposed_failed_tx: number
  gmv_at_risk_lakhs: number
  qos_queue_status: string
}

export interface CongestionResponsePolicy {
  policy_id: string
  policy_name: string
  trigger_condition: string
  action_description: string
  affected_bearers: string[]
  impact_on_user_experience: string
  execution_state: string
}

export interface CriticalServicesSimulationRequest {
  stadium_capacity?: number
  qos_slicing_enabled?: boolean
  prb_reservation_upi_pct?: number
  emergency_preemption_enabled?: boolean
  video_throttle_threshold_pct?: number
}

export interface CriticalServicesSimulationResponse {
  stadium_capacity: number
  projected_upi_failure_rate_pct: number
  projected_ran_latency_ms: number
  projected_packet_loss_pct: number
  emergency_call_success_rate_pct: number
  total_gmv_protected_lakhs: number
  status: string
  telecom_explanation: string
}
