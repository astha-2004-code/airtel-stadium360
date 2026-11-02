"""
Airtel Stadium360 — Interactive What-If Simulation Engine
Executes live mathematical modeling, multi-variable scenario simulation,
10-step cascade recalculation, and side-by-side delta comparisons.
"""

from typing import Dict, Any, List, Optional
import numpy as np
from app.services.data_loader import STADIUM_SITES
from app.services.demand_capacity_engine import (
    SPECTRUM_CONFIG,
    SITE_DISTRIBUTION_WEIGHTS,
)
from app.services.optimizer_engine import (
    COST_COW_LAKHS,
    COST_SMALL_CELL_LAKHS,
    COST_FIBRE_PER_KM_LAKHS,
    COST_5G_OVERLAY_PER_MACRO_LAKHS,
    CAPACITY_COW_GBPS,
    CAPACITY_SMALL_CELL_GBPS,
    CAPACITY_5G_MACRO_OVERLAY_GBPS,
    SITE_UPGRADE_PROFILES,
)

PRESET_SCENARIOS = [
    {
        "id": "world-cup-baseline",
        "name": "World Cup Final (Recommended SLA)",
        "description": "Standard 100k World Cup final match with recommended ₹3.975 Cr infrastructure deployment.",
        "params": {
            "capacity": 100000,
            "airtel_share": 0.40,
            "device_share_5g": 0.70,
            "peak_online_pct": 0.18,
            "target_speed_5g_mbps": 5.0,
            "target_speed_4g_mbps": 3.0,
            "target_utilization": 0.80,
            "cows_deployed": 4,
            "small_cells_deployed": 26,
            "fibre_distance_km": 0.99,
            "five_g_overlays_count": 4,
        }
    },
    {
        "id": "super-crowd-120k",
        "name": "Judicial Stress Test: 120,000 Crowd",
        "description": "Capacity increased to 120,000 spectators to evaluate network saturation and capacity deficits.",
        "params": {
            "capacity": 120000,
            "airtel_share": 0.40,
            "device_share_5g": 0.70,
            "peak_online_pct": 0.18,
            "target_speed_5g_mbps": 5.0,
            "target_speed_4g_mbps": 3.0,
            "target_utilization": 0.80,
            "cows_deployed": 4,
            "small_cells_deployed": 26,
            "fibre_distance_km": 0.99,
            "five_g_overlays_count": 4,
        }
    },
    {
        "id": "ipl-high-5g",
        "name": "IPL Opening Ceremony / High 5G Adoption",
        "description": "85% 5G device penetration with high user demand target (8 Mbps 5G).",
        "params": {
            "capacity": 100000,
            "airtel_share": 0.45,
            "device_share_5g": 0.85,
            "peak_online_pct": 0.22,
            "target_speed_5g_mbps": 8.0,
            "target_speed_4g_mbps": 3.0,
            "target_utilization": 0.80,
            "cows_deployed": 6,
            "small_cells_deployed": 32,
            "fibre_distance_km": 1.50,
            "five_g_overlays_count": 4,
        }
    },
    {
        "id": "rain-delay-extreme",
        "name": "Rain Delay / Extended Concurrency",
        "description": "Extended match delay causing 28% simultaneous active concurrency as fans stream videos and message.",
        "params": {
            "capacity": 100000,
            "airtel_share": 0.40,
            "device_share_5g": 0.70,
            "peak_online_pct": 0.28,
            "target_speed_5g_mbps": 5.0,
            "target_speed_4g_mbps": 3.0,
            "target_utilization": 0.80,
            "cows_deployed": 4,
            "small_cells_deployed": 26,
            "fibre_distance_km": 0.99,
            "five_g_overlays_count": 4,
        }
    },
    {
        "id": "budget-constrained",
        "name": "Low Budget Cap (₹2.50 Cr)",
        "description": "Deployment strictly limited to ₹2.50 Crore to demonstrate trade-offs and bottleneck risks.",
        "params": {
            "capacity": 100000,
            "airtel_share": 0.40,
            "device_share_5g": 0.70,
            "peak_online_pct": 0.18,
            "target_speed_5g_mbps": 5.0,
            "target_speed_4g_mbps": 3.0,
            "target_utilization": 0.80,
            "cows_deployed": 2,
            "small_cells_deployed": 14,
            "fibre_distance_km": 0.46,
            "five_g_overlays_count": 2,
        }
    }
]

