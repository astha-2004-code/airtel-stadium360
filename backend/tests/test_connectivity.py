"""
Tests for 5G Connectivity Intelligence Engine & Endpoints
Verifies 5G accessibility KPIs, EN-DC architecture, 64T64R beamforming,
coverage tiers, 4G fallback diagnostics, RRM recommendations, and simulation.
"""
import pytest
from app.services.connectivity_engine import connectivity_engine
from app.schemas.connectivity import ConnectivitySimulationRequest
from app.api.v1.endpoints.connectivity import (
    get_connectivity_overview,
    get_endc_architecture,
    get_beamforming_sectors,
    get_coverage_tiers,
    get_fallback_root_causes,
    get_rrm_recommendations,
    simulate_connectivity,
)


def test_connectivity_kpis_baseline_vs_proposed():
    kpis = connectivity_engine.get_overview_kpis(capacity=100000)
    assert kpis.stadium_capacity == 100000
    assert kpis.airtel_fans == 40000
    assert kpis.five_g_capable_users == 28000
    # Verify baseline vs proposed gains
    assert kpis.baseline_camping_rate_pct < 40.0
    assert kpis.proposed_camping_rate_pct > 80.0
    assert kpis.proposed_sgnb_addition_rate_pct > 95.0
    assert kpis.proposed_median_dl_speed_mbps > 100.0
    assert kpis.proposed_avg_sinr_db > kpis.baseline_avg_sinr_db
    assert kpis.proposed_scg_drop_rate_pct < 1.0
    assert kpis.five_g_throughput_delivered_gbps > 15.0


def test_endc_architecture():
    endc = connectivity_engine.get_endc_architecture()
    assert "Option 3x" in endc.architecture_mode
    assert endc.master_node.technology.startswith("LTE")
    assert endc.master_node.spectrum_mhz == 70.0
    assert endc.secondary_node.technology == "5G New Radio (NR)"
    assert endc.secondary_node.spectrum_mhz == 100.0
    assert endc.anchor_shield_active is True
    assert endc.anchor_shield_prb_reservation_pct == 15.0
    assert endc.sgnb_addition_threshold_dbm == -112.0
    assert endc.time_to_trigger_ms == 120
    assert endc.hysteresis_db == 1.5


def test_massive_mimo_sectors():
    sectors = connectivity_engine.get_massive_mimo_sectors()
    assert len(sectors) == 8
    site_ids = [s.site_id for s in sectors]
    assert "S1" in site_ids
    assert "S8" in site_ids
    for s in sectors:
        assert 0.0 <= s.azimuth_deg < 360.0
        assert 15.0 <= s.electrical_tilt_deg <= 45.0
        assert s.mu_mimo_layers == 16
        assert s.tx_power_watts == 320.0
        assert s.predicted_sinr_db > 15.0
        assert s.spectral_efficiency_bps_hz > 4.0


def test_coverage_tiers():
    tiers = connectivity_engine.get_coverage_tiers()
    assert len(tiers) == 4
    tier_ids = [t.tier_id for t in tiers]
    assert "TIER_1_LOWER" in tier_ids
    assert "TIER_2_CLUB" in tier_ids
    assert "TIER_3_UPPER" in tier_ids
    assert "CONCOURSE_GATES" in tier_ids
    for t in tiers:
        assert t.proposed_rsrp_dbm > t.baseline_rsrp_dbm
        assert t.proposed_sinr_db > t.baseline_sinr_db
        assert t.optimal_electrical_tilt_deg > 0.0


def test_fallback_root_causes():
    causes = connectivity_engine.get_fallback_root_causes()
    assert len(causes) == 4
    total_prevalence = sum(c.prevalence_pct for c in causes)
    assert abs(total_prevalence - 100.0) < 0.1
    # Check that anchor exhaustion is the primary root cause
    anchor_cause = next(c for c in causes if "Anchor" in c.name)
    assert anchor_cause.prevalence_pct >= 40.0
    assert "PRB" in anchor_cause.telecom_root_cause


def test_rrm_recommendations():
    recs = connectivity_engine.get_rrm_recommendations()
    assert len(recs) >= 6
    categories = {r.category for r in recs}
    assert "EN-DC" in categories
    assert "Beamforming" in categories
    assert "Handover" in categories
    assert "RRM" in categories
    assert "Backhaul" in categories
    for r in recs:
        assert r.confidence_score >= 90.0


def test_connectivity_simulation():
    # Simulation with 0% PRB reservation (Anchor Shield disabled)
    res_unshielded = connectivity_engine.simulate_connectivity(
        ConnectivitySimulationRequest(
            stadium_capacity=100000,
            anchor_prb_reservation_pct=0.0,
            beam_tilt_optimization=False,
            backhaul_upgrade=False,
        )
    )
    assert res_unshielded.projected_camping_rate_pct < 45.0
    assert res_unshielded.status == "SEVERELY_DEGRADED"

    # Simulation with 15% PRB reservation (Anchor Shield active)
    res_shielded = connectivity_engine.simulate_connectivity(
        ConnectivitySimulationRequest(
            stadium_capacity=100000,
            anchor_prb_reservation_pct=15.0,
            beam_tilt_optimization=True,
            backhaul_upgrade=True,
        )
    )
    assert res_shielded.projected_camping_rate_pct > 80.0
    assert res_shielded.projected_median_dl_speed_mbps > 100.0
    assert res_shielded.status == "OPTIMIZED"


def test_connectivity_api_endpoints_direct():
    # Test get_connectivity_overview
    ov = get_connectivity_overview(capacity=100000)
    assert ov.stadium_capacity == 100000
    assert ov.proposed_camping_rate_pct > 80.0

    # Test get_endc_architecture
    endc = get_endc_architecture()
    assert endc.anchor_shield_active is True

    # Test get_beamforming_sectors
    sectors = get_beamforming_sectors()
    assert len(sectors) == 8

    # Test get_coverage_tiers
    tiers = get_coverage_tiers()
    assert len(tiers) == 4

    # Test get_fallback_root_causes
    causes = get_fallback_root_causes()
    assert len(causes) == 4

    # Test get_rrm_recommendations
    recs = get_rrm_recommendations()
    assert len(recs) >= 6

    # Test simulate_connectivity
    sim = simulate_connectivity(
        ConnectivitySimulationRequest(
            stadium_capacity=120000,
            anchor_prb_reservation_pct=18.0,
            beam_tilt_optimization=True,
            small_cell_offload_pct=40.0,
            backhaul_upgrade=True,
        )
    )
    assert sim.stadium_capacity == 120000
    assert sim.projected_camping_rate_pct > 80.0
    assert sim.status == "OPTIMIZED"
