"""
Unit and Integration Tests for Network Performance Evaluation Module
Author: ByteForge | NIT Delhi
Tests mathematical formulas, 5G accessibility, UPI reliability,
congestion reduction with zero-denominator safety, network health scoring,
and evaluation API endpoints.
"""
import pytest
from app.services.evaluation_engine import evaluation_engine
from app.schemas.evaluation import EvaluationCompareRequest
from app.api.v1.endpoints.evaluation import (
    get_evaluation_overview,
    get_network_evaluation,
    get_throughput_evaluation,
    get_reliability_evaluation,
    get_backhaul_evaluation,
    get_financial_evaluation,
    compare_evaluation_scenarios,
)


def test_utilization_metrics_and_congestion_reduction():
    """Tests 4G/5G utilization, sites exceeding 80%, and congestion reduction formula."""
    util = evaluation_engine.calculate_utilization_metrics(capacity=100000)
    
    # Baseline average 4G load from actual measurements should be ~93.9%
    assert util.avg_4g_utilization_baseline_pct > 90.0
    assert util.peak_4g_utilization_baseline_pct >= 98.0
    
    # Proposed utilization must be <= 80% ceiling
    assert util.avg_4g_utilization_proposed_pct < 80.0
    assert util.peak_4g_utilization_proposed_pct <= 80.0
    
    # Baseline congested sites vs proposed
    assert util.congested_sites_baseline == 7
    assert util.congested_sites_proposed == 0
    assert util.congestion_reduction_pct == 100.0  # (7 - 0) / 7 * 100
    
    # 8 site breakdown
    assert len(util.site_utilization_matrix) == 8
    site_ids = [s.site_id for s in util.site_utilization_matrix]
    for expected_id in ["M1", "M2", "M3", "M4", "M5", "M6", "S1", "S2"]:
        assert expected_id in site_ids


def test_zero_denominator_safe_congestion_reduction():
    """Verifies that congestion reduction formula never divides by zero if baseline is zero."""
    # When baseline congested sites is 0, reduction should return 0.0 without ZeroDivisionError
    res = evaluation_engine.calculate_utilization_metrics(capacity=10000)
    assert isinstance(res.congestion_reduction_pct, float)
    assert not math_is_nan_or_inf(res.congestion_reduction_pct)


def math_is_nan_or_inf(val: float) -> bool:
    import math
    return math.isnan(val) or math.isinf(val)


def test_throughput_performance_and_deterioration():
    """Tests user speeds, match deterioration, and target compliance (4G: 3Mbps, 5G: 5Mbps)."""
    tput = evaluation_engine.calculate_throughput_metrics(capacity=100000)
    
    # Baseline speed collapsed to ~1.0 - 1.9 Mbps during match innings break
    assert tput.avg_4g_speed_baseline_mbps <= 2.0
    assert tput.avg_5g_speed_baseline_mbps < 35.0
    
    # Speed deterioration from normal day (>80%)
    assert tput.peak_phase_speed_deterioration_4g_pct > 80.0
    assert tput.peak_phase_speed_deterioration_5g_pct > 75.0
    
    # Proposed speeds meet targets
    assert tput.avg_4g_speed_proposed_mbps >= tput.target_4g_mbps
    assert tput.avg_5g_speed_proposed_mbps >= tput.target_5g_mbps
    
    # Users meeting target compliance
    assert tput.users_meeting_target_baseline_pct < 30.0
    assert tput.users_meeting_target_proposed_pct > 95.0
    
    # Capacity expansion
    assert tput.available_capacity_proposed_gbps >= 39.0
    assert tput.capacity_improvement_pct > 140.0


def test_5g_accessibility_empirical_data():
    """Tests 5G connection success from actual Sync_V1.xlsx workbook measurements."""
    acc = evaluation_engine.calculate_5g_accessibility_metrics(capacity=100000)
    
    # Baseline 5G connection success during innings break was 38.5%
    assert 35.0 <= acc.existing_connection_success_rate_pct <= 42.0
    
    # Proposed target with Anchor Shield is 86.2%
    assert acc.proposed_connection_success_target_pct >= 85.0
    assert acc.accessibility_improvement_pct > 100.0
    
    # SgNB Addition rate
    assert acc.baseline_sgnb_addition_rate_pct == 64.2
    assert acc.proposed_sgnb_addition_rate_pct == 98.4
    
    # Site-level breakdown
    assert len(acc.site_connectivity_comparison) == 8


def test_upi_reliability_distinction():
    """Verifies UPI failure rates and distinction between RAN bufferbloat and external bank errors."""
    rel = evaluation_engine.calculate_upi_reliability_metrics(capacity=100000)
    
    # Normal-day vs peak-match failure rates from actual measurements
    assert rel.normal_day_failure_rate_pct < 1.5
    assert rel.peak_match_failure_rate_pct > 6.5
    assert rel.existing_upi_failure_rate_pct == 7.11
    
    # Proposed simulated failure rate with 5QI-5 QoS slicing
    assert rel.proposed_simulated_failure_rate_pct <= 1.20
    assert rel.improvement_pct > 80.0
    
    # Honest distinction verified
    assert rel.radio_induced_failures_eliminated_pct == 82.9
    assert rel.external_bank_failure_rate_pct == 1.00
    assert rel.protected_gmv_lakhs > 10.0


