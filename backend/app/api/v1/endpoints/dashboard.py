"""
Airtel Stadium360 — Dashboard API Endpoints
Provides real-time telecom metrics, chart series, and congestion alerts.
"""

from typing import List, Optional
from typing_extensions import Annotated
from fastapi import APIRouter, Query
from app.schemas.dashboard import (
    DashboardKPIsResponse,
    TrafficSplitPoint,
    MatchPhaseLoadPoint,
    UserSpeedPoint,
    UpiFailurePoint,
    CapacityDemandPoint,
    AlertItem,
    ActivityEvent,
)
from app.services.kpi_engine import compute_executive_kpis
from app.services.data_loader import (
    STADIUM_SITES,
    MATCH_MEASUREMENTS,
    UPI_FAILURES,
    get_measurements_by_phase,
)

router = APIRouter()

@router.get("/kpis", response_model=DashboardKPIsResponse)
def get_dashboard_kpis(
    capacity: Annotated[int, Query(ge=10000, le=200000, description="Stadium total attendance")] = 100000,
    airtel_share: Annotated[float, Query(ge=0.05, le=1.0, description="Airtel subscriber share")] = 0.40,
    device_share_5g: Annotated[float, Query(ge=0.1, le=1.0, description="5G handset penetration")] = 0.70,
    peak_online_pct: Annotated[float, Query(ge=0.01, le=1.0, description="Concurrent active users share")] = 0.18,
    target_speed_5g: Annotated[float, Query(ge=1.0, le=50.0, description="Target speed 5G in Mbps")] = 5.0,
    target_speed_4g: Annotated[float, Query(ge=0.5, le=20.0, description="Target speed 4G in Mbps")] = 3.0,
    target_utilization: Annotated[float, Query(ge=0.5, le=0.95, description="Target utilization cap (default 80%)")] = 0.80,
    phase: Annotated[str, Query(description="Match timeline moment")] = "Innings break",
    budget_allocated: Annotated[float, Query(ge=0.0, description="Budget already allocated in INR")] = 0.0,
):
    """
    Computes all 11 executive KPI cards from actual workbook numbers and competition formula parameters.
    """
    kpis = compute_executive_kpis(
        capacity=capacity,
        airtel_share=airtel_share,
        device_share_5g=device_share_5g,
        peak_online_pct=peak_online_pct,
        target_speed_5g_mbps=target_speed_5g,
        target_speed_4g_mbps=target_speed_4g,
        target_utilization=target_utilization,
        phase=phase,
        budget_allocated_inr=budget_allocated,
    )
    return kpis

@router.get("/charts/traffic-split", response_model=List[TrafficSplitPoint])
def get_traffic_split_chart(
    capacity: Annotated[int, Query(description="Stadium capacity")] = 100000,
    airtel_share: Annotated[float, Query()] = 0.40,
    device_share_5g: Annotated[float, Query()] = 0.70,
    peak_online_pct: Annotated[float, Query()] = 0.18,
):
    """
    Returns 4G vs 5G traffic share and throughput demand across match phases.
    """
    phases = [
        ("Crowd building up", "17:00", 0.10),
        ("Innings break", "21:00", 0.18),
        ("Final over", "22:45", 0.16),
        ("Post-match", "23:15", 0.12),
    ]

    points = []
    airtel_users = capacity * airtel_share

    for p_name, t_str, act_pct in phases:
        active_total = airtel_users * act_pct
        active_5g = active_total * device_share_5g
        active_4g = active_total * (1.0 - device_share_5g)
        
        demand_5g = round((active_5g * 5.0) / 1000.0, 2)
        demand_4g = round((active_4g * 3.0) / 1000.0, 2)
        tot = demand_5g + demand_4g
        
        pct_5g = round((demand_5g / tot) * 100, 1) if tot > 0 else 70.0
        pct_4g = round(100.0 - pct_5g, 1)

        points.append(
            TrafficSplitPoint(
                phase=p_name,
                time=t_str,
                traffic_4g_pct=pct_4g,
                traffic_5g_pct=pct_5g,
                demand_4g_gbps=demand_4g,
                demand_5g_gbps=demand_5g
            )
        )
    return points

