"""
Airtel Stadium360 — Intelligent Network Deployment Optimizer Engine
Formulates and solves genuine Mixed-Integer Linear Programming (MILP)
and constraint optimization using SciPy.

Objective: Minimize total infrastructure cost while satisfying capacity
demand, eliminating backhaul bottlenecks, and maintaining network utilization <= 80%.
Constraints: Strict ₹4 Crore budget cap, physical stadium footprint limits,
and realistic 3GPP spectral capacity.
"""

from typing import Dict, Any, List, Optional
import numpy as np
from scipy.optimize import milp, LinearConstraint, Bounds
from app.services.data_loader import STADIUM_SITES
from app.services.demand_capacity_engine import (
    calculate_network_demand,
    SPECTRUM_CONFIG,
    SITE_DISTRIBUTION_WEIGHTS,
)

# Cost parameters specified by the Airtel SYNC master case study (in Lakhs INR)
# ₹1 Crore = 100 Lakhs; ₹4 Crore = 400 Lakhs
COST_COW_LAKHS = 25.0                 # ₹25 Lakhs per event
COST_SMALL_CELL_LAKHS = 8.0           # ₹8 Lakhs per in-bowl small cell
COST_FIBRE_PER_KM_LAKHS = 50.0        # ₹50 Lakhs per km
COST_5G_OVERLAY_PER_MACRO_LAKHS = 12.0 # ₹12 Lakhs for 64T64R AAU overlay on existing tower

# Standard practical capacity delivered by each infrastructure option (Gbps)
CAPACITY_COW_GBPS = 1.275             # 3-sector 5G (n78 100MHz) + 4G CA portable macro tower
CAPACITY_SMALL_CELL_GBPS = 0.600      # In-bowl 5G n78 micro-cell (dedicated lower/upper tier)
CAPACITY_5G_MACRO_OVERLAY_GBPS = 0.960 # Adding 100MHz 5G to 4G-only macro (M4, M6)

# Physical site backhaul upgrade distances and costs
# M4: 380m = 0.38 km -> 0.38 * 50 = 19.0 Lakhs
# M6: 450m = 0.45 km -> 0.45 * 50 = 22.5 Lakhs
# S1: 80m  = 0.08 km -> 0.08 * 50 = 4.0 Lakhs (Upgrade 1G to 10G)
# S2: 80m  = 0.08 km -> 0.08 * 50 = 4.0 Lakhs (Upgrade 1G to 10G)
SITE_UPGRADE_PROFILES = {
    "M4": {
        "distance_km": 0.38,
        "fibre_cost_lakhs": 19.0,
        "current_backhaul": "Microwave 2G",
        "upgraded_backhaul": "Fibre 10G",
        "overlay_cost_lakhs": 12.0,
        "traffic_weight": 0.10,
    },
    "M6": {
        "distance_km": 0.45,
        "fibre_cost_lakhs": 22.5,
        "current_backhaul": "Microwave 2G",
        "upgraded_backhaul": "Fibre 10G",
        "overlay_cost_lakhs": 12.0,
        "traffic_weight": 0.08,
    },
    "S1": {
        "distance_km": 0.08,
        "fibre_cost_lakhs": 4.0,
        "current_backhaul": "Fibre 1G",
        "upgraded_backhaul": "Fibre 10G",
        "overlay_cost_lakhs": 8.0, # Small cell 5G upgrade
        "traffic_weight": 0.14,
    },
    "S2": {
        "distance_km": 0.08,
        "fibre_cost_lakhs": 4.0,
        "current_backhaul": "Fibre 1G",
        "upgraded_backhaul": "Fibre 10G",
        "overlay_cost_lakhs": 8.0, # Small cell 5G upgrade
        "traffic_weight": 0.14,
    },
}

