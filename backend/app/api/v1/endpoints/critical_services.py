"""
Airtel Stadium360 - Critical Services & UPI Protection Endpoints
Exposes REST APIs for UPI reliability metrics, 3GPP QoS network slices,
end-to-end payment latency breakdowns, site-by-site merchant telemetry,
automated congestion policies, and live simulation.
"""
from typing import List, Optional
from fastapi import APIRouter, Query
from backend.app.schemas.critical_services import (
    UpiReliabilityKpis,
    QosSliceDefinition,
    PaymentHopLatency,
    SiteUpiTelemetry,
    CongestionResponsePolicy,
    CriticalServicesSimulationRequest,
    CriticalServicesSimulationResponse,
)
from backend.app.services.critical_services_engine import critical_services_engine

router = APIRouter()


@router.get("/upi-reliability", response_model=UpiReliabilityKpis)
def get_upi_reliability(
    capacity: int = Query(100000, ge=10000, le=150000, description="Stadium spectators"),
):
    """
    Returns headline UPI reliability benchmarks comparing historical baseline (7.0% failure)
    against Airtel Stadium360 QoS-prioritized state (1.12% failure).
    """
    return critical_services_engine.get_upi_reliability_kpis(capacity=capacity)


@router.get("/qos-slices", response_model=List[QosSliceDefinition])
def get_qos_slices():
    """
    Returns the 3GPP Rel-15/Rel-16 3-tier QoS slice configurations
    (Emergency SOS 5QI-1, UPI Payment 5QI-5, and General eMBB 5QI-9).
    """
    return critical_services_engine.get_qos_slices()


@router.get("/payment-hop-latencies", response_model=List[PaymentHopLatency])
def get_payment_hop_latencies():
    """
    Returns the multi-hop end-to-end payment latency breakdown
    demonstrating the elimination of RAN bufferbloat.
    """
    return critical_services_engine.get_payment_hop_latencies()


@router.get("/site-telemetry", response_model=List[SiteUpiTelemetry])
def get_site_upi_telemetry():
    """
    Returns site-by-site merchant transaction volumes, failure rates,
    and protected GMV across all 8 stadium sectors.
    """
    return critical_services_engine.get_site_upi_telemetry()


@router.get("/congestion-policies", response_model=List[CongestionResponsePolicy])
def get_congestion_policies():
    """
    Returns automated network congestion response policies that trigger
    during traffic spikes to protect critical life-safety and financial packets.
    """
    return critical_services_engine.get_congestion_policies()


@router.post("/simulate", response_model=CriticalServicesSimulationResponse)
def simulate_critical_services(req: CriticalServicesSimulationRequest):
    """
    Simulates UPI reliability and emergency service performance under variable operational inputs.
    """
    return critical_services_engine.simulate_critical_services(req)
