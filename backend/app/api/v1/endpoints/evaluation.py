"""
Airtel Stadium360 - Network Performance Evaluation & Optimization Endpoints
Author: ByteForge | NIT Delhi
Exposes REST APIs for comprehensive network evaluation, site-wise utilization matrices,
throughput compliance, 5G accessibility, UPI reliability, and 3-way scenario benchmarking.
"""
from fastapi import APIRouter, Query
from app.schemas.evaluation import (
    EvaluationOverviewResponse,
    NetworkUtilizationMetrics,
    ThroughputPerformanceMetrics,
    FiveGAccessibilityMetrics,
    UpiReliabilityMetrics,
    BackhaulPerformanceMetrics,
    FinancialEvaluationMetrics,
    EvaluationCompareRequest,
    EvaluationCompareResponse,
)
from app.services.evaluation_engine import evaluation_engine

router = APIRouter()


@router.get("/overview", response_model=EvaluationOverviewResponse)
def get_evaluation_overview(
    capacity: int = Query(100000, ge=10000, le=150000, description="Stadium spectator attendance"),
):
    """
    Returns full executive evaluation overview, including composite network health score,
    utilization metrics, throughput, 5G accessibility, UPI reliability, and financial return.
    """
    return evaluation_engine.get_evaluation_overview(capacity=capacity)


@router.get("/network", response_model=NetworkUtilizationMetrics)
def get_network_evaluation(
    capacity: int = Query(100000, ge=10000, le=150000, description="Stadium spectator attendance"),
):
    """
    Returns 4G and 5G network utilization metrics, peak loads, sites exceeding 80%,
    and site-wise utilization matrix with congestion reduction calculations.
    """
    return evaluation_engine.calculate_utilization_metrics(capacity=capacity)


@router.get("/throughput", response_model=ThroughputPerformanceMetrics)
def get_throughput_evaluation(
    capacity: int = Query(100000, ge=10000, le=150000, description="Stadium spectator attendance"),
):
    """
    Returns user speed deterioration from normal to peak phases, target throughput compliance
    (4G: 3Mbps, 5G: 5Mbps), and available vs required capacity improvement.
    """
    return evaluation_engine.calculate_throughput_metrics(capacity=capacity)


@router.get("/reliability", response_model=UpiReliabilityMetrics)
def get_reliability_evaluation(
    capacity: int = Query(100000, ge=10000, le=150000, description="Stadium spectator attendance"),
):
    """
    Returns UPI payment failure rates comparing normal-day vs match baseline vs proposed 5QI-5 slicing,
    distinguishing RAN bufferbloat elimination from external bank core failures.
    """
    return evaluation_engine.calculate_upi_reliability_metrics(capacity=capacity)


@router.get("/backhaul", response_model=BackhaulPerformanceMetrics)
def get_backhaul_evaluation():
    """
    Returns backhaul media, capacities, bottleneck detection (M4, M6, S1, S2),
    and proposed 0.99 km dedicated 10G dark fibre improvements.
    """
    return evaluation_engine.calculate_backhaul_metrics()


@router.get("/financial", response_model=FinancialEvaluationMetrics)
def get_financial_evaluation(
    capacity: int = Query(100000, ge=10000, le=150000, description="Stadium spectator attendance"),
):
    """
    Returns financial return metrics, unit costs per Gbps / user, CapEx vs OpEx splits,
    and multi-strategy deployment comparisons under the ₹4.00 Crore budget cap.
    """
    return evaluation_engine.calculate_financial_metrics(capacity=capacity)


@router.post("/compare", response_model=EvaluationCompareResponse)
def compare_evaluation_scenarios(
    request: EvaluationCompareRequest,
):
    """
    Executes dedicated 3-way evaluation comparing:
    1. Baseline network (65,000 spectators / unoptimized)
    2. Proposed network (100,000 spectators / recommended SLA)
    3. User's dynamic simulated scenario (with real-time what-if parameter tuning)
    """
    return evaluation_engine.compare_scenarios(
        capacity=request.capacity,
        airtel_share=request.airtel_share,
        device_share_5g=request.device_share_5g,
        peak_online_pct=request.peak_online_pct,
        target_speed_5g_mbps=request.target_speed_5g_mbps,
        target_speed_4g_mbps=request.target_speed_4g_mbps,
        target_utilization=request.target_utilization,
        cows_deployed=request.cows_deployed,
        small_cells_deployed=request.small_cells_deployed,
        fibre_distance_km=request.fibre_distance_km,
        five_g_overlays_count=request.five_g_overlays_count,
    )

