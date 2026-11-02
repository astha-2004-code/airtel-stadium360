"""
Tests for Critical Services & UPI Protection Engine & Endpoints
Verifies UPI transaction reliability, Emergency SOS prioritization (5QI-1),
Mission-Critical Financial Signalling (5QI-5), end-to-end payment latency breakdowns,
site-by-site merchant telemetry, automated congestion policies, and simulation.
"""
import pytest
from app.services.critical_services_engine import critical_services_engine
from app.schemas.critical_services import CriticalServicesSimulationRequest
from app.api.v1.endpoints.critical_services import (
    get_upi_reliability,
    get_qos_slices,
    get_payment_hop_latencies,
    get_site_upi_telemetry,
    get_congestion_policies,
    simulate_critical_services,
)


def test_upi_reliability_kpis_baseline_vs_proposed():
    kpis = critical_services_engine.get_upi_reliability_kpis(capacity=100000)
    assert kpis.stadium_capacity == 100000
    assert kpis.total_match_transactions == 48500
    assert kpis.baseline_upi_failure_rate_pct == 7.0
    assert kpis.proposed_upi_failure_rate_pct < 1.5
    assert kpis.transactions_saved > 2500
    assert kpis.gmv_protected_lakhs > 10.0
    # Latency & Packet loss drop
    assert kpis.proposed_ran_latency_ms < 50.0
    assert kpis.baseline_ran_latency_ms >= 4000.0
    assert kpis.proposed_packet_loss_pct < 0.1
    # Check honest reporting: external banking failures remain accounted for
    assert kpis.external_bank_failures > 400


def test_qos_slices_definitions():
    slices = critical_services_engine.get_qos_slices()
    assert len(slices) == 3
    slice_ids = [s.slice_id for s in slices]
    assert "SLICE-EMERGENCY" in slice_ids
    assert "SLICE-UPI-FINANCIAL" in slice_ids
    assert "SLICE-EMBB-GENERAL" in slice_ids

    # Verify UPI slice 5QI-5 properties
    upi_slice = next(s for s in slices if s.slice_id == "SLICE-UPI-FINANCIAL")
    assert upi_slice.five_qi == 5
    assert upi_slice.qci_lte == 5
    assert upi_slice.priority_level == 1
    assert upi_slice.packet_delay_budget_ms <= 50
    assert upi_slice.prb_reservation_pct == 3.0

    # Verify Emergency slice 5QI-1 properties
    emergency_slice = next(s for s in slices if s.slice_id == "SLICE-EMERGENCY")
    assert emergency_slice.five_qi == 1
    assert "Guaranteed Bit Rate" in emergency_slice.resource_type


def test_payment_hop_latencies():
    hops = critical_services_engine.get_payment_hop_latencies()
    assert len(hops) == 5
    hop_1 = hops[0]
    assert "Radio Air Interface" in hop_1.hop_name
    assert hop_1.entity_owner == "Airtel RAN"
    assert hop_1.baseline_latency_ms >= 4000.0
    assert hop_1.proposed_latency_ms < 50.0

    # Non-RAN hops
    npci_hop = next(h for h in hops if "NPCI" in h.hop_name)
    assert npci_hop.baseline_latency_ms > 90.0
    bank_hop = next(h for h in hops if "Bank" in h.hop_name)
    assert bank_hop.baseline_latency_ms > 100.0


def test_site_upi_telemetry():
    sites = critical_services_engine.get_site_upi_telemetry()
    assert len(sites) == 8
    site_ids = [s.site_id for s in sites]
    assert "S1" in site_ids
    assert "S6" in site_ids

    # S6 is food court with highest transactions and highest baseline failure
    s6 = next(s for s in sites if s.site_id == "S6")
    assert s6.estimated_tx_volume >= 9000
    assert s6.baseline_failure_rate_pct > 10.0
    assert s6.proposed_failure_rate_pct < 1.5


def test_congestion_response_policies():
    policies = critical_services_engine.get_congestion_policies()
    assert len(policies) == 4
    pol_ids = [p.policy_id for p in policies]
    assert "POL-01" in pol_ids
    assert "POL-04" in pol_ids
    fast_lane = next(p for p in policies if p.policy_id == "POL-01")
    assert fast_lane.execution_state == "ACTIVE"


def test_critical_services_simulation():
    # Simulation with QoS slicing disabled
    res_disabled = critical_services_engine.simulate_critical_services(
        CriticalServicesSimulationRequest(
            stadium_capacity=100000,
            qos_slicing_enabled=False,
            prb_reservation_upi_pct=0.0,
            emergency_preemption_enabled=False,
        )
    )
    assert res_disabled.projected_upi_failure_rate_pct >= 7.0
    assert res_disabled.projected_ran_latency_ms >= 4000.0
    assert res_disabled.status == "CRITICAL_PAYMENT_COLLAPSE"

    # Simulation with QoS slicing enabled
    res_enabled = critical_services_engine.simulate_critical_services(
        CriticalServicesSimulationRequest(
            stadium_capacity=100000,
            qos_slicing_enabled=True,
            prb_reservation_upi_pct=3.0,
            emergency_preemption_enabled=True,
        )
    )
    assert res_enabled.projected_upi_failure_rate_pct < 1.5
    assert res_enabled.projected_ran_latency_ms < 50.0
    assert res_enabled.emergency_call_success_rate_pct > 99.0
    assert res_enabled.status == "PROTECTED"


def test_critical_services_api_endpoints_direct():
    # Test get_upi_reliability
    kpis = get_upi_reliability(capacity=100000)
    assert kpis.baseline_upi_failure_rate_pct == 7.0
    assert kpis.proposed_upi_failure_rate_pct < 1.5

    # Test get_qos_slices
    slices = get_qos_slices()
    assert len(slices) == 3

    # Test get_payment_hop_latencies
    hops = get_payment_hop_latencies()
    assert len(hops) == 5

    # Test get_site_upi_telemetry
    sites = get_site_upi_telemetry()
    assert len(sites) == 8

    # Test get_congestion_policies
    policies = get_congestion_policies()
    assert len(policies) == 4

    # Test simulate_critical_services
    sim = simulate_critical_services(
        CriticalServicesSimulationRequest(
            stadium_capacity=120000,
            qos_slicing_enabled=True,
            prb_reservation_upi_pct=4.0,
            emergency_preemption_enabled=True,
        )
    )
    assert sim.stadium_capacity == 120000
    assert sim.projected_upi_failure_rate_pct < 1.5
    assert sim.status == "PROTECTED"

