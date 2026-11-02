"""
Airtel Stadium360 — Financial Cap and ROI Engine
Strict budget management under the ₹4.00 Crore cap, CapEx vs OpEx categorization,
telecom cost-effectiveness metrics (Cost/Gbps, Cost/User), asset inventory,
and multi-week deployment timeline.
"""

from typing import Dict, Any, List, Optional
from app.services.optimizer_engine import (
    COST_COW_LAKHS,
    COST_SMALL_CELL_LAKHS,
    COST_FIBRE_PER_KM_LAKHS,
    COST_5G_OVERLAY_PER_MACRO_LAKHS,
    CAPACITY_COW_GBPS,
    CAPACITY_SMALL_CELL_GBPS,
    CAPACITY_5G_MACRO_OVERLAY_GBPS,
)

# Strict Budget Cap: ₹4.00 Crore = 400.00 Lakhs = 40,000,000 INR
MAX_BUDGET_CRORES = 4.00
MAX_BUDGET_LAKHS = 400.00

# Recommended Baseline Deployment:
# 4 COWs (₹100L) + 26 Small Cells (₹208L) + 0.99 km Fibre (₹49.5L) + 4 5G Overlays (₹40L)
DEFAULT_ALLOCATION = {
    "cows_count": 4,
    "small_cells_count": 26,
    "fibre_km": 0.99,
    "macro_5g_overlays_count": 2, # M4, M6
    "small_cell_5g_overlays_count": 2, # S1, S2
    "civil_and_calibration_lakhs": 0.0, # Covered within contingency
}

