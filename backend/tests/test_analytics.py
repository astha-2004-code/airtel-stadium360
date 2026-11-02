"""
Unit and Integration Tests for Module 3: Network Demand and Capacity Engine
"""

import pytest
from app.services.demand_capacity_engine import (
    calculate_network_demand,
    get_match_phase_forecast,
    get_spectral_efficiency_breakdown,
)
from app.api.v1.endpoints.analytics import (
    get_demand_calculation,
    post_demand_calculation,
    get_site_capacity_breakdown,
    get_spectral_efficiency,
    get_match_phases,
    get_capacity_gap_summary,
)
from app.schemas.analytics import DemandCalculationRequest
from app.main import app

def test_demand_capacity_baseline_equations():
    """
    Tests exact mathematical formulas from the Airtel SYNC master case study:
    - 100,000 capacity
    - 40% Airtel share = 40,000 spectators
    - 70% 5G devices = 28,000 5G-capable
    - 18% peak online = 7,200 active users
    - Active 5G: 5,040, Active 4G: 2,160
    - 5G demand: 5,040 * 5 Mbps = 25.20 Gbps
    - 4G demand: 2,160 * 3 Mbps = 6.48 Gbps
    - Total demand: 31.68 Gbps
    - Required capacity @ 80%: 39.60 Gbps
    """
    result = calculate_network_demand(
        capacity=100000,
        airtel_share=0.40,
        device_share_5g=0.70,
        peak_online_pct=0.18,
        target_speed_5g_mbps=5.0,
        target_speed_4g_mbps=3.0,
        target_utilization=0.80,
    )

    spectators = result["spectators"]
    assert spectators["total_spectators"] == 100000
    assert spectators["airtel_spectators"] == 40000
    assert spectators["spectators_5g_capable"] == 28000
    assert spectators["spectators_4g_only"] == 12000

    active = result["active_users"]
    assert active["peak_active_airtel_users"] == 7200
    assert active["active_5g_users"] == 5040
    assert active["active_4g_users"] == 2160

    demand = result["throughput_demand_gbps"]
    assert demand["demand_5g"] == 25.20
    assert demand["demand_4g"] == 6.48
    assert demand["total_demand"] == 31.68

    req = result["capacity_requirements_gbps"]
    assert req["required_total_at_80_pct"] == 39.60
    assert req["required_5g_at_80_pct"] == 31.50
    assert req["required_4g_at_80_pct"] == 8.10

def test_demand_dynamic_scaling():
    """
    Tests dynamic scaling when judges adjust capacity to 120,000:
    - Airtel spectators = 48,000
    - Peak active = 8,640
    - Active 5G = 6,048, Active 4G = 2,592
    - Total demand = (6048*5 + 2592*3) / 1000 = 38.016 Gbps
    - Required capacity @ 80% = 47.52 Gbps
    """
    result = calculate_network_demand(
        capacity=120000,
        airtel_share=0.40,
        device_share_5g=0.70,
        peak_online_pct=0.18,
        target_speed_5g_mbps=5.0,
        target_speed_4g_mbps=3.0,
        target_utilization=0.80,
    )

    assert result["spectators"]["airtel_spectators"] == 48000
    assert result["active_users"]["peak_active_airtel_users"] == 8640
    assert result["active_users"]["active_5g_users"] == 6048
    assert result["active_users"]["active_4g_users"] == 2592
    assert result["throughput_demand_gbps"]["total_demand"] == 38.016
    assert result["capacity_requirements_gbps"]["required_total_at_80_pct"] == 47.52

def test_spectral_efficiency_breakdown():
    """
    Verifies practical vs theoretical throughput estimates under 3GPP channel assumptions.
    """
    spec = get_spectral_efficiency_breakdown()
    assert "spectrum_allocation" in spec
    assert "comparison" in spec
    assert len(spec["comparison"]) == 2

    nr_5g = spec["comparison"][0]
    assert nr_5g["theoretical_bps_hz"] == 7.5
    assert nr_5g["practical_bps_hz"] == 3.2
    assert nr_5g["practical_macro_gbps"] == 0.960

    lte_4g = spec["comparison"][1]
    assert lte_4g["theoretical_bps_hz"] == 4.0
    assert lte_4g["practical_bps_hz"] == 1.5
    assert lte_4g["practical_macro_gbps"] == 0.315

def test_site_capacity_bottlenecks():
    """
    Verifies site-level capacity analysis detects backhaul bottlenecks on M4, M6, S1, S2.
    """
    result = calculate_network_demand()
    sites = result["site_breakdowns"]
    assert len(sites) == 8

    site_map = {s["site_id"]: s for s in sites}

    # M4 & M6 have 2G Microwave bottlenecks
    assert site_map["M4"]["is_backhaul_constrained"] is True
    assert site_map["M4"]["backhaul_capacity_gbps"] == 2.0
    assert site_map["M6"]["is_backhaul_constrained"] is True

    # S1 & S2 have 1G Fibre bottlenecks
    assert site_map["S1"]["is_backhaul_constrained"] is True
    assert site_map["S1"]["backhaul_capacity_gbps"] == 1.0
    assert site_map["S2"]["is_backhaul_constrained"] is True

    # Total capacity deficit should be positive (unmitigated network cannot handle 100k)
    assert result["capacity_gap"]["total_site_deficit_gbps"] > 0

def test_match_phase_forecast():
    """
    Verifies forecast progression across all 4 match phases.
    """
    forecast = get_match_phase_forecast()
    assert len(forecast) == 4

    phases = [f["phase"] for f in forecast]
    assert "Crowd building up" in phases
    assert "Innings break" in phases
    assert "Final over" in phases
    assert "Post-match" in phases

    # Innings break should have the highest projected demand (18% online)
    innings_break = next(f for f in forecast if f["phase"] == "Innings break")
    assert innings_break["projected_demand_gbps"] == 31.68
    assert innings_break["historical_baseline"]["4g_load_pct"] == 98.6

def test_api_endpoints_direct():
    """
    Tests direct execution of analytics endpoints.
    """
    # GET calculation
    calc_res = get_demand_calculation(capacity=100000)
    assert calc_res["throughput_demand_gbps"]["total_demand"] == 31.68

    # POST calculation
    req = DemandCalculationRequest(capacity=100000, airtel_share=0.40)
    post_res = post_demand_calculation(payload=req)
    assert post_res["throughput_demand_gbps"]["total_demand"] == 31.68

    # Site breakdown
    breakdown = get_site_capacity_breakdown()
    assert len(breakdown) == 8

    # Spectral efficiency
    spec = get_spectral_efficiency()
    assert len(spec["comparison"]) == 2

    # Match phase forecast
    phases = get_match_phases()
    assert len(phases) == 4

    # Capacity gap summary
    gap = get_capacity_gap_summary()
    assert gap["required_total_gbps"] == 39.60
    assert gap["backhaul_bottleneck_sites_count"] == 4
