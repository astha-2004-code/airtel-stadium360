"""
Unit and Integration Tests for Module 5: Interactive What-If Scenario Simulator
"""

import pytest
from app.services.simulator_engine import (
    simulate_network_scenario,
    compare_scenarios,
    get_preset_scenarios,
)
from app.schemas.simulator import SimulationRequest, SimulationComparisonRequest
from app.api.v1.endpoints.simulator import (
    get_simulate_scenario,
    post_simulate_scenario,
    post_compare_scenarios,
    get_presets,
)

def test_simulator_baseline_cascade():
    """
    Verifies baseline 100k scenario 10-step cascade:
    - 100k fans -> 40,000 Airtel -> 7,200 active -> 31.68 Gbps demand -> 39.60 Gbps req.
    """
    res = simulate_network_scenario(
        capacity=100000,
        airtel_share=0.40,
        device_share_5g=0.70,
        peak_online_pct=0.18,
        cows_deployed=4,
        small_cells_deployed=26,
        fibre_distance_km=0.99,
        five_g_overlays_count=4,
    )

    cas = res["cascade"]
    assert cas["step_1_airtel_spectators"]["airtel_spectators"] == 40000
    assert cas["step_2_active_users"]["peak_active_airtel_users"] == 7200
    assert cas["step_3_user_split"]["active_5g_users"] == 5040
    assert cas["step_3_user_split"]["active_4g_users"] == 2160
    assert cas["step_4_throughput_demand"]["total_demand_gbps"] == 31.68
    assert cas["step_5_required_capacity"]["required_capacity_gbps"] == 39.60
    assert cas["step_9_financial_impact"]["is_within_budget"] is True

def test_simulator_critical_demonstration_120k_crowd():
    """
    THE CRITICAL JUDICIAL DEMONSTRATION:
    When the judge changes stadium capacity from 100,000 to 120,000:
    1. Recalculate Airtel spectators: 120,000 * 40% = 48,000
    2. Recalculate active users: 48,000 * 18% = 8,640
    3. Recalculate 5G/4G user split: 5G = 6,048, 4G = 2,592
    4. Recalculate total throughput demand: (6048*5 + 2592*3)/1000 = 38.016 Gbps
    5. Recalculate required capacity @ 80%: 38.016 / 0.80 = 47.52 Gbps
    6. Evaluate whether deployed capacity meets demand: 29.85 Gbps < 47.52 Gbps -> DEFICIT
    7. Show utilization across all sites
    8. Show bottleneck indicators
    9. Show financial impact
    10. Show technical feasibility within budget
    """
    res = simulate_network_scenario(
        capacity=120000,
        airtel_share=0.40,
        device_share_5g=0.70,
        peak_online_pct=0.18,
        cows_deployed=4,
        small_cells_deployed=26,
        fibre_distance_km=0.99,
        five_g_overlays_count=4,
    )

    cas = res["cascade"]
    # 1. Airtel spectators
    assert cas["step_1_airtel_spectators"]["airtel_spectators"] == 48000
    # 2. Active users
    assert cas["step_2_active_users"]["peak_active_airtel_users"] == 8640
    # 3. User split
    assert cas["step_3_user_split"]["active_5g_users"] == 6048
    assert cas["step_3_user_split"]["active_4g_users"] == 2592
    # 4. Total throughput demand
    assert cas["step_4_throughput_demand"]["total_demand_gbps"] == 38.016
    # 5. Required capacity @ 80%
    assert cas["step_5_required_capacity"]["required_capacity_gbps"] == 47.52
    # 6. Evaluation
    assert cas["step_6_capacity_evaluation"]["status"] == "DEFICIT"
    assert cas["step_6_capacity_evaluation"]["capacity_gap_gbps"] > 15.0
    # 7. Utilization
    assert cas["step_7_utilization_metrics"]["overall_utilization_pct"] > 80.0
    # 8. Bottlenecks
    assert "has_backhaul_bottlenecks" in cas["step_8_bottlenecks"]
    # 9. Financial impact
    assert cas["step_9_financial_impact"]["total_cost_crores"] <= 4.0
    # 10. Feasibility
    assert cas["step_10_feasibility"]["is_feasible"] is False
    assert cas["step_10_feasibility"]["status"] == "CAPACITY_DEFICIT"

def test_simulator_side_by_side_comparison():
    """
    Verifies side-by-side delta calculation between 100k and 120k scenarios.
    """
    base = {"capacity": 100000, "airtel_share": 0.40}
    sim = {"capacity": 120000, "airtel_share": 0.40}

    comp = compare_scenarios(baseline_params=base, simulated_params=sim)
    deltas = comp["deltas"]

    assert deltas["capacity_spectators"] == 20000
    assert deltas["airtel_spectators"] == 8000
    assert deltas["active_users"] == 1440
    assert deltas["demand_gbps"] == 6.336
    assert deltas["required_capacity_gbps"] == 7.92

def test_simulator_presets():
    """
    Verifies that all 5 preset scenarios are populated with valid telecom parameters.
    """
    presets = get_preset_scenarios()
    assert len(presets) == 5

    preset_ids = [p["id"] for p in presets]
    assert "world-cup-baseline" in preset_ids
    assert "super-crowd-120k" in preset_ids
    assert "ipl-high-5g" in preset_ids
    assert "rain-delay-extreme" in preset_ids
    assert "budget-constrained" in preset_ids

def test_simulator_api_endpoints_direct():
    """
    Tests direct execution of simulator REST endpoints.
    """
    # GET simulate
    get_res = get_simulate_scenario(capacity=100000)
    assert get_res["cascade"]["step_1_airtel_spectators"]["airtel_spectators"] == 40000

    # POST simulate
    req = SimulationRequest(capacity=120000)
    post_res = post_simulate_scenario(payload=req)
    assert post_res["cascade"]["step_1_airtel_spectators"]["airtel_spectators"] == 48000

    # POST compare
    comp_req = SimulationComparisonRequest(
        baseline=SimulationRequest(capacity=100000),
        simulated=SimulationRequest(capacity=120000),
    )
    comp_res = post_compare_scenarios(payload=comp_req)
    assert comp_res["deltas"]["capacity_spectators"] == 20000

    # GET presets
    presets_res = get_presets()
    assert len(presets_res) == 5