@router.get("/charts/match-phase-load", response_model=List[MatchPhaseLoadPoint])
def get_match_phase_load_chart():
    """
    Returns aggregated 4G load progression and UPI failure rates for normal vs match days.
    """
    phases = ["Crowd building up", "Innings break", "Final over", "Post-match"]
    times = {"Crowd building up": "17:00", "Innings break": "21:00", "Final over": "22:45", "Post-match": "23:15"}
    points = []

    for phase in phases:
        measurements = get_measurements_by_phase(phase)
        avg_normal_load = round(sum(m["normal_4g_load"] for m in measurements) / len(measurements), 1)
        avg_match_load = round(sum(m["match_4g_load"] for m in measurements) / len(measurements), 1)
        
        upi = next((u for u in UPI_FAILURES if u["phase"] == phase), None)
        normal_upi = upi["normal_upi_failure_pct"] if upi else 1.1
        match_upi = upi["match_upi_failure_pct"] if upi else 1.8

        points.append(
            MatchPhaseLoadPoint(
                phase=phase,
                time=times[phase],
                normal_4g_load=avg_normal_load,
                match_4g_load=avg_match_load,
                normal_upi_failure=normal_upi,
                match_upi_failure=match_upi
            )
        )
    return points

@router.get("/charts/user-speed-trends", response_model=List[UserSpeedPoint])
def get_user_speed_trends():
    """
    Compares 4G and 5G user speeds between normal day and match day across all phases.
    """
    phases = ["Crowd building up", "Innings break", "Final over", "Post-match"]
    times = {"Crowd building up": "17:00", "Innings break": "21:00", "Final over": "22:45", "Post-match": "23:15"}
    points = []

    for phase in phases:
        measurements = get_measurements_by_phase(phase)
        avg_normal_4g_speed = round(sum(m["normal_4g_speed"] for m in measurements) / len(measurements), 2)
        avg_match_4g_speed = round(sum(m["match_4g_speed"] for m in measurements) / len(measurements), 2)

        # 5G speeds for sites with 5G
        sites_with_5g = [m for m in measurements if m["normal_5g_speed"] is not None]
        avg_normal_5g_speed = round(sum(m["normal_5g_speed"] for m in sites_with_5g) / len(sites_with_5g), 2) if sites_with_5g else None
        avg_match_5g_speed = round(sum(m["match_5g_speed"] for m in sites_with_5g) / len(sites_with_5g), 2) if sites_with_5g else None

        points.append(
            UserSpeedPoint(
                phase=phase,
                time=times[phase],
                normal_4g_speed=avg_normal_4g_speed,
                match_4g_speed=avg_match_4g_speed,
                normal_5g_speed=avg_normal_5g_speed,
                match_5g_speed=avg_match_5g_speed
            )
        )
    return points

@router.get("/charts/upi-failure-trends", response_model=List[UpiFailurePoint])
def get_upi_failure_trends():
    """
    Returns observed UPI failure % with the SLA failure threshold.
    """
    points = []
    for u in UPI_FAILURES:
        points.append(
            UpiFailurePoint(
                phase=u["phase"],
                time=u["time"],
                normal_upi_failure_pct=u["normal_upi_failure_pct"],
                match_upi_failure_pct=u["match_upi_failure_pct"],
                threshold_pct=2.0
            )
        )
    return points

