"""
Airtel Stadium360 — Financial & Budget API Endpoints
Provides budget utilization, CapEx/OpEx breakdowns, asset inventory,
and role-protected allocation & administrative approval under the strict ₹4.00 Crore cap.
"""

from typing import Dict, Any, List, Optional
from typing_extensions import Annotated
from fastapi import APIRouter, Query, Body, Depends, HTTPException, status

from app.schemas.budget import (
    BudgetAllocationRequest,
    BudgetSummaryResponse,
    CostEffectivenessResponse,
    AssetItem,
    TimelineMilestone,
)
from app.services.budget_engine import (
    calculate_budget_summary,
    calculate_cost_effectiveness_metrics,
    get_asset_inventory,
    get_deployment_timeline,
)
from app.api.deps import get_current_admin, get_current_engineer_or_admin
from app.models.user import User

router = APIRouter()


@router.get("/summary", response_model=BudgetSummaryResponse)
def get_budget_summary(
    budget_limit_crores: Annotated[float, Query(description="Budget cap in Crores INR")] = 4.0,
    cows_count: Annotated[int, Query(description="COWs count")] = 4,
    small_cells_count: Annotated[int, Query(description="Small cells count")] = 26,
    fibre_km: Annotated[float, Query(description="Fibre upgrade distance km")] = 0.99,
    macro_5g_overlays_count: Annotated[int, Query(description="Macro 5G overlays")] = 2,
    small_cell_5g_overlays_count: Annotated[int, Query(description="Small cell 5G overlays")] = 2,
) -> Dict[str, Any]:
    """
    Returns budget utilization, remaining buffer, CapEx/OpEx breakdown, and threshold status.
    Accessible to all authenticated personas (Admin, Engineer, Viewer).
    """
    return calculate_budget_summary(
        budget_limit_crores=budget_limit_crores,
        cows_count=cows_count,
        small_cells_count=small_cells_count,
        fibre_km=fibre_km,
        macro_5g_overlays_count=macro_5g_overlays_count,
        small_cell_5g_overlays_count=small_cell_5g_overlays_count,
    )


@router.get("/cost-effectiveness", response_model=CostEffectivenessResponse)
def get_cost_effectiveness(
    budget_limit_crores: Annotated[float, Query(description="Budget cap in Crores INR")] = 4.0,
    cows_count: Annotated[int, Query(description="COWs count")] = 4,
    small_cells_count: Annotated[int, Query(description="Small cells count")] = 26,
    fibre_km: Annotated[float, Query(description="Fibre upgrade distance km")] = 0.99,
    macro_5g_overlays_count: Annotated[int, Query(description="Macro 5G overlays")] = 2,
    small_cell_5g_overlays_count: Annotated[int, Query(description="Small cell 5G overlays")] = 2,
    capacity: Annotated[int, Query(description="Total crowd size")] = 100000,
    airtel_share: Annotated[float, Query(description="Airtel share")] = 0.40,
    peak_online_pct: Annotated[float, Query(description="Peak concurrency %")] = 0.18,
) -> Dict[str, Any]:
    """
    Returns telecom cost-effectiveness metrics (Cost/Gbps, Cost/User, ROI score, UPI revenue preserved).
    """
    return calculate_cost_effectiveness_metrics(
        budget_limit_crores=budget_limit_crores,
        cows_count=cows_count,
        small_cells_count=small_cells_count,
        fibre_km=fibre_km,
        macro_5g_overlays_count=macro_5g_overlays_count,
        small_cell_5g_overlays_count=small_cell_5g_overlays_count,
        capacity=capacity,
        airtel_share=airtel_share,
        peak_online_pct=peak_online_pct,
    )


@router.get("/assets", response_model=List[AssetItem])
def get_assets() -> List[Dict[str, Any]]:
    """
    Returns itemized physical and rented asset inventory catalog.
    """
    return get_asset_inventory()


@router.get("/timeline", response_model=List[TimelineMilestone])
def get_timeline() -> List[Dict[str, Any]]:
    """
    Returns the 4-week pre-match deployment timeline and milestone deliverables.
    """
    return get_deployment_timeline()


@router.post("/allocate", response_model=BudgetSummaryResponse)
def post_allocate_budget(
    payload: BudgetAllocationRequest = Body(...),
    current_user: Optional[User] = Depends(get_current_engineer_or_admin)
) -> Dict[str, Any]:
    """
    Computes custom budget allocation and CapEx/OpEx split via JSON payload.
    Restricted to TELECOM_ENGINEER and NETWORK_ADMIN personas.
    """
    return calculate_budget_summary(
        budget_limit_crores=payload.budget_limit_crores,
        cows_count=payload.cows_count,
        small_cells_count=payload.small_cells_count,
        fibre_km=payload.fibre_km,
        macro_5g_overlays_count=payload.macro_5g_overlays_count,
        small_cell_5g_overlays_count=payload.small_cell_5g_overlays_count,
    )


@router.post("/approve", response_model=BudgetSummaryResponse)
def approve_budget_plan(
    payload: BudgetAllocationRequest = Body(...),
    admin_user: Optional[User] = Depends(get_current_admin)
) -> Dict[str, Any]:
    """
    Formally approves and commits the budget plan under the ₹4.00 Crore cap.
    Strictly restricted to NETWORK_ADMIN persona.
    """
    summary = calculate_budget_summary(
        budget_limit_crores=payload.budget_limit_crores,
        cows_count=payload.cows_count,
        small_cells_count=payload.small_cells_count,
        fibre_km=payload.fibre_km,
        macro_5g_overlays_count=payload.macro_5g_overlays_count,
        small_cell_5g_overlays_count=payload.small_cell_5g_overlays_count,
    )
    if not summary["is_within_budget"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Cannot approve budget: planned expenditure (₹{summary['total_expenditure_crores']:.3f} Cr) "
                f"exceeds cap limit (₹{payload.budget_limit_crores:.2f} Cr)."
            )
        )
    summary["status"] = "APPROVED_BY_ADMIN"
    return summary