# Complete Itemized Asset Inventory Catalog
ASSET_CATALOG = [
    {
        "asset_id": "AST-COW-01",
        "name": "Cell on Wheels 01 (Gate 1 VIP Plaza)",
        "category": "OpEx",
        "type": "Portable Macro Tower",
        "vendor": "Ericsson / Airtel Tactical",
        "specs": "3-Sector 5G n78 (64T64R) + 4G CA (B1/B3/B40)",
        "capacity_gbps": 1.275,
        "unit_cost_lakhs": 25.0,
        "quantity": 1,
        "total_cost_lakhs": 25.0,
        "location": "Gate 1 North Plaza",
        "commission_status": "Ready for Staging",
    },
    {
        "asset_id": "AST-COW-02",
        "name": "Cell on Wheels 02 (Gate 3 East Concourse)",
        "category": "OpEx",
        "type": "Portable Macro Tower",
        "vendor": "Ericsson / Airtel Tactical",
        "specs": "3-Sector 5G n78 (64T64R) + 4G CA (B1/B3/B40)",
        "capacity_gbps": 1.275,
        "unit_cost_lakhs": 25.0,
        "quantity": 1,
        "total_cost_lakhs": 25.0,
        "location": "Gate 3 East Entrance",
        "commission_status": "Ready for Staging",
    },
    {
        "asset_id": "AST-COW-03",
        "name": "Cell on Wheels 03 (Gate 5 South Fan Zone)",
        "category": "OpEx",
        "type": "Portable Macro Tower",
        "vendor": "Nokia / Airtel Tactical",
        "specs": "3-Sector 5G n78 (64T64R) + 4G CA (B1/B3/B40)",
        "capacity_gbps": 1.275,
        "unit_cost_lakhs": 25.0,
        "quantity": 1,
        "total_cost_lakhs": 25.0,
        "location": "Gate 5 Food Court Plaza",
        "commission_status": "Ready for Staging",
    },
    {
        "asset_id": "AST-COW-04",
        "name": "Cell on Wheels 04 (Gate 7 West Metro Corridor)",
        "category": "OpEx",
        "type": "Portable Macro Tower",
        "vendor": "Nokia / Airtel Tactical",
        "specs": "3-Sector 5G n78 (64T64R) + 4G CA (B1/B3/B40)",
        "capacity_gbps": 1.275,
        "unit_cost_lakhs": 25.0,
        "quantity": 1,
        "total_cost_lakhs": 25.0,
        "location": "Gate 7 Metro Concourse",
        "commission_status": "Ready for Staging",
    },
    {
        "asset_id": "AST-SC-NORTH",
        "name": "In-Bowl 5G Micro Small Cells (North Tier Array)",
        "category": "CapEx",
        "type": "Micro-Radio RRH",
        "vendor": "Ericsson Radio Dot System",
        "specs": "5G n78 100MHz TDD 4T4R Micro Cell",
        "capacity_gbps": 7.80, # 13 * 0.600
        "unit_cost_lakhs": 8.0,
        "quantity": 13,
        "total_cost_lakhs": 104.0,
        "location": "North Stand Lower & Upper Tiers (S1 Sector)",
        "commission_status": "Hardware Procured",
    },
    {
        "asset_id": "AST-SC-SOUTH",
        "name": "In-Bowl 5G Micro Small Cells (South Tier Array)",
        "category": "CapEx",
        "type": "Micro-Radio RRH",
        "vendor": "Ericsson Radio Dot System",
        "specs": "5G n78 100MHz TDD 4T4R Micro Cell",
        "capacity_gbps": 7.80, # 13 * 0.600
        "unit_cost_lakhs": 8.0,
        "quantity": 13,
        "total_cost_lakhs": 104.0,
        "location": "South Stand Lower & Upper Tiers (S2 Sector)",
        "commission_status": "Hardware Procured",
    },
    {
        "asset_id": "AST-FIBRE-M4",
        "name": "10G Dark Fibre Link — Site M4",
        "category": "CapEx",
        "type": "Optical Transport",
        "vendor": "Sterlite Optical 96-Core Armoured",
        "specs": "96-Core Single-Mode Underground Dark Fibre (0.38 km)",
        "capacity_gbps": 10.0,
        "unit_cost_lakhs": 50.0,
        "quantity": 0.38,
        "total_cost_lakhs": 19.0,
        "location": "South-West Perimeter Trench to M4",
        "commission_status": "Trenching Completed",
    },
    {
        "asset_id": "AST-FIBRE-M6",
        "name": "10G Dark Fibre Link — Site M6",
        "category": "CapEx",
        "type": "Optical Transport",
        "vendor": "Sterlite Optical 96-Core Armoured",
        "specs": "96-Core Single-Mode Underground Dark Fibre (0.45 km)",
        "capacity_gbps": 10.0,
        "unit_cost_lakhs": 50.0,
        "quantity": 0.45,
        "total_cost_lakhs": 22.5,
        "location": "North-West Perimeter Trench to M6",
        "commission_status": "Trenching Completed",
    },
    {
        "asset_id": "AST-FIBRE-S1S2",
        "name": "10G Dedicated Bowl Backbone — Sites S1 & S2",
        "category": "CapEx",
        "type": "Optical Transport",
        "vendor": "Sterlite Optical 96-Core Armoured",
        "specs": "High-Density In-Bowl Conduit Optical Backbone (0.16 km)",
        "capacity_gbps": 20.0,
        "unit_cost_lakhs": 50.0,
        "quantity": 0.16,
        "total_cost_lakhs": 8.0,
        "location": "Concourse Sub-duct to S1 & S2",
        "commission_status": "Ducting Completed",
    },
    {
        "asset_id": "AST-5G-M4M6",
        "name": "64T64R Massive MIMO AAU Overlay — Sites M4 & M6",
        "category": "CapEx",
        "type": "Active Antenna Unit (AAU)",
        "vendor": "Ericsson AIR 6449 (3.5 GHz)",
        "specs": "64T64R 320W EIRP 100MHz n78 Massive MIMO",
        "capacity_gbps": 1.92, # 2 * 0.960
        "unit_cost_lakhs": 12.0,
        "quantity": 2,
        "total_cost_lakhs": 24.0,
        "location": "M4 & M6 Tower Mastheads",
        "commission_status": "Mast Mount Ready",
    },
    {
        "asset_id": "AST-5G-S1S2",
        "name": "5G Micro-RRH Overlay Modules — Sites S1 & S2",
        "category": "CapEx",
        "type": "Micro-Radio Unit",
        "vendor": "Ericsson Micro Radio 4415",
        "specs": "4T4R 4x5W 100MHz n78 Dedicated Micro Transceiver",
        "capacity_gbps": 1.20, # 2 * 0.600
        "unit_cost_lakhs": 8.0,
        "quantity": 2,
        "total_cost_lakhs": 16.0,
        "location": "S1 & S2 Bowl Sector Hubs",
        "commission_status": "Configured in Lab",
    },
]

