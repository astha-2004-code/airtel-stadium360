"""
Unit and Integration Tests for Module 6: Financial Cap and ROI Engine
"""

import pytest
from app.services.budget_engine import (
    calculate_budget_summary,
    calculate_cost_effectiveness_metrics,
    get_asset_inventory,
    get_deployment_timeline,
)
from app.schemas.budget import BudgetAllocationRequest
from app.api.v1.endpoints.budget import (
    get_budget_summary,
    get_cost_effectiveness,
    get_assets,
    get_timeline,
    post_allocate_budget,
)

def test_budget_baseline_4cr_compliance():
    """
    Verifies that the default deployment satisfies the strict ₹4.00 Crore cap:
    - 4 COWs (₹100L) + 26 Small Cells (₹208L) + 0.99 km Fibre (₹49.5L) + 4 Overlays (₹40L)
    - Total: ₹397.50 Lakhs (₹3.975 Cr)
    - Remaining: ₹2.50 Lakhs
    """
    summary = calculate_budget_summary()

    assert summary["budget_limit_crores"] == 4.0
    assert summary["budget_limit_lakhs"] == 400.0
    assert summary["total_expenditure_crores"] == 3.975
    assert summary["total_expenditure_lakhs"] == 397.50
    assert summary["remaining_budget_lakhs"] == 2.50
    assert summary["is_within_budget"] is True
    assert summary["status"] == "OPTIMAL_COMMITTED"
    assert summary["alert"]["severity"] == "INFO"

def test_capex_vs_opex_split():
    """
    Verifies capital vs operational expenditure categorization:
    - CapEx: Small cells, Fibre, 5G Overlays (permanent infrastructure)
    - OpEx: COWs rental (event deployment)
    """
    summary = calculate_budget_summary()
    split = summary["capex_opex_split"]

    assert split["capex_lakhs"] == 297.50  # 208 + 49.5 + 40
    assert split["opex_lakhs"] == 100.00   # 4 * 25
    assert split["capex_pct"] > 70.0       # ~74.8% CapEx
    assert split["opex_pct"] < 30.0        # ~25.2% OpEx

def test_cost_effectiveness_and_roi():
    """
    Verifies telecom ROI and cost efficiency metrics.
    """
    roi = calculate_cost_effectiveness_metrics()

    assert roi["capacity_added_gbps"] > 20.0
    assert roi["cost_per_gbps_lakhs"] < 18.0     # ~₹16.69L per Gbps
    assert roi["cost_per_active_user_inr"] < 6000 # ~₹5,521 per active user
    assert roi["cost_per_spectator_inr"] < 1000   # ~₹993.75 per spectator
    assert roi["upi_preservation"]["protected_transactions_count"] > 3000
    assert roi["upi_preservation"]["protected_turnover_gmv_lakhs"] > 10.0
    assert roi["telecom_roi_score"] >= 85.0
    assert roi["capital_efficiency_rating"] == "EXCELLENT"

def test_asset_inventory_catalog():
    """
    Verifies that the asset catalog contains all hardware and rented assets.
    """
    assets = get_asset_inventory()
    assert len(assets) >= 10

    categories = {a["category"] for a in assets}
    assert "CapEx" in categories
    assert "OpEx" in categories

    cow_assets = [a for a in assets if "COW" in a["asset_id"]]
    assert len(cow_assets) == 4

def test_deployment_timeline_milestones():
    """
    Verifies the 4-week pre-match timeline.
    """
    timeline = get_deployment_timeline()
    assert len(timeline) == 5

    phases = [m["phase"] for m in timeline]
    assert "Week -4" in phases
    assert "Week -3" in phases
    assert "Week -2" in phases
    assert "Week -1" in phases

def test_budget_breach_detection():
    """
    Verifies system triggers CRITICAL_EXCEEDED when budget is over-allocated.
    """
    summary = calculate_budget_summary(
        budget_limit_crores=4.0,
        cows_count=8, # 8 * 25 = 200L
        small_cells_count=35, # 35 * 8 = 280L -> 480L total
    )
    assert summary["is_within_budget"] is False
    assert summary["status"] == "CRITICAL_EXCEEDED"
    assert summary["remaining_budget_lakhs"] < 0
    assert summary["alert"]["severity"] == "CRITICAL"

def test_budget_api_endpoints_direct():
    """
    Tests direct execution of all budget endpoints.
    """
    # GET summary
    s = get_budget_summary(budget_limit_crores=4.0)
    assert s["is_within_budget"] is True

    # GET cost effectiveness
    ce = get_cost_effectiveness(budget_limit_crores=4.0)
    assert ce["telecom_roi_score"] >= 85.0

    # GET assets
    assets = get_assets()
    assert len(assets) >= 10

    # GET timeline
    tl = get_timeline()
    assert len(tl) == 5

    # POST allocate
    req = BudgetAllocationRequest(cows_count=4, small_cells_count=26)
    alloc = post_allocate_budget(payload=req)
    assert alloc["total_expenditure_crores"] == 3.975