@router.get("/charts/capacity-vs-demand", response_model=List[CapacityDemandPoint])
def get_capacity_vs_demand(
    capacity: Annotated[int, Query()] = 100000,
    airtel_share: Annotated[float, Query()] = 0.40,
    device_share_5g: Annotated[float, Query()] = 0.70,
    peak_online_pct: Annotated[float, Query()] = 0.18,
):
    """
    Compares existing backhaul/RF capacity against peak demand and 80% target capacity.
    """
    airtel_users = capacity * airtel_share
    active_users = airtel_users * peak_online_pct
    active_5g = active_users * device_share_5g
    active_4g = active_users * (1.0 - device_share_5g)

    demand_5g = round((active_5g * 5.0) / 1000.0, 2)
    demand_4g = round((active_4g * 3.0) / 1000.0, 2)
    total_demand = round(demand_5g + demand_4g, 2)
    required_capacity_80 = round(total_demand / 0.80, 2)

    current_rf_capacity_5g = 12.80
    current_rf_capacity_4g = 4.20
    current_rf_total = current_rf_capacity_5g + current_rf_capacity_4g

    return [
        CapacityDemandPoint(
            category="5G Band (n78 - 100 MHz)",
            current_capacity_gbps=current_rf_capacity_5g,
            required_capacity_gbps=round(demand_5g / 0.80, 2),
            peak_demand_gbps=demand_5g
        ),
        CapacityDemandPoint(
            category="4G Bands (3 bands - 70 MHz)",
            current_capacity_gbps=current_rf_capacity_4g,
            required_capacity_gbps=round(demand_4g / 0.80, 2),
            peak_demand_gbps=demand_4g
        ),
        CapacityDemandPoint(
            category="Total Network Capacity",
            current_capacity_gbps=current_rf_total,
            required_capacity_gbps=required_capacity_80,
            peak_demand_gbps=total_demand
        ),
    ]

@router.get("/alerts", response_model=List[AlertItem])
def get_congestion_alerts():
    """
    Returns active alerts for network bottlenecks and critical service risks.
    """
    return [
        AlertItem(
            id="ALT-001",
            severity="critical",
            title="4G Anchor Cell Saturation (>98%)",
            description="Seven of eight sites reached 98%-99% 4G utilization during innings break. Spectator throughput collapsed from 16 Mbps to 1 Mbps.",
            site="M1, M2, M3, M4, M5, S1, S2",
            timestamp="21:00 (Innings break)"
        ),
        AlertItem(
            id="ALT-002",
            severity="critical",
            title="UPI Transaction Failure Surge (7.11%)",
            description="UPI payment failures at concession and food stalls rose from normal 1.08% baseline to 7.11% due to uplink packet loss on saturated 4G carrier.",
            site="Stadium Concourse & Gates",
            timestamp="21:00 (Innings break)"
        ),
        AlertItem(
            id="ALT-003",
            severity="warning",
            title="5G Connection Success Deterioration (35.2%)",
            description="64.8% of 5G handsets failed to establish Secondary Node Addition (EN-DC) due to 4G anchor signaling timeouts, leaving them trapped on 4G.",
            site="M1, M2, M3, M5",
            timestamp="21:00 (Innings break)"
        ),
        AlertItem(
            id="ALT-004",
            severity="warning",
            title="Backhaul Bottleneck on Microwave Sites",
            description="M4 and M6 operate on 2 Gbps microwave hops. S1 and S2 small cells have 1 Gbps fibre backhaul, incapable of hosting proposed 5G NR carriers.",
            site="M4, M6, S1, S2",
            timestamp="Permanent Constraint"
        ),
    ]

@router.get("/recent-activity", response_model=List[ActivityEvent])
def get_recent_activity():
    """
    Returns real-time network telemetry events feed.
    """
    return [
        ActivityEvent(
            id="EVT-101",
            type="TRAFFIC_SPIKE",
            message="Traffic spike detected at Innings Break: 7,200 concurrent active users online",
            site="All Sectors",
            time="21:00:15",
            status="CRITICAL"
        ),
        ActivityEvent(
            id="EVT-102",
            type="QOS_DEGRADATION",
            message="4G anchor B3 load reached 98.9% on M4. User speed collapsed to 0.9 Mbps",
            site="M4",
            time="21:00:45",
            status="ALERT"
        ),
        ActivityEvent(
            id="EVT-103",
            type="PAYMENT_ALERT",
            message="Concession POS transaction retry rate exceeded 18%. Failure rate 7.11%",
            site="East Stand Food Court",
            time="21:01:20",
            status="WARNING"
        ),
        ActivityEvent(
            id="EVT-104",
            type="5G_FAILURE",
            message="EN-DC B3+n78 addition failure rate 64.8%. Fallback to 4G triggered",
            site="M1 & M3",
            time="21:02:00",
            status="ALERT"
        ),
        ActivityEvent(
            id="EVT-105",
            type="TELEMETRY_SAMPLE",
            message="Site M6 load steady at 60.5% (North-West perimeter, lower crowd density)",
            site="M6",
            time="21:05:00",
            status="NORMAL"
        )
    ]