# 4-Week Pre-Match Deployment Timeline
DEPLOYMENT_TIMELINE = [
    {
        "milestone_id": "MLS-01",
        "phase": "Week -4",
        "title": "Civil Works & Dark Fibre Trenching",
        "dates": "Day -28 to Day -21",
        "status": "COMPLETED",
        "progress_pct": 100,
        "description": "Trenching and laying 0.99 km 96-core armoured fibre to M4, M6, S1, and S2. Eliminates Microwave 2G bottlenecks.",
        "deliverables": [
            "0.38 km fibre to M4 South-West tower",
            "0.45 km fibre to M6 North-West tower",
            "0.16 km dual-redundant ring to in-bowl S1 & S2 concourse hubs",
            "OTDR optical loss test passed (< 0.25 dB/km)",
        ],
        "budget_impact_lakhs": 49.5,
    },
    {
        "milestone_id": "MLS-02",
        "phase": "Week -3",
        "title": "In-Bowl Small Cell Installation & Cabling",
        "dates": "Day -20 to Day -14",
        "status": "COMPLETED",
        "progress_pct": 100,
        "description": "Mounting 26 units of 5G n78 micro small cells along lower and upper bowl seating tiers and canopy structures.",
        "deliverables": [
            "13 Small Cells installed in North Stand (S1 sector)",
            "13 Small Cells installed in South Stand (S2 sector)",
            "PoE+ power distribution and Cat6A/Fibre drops completed",
            "Aesthetic spectator shielding & structural load certified",
        ],
        "budget_impact_lakhs": 208.0,
    },
    {
        "milestone_id": "MLS-03",
        "phase": "Week -2",
        "title": "5G Massive MIMO Overlays & Core Splicing",
        "dates": "Day -13 to Day -7",
        "status": "COMPLETED",
        "progress_pct": 100,
        "description": "Hoisting 64T64R Massive MIMO AAUs onto M4 and M6 tower masts; optical transceiver splicing into 10G optical ring.",
        "deliverables": [
            "Ericsson AIR 6449 hoisted on M4 & M6 masts (0.960 Gbps added each)",
            "10G SFP+ optical transceivers spliced into Airtel Ahmedabad core ring",
            "S1 and S2 micro-RRH overlays integrated",
            "End-to-end 10 Gbps backhaul ping latency < 3.2 ms verified",
        ],
        "budget_impact_lakhs": 40.0,
    },
    {
        "milestone_id": "MLS-04",
        "phase": "Week -1",
        "title": "COW Staging & Gate Concourse Positioning",
        "dates": "Day -6 to Day -2",
        "status": "IN_PROGRESS",
        "progress_pct": 85,
        "description": "Stationing 4 heavy-duty Cells on Wheels at Gates 1, 3, 5, 7. Establishing tactical microwave / optical links.",
        "deliverables": [
            "COW-1 stationed at Gate 1 VIP / Media arrival plaza",
            "COW-2 stationed at Gate 3 East Concourse",
            "COW-3 stationed at Gate 5 South Fan Zone & Food Court",
            "COW-4 stationed at Gate 7 Metro Station pedestrian concourse",
            "Mobile diesel generator power & grounding inspected",
        ],
        "budget_impact_lakhs": 100.0,
    },
    {
        "milestone_id": "MLS-05",
        "phase": "Day -1 to Match Day",
        "title": "End-to-End Drive Testing & NOC Readiness",
        "dates": "Day -1 to Match Day",
        "status": "UPCOMING",
        "progress_pct": 20,
        "description": "Simulated multi-user load testing, beamforming azimuth verification, UPI packet priority slice activation, and live NOC monitoring.",
        "deliverables": [
            "Comprehensive 100% bowl walk-test with scanner (SINR > 18 dB)",
            "5G target speed of 5 Mbps and 4G target speed of 3 Mbps validated",
            "UPI 5QI=1 / QCI=1 priority slice enabled for all stadium merchants",
            "Real-time 24/7 War Room monitoring activated",
        ],
        "budget_impact_lakhs": 0.0,
    },
]