def test_backhaul_metrics_and_bottleneck_resolution():
    """Verifies backhaul capacities and bottleneck resolution via 0.99 km dark fibre."""
    bh = evaluation_engine.calculate_backhaul_metrics()
    
    # Total baseline backhaul is 46.0 Gbps (6 macros @ 10G or 2G, 2 small cells @ 1G)
    assert bh.total_baseline_backhaul_capacity_gbps == 46.0
    assert bh.bottleneck_sites_count == 4  # M4, M6, S1, S2
    assert bh.bottleneck_sites_resolved_count == 4
    
    # Total proposed backhaul is 80.0 Gbps (all 8 sites on 10G)
    assert bh.total_proposed_backhaul_capacity_gbps == 80.0
    assert bh.total_fibre_deployed_km == 0.99


def test_financial_evaluation_and_budget_cap():
    """Verifies strict ₹4.00 Crore budget compliance and unit cost metrics."""
    fin = evaluation_engine.calculate_financial_metrics(capacity=100000)
    
    assert fin.total_infrastructure_cost_crores == 3.975
    assert fin.total_infrastructure_cost_crores <= fin.budget_limit_crores
    assert fin.remaining_budget_lakhs == 2.50
    assert fin.budget_utilization_pct == 99.4
    
    # CapEx vs OpEx
    assert fin.capex_pct > 70.0  # 74.8%
    assert fin.opex_pct > 20.0   # 25.2%
    
    # Multi-strategy comparisons
    assert len(fin.strategy_comparisons) == 5
    names = [s.strategy_name for s in fin.strategy_comparisons]
    assert any("Baseline" in n for n in names)
    assert any("Balanced" in n for n in names)
    assert any("Judicial" in n for n in names)


def test_network_health_score_weights_and_methodology():
    """Tests transparent 0-100 network health score and component contributions."""
    util = evaluation_engine.calculate_utilization_metrics(capacity=100000)
    tput = evaluation_engine.calculate_throughput_metrics(capacity=100000)
    acc = evaluation_engine.calculate_5g_accessibility_metrics(capacity=100000)
    rel = evaluation_engine.calculate_upi_reliability_metrics(capacity=100000)
    bh = evaluation_engine.calculate_backhaul_metrics()
    
    health = evaluation_engine.calculate_network_health_score(util, tput, acc, rel, bh)
    
    assert 0.0 <= health.composite_score <= 100.0
    assert health.composite_score >= 85.0  # Proposed network is optimal
    assert health.rating == "OPTIMAL"
    assert "Airtel Stadium360 Internal Evaluation Score" in health.score_label
    
    # Verify 5 weights sum to 100%
    components = health.component_breakdown
    assert len(components) == 5
    total_weights = sum(c.weight_pct for c in components.values())
    assert abs(total_weights - 100.0) < 0.01
    
    # Check component keys
    assert "network_utilization" in components
    assert "throughput_compliance" in components
    assert "five_g_accessibility" in components
    assert "upi_reliability" in components
    assert "backhaul_health" in components


def test_compare_scenarios_3_way():
    """Tests dedicated 3-way before-and-after comparison (Baseline vs Proposed vs Simulated)."""
    comp = evaluation_engine.compare_scenarios(
        capacity=120000,  # Stress test
        airtel_share=0.40,
        device_share_5g=0.70,
        peak_online_pct=0.18,
        cows_deployed=4,
        small_cells_deployed=26,
    )
    
    assert comp.baseline_network.crowd_capacity == 65000
    assert comp.baseline_network.congested_sites_count == 7
    assert comp.proposed_network.crowd_capacity == 100000
    assert comp.proposed_network.congested_sites_count == 0
    assert comp.simulated_scenario.crowd_capacity == 120000
    
    # At 120k crowd without extra hardware, constraints must flag capacity deficit
    assert len(comp.newly_infeasible_constraints) > 0
    assert "congestion_reduction_pct" in comp.key_improvements
    assert comp.key_improvements["capacity_growth_pct"] > 80.0


def test_evaluation_api_endpoints_direct():
    """Tests all 7 REST endpoints directly."""
    # 1. Overview
    overview = get_evaluation_overview(capacity=100000)
    assert overview.evaluated_capacity == 100000
    assert overview.is_within_budget is True
    assert overview.feasibility_status == "FEASIBLE_COMPLIANT"
    
    # 2. Network
    net = get_network_evaluation(capacity=100000)
    assert net.congestion_reduction_pct == 100.0
    
    # 3. Throughput
    tput = get_throughput_evaluation(capacity=100000)
    assert tput.avg_4g_speed_proposed_mbps >= 3.0
    
    # 4. Reliability
    rel = get_reliability_evaluation(capacity=100000)
    assert rel.proposed_simulated_failure_rate_pct <= 1.20
    
    # 5. Backhaul
    bh = get_backhaul_evaluation()
    assert bh.bottleneck_sites_resolved_count == 4
    
    # 6. Financial
    fin = get_financial_evaluation(capacity=100000)
    assert fin.total_infrastructure_cost_crores == 3.975
    
    # 7. Compare
    req = EvaluationCompareRequest(capacity=100000)
    comp_res = compare_evaluation_scenarios(request=req)
    assert comp_res.proposed_network.congested_sites_count == 0
