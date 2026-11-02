"""
Airtel Stadium360 - Critical Services & UPI Protection Schemas
Pydantic models for UPI transaction reliability, Emergency SOS prioritization,
3GPP 5QI/QCI QoS network slicing, end-to-end payment latency breakdowns,
site-by-site transaction telemetry, and automated congestion response policies.
"""
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class UpiReliabilityKpis(BaseModel):
    stadium_capacity: int = Field(100000, description="Total stadium crowd size")
    total_match_transactions: int = Field(48500, description="Estimated UPI transaction attempts during match")
    peak_transactions_per_minute: int = Field(850, description="Peak transaction frequency during innings break")
    total_gmv_lakhs: float = Field(242.5, description="Total Gross Merchandise Value in Lakhs")
    
    # Failure Rates
    baseline_upi_failure_rate_pct: float = Field(7.0, description="Historical failure rate during peak congestion")
    proposed_upi_failure_rate_pct: float = Field(1.12, description="Optimized failure rate with QoS prioritization")
    
    # RAN vs Non-RAN Breakdown
    baseline_radio_induced_failures: int = Field(2813, description="Failures caused by radio packet loss / bufferbloat")
    proposed_radio_induced_failures: int = Field(58, description="Failures remaining after QoS prioritization")
    external_bank_failures: int = Field(485, description="Residual failures due to NPCI / Bank Core switch downtimes")
    
    # Financial Impact
    gmv_protected_lakhs: float = Field(13.78, description="Financial transaction value saved from failure")
    transactions_saved: int = Field(2755, description="Count of merchant/fan payments saved")
    
    # Latency & Loss
    baseline_ran_latency_ms: float = Field(4200.0, description="Mean RAN air interface delay under bufferbloat")
    proposed_ran_latency_ms: float = Field(42.5, description="Mean RAN air interface delay with 5QI-5 priority queue")
    baseline_packet_loss_pct: float = Field(14.8, description="Air interface packet loss on best-effort bearer")
    proposed_packet_loss_pct: float = Field(0.08, description="Air interface packet loss on prioritized bearer")


class QosSliceDefinition(BaseModel):
    slice_id: str = Field(..., description="Unique slice identifier")
    service_name: str = Field(..., description="Service classification name")
    traffic_type: str = Field(..., description="Emergency, Financial, or General Mobile Broadband")
    five_qi: int = Field(..., description="3GPP 5G QoS Identifier (5QI)")
    qci_lte: int = Field(..., description="3GPP LTE QoS Class Identifier (QCI)")
    resource_type: str = Field(..., description="Guaranteed Bit Rate (GBR) or Non-GBR")
    priority_level: int = Field(..., description="3GPP priority level (1 = highest)")
    packet_delay_budget_ms: int = Field(..., description="Target packet delay budget in ms")
    packet_error_rate: str = Field(..., description="Target packet error rate")
    prb_reservation_pct: float = Field(..., description="Dedicated Physical Resource Block reservation %")
    dscp_marking: str = Field(..., description="IP Backhaul Differentiated Services Code Point")
    preemption_capability: str = Field(..., description="Pre-emption trigger setting")
    active_status: str = Field(..., description="ACTIVE or ENFORCED")


class PaymentHopLatency(BaseModel):
    hop_number: int = Field(..., description="Sequence in payment path")
    hop_name: str = Field(..., description="Network node / entity name")
    entity_owner: str = Field(..., description="Airtel RAN, Airtel Core, NPCI, or Bank")
    baseline_latency_ms: float = Field(..., description="Delay in milliseconds during historical peak")
    proposed_latency_ms: float = Field(..., description="Delay in milliseconds with Stadium360 QoS")
    variance_jitter_ms: float = Field(..., description="Delay variance")
    bottleneck_risk: str = Field(..., description="CRITICAL, MODERATE, or LOW")
    technical_description: str = Field(..., description="What happens at this hop")


class SiteUpiTelemetry(BaseModel):
    site_id: str = Field(..., description="Macro site ID (S1-S8)")
    site_name: str = Field(..., description="Site location")
    primary_merchants: str = Field(..., description="Commercial amenities covered")
    estimated_tx_volume: int = Field(..., description="Transactions attempted during match")
    baseline_failure_rate_pct: float = Field(..., description="Historical failure %")
    proposed_failure_rate_pct: float = Field(..., description="Optimized failure %")
    baseline_failed_tx: int = Field(..., description="Historical failed transactions")
    proposed_failed_tx: int = Field(..., description="Optimized failed transactions")
    gmv_at_risk_lakhs: float = Field(..., description="Transaction value processed in Lakhs")
    qos_queue_status: str = Field(..., description="PROTECTED or NORMAL")


class CongestionResponsePolicy(BaseModel):
    policy_id: str = Field(..., description="Unique policy identifier")
    policy_name: str = Field(..., description="Policy title")
    trigger_condition: str = Field(..., description="Threshold condition that activates policy")
    action_description: str = Field(..., description="Automated network response")
    affected_bearers: List[str] = Field(..., description="Targeted traffic classes")
    impact_on_user_experience: str = Field(..., description="Spectator perceived impact")
    execution_state: str = Field("ENABLED", description="ENABLED, ACTIVE, or STANDBY")


class CriticalServicesSimulationRequest(BaseModel):
    stadium_capacity: Optional[int] = Field(100000, ge=10000, le=150000)
    qos_slicing_enabled: Optional[bool] = Field(True)
    prb_reservation_upi_pct: Optional[float] = Field(3.0, ge=0.0, le=10.0)
    emergency_preemption_enabled: Optional[bool] = Field(True)
    video_throttle_threshold_pct: Optional[float] = Field(85.0, ge=70.0, le=98.0)


class CriticalServicesSimulationResponse(BaseModel):
    stadium_capacity: int
    projected_upi_failure_rate_pct: float
    projected_ran_latency_ms: float
    projected_packet_loss_pct: float
    emergency_call_success_rate_pct: float
    total_gmv_protected_lakhs: float
    status: str
    telecom_explanation: str