def optimize_stadium_network(
    budget_limit_crores: float = 4.0,
    capacity: int = 100000,
    airtel_share: float = 0.40,
    device_share_5g: float = 0.70,
    peak_online_pct: float = 0.18,
    target_speed_5g_mbps: float = 5.0,
    target_speed_4g_mbps: float = 3.0,
    target_utilization: float = 0.80,
    max_cows_allowed: int = 6,
    max_small_cells_allowed: int = 35,
    prioritize_backhaul: bool = True,
) -> Dict[str, Any]:
    """
    Executes SciPy MILP optimization to minimize cost while satisfying
    capacity demand under budget constraint.
    
    Decision variables (Integer & Binary):
    x[0] = num_cows (integer, 0 to max_cows_allowed)
    x[1] = num_small_cells (integer, 0 to max_small_cells_allowed)
    x[2] = upgrade_fiber_m4 (binary: 0 or 1)
    x[3] = upgrade_fiber_m6 (binary: 0 or 1)
    x[4] = upgrade_fiber_s1 (binary: 0 or 1)
    x[5] = upgrade_fiber_s2 (binary: 0 or 1)
    x[6] = upgrade_5g_m4 (binary: 0 or 1, requires fiber_m4)
    x[7] = upgrade_5g_m6 (binary: 0 or 1, requires fiber_m6)
    x[8] = upgrade_5g_s1 (binary: 0 or 1, requires fiber_s1)
    x[9] = upgrade_5g_s2 (binary: 0 or 1, requires fiber_s2)
    """
    budget_limit_lakhs = budget_limit_crores * 100.0

    # 1. Compute baseline demand
    demand_metrics = calculate_network_demand(
        capacity=capacity,
        airtel_share=airtel_share,
        device_share_5g=device_share_5g,
        peak_online_pct=peak_online_pct,
        target_speed_5g_mbps=target_speed_5g_mbps,
        target_speed_4g_mbps=target_speed_4g_mbps,
        target_utilization=target_utilization,
    )
    
    required_capacity_gbps = demand_metrics["capacity_requirements_gbps"]["required_total_at_80_pct"]
    current_installed_rf_gbps = demand_metrics["spectral_efficiency"]["total_practical_rf_capacity_gbps"]
    capacity_deficit_gbps = round(max(0.0, required_capacity_gbps - current_installed_rf_gbps), 3)

    # Cost coefficients (c vector in c^T * x to minimize) in Lakhs:
    c = np.array([
        COST_COW_LAKHS,                        # 0: COW (₹25L)
        COST_SMALL_CELL_LAKHS,                 # 1: Small Cell (₹8L)
        SITE_UPGRADE_PROFILES["M4"]["fibre_cost_lakhs"],    # 2: 19.0L
        SITE_UPGRADE_PROFILES["M6"]["fibre_cost_lakhs"],    # 3: 22.5L
        SITE_UPGRADE_PROFILES["S1"]["fibre_cost_lakhs"],    # 4: 4.0L
        SITE_UPGRADE_PROFILES["S2"]["fibre_cost_lakhs"],    # 5: 4.0L
        SITE_UPGRADE_PROFILES["M4"]["overlay_cost_lakhs"],  # 6: 12.0L
        SITE_UPGRADE_PROFILES["M6"]["overlay_cost_lakhs"],  # 7: 12.0L
        SITE_UPGRADE_PROFILES["S1"]["overlay_cost_lakhs"],  # 8: 8.0L
        SITE_UPGRADE_PROFILES["S2"]["overlay_cost_lakhs"],  # 9: 8.0L
    ])

    # Capacity added per variable (in Gbps)
    cap_gain = np.array([
        CAPACITY_COW_GBPS,
        CAPACITY_SMALL_CELL_GBPS,
        0.0, # Fiber enables backhaul
        0.0,
        0.0,
        0.0,
        CAPACITY_5G_MACRO_OVERLAY_GBPS,
        CAPACITY_5G_MACRO_OVERLAY_GBPS,
        CAPACITY_SMALL_CELL_GBPS,
        CAPACITY_SMALL_CELL_GBPS,
    ])

    # Variable bounds: all integer/binary
    integrality = np.ones(10)
    lb = np.zeros(10)
    ub = np.array([
        max_cows_allowed,
        max_small_cells_allowed,
        1, 1, 1, 1, # Binary fiber upgrades
        1, 1, 1, 1, # Binary 5G overlays
    ])

    # If prioritizing backhaul and budget allows infrastructure overhaul (>= ₹1 Cr),
    # ensure backhaul upgrades for bottleneck sites (M4, M6, S1, S2) are mandated
    fixed_infra_cost = sum(c[2:]) # 49.5L fiber + 40.0L overlays = 89.5L
    if prioritize_backhaul and budget_limit_lakhs >= fixed_infra_cost:
        lb[2:10] = 1.0

    bounds = Bounds(lb, ub)

    # Constraints:
    # 1. Total Cost <= budget_limit_lakhs
    # 2. Dependency: 5G M4 requires Fiber M4 (x[6] - x[2] <= 0)
    # 3. Dependency: 5G M6 requires Fiber M6 (x[7] - x[3] <= 0)
    # 4. Dependency: 5G S1 requires Fiber S1 (x[8] - x[4] <= 0)
    # 5. Dependency: 5G S2 requires Fiber S2 (x[9] - x[5] <= 0)
    # 6. Capacity requirement: sum(cap_gain_i * x_i) >= capacity_deficit_gbps
    A_rows = [
        c,                                             # Cost <= budget
        np.array([0, 0, -1, 0, 0, 0, 1, 0, 0, 0]),     # x[6] - x[2] <= 0
        np.array([0, 0, 0, -1, 0, 0, 0, 1, 0, 0]),     # x[7] - x[3] <= 0
        np.array([0, 0, 0, 0, -1, 0, 0, 0, 1, 0]),     # x[8] - x[4] <= 0
        np.array([0, 0, 0, 0, 0, -1, 0, 0, 0, 1]),     # x[9] - x[5] <= 0
        cap_gain,                                      # Capacity >= deficit
    ]

    lhs_ub = [budget_limit_lakhs, 0.0, 0.0, 0.0, 0.0, np.inf]
    lhs_lb = [0.0, -np.inf, -np.inf, -np.inf, -np.inf, capacity_deficit_gbps]

    A = np.array(A_rows)
    constraints = LinearConstraint(A, lhs_lb, lhs_ub)

    # Run SciPy MILP
    res = milp(c=c, integrality=integrality, bounds=bounds, constraints=constraints)

    is_fully_feasible = res.success
    unresolved_constraints = []

    if not is_fully_feasible:
        # Maximize capacity within available budget limit
        c_max_cap = -cap_gain
        A_budget_only = np.array([
            c,
            np.array([0, 0, -1, 0, 0, 0, 1, 0, 0, 0]),
            np.array([0, 0, 0, -1, 0, 0, 0, 1, 0, 0]),
            np.array([0, 0, 0, 0, -1, 0, 0, 0, 1, 0]),
            np.array([0, 0, 0, 0, 0, -1, 0, 0, 0, 1]),
        ])
        b_budget_only = LinearConstraint(
            A_budget_only,
            [0.0, -np.inf, -np.inf, -np.inf, -np.inf],
            [budget_limit_lakhs, 0.0, 0.0, 0.0, 0.0]
        )
        res_budget = milp(c=c_max_cap, integrality=integrality, bounds=bounds, constraints=b_budget_only)
        
        if res_budget.success:
            sol = np.round(res_budget.x).astype(int)
        else:
            sol = np.zeros(10, dtype=int)
            
        unresolved_constraints.append(
            f"Capacity deficit of {capacity_deficit_gbps:.2f} Gbps could not be 100% satisfied within the ₹{budget_limit_crores:.2f} Cr budget limit. Maximum capacity allocation selected."
        )
    else:
        sol = np.round(res.x).astype(int)

    # Extract solution variables
    num_cows = int(sol[0])
    num_small_cells = int(sol[1])
    fiber_m4 = bool(sol[2])
    fiber_m6 = bool(sol[3])
    fiber_s1 = bool(sol[4])
    fiber_s2 = bool(sol[5])
    five_g_m4 = bool(sol[6])
    five_g_m6 = bool(sol[7])
    five_g_s1 = bool(sol[8])
    five_g_s2 = bool(sol[9])

    # Compute financial costs
    cost_cows_lakhs = num_cows * COST_COW_LAKHS
    cost_small_cells_lakhs = num_small_cells * COST_SMALL_CELL_LAKHS
    
    cost_fiber_lakhs = (
        (SITE_UPGRADE_PROFILES["M4"]["fibre_cost_lakhs"] if fiber_m4 else 0.0) +
        (SITE_UPGRADE_PROFILES["M6"]["fibre_cost_lakhs"] if fiber_m6 else 0.0) +
        (SITE_UPGRADE_PROFILES["S1"]["fibre_cost_lakhs"] if fiber_s1 else 0.0) +
        (SITE_UPGRADE_PROFILES["S2"]["fibre_cost_lakhs"] if fiber_s2 else 0.0)
    )
    
    cost_5g_overlays_lakhs = (
        (SITE_UPGRADE_PROFILES["M4"]["overlay_cost_lakhs"] if five_g_m4 else 0.0) +
        (SITE_UPGRADE_PROFILES["M6"]["overlay_cost_lakhs"] if five_g_m6 else 0.0) +
        (SITE_UPGRADE_PROFILES["S1"]["overlay_cost_lakhs"] if five_g_s1 else 0.0) +
        (SITE_UPGRADE_PROFILES["S2"]["overlay_cost_lakhs"] if five_g_s2 else 0.0)
    )

    total_cost_lakhs = round(cost_cows_lakhs + cost_small_cells_lakhs + cost_fiber_lakhs + cost_5g_overlays_lakhs, 2)
    total_cost_crores = round(total_cost_lakhs / 100.0, 3)
    remaining_budget_lakhs = round(budget_limit_lakhs - total_cost_lakhs, 2)
    remaining_budget_crores = round(remaining_budget_lakhs / 100.0, 3)

    # Compute capacity added
    added_capacity_gbps = round(float(np.dot(cap_gain, sol)), 3)
    post_deployment_rf_capacity_gbps = round(current_installed_rf_gbps + added_capacity_gbps, 3)
    
    # Post-deployment utilization
    total_demand_gbps = demand_metrics["throughput_demand_gbps"]["total_demand"]
    post_deployment_utilization_pct = round(min(100.0, (total_demand_gbps / post_deployment_rf_capacity_gbps) * 100), 1)

    if post_deployment_utilization_pct > (target_utilization * 100):
        unresolved_constraints.append(
            f"Expected utilization of {post_deployment_utilization_pct}% exceeds the target threshold of {int(target_utilization * 100)}%."
        )

    # Site-by-site intervention plan
    site_interventions = []
    for site in STADIUM_SITES:
        sid = site["site_id"]
        is_macro = site["type"] == "Macro"
        orig_cap = SPECTRUM_CONFIG["4G"]["macro_practical_capacity_gbps"] if is_macro else SPECTRUM_CONFIG["4G"]["small_cell_capacity_gbps"]
        if site["has_5g"]:
            orig_cap += SPECTRUM_CONFIG["5G"]["macro_practical_capacity_gbps"]

        actions = []
        new_backhaul = site["backhaul"]
        new_has_5g = site["has_5g"]
        added_site_cap = 0.0

        if sid == "M4":
            if fiber_m4:
                actions.append("Upgrade backhaul from 2G Microwave to 10G Dark Fibre (0.38 km)")
                new_backhaul = "Fibre 10G"
            if five_g_m4:
                actions.append("Install 64T64R Massive MIMO 5G (n78 100MHz) AAU overlay")
                new_has_5g = True
                added_site_cap += CAPACITY_5G_MACRO_OVERLAY_GBPS
        elif sid == "M6":
            if fiber_m6:
                actions.append("Upgrade backhaul from 2G Microwave to 10G Dark Fibre (0.45 km)")
                new_backhaul = "Fibre 10G"
            if five_g_m6:
                actions.append("Install 64T64R Massive MIMO 5G (n78 100MHz) AAU overlay")
                new_has_5g = True
                added_site_cap += CAPACITY_5G_MACRO_OVERLAY_GBPS
        elif sid == "S1":
            if fiber_s1:
                actions.append("Upgrade backhaul from 1G Fibre to 10G Dedicated Fibre (0.08 km)")
                new_backhaul = "Fibre 10G"
            if five_g_s1:
                actions.append("Deploy 5G n78 micro-RRH overlay for lower-tier bowl")
                new_has_5g = True
                added_site_cap += CAPACITY_SMALL_CELL_GBPS
        elif sid == "S2":
            if fiber_s2:
                actions.append("Upgrade backhaul from 1G Fibre to 10G Dedicated Fibre (0.08 km)")
                new_backhaul = "Fibre 10G"
            if five_g_s2:
                actions.append("Deploy 5G n78 micro-RRH overlay for lower-tier bowl")
                new_has_5g = True
                added_site_cap += CAPACITY_SMALL_CELL_GBPS
        else:
            actions.append("Retain existing 10G Fibre + 5G Massive MIMO configuration; optimize downtilt and beam azimuth")

        # In-bowl small cells allocated to reinforce bowl stands
        if sid in ["S1", "S2"]:
            sc_share = num_small_cells // 2
            actions.append(f"Deploy {sc_share} coordinated in-bowl Small Cells (+{sc_share * CAPACITY_SMALL_CELL_GBPS:.2f} Gbps)")
            added_site_cap += sc_share * CAPACITY_SMALL_CELL_GBPS

        final_site_cap = round(orig_cap + added_site_cap, 3)
        weight = SITE_DISTRIBUTION_WEIGHTS.get(sid, 0.125)
        # Peripheral COWs absorb ~25% of overall traffic near perimeter gates
        cow_absorption_factor = 0.75 if num_cows > 0 else 1.0
        site_demand = round(total_demand_gbps * weight * cow_absorption_factor, 3)
        final_site_util = round(min(99.0, (site_demand / max(0.1, final_site_cap)) * 100), 1)

        site_interventions.append({
            "site_id": sid,
            "type": site["type"],
            "original_backhaul": site["backhaul"],
            "new_backhaul": new_backhaul,
            "original_has_5g": site["has_5g"],
            "new_has_5g": new_has_5g,
            "original_capacity_gbps": round(orig_cap, 3),
            "added_capacity_gbps": round(added_site_cap, 3),
            "final_capacity_gbps": final_site_cap,
            "traffic_demand_gbps": site_demand,
            "final_utilization_pct": final_site_util,
            "status": "OPTIMAL" if final_site_util <= 80 else "WARNING" if final_site_util <= 90 else "CRITICAL",
            "actions": actions,
        })

    # Peripheral COW Deployments
    cow_deployments = []
    cow_locations = [
        {"id": "COW-1", "location": "Gate 1 North Plaza (VIP & Media Arrival)", "azimuth": 30},
        {"id": "COW-2", "location": "Gate 3 East Concourse (High Footfall)", "azimuth": 105},
        {"id": "COW-3", "location": "Gate 5 South Fan Zone & Food Court", "azimuth": 200},
        {"id": "COW-4", "location": "Gate 7 West Metro Station Corridor", "azimuth": 290},
        {"id": "COW-5", "location": "North-West Perimeter Overflow Area", "azimuth": 340},
        {"id": "COW-6", "location": "South-East Outer Parking Hub", "azimuth": 150},
    ]

    for i in range(num_cows):
        loc = cow_locations[i] if i < len(cow_locations) else {"id": f"COW-{i+1}", "location": f"Auxiliary Perimeter Sector {i+1}", "azimuth": i * 60}
        cow_deployments.append({
            "cow_id": loc["id"],
            "location": loc["location"],
            "azimuth": loc["azimuth"],
            "capacity_gbps": CAPACITY_COW_GBPS,
            "backhaul": "10G Microwave / Tactical Fibre Link",
            "spectrum": "5G n78 (100MHz) + 4G B1/B3/B40",
            "cost_lakhs": COST_COW_LAKHS,
        })

    return {
        "status": "FEASIBLE" if is_fully_feasible else "CONSTRAINED_OPTIMAL",
        "is_feasible": is_fully_feasible,
        "solver": "SciPy MILP (Highs)",
        "budget_summary": {
            "budget_limit_crores": budget_limit_crores,
            "budget_limit_lakhs": budget_limit_lakhs,
            "total_expenditure_lakhs": total_cost_lakhs,
            "total_expenditure_crores": total_cost_crores,
            "remaining_budget_lakhs": remaining_budget_lakhs,
            "remaining_budget_crores": remaining_budget_crores,
            "budget_utilization_pct": round((total_cost_lakhs / budget_limit_lakhs) * 100, 1),
            "is_within_budget": total_cost_lakhs <= budget_limit_lakhs,
        },
        "cost_breakdown_lakhs": {
            "cows": cost_cows_lakhs,
            "small_cells": cost_small_cells_lakhs,
            "fiber_backhaul": cost_fiber_lakhs,
            "five_g_overlays": cost_5g_overlays_lakhs,
            "total": total_cost_lakhs,
        },
        "recommended_mix": {
            "cows_deployed": num_cows,
            "small_cells_deployed": num_small_cells,
            "backhaul_upgrades_count": sum([fiber_m4, fiber_m6, fiber_s1, fiber_s2]),
            "five_g_overlays_count": sum([five_g_m4, five_g_m6, five_g_s1, five_g_s2]),
            "upgrades": {
                "fiber_m4": fiber_m4,
                "fiber_m6": fiber_m6,
                "fiber_s1": fiber_s1,
                "fiber_s2": fiber_s2,
                "five_g_m4": five_g_m4,
                "five_g_m6": five_g_m6,
                "five_g_s1": five_g_s1,
                "five_g_s2": five_g_s2,
            }
        },
        "capacity_results": {
            "baseline_demand_gbps": total_demand_gbps,
            "required_capacity_80_pct_gbps": required_capacity_gbps,
            "original_installed_rf_gbps": current_installed_rf_gbps,
            "added_capacity_gbps": added_capacity_gbps,
            "post_deployment_capacity_gbps": post_deployment_rf_capacity_gbps,
            "post_deployment_utilization_pct": post_deployment_utilization_pct,
            "target_utilization_pct": round(target_utilization * 100, 1),
            "meets_utilization_sla": post_deployment_utilization_pct <= (target_utilization * 100),
        },
        "site_interventions": site_interventions,
        "cow_deployments": cow_deployments,
        "unresolved_constraints": unresolved_constraints,
    }
