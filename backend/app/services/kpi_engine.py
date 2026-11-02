"""
Airtel Stadium360 — Network Demand, Capacity, and KPI Engine
Calculates standard and dynamic telecom metrics based on case study equations.
"""

from typing import Dict, Any, List
from app.services.data_loader import (
    STADIUM_SITES,
    MATCH_MEASUREMENTS,
    UPI_FAILURES,
    get_measurements_by_phase,
)

TOTAL_BUDGET_INR = 40000000.0  # ₹4 Crore

def compute_executive_kpis(
    capacity: int = 100000,
    airtel_share: float = 0.40,
    device_share_5g: float = 0.70,
    peak_online_pct: float = 0.18,
    target_speed_5g_mbps: float = 5.0,
    target_speed_4g_mbps: float = 3.0,
    target_utilization: float = 0.80,
    phase: str = "Innings break",
    budget_allocated_inr: float = 0.0
) -> Dict[str, Any]:
    """
    Computes complete executive KPI card values adhering to Airtel SYNC specifications.
    """
    # 1. User & Device calculations
    airtel_spectators = int(capacity * airtel_share)
    spectators_5g_capable = int(airtel_spectators * device_share_5g)
    spectators_4g_only = airtel_spectators - spectators_5g_capable
    
    peak_active_users = int(airtel_spectators * peak_online_pct)
    active_5g_users = int(peak_active_users * device_share_5g)
    active_4g_users = peak_active_users - active_5g_users

    # 2. Demand calculations (Mbps -> Gbps)
    demand_5g_mbps = active_5g_users * target_speed_5g_mbps
    demand_4g_mbps = active_4g_users * target_speed_4g_mbps
    total_demand_mbps = demand_5g_mbps + demand_4g_mbps

    demand_5g_gbps = round(demand_5g_mbps / 1000.0, 3)
    demand_4g_gbps = round(demand_4g_mbps / 1000.0, 3)
    total_demand_gbps = round(total_demand_mbps / 1000.0, 3)

    # 3. Required capacity at target utilization (e.g. 80%)
    required_capacity_gbps = round(total_demand_gbps / target_utilization, 3)

    # 4. Phase-specific site observations from actual workbook data
    phase_data = get_measurements_by_phase(phase)
    if not phase_data:
        phase_data = get_measurements_by_phase("Innings break")

    # Actual 4G loads in this match phase
    loads_4g = [m["match_4g_load"] for m in phase_data]
    normal_loads_4g = [m["normal_4g_load"] for m in phase_data]
    
    # Scale load if capacity changes from historical 65k baseline
    # Historical match had 65,000 spectators
    baseline_crowd = 65000.0
    crowd_scale = capacity / baseline_crowd

    # Site-specific scaled loads capped at 99.9%
    site_utilizations = []
    congested_count = 0
    for m in phase_data:
        # Base observed match load
        obs_load = m["match_4g_load"]
        # When crowd is 1,00,000 vs 65,000, demand is higher; if unmitigated, all congested sites remain at ~99%
        effective_load = min(99.9, round(obs_load * (1.0 if obs_load >= 95 else min(1.5, crowd_scale)), 1))
        is_congested = effective_load >= (target_utilization * 100)
        if is_congested:
            congested_count += 1
        site_utilizations.append({
            "site": m["site"],
            "load_pct": effective_load,
            "normal_load_pct": m["normal_4g_load"],
            "speed_4g_mbps": m["match_4g_speed"],
            "speed_5g_mbps": m["match_5g_speed"],
            "success_5g_pct": m["match_5g_success"],
            "is_congested": is_congested
        })

    avg_utilization_pct = round(sum(s["load_pct"] for s in site_utilizations) / len(site_utilizations), 1)

    # 5. UPI payment failure rate for selected phase
    upi_record = next((u for u in UPI_FAILURES if u["phase"].lower() == phase.lower()), UPI_FAILURES[1])
    upi_failure_rate_pct = upi_record["match_upi_failure_pct"]
    normal_upi_rate_pct = upi_record["normal_upi_failure_pct"]

    # 6. Budget tracking
    remaining_budget_inr = max(0.0, TOTAL_BUDGET_INR - budget_allocated_inr)

    # Health status index (0 - 100)
    # Severe penalty for utilization > 80%, high UPI failure, low 5G connection success
    health_score = max(10, min(100, int(100 - (avg_utilization_pct - 50) * 1.5 - (upi_failure_rate_pct * 4))))
    health_status = "CRITICAL" if avg_utilization_pct >= 90 else "WARNING" if avg_utilization_pct >= 80 else "OPTIMAL"

    return {
        "stadium_capacity": capacity,
        "airtel_spectators": airtel_spectators,
        "spectators_5g_capable": spectators_5g_capable,
        "spectators_4g_only": spectators_4g_only,
        "active_airtel_users": peak_active_users,
        "active_5g_users": active_5g_users,
        "active_4g_users": active_4g_users,
        
        "demand_5g_gbps": demand_5g_gbps,
        "demand_4g_gbps": demand_4g_gbps,
        "total_demand_gbps": total_demand_gbps,
        "required_capacity_gbps": required_capacity_gbps,
        "target_utilization_pct": int(target_utilization * 100),
        
        "network_utilization_pct": avg_utilization_pct,
        "total_sites": len(STADIUM_SITES),
        "congested_sites_count": congested_count,
        "upi_failure_rate_pct": upi_failure_rate_pct,
        "normal_upi_rate_pct": normal_upi_rate_pct,
        
        "total_budget_inr": TOTAL_BUDGET_INR,
        "budget_allocated_inr": budget_allocated_inr,
        "budget_remaining_inr": remaining_budget_inr,
        "budget_cap_cr": 4.0,
        
        "health_score": health_score,
        "health_status": health_status,
        "match_phase": phase,
        "site_utilizations": site_utilizations
    }