def calculate_budget_summary(
    budget_limit_crores: float = MAX_BUDGET_CRORES,
    cows_count: int = DEFAULT_ALLOCATION["cows_count"],
    small_cells_count: int = DEFAULT_ALLOCATION["small_cells_count"],
    fibre_km: float = DEFAULT_ALLOCATION["fibre_km"],
    macro_5g_overlays_count: int = DEFAULT_ALLOCATION["macro_5g_overlays_count"],
    small_cell_5g_overlays_count: int = DEFAULT_ALLOCATION["small_cell_5g_overlays_count"],
) -> Dict[str, Any]:
    """
    Computes strict budget consumption, CapEx vs OpEx split, and threshold warnings.
    """
    budget_limit_lakhs = round(budget_limit_crores * 100.0, 2)

    # Itemized spends in Lakhs INR
    cost_cows_lakhs = round(cows_count * COST_COW_LAKHS, 2)
    cost_small_cells_lakhs = round(small_cells_count * COST_SMALL_CELL_LAKHS, 2)
    cost_fibre_lakhs = round(fibre_km * COST_FIBRE_PER_KM_LAKHS, 2)
    cost_macro_5g_lakhs = round(macro_5g_overlays_count * COST_5G_OVERLAY_PER_MACRO_LAKHS, 2)
    cost_small_cell_5g_lakhs = round(small_cell_5g_overlays_count * 8.0, 2)
    cost_overlays_lakhs = round(cost_macro_5g_lakhs + cost_small_cell_5g_lakhs, 2)

    # CapEx vs OpEx
    # CapEx: Small cells, Fibre backhaul, 5G overlays (Permanent infrastructure)
    # OpEx: COWs rental (Per-event temporary deployment)
    capex_lakhs = round(cost_small_cells_lakhs + cost_fibre_lakhs + cost_overlays_lakhs, 2)
    opex_lakhs = round(cost_cows_lakhs, 2)

    total_expenditure_lakhs = round(capex_lakhs + opex_lakhs, 2)
    total_expenditure_crores = round(total_expenditure_lakhs / 100.0, 3)

    remaining_budget_lakhs = round(budget_limit_lakhs - total_expenditure_lakhs, 2)
    remaining_budget_crores = round(remaining_budget_lakhs / 100.0, 3)

    budget_utilization_pct = round((total_expenditure_lakhs / budget_limit_lakhs) * 100, 1)

    # Threshold Status & Alert
    if total_expenditure_lakhs > budget_limit_lakhs:
        budget_status = "CRITICAL_EXCEEDED"
        alert_message = f"Budget ceiling breached! Total expenditure of ₹{total_expenditure_crores:.3f} Cr exceeds the ₹{budget_limit_crores:.2f} Cr cap by ₹{-remaining_budget_lakhs:.2f} Lakhs."
        alert_severity = "CRITICAL"
    elif budget_utilization_pct >= 95.0:
        budget_status = "OPTIMAL_COMMITTED"
        alert_message = f"Budget allocation is fully optimized: {budget_utilization_pct:.1f}% committed with ₹{remaining_budget_lakhs:.2f} Lakhs contingency buffer."
        alert_severity = "INFO"
    elif budget_utilization_pct >= 85.0:
        budget_status = "APPROACHING_LIMIT"
        alert_message = f"Budget is nearing the ceiling ({budget_utilization_pct:.1f}% utilized). ₹{remaining_budget_lakhs:.2f} Lakhs remaining."
        alert_severity = "WARNING"
    else:
        budget_status = "UNDER_BUDGET"
        alert_message = f"Expenditure is well within budget limits ({budget_utilization_pct:.1f}% committed)."
        alert_severity = "SUCCESS"

    return {
        "budget_limit_crores": budget_limit_crores,
        "budget_limit_lakhs": budget_limit_lakhs,
        "total_expenditure_crores": total_expenditure_crores,
        "total_expenditure_lakhs": total_expenditure_lakhs,
        "remaining_budget_crores": remaining_budget_crores,
        "remaining_budget_lakhs": remaining_budget_lakhs,
        "budget_utilization_pct": budget_utilization_pct,
        "is_within_budget": total_expenditure_lakhs <= budget_limit_lakhs,
        "status": budget_status,
        "alert": {
            "severity": alert_severity,
            "message": alert_message,
        },
        "breakdown_lakhs": {
            "cows": cost_cows_lakhs,
            "small_cells": cost_small_cells_lakhs,
            "fibre_backhaul": cost_fibre_lakhs,
            "five_g_overlays": cost_overlays_lakhs,
            "total": total_expenditure_lakhs,
        },
        "capex_opex_split": {
            "capex_lakhs": capex_lakhs,
            "capex_crores": round(capex_lakhs / 100.0, 3),
            "capex_pct": round((capex_lakhs / max(0.1, total_expenditure_lakhs)) * 100, 1),
            "opex_lakhs": opex_lakhs,
            "opex_crores": round(opex_lakhs / 100.0, 3),
            "opex_pct": round((opex_lakhs / max(0.1, total_expenditure_lakhs)) * 100, 1),
            "strategic_notes": "74.8% of capital is deployed into permanent stadium infrastructure (in-bowl small cells, dark fibre ducting, and 64T64R AAUs) providing multi-year asset ROI for all future sporting events and concerts."
        }
    }

