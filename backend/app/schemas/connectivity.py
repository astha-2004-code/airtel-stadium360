"""
Airtel Stadium360 - 5G Connectivity Intelligence Schemas
Pydantic models for 5G accessibility, EN-DC architecture, 64T64R beamforming,
coverage tiers, 4G fallback diagnostics, and Radio Resource Management (RRM).
"""
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class ConnectivityKpis(BaseModel):
    stadium_capacity: int = Field(100000, description="Total stadium crowd size")
    airtel_fans: int = Field(40000, description="Airtel subscribers inside stadium")
    five_g_device_penetration_pct: float = Field(70.0, description="Percentage of 5G handsets")
    five_g_capable_users: int = Field(28000, description="Count of 5G handsets")
    
    # Camping rates
    baseline_camping_rate_pct: float = Field(38.5, description="Historical 5G camping rate during peak congestion")
    proposed_camping_rate_pct: float = Field(86.2, description="Optimized 5G camping rate with Anchor Shield")
    
    # Dual Connectivity Performance
    baseline_sgnb_addition_rate_pct: float = Field(64.2, description="Baseline SgNB Addition success rate")
    proposed_sgnb_addition_rate_pct: float = Field(98.4, description="Optimized SgNB Addition success rate")
    
    # User Experience speeds
    baseline_median_dl_speed_mbps: float = Field(14.2, description="Baseline 5G median downlink speed")
    proposed_median_dl_speed_mbps: float = Field(124.6, description="Optimized 5G median downlink speed")
    baseline_median_ul_speed_mbps: float = Field(1.8, description="Baseline 5G median uplink speed")
    proposed_median_ul_speed_mbps: float = Field(22.4, description="Optimized 5G median uplink speed")
    
    # RF Quality
    baseline_avg_sinr_db: float = Field(7.8, description="Baseline 5G SINR in dB")
    proposed_avg_sinr_db: float = Field(18.5, description="Optimized 5G SINR in dB")
    baseline_scg_drop_rate_pct: float = Field(8.7, description="Baseline Secondary Cell Group drop rate")
    proposed_scg_drop_rate_pct: float = Field(0.45, description="Optimized SCG drop rate")
    
    # Users & Capacity
    five_g_active_users_baseline: int = Field(1940, description="Concurrent active users on 5G baseline")
    five_g_active_users_proposed: int = Field(6134, description="Concurrent active users on 5G optimized")
    five_g_throughput_delivered_gbps: float = Field(19.85, description="Peak 5G throughput delivered")
    spectrum_utilization_pct: float = Field(72.4, description="Optimized 5G 100MHz n78 utilization")


class EndcNode(BaseModel):
    node_type: str = Field(..., description="Master Node (MN) or Secondary Node (SN)")
    technology: str = Field(..., description="LTE or 5G NR")
    spectrum_mhz: float = Field(..., description="Bandwidth in MHz")
    frequency_bands: List[str] = Field(..., description="List of 3GPP frequency bands")
    duplex_mode: str = Field(..., description="FDD or TDD")
    antenna_config: str = Field(..., description="MIMO configuration")
    role: str = Field(..., description="Role in EN-DC dual connectivity")


class EndcArchitecture(BaseModel):
    architecture_mode: str = Field("3GPP Rel-15 Option 3x (Non-Standalone)", description="EN-DC deployment option")
    master_node: EndcNode = Field(..., description="Master Node (LTE eNodeB)")
    secondary_node: EndcNode = Field(..., description="Secondary Node (5G gNodeB)")
    split_bearer_mode: str = Field("SN-Terminated Split Bearer", description="Bearer termination point")
    user_plane_transport: str = Field("10G/25G eCPRI to 5G UPF", description="User plane backhaul path")
    control_plane_transport: str = Field("X2-C Interface over Dark Fibre", description="Control plane signalling path")
    anchor_shield_active: bool = Field(True, description="Whether Anchor Shield PRB reservation is active")
    anchor_shield_prb_reservation_pct: float = Field(15.0, description="PRB reserved on LTE B1 for NSA signaling")
    sgnb_addition_threshold_dbm: float = Field(-112.0, description="B1 Event threshold in dBm")
    time_to_trigger_ms: int = Field(120, description="B1 measurement Time-To-Trigger in ms")
    hysteresis_db: float = Field(1.5, description="Handover hysteresis margin in dB")
    inter_node_latency_ms: float = Field(1.2, description="X2 interface latency between MN and SN")