def simulate_network_scenario(
    capacity: int = 100000,
    airtel_share: float = 0.40,
    device_share_5g: float = 0.70,
    peak_online_pct: float = 0.18,
    target_speed_5g_mbps: float = 5.0,
    target_speed_4g_mbps: float = 3.0,
    target_utilization: float = 0.80,
    budget_cap_crores: float = 4.0,
    cows_deployed: int = 4,
    small_cells_deployed: int = 26,
    fibre_distance_km: float = 0.99,
    five_g_overlays_count: int = 4,
) -> Dict[str, Any]:
    """
    Executes the exact 10-Step Mathematical Cascade required by the master prompt:
    1. Recalculate Airtel spectators.
    2. Recalculate active users.
    3. Recalculate 5G/4G user split.
    4. Recalculate total throughput demand.
    5. Recalculate required capacity.
    6. Evaluate whether deployed capacity meets demand.
    7. Show utilization across all sites.
    8. Show bottleneck indicators.
    9. Show financial impact.
    10. Show whether deployment is technically feasible within the budget.
    """
    # Step 1: Recalculate Airtel spectators
    airtel_spectators = int(capacity * airtel_share)
    spectators_5g_capable = int(airtel_spectators * device_share_5g)
    spectators_4g_only = airtel_spectators - spectators_5g_capable

    # Step 2: Recalculate active users
    peak_active_airtel_users = int(airtel_spectators * peak_online_pct)

    # Step 3: Recalculate 5G/4G user split
    active_5g_users = int(peak_active_airtel_users * device_share_5g)
    active_4g_users = int(peak_active_airtel_users * (1.0 - device_share_5g))

    # Step 4: Recalculate total throughput demand
    demand_5g_mbps = active_5g_users * target_speed_5g_mbps
    demand_4g_mbps = active_4g_users * target_speed_4g_mbps
    total_demand_mbps = demand_5g_mbps + demand_4g_mbps

    demand_5g_gbps = round(demand_5g_mbps / 1000.0, 3)
    demand_4g_gbps = round(demand_4g_mbps / 1000.0, 3)
    total_demand_gbps = round(total_demand_mbps / 1000.0, 3)

    # Step 5: Recalculate required capacity at target utilization (e.g. 80%)
    required_capacity_gbps = round(total_demand_gbps / target_utilization, 3)
    required_capacity_5g_gbps = round(demand_5g_gbps / target_utilization, 3)
    required_capacity_4g_gbps = round(demand_4g_gbps / target_utilization, 3)

    # Base installed capacity from existing 8 sites: 6.03 Gbps
    base_installed_rf_gbps = 6.03

    # Additional capacity from deployment variables:
    added_cow_cap = cows_deployed * CAPACITY_COW_GBPS
    added_sc_cap = small_cells_deployed * CAPACITY_SMALL_CELL_GBPS
    # 5G overlays on M4, M6 (+0.960 each) and S1, S2 (+0.600 each)
    added_overlay_cap = min(2, five_g_overlays_count) * CAPACITY_5G_MACRO_OVERLAY_GBPS + max(0, min(2, five_g_overlays_count - 2)) * CAPACITY_SMALL_CELL_GBPS
    total_added_cap = round(added_cow_cap + added_sc_cap + added_overlay_cap, 3)
    total_deployed_capacity_gbps = round(base_installed_rf_gbps + total_added_cap, 3)

    # Step 6: Evaluate whether deployed capacity meets demand
    capacity_gap_gbps = round(required_capacity_gbps - total_deployed_capacity_gbps, 3)
    capacity_surplus_deficit = "SURPLUS" if capacity_gap_gbps <= 0 else "DEFICIT"
    meets_capacity_sla = capacity_gap_gbps <= 0

    # Overall Post-Deployment Utilization
    overall_utilization_pct = round(min(120.0, (total_demand_gbps / max(0.1, total_deployed_capacity_gbps)) * 100), 1)

    # Step 7: Show utilization across all sites & Step 8: Bottleneck indicators
    site_simulations = []
    has_backhaul_bottlenecks = False
    congested_sites_count = 0

    cow_absorption_factor = 0.75 if cows_deployed > 0 else 1.0

    for site in STADIUM_SITES:
        sid = site["site_id"]
        is_macro = site["type"] == "Macro"
        orig_cap = SPECTRUM_CONFIG["4G"]["macro_practical_capacity_gbps"] if is_macro else SPECTRUM_CONFIG["4G"]["small_cell_capacity_gbps"]
        if site["has_5g"]:
            orig_cap += SPECTRUM_CONFIG["5G"]["macro_practical_capacity_gbps"]

        # Was backhaul upgraded?
        is_fiber_upgraded = (
            (sid in ["M4", "M6"] and fibre_distance_km >= 0.83) or
            (sid in ["S1", "S2"] and fibre_distance_km >= 0.16) or
            fibre_distance_km >= 0.99
        )
        # Backhaul limit
        backhaul_cap = 10.0 if is_fiber_upgraded else site["backhaul_capacity_gbps"]

        # Was 5G overlay installed?
        has_5g_overlay = (
            (sid in ["M4", "M6"] and five_g_overlays_count >= 2 and is_fiber_upgraded) or
            (sid in ["S1", "S2"] and five_g_overlays_count >= 4 and is_fiber_upgraded)
        )
        site_has_5g = site["has_5g"] or has_5g_overlay

        # Added capacity to this site
        site_added_cap = 0.0
        if has_5g_overlay:
            site_added_cap += CAPACITY_5G_MACRO_OVERLAY_GBPS if is_macro else CAPACITY_SMALL_CELL_GBPS
        if sid in ["S1", "S2"]:
            # Distributed small cells
            sc_share = small_cells_deployed // 2
            site_added_cap += sc_share * CAPACITY_SMALL_CELL_GBPS

        final_site_rf = round(orig_cap + site_added_cap, 3)
        usable_site_throughput = min(final_site_rf, backhaul_cap)

        weight = SITE_DISTRIBUTION_WEIGHTS.get(sid, 0.125)
        site_demand = round(total_demand_gbps * weight * cow_absorption_factor, 3)
        site_util = round(min(120.0, (site_demand / max(0.1, usable_site_throughput)) * 100), 1)

        is_bottleneck = usable_site_throughput < final_site_rf or backhaul_cap <= 2.0
        if is_bottleneck:
            has_backhaul_bottlenecks = True
        if site_util > (target_utilization * 100):
            congested_sites_count += 1

        site_simulations.append({
            "site_id": sid,
            "type": site["type"],
            "has_5g": site_has_5g,
            "backhaul": "Fibre 10G" if is_fiber_upgraded else site["backhaul"],
            "backhaul_capacity_gbps": backhaul_cap,
            "usable_capacity_gbps": usable_site_throughput,
            "demand_gbps": site_demand,
            "utilization_pct": site_util,
            "is_backhaul_bottleneck": is_bottleneck,
            "status": "OPTIMAL" if site_util <= (target_utilization * 100) else "WARNING" if site_util <= 90 else "CRITICAL",
        })

    # Step 9: Show financial impact
    cost_cows_lakhs = cows_deployed * COST_COW_LAKHS
    cost_sc_lakhs = small_cells_deployed * COST_SMALL_CELL_LAKHS
    cost_fibre_lakhs = round(fibre_distance_km * COST_FIBRE_PER_KM_LAKHS, 2)
    cost_overlays_lakhs = (
        min(2, five_g_overlays_count) * COST_5G_OVERLAY_PER_MACRO_LAKHS +
        max(0, min(2, five_g_overlays_count - 2)) * 8.0
    )
    total_cost_lakhs = round(cost_cows_lakhs + cost_sc_lakhs + cost_fibre_lakhs + cost_overlays_lakhs, 2)
    total_cost_crores = round(total_cost_lakhs / 100.0, 3)
    budget_cap_lakhs = budget_cap_crores * 100.0
    remaining_budget_lakhs = round(budget_cap_lakhs - total_cost_lakhs, 2)
    is_within_budget = total_cost_lakhs <= budget_cap_lakhs

    # Step 10: Show whether the deployment is technically feasible within the budget
    is_technically_feasible = (
        is_within_budget and
        overall_utilization_pct <= (target_utilization * 100) and
        not has_backhaul_bottlenecks
    )

    if is_technically_feasible:
        feasibility_status = "FEASIBLE"
        feasibility_reason = "Meets capacity SLA (<=80% utilization), zero backhaul bottlenecks, and strictly within budget cap."
    elif not is_within_budget:
        feasibility_status = "BUDGET_EXCEEDED"
        feasibility_reason = f"Total expenditure of ₹{total_cost_crores:.3f} Cr exceeds the ₹{budget_cap_crores:.2f} Cr budget limit."
    elif has_backhaul_bottlenecks:
        feasibility_status = "BACKHAUL_BOTTLENECK"
        feasibility_reason = "Backhaul transport capacity is saturated (<10G Fibre), causing packet queuing and UPI drops."
    else:
        feasibility_status = "CAPACITY_DEFICIT"
        feasibility_reason = f"Network utilization of {overall_utilization_pct:.1f}% exceeds target SLA threshold of {int(target_utilization * 100)}%."

    return {
        "inputs": {
            "capacity": capacity,
            "airtel_share": airtel_share,
            "device_share_5g": device_share_5g,
            "peak_online_pct": peak_online_pct,
            "target_speed_5g_mbps": target_speed_5g_mbps,
            "target_speed_4g_mbps": target_speed_4g_mbps,
            "target_utilization": target_utilization,
            "budget_cap_crores": budget_cap_crores,
            "cows_deployed": cows_deployed,
            "small_cells_deployed": small_cells_deployed,
            "fibre_distance_km": fibre_distance_km,
            "five_g_overlays_count": five_g_overlays_count,
        },
        "cascade": {
            "step_1_airtel_spectators": {
                "total_spectators": capacity,
                "airtel_spectators": airtel_spectators,
                "spectators_5g_capable": spectators_5g_capable,
                "spectators_4g_only": spectators_4g_only,
            },
            "step_2_active_users": {
                "peak_active_airtel_users": peak_active_airtel_users,
                "peak_online_pct": round(peak_online_pct * 100, 1),
            },
            "step_3_user_split": {
                "active_5g_users": active_5g_users,
                "active_4g_users": active_4g_users,
            },
            "step_4_throughput_demand": {
                "demand_5g_gbps": demand_5g_gbps,
                "demand_4g_gbps": demand_4g_gbps,
                "total_demand_gbps": total_demand_gbps,
            },
            "step_5_required_capacity": {
                "required_capacity_gbps": required_capacity_gbps,
                "required_5g_gbps": required_capacity_5g_gbps,
                "required_4g_gbps": required_capacity_4g_gbps,
            },
            "step_6_capacity_evaluation": {
                "total_deployed_capacity_gbps": total_deployed_capacity_gbps,
                "required_capacity_gbps": required_capacity_gbps,
                "capacity_gap_gbps": capacity_gap_gbps,
                "status": capacity_surplus_deficit,
                "meets_sla": meets_capacity_sla,
            },
            "step_7_utilization_metrics": {
                "overall_utilization_pct": overall_utilization_pct,
                "target_utilization_pct": round(target_utilization * 100, 1),
                "congested_sites_count": congested_sites_count,
            },
            "step_8_bottlenecks": {
                "has_backhaul_bottlenecks": has_backhaul_bottlenecks,
                "bottleneck_count": len([s for s in site_simulations if s["is_backhaul_bottleneck"]]),
            },
            "step_9_financial_impact": {
                "cost_cows_lakhs": cost_cows_lakhs,
                "cost_small_cells_lakhs": cost_sc_lakhs,
                "cost_fibre_lakhs": cost_fibre_lakhs,
                "cost_overlays_lakhs": cost_overlays_lakhs,
                "total_cost_lakhs": total_cost_lakhs,
                "total_cost_crores": total_cost_crores,
                "remaining_budget_lakhs": remaining_budget_lakhs,
                "remaining_budget_crores": round(remaining_budget_lakhs / 100.0, 3),
                "is_within_budget": is_within_budget,
            },
            "step_10_feasibility": {
                "status": feasibility_status,
                "is_feasible": is_technically_feasible,
                "reason": feasibility_reason,
            }
        },
        "site_simulations": site_simulations,
    }

