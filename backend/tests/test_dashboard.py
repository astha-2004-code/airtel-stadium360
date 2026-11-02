from app.services.kpi_engine import compute_executive_kpis
from app.api.v1.endpoints.dashboard import (
    get_dashboard_kpis,
    get_traffic_split_chart,
    get_match_phase_load_chart,
    get_user_speed_trends,
    get_upi_failure_trends,
    get_capacity_vs_demand,
    get_congestion_alerts,
    get_recent_activity
)

def test_kpi_engine_calculation_exact_spec():
    """
    Test exact case study calculations for 1,00,000 spectators and 65,000 baseline.
    """
    # Baseline 65,000 match check (7 of 8 sites congested)
    baseline_kpis = compute_executive_kpis(capacity=65000, phase="Innings break")
    assert baseline_kpis["congested_sites_count"] == 7

    # 1,00,000 Final match check
    kpis = compute_executive_kpis(
        capacity=100000,
        airtel_share=0.40,
        device_share_5g=0.70,
        peak_online_pct=0.18,
        target_speed_5g_mbps=5.0,
        target_speed_4g_mbps=3.0,
        target_utilization=0.80,
        phase="Innings break"
    )

    # Airtel spectators = 100,000 * 40% = 40,000
    assert kpis["airtel_spectators"] == 40000
    # 5G capable = 40,000 * 70% = 28,000
    assert kpis["spectators_5g_capable"] == 28000
    # Peak active users = 40,000 * 18% = 7,200
    assert kpis["active_airtel_users"] == 7200
    # Active 5G users = 7,200 * 70% = 5,040
    assert kpis["active_5g_users"] == 5040
    # Active 4G users = 7,200 * 30% = 2,160
    assert kpis["active_4g_users"] == 2160
    # 5G demand = 5,040 * 5 Mbps = 25.2 Gbps
    assert kpis["demand_5g_gbps"] == 25.2
    # 4G demand = 2,160 * 3 Mbps = 6.48 Gbps
    assert kpis["demand_4g_gbps"] == 6.48
    # Total demand = 31.68 Gbps
    assert kpis["total_demand_gbps"] == 31.68
    # Required capacity @ 80% = 31.68 / 0.8 = 39.6 Gbps
    assert kpis["required_capacity_gbps"] == 39.6
    # Budget cap = ₹4.0 Crore
    assert kpis["budget_cap_cr"] == 4.0
    assert kpis["total_budget_inr"] == 40000000.0
    # UPI failure rate at innings break = 7.11%
    assert kpis["upi_failure_rate_pct"] == 7.11

def test_dashboard_kpis_endpoint():
    res = get_dashboard_kpis(capacity=100000)
    assert res["stadium_capacity"] == 100000
    assert res["airtel_spectators"] == 40000
    assert len(res["site_utilizations"]) == 8

def test_traffic_split_endpoint():
    res = get_traffic_split_chart(capacity=100000)
    assert len(res) == 4
    innings_break = next(p for p in res if p.phase == "Innings break")
    assert innings_break.demand_5g_gbps == 25.2
    assert innings_break.demand_4g_gbps == 6.48

def test_match_phase_load_endpoint():
    res = get_match_phase_load_chart()
    assert len(res) == 4
    innings = next(p for p in res if p.phase == "Innings break")
    # Average match load is heavily elevated (~87.7%) compared to normal day (~20.9%)
    assert innings.match_4g_load > 80.0
    assert innings.normal_4g_load < 30.0

def test_user_speed_trends_endpoint():
    res = get_user_speed_trends()
    assert len(res) == 4
    innings = next(p for p in res if p.phase == "Innings break")
    # Across sites during innings break, speeds fell from ~15.8 Mbps to ~1.9 Mbps average (and 0.9-1.0 Mbps on 7 sites)
    assert innings.match_4g_speed <= 2.5
    assert innings.normal_4g_speed >= 15.0

def test_upi_failure_trends_endpoint():
    res = get_upi_failure_trends()
    assert len(res) == 4
    innings = next(p for p in res if p.phase == "Innings break")
    assert innings.match_upi_failure_pct == 7.11
    assert innings.normal_upi_failure_pct == 1.23

def test_capacity_vs_demand_endpoint():
    res = get_capacity_vs_demand(capacity=100000)
    assert len(res) == 3
    total = next(c for c in res if "Total" in c.category)
    assert total.peak_demand_gbps == 31.68
    assert total.required_capacity_gbps == 39.6

def test_alerts_endpoint():
    res = get_congestion_alerts()
    assert len(res) >= 4
    critical_alerts = [a for a in res if a.severity == "critical"]
    assert len(critical_alerts) >= 2

def test_recent_activity_endpoint():
    res = get_recent_activity()
    assert len(res) >= 5