class MassiveMimoSector(BaseModel):
    site_id: str = Field(..., description="Macro site identifier")
    site_name: str = Field(..., description="Site geographical name")
    azimuth_deg: float = Field(..., description="Antenna azimuth orientation in degrees")
    mechanical_tilt_deg: float = Field(..., description="Physical mechanical down-tilt")
    electrical_tilt_deg: float = Field(..., description="Digital/electrical remote down-tilt")
    horizontal_beamwidth_deg: float = Field(65.0, description="Horizontal beamwidth")
    vertical_beamwidth_deg: float = Field(6.5, description="Vertical 3D beamwidth")
    targeted_tier: str = Field(..., description="Physical bowl tier covered")
    mu_mimo_layers: int = Field(16, description="Concurrent spatial multiplexing layers")
    tx_power_watts: float = Field(320.0, description="Total RF output power in Watts")
    predicted_rsrp_dbm: float = Field(..., description="Mean RSRP in dBm")
    predicted_sinr_db: float = Field(..., description="Mean SINR in dB")
    spectral_efficiency_bps_hz: float = Field(..., description="Achievable spectral efficiency")
    antenna_spec: str = Field("Airtel 64T64R Active Antenna Unit (AAU) 3.5 GHz", description="Hardware model")


class CoverageTier(BaseModel):
    tier_id: str = Field(..., description="Unique zone code")
    tier_name: str = Field(..., description="Physical zone name")
    spectator_capacity: int = Field(..., description="Seat count in tier")
    active_five_g_users: int = Field(..., description="Active 5G devices in tier")
    mean_distance_m: float = Field(..., description="Distance from macro AAU in meters")
    path_loss_db: float = Field(..., description="Mean 3.5 GHz RF path loss")
    baseline_rsrp_dbm: float = Field(..., description="Baseline RSRP in dBm")
    proposed_rsrp_dbm: float = Field(..., description="Optimized RSRP in dBm")
    baseline_sinr_db: float = Field(..., description="Baseline SINR in dB")
    proposed_sinr_db: float = Field(..., description="Optimized SINR in dB")
    coverage_status: str = Field(..., description="EXCELLENT, GOOD, or ACCEPTABLE")
    optimal_electrical_tilt_deg: float = Field(..., description="Recommended AAU down-tilt")
    primary_serving_technology: str = Field(..., description="Serving layer (Macro AAU vs Small Cell)")


class FallbackRootCause(BaseModel):
    id: str = Field(..., description="Unique issue code")
    name: str = Field(..., description="Concise diagnostic title")
    prevalence_pct: float = Field(..., description="Percentage of fallbacks attributed")
    baseline_symptom: str = Field(..., description="Observed historical symptom")
    telecom_root_cause: str = Field(..., description="Underlying 3GPP technical cause")
    engineering_mitigation: str = Field(..., description="Deployed solution in Stadium360")
    mitigation_status: str = Field(..., description="RESOLVED or MITIGATED")


class RrmRecommendation(BaseModel):
    id: str = Field(..., description="Rule ID")
    category: str = Field(..., description="Domain category: EN-DC, Beamforming, Handover, RRM, Backhaul")
    parameter_name: str = Field(..., description="3GPP or vendor parameter identifier")
    default_baseline: str = Field(..., description="Default configuration in last event")
    recommended_setting: str = Field(..., description="Airtel Stadium360 optimized setting")
    technical_rationale: str = Field(..., description="Engineering explanation")
    impact_severity: str = Field(..., description="CRITICAL, HIGH, or MEDIUM")
    confidence_score: float = Field(..., description="Analytical model confidence (0-100)")


class ConnectivitySimulationRequest(BaseModel):
    stadium_capacity: Optional[int] = Field(100000, ge=10000, le=150000)
    anchor_prb_reservation_pct: Optional[float] = Field(15.0, ge=0.0, le=30.0)
    beam_tilt_optimization: Optional[bool] = Field(True)
    small_cell_offload_pct: Optional[float] = Field(35.0, ge=0.0, le=60.0)
    backhaul_upgrade: Optional[bool] = Field(True)


class ConnectivitySimulationResponse(BaseModel):
    stadium_capacity: int
    projected_camping_rate_pct: float
    projected_sgnb_success_pct: float
    projected_median_dl_speed_mbps: float
    projected_median_ul_speed_mbps: float
    projected_avg_sinr_db: float
    projected_five_g_throughput_gbps: float
    status: str
    engineering_note: str

