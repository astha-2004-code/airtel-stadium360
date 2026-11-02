"""
Airtel Stadium360 - Critical Services & UPI Protection Engine
Models UPI transaction reliability, Emergency SOS prioritization (5QI-1/QCI-1),
Mission-Critical Financial Signalling (5QI-5/QCI-5), end-to-end payment latency breakdowns,
site-by-site merchant telemetry, and automated congestion response policies.

Telecom Engineering Architecture:
Contrasts unmanaged best-effort bufferbloat (4,200ms RAN latency, 14.8% packet drop)
against 3GPP Rel-15/Rel-16 QoS slicing with Strict Priority Scheduling (SPQ),
reducing radio-induced transaction failure from 5.8% to 0.12%.
"""
from typing import Dict, List, Any
import math
from backend.app.schemas.critical_services import (
    UpiReliabilityKpis,
    QosSliceDefinition,
    PaymentHopLatency,
    SiteUpiTelemetry,
    CongestionResponsePolicy,
    CriticalServicesSimulationRequest,
    CriticalServicesSimulationResponse,
)
from backend.app.services.data_loader import get_stadium_sites


class CriticalServicesEngine:
    """
    Engine for modeling and optimizing critical traffic classes (UPI and Emergency Services)
    inside Narendra Modi Stadium during high-density match events.
    """

    def __init__(self):
        self.sites = get_stadium_sites()

    def get_upi_reliability_kpis(self, capacity: int = 100000) -> UpiReliabilityKpis:
        """
        Calculates baseline vs. proposed UPI transaction reliability metrics.
        Scales with total crowd capacity.
        """
        # Capacity scaling factor
        scale = capacity / 100000.0
        total_tx = int(48500 * scale)
        peak_tpm = int(850 * scale)
        avg_tx_val_inr = 500.0  # Mean stadium transaction (food, drinks, merchandise)
        total_gmv_lakhs = round((total_tx * avg_tx_val_inr) / 100000.0, 2)

        # Baseline: 7.0% failure rate
        baseline_failure_rate = 7.0
        total_baseline_failures = int(total_tx * (baseline_failure_rate / 100.0))
        
        # RAN vs External decomposition:
        # In baseline 7.0% failure:
        # - 5.8% is caused by RAN radio packet drop & bufferbloat timeouts (82.9% of all failures)
        # - 1.2% is caused by external NPCI switch throttle & bank core systems (17.1% of failures)
        baseline_radio_failures = int(total_tx * 0.058)
        external_bank_failures = total_baseline_failures - baseline_radio_failures

        # Proposed: 5QI-5 QoS slicing reserves 3% PRBs with Strict Priority Scheduling (SPQ).
        # RAN-induced failures drop to 0.12% (58 tx).
        proposed_radio_failures = int(total_tx * 0.0012)
        total_proposed_failures = proposed_radio_failures + external_bank_failures
        proposed_failure_rate = round((total_proposed_failures / total_tx) * 100.0, 2)

        transactions_saved = baseline_radio_failures - proposed_radio_failures
        gmv_protected_lakhs = round((transactions_saved * avg_tx_val_inr) / 100000.0, 2)

        return UpiReliabilityKpis(
            stadium_capacity=capacity,
            total_match_transactions=total_tx,
            peak_transactions_per_minute=peak_tpm,
            total_gmv_lakhs=total_gmv_lakhs,
            baseline_upi_failure_rate_pct=baseline_failure_rate,
            proposed_upi_failure_rate_pct=proposed_failure_rate,
            baseline_radio_induced_failures=baseline_radio_failures,
            proposed_radio_induced_failures=proposed_radio_failures,
            external_bank_failures=external_bank_failures,
            gmv_protected_lakhs=gmv_protected_lakhs,
            transactions_saved=transactions_saved,
            baseline_ran_latency_ms=4200.0,
            proposed_ran_latency_ms=42.5,
            baseline_packet_loss_pct=14.8,
            proposed_packet_loss_pct=0.08,
        )

    def get_qos_slices(self) -> List[QosSliceDefinition]:
        """
        Returns the 3-tier 3GPP QoS network slice architecture:
        1. Emergency / Public Safety (5QI-1 / QCI-1)
        2. Mission-Critical Financial / UPI (5QI-5 / QCI-5)
        3. General Mobile Broadband (5QI-9 / QCI-9)
        """
        return [
            QosSliceDefinition(
                slice_id="SLICE-EMERGENCY",
                service_name="Public Safety & Emergency SOS (112)",
                traffic_type="Emergency Voice & Telemetry",
                five_qi=1,
                qci_lte=1,
                resource_type="Guaranteed Bit Rate (GBR)",
                priority_level=2,
                packet_delay_budget_ms=100,
                packet_error_rate="10^-2 (Ultra-Reliable)",
                prb_reservation_pct=2.0,
                dscp_marking="Expedited Forwarding (EF / 46)",
                preemption_capability="May Trigger Pre-emption / Not Pre-emptable",
                active_status="ENFORCED",
            ),
            QosSliceDefinition(
                slice_id="SLICE-UPI-FINANCIAL",
                service_name="Mission-Critical UPI & Merchant Payments",
                traffic_type="Financial Signaling & Soundbox Webhooks",
                five_qi=5,
                qci_lte=5,
                resource_type="Non-GBR (High Priority SPQ)",
                priority_level=1,
                packet_delay_budget_ms=50,
                packet_error_rate="10^-6 (Zero-Drop Core)",
                prb_reservation_pct=3.0,
                dscp_marking="Assured Forwarding 41 (AF41 / 34)",
                preemption_capability="High Priority / Not Pre-emptable",
                active_status="ENFORCED",
            ),
            QosSliceDefinition(
                slice_id="SLICE-EMBB-GENERAL",
                service_name="General Mobile Broadband (eMBB)",
                traffic_type="Social Media, Video Streams & Web Browsing",
                five_qi=9,
                qci_lte=9,
                resource_type="Non-GBR (Best Effort)",
                priority_level=9,
                packet_delay_budget_ms=300,
                packet_error_rate="10^-3 (Standard)",
                prb_reservation_pct=95.0,
                dscp_marking="Best Effort (BE / 0)",
                preemption_capability="Pre-emptable under severe congestion",
                active_status="ACTIVE",
            ),
        ]

    def get_payment_hop_latencies(self) -> List[PaymentHopLatency]:
        """
        End-to-End multi-hop latency breakdown of a standard UPI transaction loop:
        Handset -> RAN Air Interface -> Mobile Core -> NPCI Switch -> Bank CBS -> Return.
        Contrasts historical bufferbloat against Airtel Stadium360 prioritized queue.
        """
        return [
            PaymentHopLatency(
                hop_number=1,
                hop_name="Radio Air Interface (Handset <-> eNodeB/gNodeB)",
                entity_owner="Airtel RAN",
                baseline_latency_ms=4200.0,
                proposed_latency_ms=42.5,
                variance_jitter_ms=8.5,
                bottleneck_risk="CRITICAL",
                technical_description="Historical bufferbloat due to unprioritized QCI-9 queuing with 4K video. Stadium360 5QI-5 Strict Priority Queue jumps packets directly to the MAC scheduler.",
            ),
            PaymentHopLatency(
                hop_number=2,
                hop_name="Stadium Optical Front-Haul & S1/N3 Core Backhaul",
                entity_owner="Airtel Transport",
                baseline_latency_ms=180.0,
                proposed_latency_ms=4.8,
                variance_jitter_ms=1.2,
                bottleneck_risk="MODERATE",
                technical_description="Upgraded 10 Gbps dark fibre with DSCP AF41 diffserv tag eliminates backhaul router buffer queuing delays.",
            ),
            PaymentHopLatency(
                hop_number=3,
                hop_name="Airtel 5G Core User Plane (UPF / PGW-U)",
                entity_owner="Airtel Core",
                baseline_latency_ms=25.0,
                proposed_latency_ms=12.0,
                variance_jitter_ms=2.0,
                bottleneck_risk="LOW",
                technical_description="High-throughput packet parsing with GTP-U acceleration and dedicated IP peering to national payment gateway.",
            ),
            PaymentHopLatency(
                hop_number=4,
                hop_name="NPCI National Switch & Routing Exchange",
                entity_owner="National Payments Corp of India",
                baseline_latency_ms=110.0,
                proposed_latency_ms=105.0,
                variance_jitter_ms=18.0,
                bottleneck_risk="MODERATE",
                technical_description="National UPI central switch orchestration. Governed by national transaction volume during prime-time matches (non-telco domain).",
            ),
            PaymentHopLatency(
                hop_number=5,
                hop_name="Remitter & Beneficiary Bank Core Banking (CBS)",
                entity_owner="Acquiring & Issuing Banks",
                baseline_latency_ms=135.0,
                proposed_latency_ms=121.0,
                variance_jitter_ms=25.0,
                bottleneck_risk="MODERATE",
                technical_description="Two-factor authentication, cryptographic ledger debit, and SMS notification trigger at the issuer bank server.",
            ),
        ]

    def get_site_upi_telemetry(self) -> List[SiteUpiTelemetry]:
        """
        Site-by-site UPI transaction volume, historical failure rate,
        and protected transaction values across all 8 stadium sites.
        """
        site_data = [
            {
                "site_id": "S1",
                "site_name": "North Stand / Pavilion Macro",
                "merchants": "VIP Lounge & Corporate Boxes",
                "tx": 4200,
                "base_fail": 5.4,
                "prop_fail": 1.05,
                "gmv": 31.5,
            },
            {
                "site_id": "S2",
                "site_name": "South Stand Macro",
                "merchants": "Hospitality & Premium Food Court",
                "tx": 6800,
                "base_fail": 6.8,
                "prop_fail": 1.10,
                "gmv": 44.2,
            },
            {
                "site_id": "S3",
                "site_name": "East Stand Macro",
                "merchants": "General Concession Stalls 1-12",
                "tx": 8100,
                "base_fail": 8.5,
                "prop_fail": 1.15,
                "gmv": 36.4,
            },
            {
                "site_id": "S4",
                "site_name": "West Stand Macro",
                "merchants": "Club House & Media Center",
                "tx": 5400,
                "base_fail": 5.8,
                "prop_fail": 1.08,
                "gmv": 32.4,
            },
            {
                "site_id": "S5",
                "site_name": "North-East Upper Stand",
                "merchants": "Upper Deck Beverage Stalls",
                "tx": 4900,
                "base_fail": 7.9,
                "prop_fail": 1.18,
                "gmv": 19.6,
            },
            {
                "site_id": "S6",
                "site_name": "South-East Lower Stand",
                "merchants": "Main Stadium Food Court (High Density)",
                "tx": 9800,
                "base_fail": 10.4,
                "prop_fail": 1.20,
                "gmv": 49.0,
            },
            {
                "site_id": "S7",
                "site_name": "North-West Concourse / Gate 1",
                "merchants": "Gate 1 Turnstiles & Merch Megastore",
                "tx": 4800,
                "base_fail": 5.2,
                "prop_fail": 1.02,
                "gmv": 16.8,
            },
            {
                "site_id": "S8",
                "site_name": "South-West Concourse / Gate 2",
                "merchants": "Gate 2 Parking & Street Vendors",
                "tx": 4500,
                "base_fail": 5.6,
                "prop_fail": 1.05,
                "gmv": 12.6,
            },
        ]

        result: List[SiteUpiTelemetry] = []
        for s in site_data:
            base_failed = int(s["tx"] * (s["base_fail"] / 100.0))
            prop_failed = int(s["tx"] * (s["prop_fail"] / 100.0))
            result.append(
                SiteUpiTelemetry(
                    site_id=s["site_id"],
                    site_name=s["site_name"],
                    primary_merchants=s["merchants"],
                    estimated_tx_volume=s["tx"],
                    baseline_failure_rate_pct=s["base_fail"],
                    proposed_failure_rate_pct=s["prop_fail"],
                    baseline_failed_tx=base_failed,
                    proposed_failed_tx=prop_failed,
                    gmv_at_risk_lakhs=s["gmv"],
                    qos_queue_status="PROTECTED",
                )
            )
        return result

    def get_congestion_policies(self) -> List[CongestionResponsePolicy]:
        """
        Returns automated network congestion response policies that trigger
        during stadium load spikes to protect critical communications.
        """
        return [
            CongestionResponsePolicy(
                policy_id="POL-01",
                policy_name="Critical Traffic Fast-Lane (5QI-5 Priority Scheduler)",
                trigger_condition="Always Active on All Sectors",
                action_description="eNodeB/gNodeB MAC scheduler allocates instantaneous transmission slots to 5QI-5 packets ahead of best-effort data, enforcing 50ms delay budget.",
                affected_bearers=["5QI-5 (UPI)", "5QI-1 (Voice SOS)"],
                impact_on_user_experience="Zero latency for payments and emergency calls.",
                execution_state="ACTIVE",
            ),
            CongestionResponsePolicy(
                policy_id="POL-02",
                policy_name="Dynamic Video Bitrate Shaping at 85% PRB Threshold",
                trigger_condition="Sector PRB Utilization > 85% for > 30 seconds",
                action_description="Temporarily throttles aggressive video pre-buffering (4K to 1080p) on 5QI-9 general traffic while reserving 5% PRB headroom for UPI and signaling.",
                affected_bearers=["5QI-9 (eMBB Social Video)"],
                impact_on_user_experience="Smooth video playback continues without stalling; prevents cell crash.",
                execution_state="ENABLED",
            ),
            CongestionResponsePolicy(
                policy_id="POL-03",
                policy_name="Merchant POS Terminal Directed Retry to Small Cells",
                trigger_condition="Concession Stand Queue Length > 50 simultaneous UEs",
                action_description="RRC connection steering moves merchant POS devices and soundboxes to dedicated under-counter micro-small cells, freeing macro capacity.",
                affected_bearers=["Merchant POS Soundboxes", "Payment Terminals"],
                impact_on_user_experience="Instant payment confirmation beep (< 1.5 seconds) for vendors.",
                execution_state="ENABLED",
            ),
            CongestionResponsePolicy(
                policy_id="POL-04",
                policy_name="Emergency Call Pre-emption Engine (ARP Priority 1)",
                trigger_condition="Incoming SOS Call (112 / Police / Medical)",
                action_description="Immediately pre-empts dormant background TCP connections if zero radio resource blocks are free, guaranteeing 100% emergency call setup.",
                affected_bearers=["5QI-1 (Emergency GBR)", "Pre-empts 5QI-9"],
                impact_on_user_experience="Life-safety priority: zero dropped emergency calls in stadium.",
                execution_state="ENABLED",
            ),
        ]

    def simulate_critical_services(
        self, req: CriticalServicesSimulationRequest
    ) -> CriticalServicesSimulationResponse:
        """
        Simulates UPI reliability and emergency service performance under variable inputs
        (capacity, QoS slicing enabled/disabled, PRB reservation, emergency pre-emption).
        """
        cap = req.stadium_capacity or 100000
        qos_enabled = req.qos_slicing_enabled if req.qos_slicing_enabled is not None else True
        prb_upi = req.prb_reservation_upi_pct if req.prb_reservation_upi_pct is not None else 3.0
        preempt = req.emergency_preemption_enabled if req.emergency_preemption_enabled is not None else True

        crowd_scale = cap / 100000.0

        if not qos_enabled or prb_upi <= 0.2:
            # Unshielded baseline behavior
            failure_rate = round(min(15.0, 7.0 * crowd_scale), 2)
            ran_latency = round(min(8000.0, 4200.0 * crowd_scale), 1)
            packet_loss = round(min(25.0, 14.8 * crowd_scale), 2)
            emergency_success = 88.4 if not preempt else 95.0
            gmv_saved = 0.0
            status = "CRITICAL_PAYMENT_COLLAPSE"
            explanation = "QoS slicing disabled: UPI packets are trapped in saturated 4G/5G best-effort queues. 7.0%+ failure rate with massive vendor payment timeouts."
        else:
            # Protected state
            prb_factor = min(1.0, prb_upi / 3.0)
            ran_latency = round(max(35.0, 42.5 / prb_factor), 1)
            packet_loss = round(max(0.04, 0.08 / prb_factor), 2)
            # Baseline failures avoided:
            radio_failures = 0.12 / prb_factor
            external_failures = 1.00  # constant national banking failure
            failure_rate = round(radio_failures + external_failures, 2)
            emergency_success = 99.98 if preempt else 97.5
            total_tx = int(48500 * crowd_scale)
            saved_tx = int(total_tx * (0.07 - (failure_rate / 100.0)))
            gmv_saved = round((saved_tx * 500.0) / 100000.0, 2)
            status = "PROTECTED"
            explanation = f"5QI-5 Priority Scheduler Active ({prb_upi}% PRBs reserved). Radio transit latency reduced to {ran_latency}ms. UPI failure constrained to {failure_rate}% (residual banking limit)."

        return CriticalServicesSimulationResponse(
            stadium_capacity=cap,
            projected_upi_failure_rate_pct=failure_rate,
            projected_ran_latency_ms=ran_latency,
            projected_packet_loss_pct=packet_loss,
            emergency_call_success_rate_pct=emergency_success,
            total_gmv_protected_lakhs=gmv_saved,
            status=status,
            telecom_explanation=explanation,
        )


critical_services_engine = CriticalServicesEngine()

