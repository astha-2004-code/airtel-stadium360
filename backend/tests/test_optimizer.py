"""
Unit and Integration Tests for Module 4: Intelligent Network Deployment Optimizer
"""

import pytest
from app.services.optimizer_engine import optimize_stadium_network
from app.schemas.optimizer import OptimizationRequest
from app.api.v1.endpoints.optimizer import (
    get_recommended_optimization,
    post_custom_optimization,
    get_site_recommendations,
    get_cost_breakdown,
)

def test_optimizer_baseline_4cr_budget_compliance():
    """
    Verifies optimization strictly respects the ₹4.00 Crore (400 Lakhs) budget limit.
    """
    result = optimize_stadium_network(budget_limit_crores=4.0)

    budget = result["budget_summary"]
    assert budget["budget_limit_crores"] == 4.0
    assert budget["budget_limit_lakhs"] == 400.0
    assert budget["total_expenditure_lakhs"] <= 400.0
    assert budget["total_expenditure_crores"] <= 4.0
    assert budget["remaining_budget_lakhs"] >= 0.0
    assert budget["is_within_budget"] is True

def test_optimizer_capacity_addition():
    """
    Verifies that solver adds substantial practical capacity and details COW/Small cell mix.
    """
    result = optimize_stadium_network(budget_limit_crores=4.0)

    mix = result["recommended_mix"]
    assert mix["cows_deployed"] > 0
    assert mix["small_cells_deployed"] > 0
    assert mix["backhaul_upgrades_count"] > 0

    cap = result["capacity_results"]
    assert cap["added_capacity_gbps"] > 20.0
    assert cap["post_deployment_capacity_gbps"] > cap["original_installed_rf_gbps"]
    assert len(result["cow_deployments"]) == mix["cows_deployed"]

def test_optimizer_dependency_constraints():
    """
    Verifies technical telecom dependency: 5G overlay on M4 and M6 requires fibre backhaul.
    """
    result = optimize_stadium_network(budget_limit_crores=4.0)
    upgrades = result["recommended_mix"]["upgrades"]

    if upgrades["five_g_m4"]:
        assert upgrades["fiber_m4"] is True
    if upgrades["five_g_m6"]:
        assert upgrades["fiber_m6"] is True

def test_optimizer_site_interventions():
    """
    Verifies all 8 sites receive concrete engineering action plans.
    """
    result = optimize_stadium_network(budget_limit_crores=4.0)
    sites = result["site_interventions"]
    assert len(sites) == 8

    m4 = next(s for s in sites if s["site_id"] == "M4")
    assert "Fibre" in m4["new_backhaul"]
    assert len(m4["actions"]) > 0

    s1 = next(s for s in sites if s["site_id"] == "S1")
    assert len(s1["actions"]) > 0

def test_optimizer_infeasible_budget_honest_reporting():
    """
    Verifies rule: 'Never return a false feasible solution'.
    With an impossible budget of ₹0.5 Crore (50 Lakhs), the system must flag
    unresolved constraints rather than falsely claiming 100% SLA satisfaction.
    """
    result = optimize_stadium_network(budget_limit_crores=0.5)
    assert result["budget_summary"]["total_expenditure_crores"] <= 0.5
    assert len(result["unresolved_constraints"]) > 0

def test_optimizer_api_endpoints_direct():
    """
    Tests direct execution of optimizer endpoints.
    """
    # GET recommended
    rec = get_recommended_optimization(budget_limit_crores=4.0)
    assert rec["budget_summary"]["is_within_budget"] is True

    # POST custom optimization
    req = OptimizationRequest(budget_limit_crores=4.0, capacity=100000)
    post_res = post_custom_optimization(payload=req)
    assert post_res["budget_summary"]["total_expenditure_crores"] <= 4.0

    # GET site recommendations
    site_recs = get_site_recommendations(budget_limit_crores=4.0)
    assert len(site_recs) == 8

    # GET cost breakdown
    costs = get_cost_breakdown(budget_limit_crores=4.0)
    assert costs["total"] <= 400.0

