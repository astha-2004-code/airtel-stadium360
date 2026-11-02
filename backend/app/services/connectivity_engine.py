"""
Airtel Stadium360 - 5G Connectivity Intelligence Engine
Provides 5G accessibility modeling, 3GPP NSA Option 3x (EN-DC) architecture analysis,
64T64R Massive MIMO 3D beamforming steering, stadium tier coverage mapping,
4G fallback root-cause diagnostics, and Radio Resource Management (RRM) optimization.

Engineering Disclaimer:
All RRM parameter recommendations and beam-steering models are analytical simulations
designed for planning and operational guidance during stadium events. Live network
provisioning must follow Airtel OSS/EMS change control windows.
"""
from typing import Dict, List, Any
import math
from backend.app.schemas.connectivity import (
    ConnectivityKpis,
    EndcNode,
    EndcArchitecture,
    MassiveMimoSector,
    CoverageTier,
    FallbackRootCause,
    RrmRecommendation,
    ConnectivitySimulationRequest,
    ConnectivitySimulationResponse,
)
from backend.app.services.data_loader import get_stadium_sites


class ConnectivityEngine:
    """
    5G Accessibility & Connectivity Optimization Engine for Narendra Modi Stadium.
    Models 3.5 GHz Band n78 coverage, beamforming, EN-DC anchor protection,
    and 4G fallback prevention.
    """

    def __init__(self):
        self.sites = get_stadium_sites()

    def get_overview_kpis(self, capacity: int = 100000) -> ConnectivityKpis:
        """
        Computes summary 5G accessibility KPIs comparing historical baseline
        (unshielded, congested anchor) vs. Airtel Stadium360 proposed state.
        """
        airtel_share = 0.40
        five_g_device_share = 0.70
        peak_online_rate = 0.18

        airtel_fans = int(capacity * airtel_share)
        five_g_capable = int(airtel_fans * five_g_device_share)
        total_active_users = int(airtel_fans * peak_online_rate)

        # Baseline: Only 38.5% of 5G handsets successfully camped on 5G due to anchor PRB exhaustion
        # and SCG release. Remainder fell back to congested 4G.
        baseline_camping_rate = 38.5
        five_g_active_baseline = int(total_active_users * (baseline_camping_rate / 100.0) * five_g_device_share)

        # Proposed: Anchor Shield reserves signaling PRBs and fast-tracks SgNB Addition,
        # elevating camping rate to 86.2%
        proposed_camping_rate = 86.2
        five_g_active_proposed = int(total_active_users * (proposed_camping_rate / 100.0) * five_g_device_share)

        # Throughput calculations (target 5 Mbps, but 5G capacity delivers ~124 Mbps median)
        five_g_throughput_delivered = round(five_g_active_proposed * 5.0 / 1000.0 * 2.8, 2)  # Gbps with burst headroom

        return ConnectivityKpis(
            stadium_capacity=capacity,
            airtel_fans=airtel_fans,
            five_g_device_penetration_pct=70.0,
            five_g_capable_users=five_g_capable,
            baseline_camping_rate_pct=baseline_camping_rate,
            proposed_camping_rate_pct=proposed_camping_rate,
            baseline_sgnb_addition_rate_pct=64.2,
            proposed_sgnb_addition_rate_pct=98.4,
            baseline_median_dl_speed_mbps=14.2,
            proposed_median_dl_speed_mbps=124.6,
            baseline_median_ul_speed_mbps=1.8,
            proposed_median_ul_speed_mbps=22.4,
            baseline_avg_sinr_db=7.8,
            proposed_avg_sinr_db=18.5,
            baseline_scg_drop_rate_pct=8.7,
            proposed_scg_drop_rate_pct=0.45,
            five_g_active_users_baseline=five_g_active_baseline,
            five_g_active_users_proposed=five_g_active_proposed,
            five_g_throughput_delivered_gbps=five_g_throughput_delivered,
            spectrum_utilization_pct=72.4,
        )

    def get_endc_architecture(self) -> EndcArchitecture:
        """
        Returns the detailed 3GPP Rel-15 Option 3x (EN-DC) architecture specification
        with Anchor Shield PRB reservation configuration.
        """
        master_node = EndcNode(
            node_type="Master Node (MN)",
            technology="LTE-Advanced Pro (4G)",
            spectrum_mhz=70.0,
            frequency_bands=["Band 1 (2100 MHz FDD 10MHz)", "Band 3 (1800 MHz FDD 20MHz)", "Band 40 (2300 MHz TDD 40MHz)"],
            duplex_mode="Hybrid FDD/TDD Carrier Aggregation (3CC)",
            antenna_config="4T4R MIMO with Cross-Polarized Antennas",
            role="Control Plane Signaling Anchor (RRC, NAS, S1-C) & Legacy Fallback Data",
        )

        secondary_node = EndcNode(
            node_type="Secondary Node (SN)",
            technology="5G New Radio (NR)",
            spectrum_mhz=100.0,
            frequency_bands=["Band n78 (3500 MHz TDD)"],
            duplex_mode="TDD (2.5ms Slot Pattern 4:1 DL:UL ratio)",
            antenna_config="64T64R Active Antenna Unit (AAU) Massive MIMO",
            role="High-Throughput User Plane Data Payload (S1-U via Direct UPF)",
        )

        return EndcArchitecture(
            architecture_mode="3GPP Rel-15 Option 3x (Non-Standalone)",
            master_node=master_node,
            secondary_node=secondary_node,
            split_bearer_mode="SN-Terminated Split Bearer (User plane directly to 5G UPF)",
            user_plane_transport="10G/25G eCPRI Front-haul to High-Performance UPF",
            control_plane_transport="X2-C Interface over Protected Dark Fibre (latency < 1.5ms)",
            anchor_shield_active=True,
            anchor_shield_prb_reservation_pct=15.0,
            sgnb_addition_threshold_dbm=-112.0,
            time_to_trigger_ms=120,
            hysteresis_db=1.5,
            inter_node_latency_ms=1.2,
        )

    def get_massive_mimo_sectors(self) -> List[MassiveMimoSector]:
        """
        Returns sector-by-sector 64T64R Massive MIMO 3D beamforming orientations,
        mechanical and electrical down-tilts, targeted stadium bowl tiers,
        and MU-MIMO spatial multiplexing capabilities.
        """
        sector_definitions = [
            {
                "site_id": "S1",
                "site_name": "North Stand / Pavilion Macro",
                "azimuth": 0.0,
                "mech_tilt": 4.0,
                "elec_tilt": 28.0,
                "tier": "North Upper & Lower Pavilion",
                "rsrp": -78.5,
                "sinr": 19.4,
                "eff": 4.92,
            },
            {
                "site_id": "S2",
                "site_name": "South Stand Macro",
                "azimuth": 180.0,
                "mech_tilt": 4.0,
                "elec_tilt": 26.0,
                "tier": "South Upper Bowl & Hospitality",
                "rsrp": -79.2,
                "sinr": 18.8,
                "eff": 4.81,
            },
            {
                "site_id": "S3",
                "site_name": "East Stand Macro",
                "azimuth": 90.0,
                "mech_tilt": 3.5,
                "elec_tilt": 32.0,
                "tier": "East General Stand (Tier 1-3)",
                "rsrp": -81.0,
                "sinr": 17.6,
                "eff": 4.65,
            },
            {
                "site_id": "S4",
                "site_name": "West Stand Macro",
                "azimuth": 270.0,
                "mech_tilt": 3.5,
                "elec_tilt": 30.0,
                "tier": "West Club & Media Box Tiers",
                "rsrp": -77.8,
                "sinr": 20.2,
                "eff": 5.10,
            },
            {
                "site_id": "S5",
                "site_name": "North-East Upper Stand",
                "azimuth": 45.0,
                "mech_tilt": 5.0,
                "elec_tilt": 38.0,
                "tier": "North-East Tier 3 Upper Deck",
                "rsrp": -83.4,
                "sinr": 16.9,
                "eff": 4.45,
            },
            {
                "site_id": "S6",
                "site_name": "South-East Lower Stand",
                "azimuth": 135.0,
                "mech_tilt": 4.0,
                "elec_tilt": 22.0,
                "tier": "South-East Tier 1 Lower Bowl",
                "rsrp": -80.2,
                "sinr": 18.2,
                "eff": 4.75,
            },
            {
                "site_id": "S7",
                "site_name": "North-West Concourse / Gate 1",
                "azimuth": 315.0,
                "mech_tilt": 3.0,
                "elec_tilt": 18.0,
                "tier": "Gate 1 Plaza & Turnstiles",
                "rsrp": -76.4,
                "sinr": 21.0,
                "eff": 5.25,
            },
            {
                "site_id": "S8",
                "site_name": "South-West Concourse / Gate 2",
                "azimuth": 225.0,
                "mech_tilt": 3.0,
                "elec_tilt": 19.0,
                "tier": "Gate 2 Concourse & Food Court",
                "rsrp": -77.1,
                "sinr": 20.5,
                "eff": 5.18,
            },
        ]

        sectors: List[MassiveMimoSector] = []
        for s in sector_definitions:
            sectors.append(
                MassiveMimoSector(
                    site_id=s["site_id"],
                    site_name=s["site_name"],
                    azimuth_deg=s["azimuth"],
                    mechanical_tilt_deg=s["mech_tilt"],
                    electrical_tilt_deg=s["elec_tilt"],
                    horizontal_beamwidth_deg=65.0,
                    vertical_beamwidth_deg=6.5,
                    targeted_tier=s["tier"],
                    mu_mimo_layers=16,
                    tx_power_watts=320.0,
                    predicted_rsrp_dbm=s["rsrp"],
                    predicted_sinr_db=s["sinr"],
                    spectral_efficiency_bps_hz=s["eff"],
                    antenna_spec="Airtel 64T64R Active Antenna Unit (AAU) 3.5 GHz",
                )
            )
        return sectors

    def get_coverage_tiers(self) -> List[CoverageTier]:
        """
        Returns coverage and RF propagation parameters across the 4 physical tiers
        of Narendra Modi Stadium bowl.
        """
        return [
            CoverageTier(
                tier_id="TIER_1_LOWER",
                tier_name="Lower Bowl Tier 1",
                spectator_capacity=38000,
                active_five_g_users=2350,
                mean_distance_m=35.0,
                path_loss_db=74.2,
                baseline_rsrp_dbm=-86.5,
                proposed_rsrp_dbm=-75.2,
                baseline_sinr_db=9.2,
                proposed_sinr_db=20.4,
                coverage_status="OPTIMAL",
                optimal_electrical_tilt_deg=18.0,
                primary_serving_technology="64T64R Massive MIMO AAU + Under-Seat Micro-RRH",
            ),
            CoverageTier(
                tier_id="TIER_2_CLUB",
                tier_name="Club & Hospitality Suites",
                spectator_capacity=14000,
                active_five_g_users=1120,
                mean_distance_m=58.0,
                path_loss_db=81.0,
                baseline_rsrp_dbm=-89.0,
                proposed_rsrp_dbm=-77.8,
                baseline_sinr_db=8.5,
                proposed_sinr_db=19.8,
                coverage_status="OPTIMAL",
                optimal_electrical_tilt_deg=28.0,
                primary_serving_technology="64T64R AAU Focused Pencil Beams + Dedicated Small Cells",
            ),
            CoverageTier(
                tier_id="TIER_3_UPPER",
                tier_name="Upper Bowl Tier 3",
                spectator_capacity=36000,
                active_five_g_users=2100,
                mean_distance_m=95.0,
                path_loss_db=89.5,
                baseline_rsrp_dbm=-98.4,
                proposed_rsrp_dbm=-83.5,
                baseline_sinr_db=5.4,
                proposed_sinr_db=16.8,
                coverage_status="GOOD",
                optimal_electrical_tilt_deg=42.0,
                primary_serving_technology="Macro 64T64R High-Gain Down-Tilted Beams",
            ),
            CoverageTier(
                tier_id="CONCOURSE_GATES",
                tier_name="Concourse, Entry Gates & Fan Plazas",
                spectator_capacity=12000,
                active_five_g_users=564,
                mean_distance_m=25.0,
                path_loss_db=71.0,
                baseline_rsrp_dbm=-94.2,
                proposed_rsrp_dbm=-72.0,
                baseline_sinr_db=6.1,
                proposed_sinr_db=21.5,
                coverage_status="OPTIMAL",
                optimal_electrical_tilt_deg=12.0,
                primary_serving_technology="Street-Level 4T4R Micro Small Cells (Gate 1 & Gate 2)",
            ),
        ]

    def get_fallback_root_causes(self) -> List[FallbackRootCause]:
        """
        Deep-dive technical explanation of why 5G-capable devices stayed camped on 4G
        during previous events, and the specific telecom counter-measures deployed.
        """
        return [
            FallbackRootCause(
                id="RC-01",
                name="LTE Anchor Carrier PRB Exhaustion",
                prevalence_pct=42.0,
                baseline_symptom="5G devices stuck in 4G RRC_CONNECTED state; 5G icon flickers or never appears.",
                telecom_root_cause="In 3GPP Option 3x, SgNB Addition signaling requires LTE anchor PRBs. When 4G utilization hit 99%, eNodeB dropped X2-AP SgNB Addition Requests due to control channel saturation.",
                engineering_mitigation="Airtel Anchor Shield reserves 15% dedicated PRBs on LTE Band 1 (2100 MHz) exclusively for 5G NSA RRC signaling, guaranteeing 98.4% addition success.",
                mitigation_status="RESOLVED",
            ),
            FallbackRootCause(
                id="RC-02",
                name="Handset Uplink Coverage & Power Deficit",
                prevalence_pct=28.0,
                baseline_symptom="5G data transmission freezes during uploads; device de-registers to 4G within 30 seconds.",
                telecom_root_cause="3.5 GHz path loss is ~8-10 dB higher than sub-2GHz. While downlink benefits from +25 dBi AAU gain, UE uplink is limited to 23 dBm (200mW), causing PUCCH BLER > 10% and SCG Failure.",
                engineering_mitigation="Deployed 26 stadium Small Cells to shorten mean radio link distance by 45%, and activated dynamic PUSCH closed-loop power control with 2.5ms TDD UL slot allocation.",
                mitigation_status="RESOLVED",
            ),
            FallbackRootCause(
                id="RC-03",
                name="Suboptimal Handover Hysteresis & SCG Release",
                prevalence_pct=18.0,
                baseline_symptom="High 5G drop rate (8.7%) when spectators moved across tiers or stood up.",
                telecom_root_cause="Default B1 event thresholds (-105 dBm) with 320ms Time-to-Trigger caused premature SCG release during momentary human body shadowing.",
                engineering_mitigation="Optimized B1 event threshold to -112 dBm with 120ms Time-to-Trigger and 1.5 dB hysteresis margin, eliminating ping-pong and reducing drop rate to 0.45%.",
                mitigation_status="RESOLVED",
            ),
            FallbackRootCause(
                id="RC-04",
                name="Transport & Backhaul Scheduler Throttling",
                prevalence_pct=12.0,
                baseline_symptom="5G connected but speed dropped below 2 Mbps under peak crowd load.",
                telecom_root_cause="Sites S5 & S6 were backhaul-constrained at 1 Gbps. When NR user rate surged, backhaul buffer overflow caused TCP window collapse and scheduler de-prioritization.",
                engineering_mitigation="Installed 0.99 km dedicated Dark Fibre backhaul providing 10 Gbps uncompressed eCPRI front-haul / S1-U capacity.",
                mitigation_status="RESOLVED",
            ),
        ]

    def get_rrm_recommendations(self) -> List[RrmRecommendation]:
        """
        Actionable Radio Resource Management (RRM) configurations for Airtel engineers.
        """
        return [
            RrmRecommendation(
                id="RRM-01",
                category="EN-DC",
                parameter_name="anchorShieldPRBReserveRatio (B1)",
                default_baseline="0% (Shared dynamically with 4G best-effort traffic)",
                recommended_setting="15% Dedicated Reserved PRBs on Band 1 (2100 MHz)",
                technical_rationale="Protects RRC Connection Reconfiguration and X2-AP signaling from 4G data saturation, preventing SgNB addition drops.",
                impact_severity="CRITICAL",
                confidence_score=98.5,
            ),
            RrmRecommendation(
                id="RRM-02",
                category="Handover",
                parameter_name="eventB1ThresholdNR (dBm)",
                default_baseline="-105 dBm (Conservative)",
                recommended_setting="-112 dBm (Stadium Aggressive)",
                technical_rationale="Allows UEs to add 5G secondary cell in moderate coverage zones, maximizing 5G camping rate from 38.5% to 86.2%.",
                impact_severity="HIGH",
                confidence_score=95.0,
            ),
            RrmRecommendation(
                id="RRM-03",
                category="Handover",
                parameter_name="timeToTriggerB1 (ms)",
                default_baseline="320 ms",
                recommended_setting="120 ms",
                technical_rationale="Enables fast secondary cell addition in high-density stadium environments without waiting through prolonged measurement delays.",
                impact_severity="HIGH",
                confidence_score=94.2,
            ),
            RrmRecommendation(
                id="RRM-04",
                category="Beamforming",
                parameter_name="mimoBeamPatternTierElevation",
                default_baseline="Uniform 15° electrical tilt across all sectors",
                recommended_setting="Tiered electrical down-tilt (18° Lower, 28° Club, 42° Upper)",
                technical_rationale="Matches 3D vertical beamwidth (6.5°) exactly to stadium bowl rake angle, eliminating RF leakage and maximizing MU-MIMO SINR.",
                impact_severity="CRITICAL",
                confidence_score=97.0,
            ),
            RrmRecommendation(
                id="RRM-05",
                category="RRM",
                parameter_name="tddSlotPatternConfig (3.5 GHz)",
                default_baseline="Standard 3:1 DL:UL (5ms frame)",
                recommended_setting="2.5ms Slot Pattern (4:1 DL:UL with special subframe 10:2:2)",
                technical_rationale="Reduces HARQ round-trip latency by 50% and provides dedicated UL slots for 4K video uploads and social media posts.",
                impact_severity="HIGH",
                confidence_score=92.5,
            ),
            RrmRecommendation(
                id="RRM-06",
                category="Backhaul",
                parameter_name="transportQosProfile (eCPRI / S1-U)",
                default_baseline="Best-effort 1 Gbps shared interface",
                recommended_setting="10 Gbps Dedicated Fibre with Strict Priority for 5QI-1/5",
                technical_rationale="Prevents transport queue buffer overflow during peak celebrations, protecting IMS voice and UPI transactions.",
                impact_severity="CRITICAL",
                confidence_score=99.0,
            ),
        ]

    def simulate_connectivity(self, req: ConnectivitySimulationRequest) -> ConnectivitySimulationResponse:
        """
        Simulates 5G connectivity performance under variable inputs
        (stadium crowd, anchor PRB reservation, beam tilt optimization, small cell offload).
        """
        cap = req.stadium_capacity or 100000
        prb_res = req.anchor_prb_reservation_pct if req.anchor_prb_reservation_pct is not None else 15.0
        beam_opt = req.beam_tilt_optimization if req.beam_tilt_optimization is not None else True
        small_cell_offload = req.small_cell_offload_pct if req.small_cell_offload_pct is not None else 35.0
        backhaul = req.backhaul_upgrade if req.backhaul_upgrade is not None else True

        # Baseline camping rate calculation
        # If PRB reservation is 0, anchor saturation destroys camping rate
        prb_factor = min(1.0, prb_res / 15.0)
        beam_factor = 1.0 if beam_opt else 0.82
        backhaul_factor = 1.0 if backhaul else 0.75
        crowd_penalty = max(0.0, (cap - 100000) / 100000.0 * 0.12)

        # Base 5G camping rate
        if prb_res <= 1.0:
            camping_rate = round(max(32.0, 38.5 - crowd_penalty * 100.0), 1)
            sgnb_success = round(max(55.0, 64.2 - crowd_penalty * 100.0), 1)
            median_dl = round(14.2 * backhaul_factor, 1)
            median_ul = round(1.8, 1)
            sinr = round(7.8 * beam_factor, 1)
            status = "SEVERELY_DEGRADED"
            note = "Anchor PRB exhaustion: 5G compatible handsets cannot establish secondary connection; trapped on congested 4G."
        else:
            camping_rate = round(min(92.0, (38.5 + 47.7 * prb_factor * beam_factor) - crowd_penalty * 50.0), 1)
            sgnb_success = round(min(99.5, (64.2 + 34.2 * prb_factor)), 1)
            median_dl = round(min(145.0, (14.2 + 110.4 * beam_factor * backhaul_factor) * (1.0 - crowd_penalty * 0.4)), 1)
            median_ul = round(min(28.0, 22.4 * (1.0 - crowd_penalty * 0.3)), 1)
            sinr = round(min(22.0, (7.8 + 10.7 * beam_factor)), 1)
            status = "OPTIMIZED" if camping_rate >= 80.0 else "SUBOPTIMAL"
            note = f"Anchor Shield active ({prb_res}% PRB reserved). 5G accessibility maintained at {camping_rate}% under {cap:,} spectators."

        # Peak 5G throughput
        airtel_active_5g = int(cap * 0.40 * 0.70 * 0.18 * (camping_rate / 100.0))
        five_g_throughput = round(airtel_active_5g * (median_dl / 1000.0) * 0.35, 2)

        return ConnectivitySimulationResponse(
            stadium_capacity=cap,
            projected_camping_rate_pct=camping_rate,
            projected_sgnb_success_pct=sgnb_success,
            projected_median_dl_speed_mbps=median_dl,
            projected_median_ul_speed_mbps=median_ul,
            projected_avg_sinr_db=sinr,
            projected_five_g_throughput_gbps=five_g_throughput,
            status=status,
            engineering_note=note,
        )


connectivity_engine = ConnectivityEngine()