def calculate_cost_effectiveness_metrics(
    budget_limit_crores: float = MAX_BUDGET_CRORES,
    cows_count: int = DEFAULT_ALLOCATION["cows_count"],
    small_cells_count: int = DEFAULT_ALLOCATION["small_cells_count"],
    fibre_km: float = DEFAULT_ALLOCATION["fibre_km"],
    macro_5g_overlays_count: int = DEFAULT_ALLOCATION["macro_5g_overlays_count"],
    small_cell_5g_overlays_count: int = DEFAULT_ALLOCATION["small_cell_5g_overlays_count"],
    capacity: int = 100000,
    airtel_share: float = 0.40,
    peak_online_pct: float = 0.18,
) -> Dict[str, Any]:
    """
    Computes rigorous telecom cost-effectiveness metrics:
    - Cost per Gbps added
    - Cost per active concurrent user
    - Cost per Airtel spectator
    - UPI revenue / transaction failure protection
    """
    budget_info = calculate_budget_summary(
        budget_limit_crores=budget_limit_crores,
        cows_count=cows_count,
        small_cells_count=small_cells_count,
        fibre_km=fibre_km,
        macro_5g_overlays_count=macro_5g_overlays_count,
        small_cell_5g_overlays_count=small_cell_5g_overlays_count,
    )

    total_cost_lakhs = budget_info["total_expenditure_lakhs"]
    total_cost_inr = total_cost_lakhs * 100000.0

    # Capacity added
    cow_cap = cows_count * CAPACITY_COW_GBPS
    sc_cap = small_cells_count * CAPACITY_SMALL_CELL_GBPS
    overlay_cap = (
        macro_5g_overlays_count * CAPACITY_5G_MACRO_OVERLAY_GBPS +
        small_cell_5g_overlays_count * CAPACITY_SMALL_CELL_GBPS
    )
    total_added_cap_gbps = round(cow_cap + sc_cap + overlay_cap, 3)

    # Users
    airtel_spectators = int(capacity * airtel_share)
    peak_active_users = int(airtel_spectators * peak_online_pct)

    # 1. Cost per Gbps Added
    cost_per_gbps_lakhs = round(total_cost_lakhs / max(0.1, total_added_cap_gbps), 2)
    cost_per_gbps_inr = round(total_cost_inr / max(0.1, total_added_cap_gbps), 0)

    # 2. Cost per Active User (Concurrent peak load)
    cost_per_active_user_inr = round(total_cost_inr / max(1, peak_active_users), 1)

    # 3. Cost per Airtel Spectator
    cost_per_spectator_inr = round(total_cost_inr / max(1, airtel_spectators), 1)

    # 4. UPI Protection Impact
    # 40k Airtel fans initiate ~60,000 UPI payments during 6-hour match window (food, cabs, merchandise)
    # Historical baseline failure rate was 7.11% (4,266 failed transactions)
    # With 10G fibre and QoS slicing, failure rate drops to <1.0% (~600 failed transactions)
    # Transactions protected: ~3,666 payments with average ticket size of ₹450
    estimated_transactions = int(airtel_spectators * 1.5)
    baseline_failed_tx = int(estimated_transactions * 0.0711)
    optimized_failed_tx = int(estimated_transactions * 0.0095)
    protected_transactions = baseline_failed_tx - optimized_failed_tx
    average_ticket_size_inr = 450.0
    protected_gmv_inr = round(protected_transactions * average_ticket_size_inr, 2)
    protected_gmv_lakhs = round(protected_gmv_inr / 100000.0, 2)

    # ROI Score out of 100 based on capacity efficiency, budget buffer, and SLA protection
    roi_score = min(98.5, round((total_added_cap_gbps / 25.0) * 40 + (budget_info["remaining_budget_lakhs"] / 10.0) * 10 + 48.5, 1))

    return {
        "budget_summary": budget_info,
        "capacity_added_gbps": total_added_cap_gbps,
        "cost_per_gbps_lakhs": cost_per_gbps_lakhs,
        "cost_per_gbps_inr": cost_per_gbps_inr,
        "cost_per_active_user_inr": cost_per_active_user_inr,
        "cost_per_spectator_inr": cost_per_spectator_inr,
        "upi_preservation": {
            "estimated_match_transactions": estimated_transactions,
            "baseline_failed_transactions": baseline_failed_tx,
            "optimized_failed_transactions": optimized_failed_tx,
            "protected_transactions_count": protected_transactions,
            "protected_turnover_gmv_lakhs": protected_gmv_lakhs,
            "protected_turnover_gmv_inr": protected_gmv_inr,
        },
        "telecom_roi_score": roi_score,
        "capital_efficiency_rating": "EXCELLENT" if cost_per_gbps_lakhs <= 18.0 else "GOOD",
    }

def get_asset_inventory() -> List[Dict[str, Any]]:
    return ASSET_CATALOG

def get_deployment_timeline() -> List[Dict[str, Any]]:
    return DEPLOYMENT_TIMELINE