def compare_scenarios(
    baseline_params: Dict[str, Any],
    simulated_params: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Executes side-by-side delta comparison between baseline and simulated scenario.
    """
    baseline = simulate_network_scenario(**baseline_params)
    simulated = simulate_network_scenario(**simulated_params)

    base_cas = baseline["cascade"]
    sim_cas = simulated["cascade"]

    deltas = {
        "capacity_spectators": sim_cas["step_1_airtel_spectators"]["total_spectators"] - base_cas["step_1_airtel_spectators"]["total_spectators"],
        "airtel_spectators": sim_cas["step_1_airtel_spectators"]["airtel_spectators"] - base_cas["step_1_airtel_spectators"]["airtel_spectators"],
        "active_users": sim_cas["step_2_active_users"]["peak_active_airtel_users"] - base_cas["step_2_active_users"]["peak_active_airtel_users"],
        "demand_gbps": round(sim_cas["step_4_throughput_demand"]["total_demand_gbps"] - base_cas["step_4_throughput_demand"]["total_demand_gbps"], 3),
        "required_capacity_gbps": round(sim_cas["step_5_required_capacity"]["required_capacity_gbps"] - base_cas["step_5_required_capacity"]["required_capacity_gbps"], 3),
        "deployed_capacity_gbps": round(sim_cas["step_6_capacity_evaluation"]["total_deployed_capacity_gbps"] - base_cas["step_6_capacity_evaluation"]["total_deployed_capacity_gbps"], 3),
        "utilization_pct": round(sim_cas["step_7_utilization_metrics"]["overall_utilization_pct"] - base_cas["step_7_utilization_metrics"]["overall_utilization_pct"], 1),
        "expenditure_crores": round(sim_cas["step_9_financial_impact"]["total_cost_crores"] - base_cas["step_9_financial_impact"]["total_cost_crores"], 3),
    }

    return {
        "baseline": baseline,
        "simulated": simulated,
        "deltas": deltas,
    }

def get_preset_scenarios() -> List[Dict[str, Any]]:
    return PRESET_SCENARIOS
