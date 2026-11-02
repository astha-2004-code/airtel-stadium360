"""
Airtel Stadium360 — Network Site & Digital Twin API Endpoints
Provides live access to stadium sites, telemetry measurements, topology, and deployment comparisons.
"""

from typing import List, Optional
from typing_extensions import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.network import StadiumSite, NetworkMeasurement, InfrastructureAsset
from app.schemas.network import (
    SiteSummary,
    SiteDetail,
    MeasurementSchema,
    InfrastructureAssetSchema,
    TopologyResponse,
    SiteHealthSummary,
    BeforeAfterComparisonResponse,
)
from app.services.seed_data import seed_database, STADIUM_CENTER

router = APIRouter()

def get_site_current_telemetry(site: StadiumSite, phase: str = "Innings break"):
    """
    Helper to extract load and speed for a site at a given phase.
    """
    meas = next((m for m in site.measurements if m.match_phase.lower() == phase.lower()), None)
    if not meas and site.measurements:
        meas = site.measurements[0]
    
    load = meas.match_4g_load_pct if meas else 20.0
    speed = meas.match_4g_speed_mbps if meas else 15.0
    is_bottleneck = site.backhaul_capacity_gbps <= 2.0
    
    status = "CRITICAL" if load >= 90 else "WARNING" if load >= 80 else "OPTIMAL"
    
    return {
        "current_load_pct": load,
        "current_speed_mbps": speed,
        "is_bottleneck": is_bottleneck,
        "status": status,
        "success_pct": meas.match_5g_connection_success_pct if meas else 99.2
    }

@router.get("/sites", response_model=List[SiteSummary])
def list_sites(
    phase: Annotated[str, Query(description="Match phase")] = "Innings break",
    db: Session = Depends(get_db)
):
    """
    Lists all 8 existing stadium network sites with real database records and current telemetry.
    """
    seed_database(db)
    sites = db.query(StadiumSite).all()
    results = []

    for s in sites:
        tel = get_site_current_telemetry(s, phase)
        results.append(
            SiteSummary(
                site_id=s.site_id,
                name=s.name,
                site_type=s.site_type,
                distance_m=s.distance_m,
                azimuth_deg=s.azimuth_deg,
                latitude=s.latitude,
                longitude=s.longitude,
                backhaul_type=s.backhaul_type,
                backhaul_capacity_gbps=s.backhaul_capacity_gbps,
                has_5g=s.has_5g,
                rf_bands=s.rf_bands,
                description=s.description,
                is_bottleneck=tel["is_bottleneck"],
                current_load_pct=tel["current_load_pct"],
                current_speed_mbps=tel["current_speed_mbps"],
                status=tel["status"]
            )
        )
    return results

@router.get("/sites/{site_id}", response_model=SiteDetail)
def get_site_detail(
    site_id: str,
    phase: Annotated[str, Query(description="Match phase")] = "Innings break",
    db: Session = Depends(get_db)
):
    """
    Retrieves full engineering and historical details for a single network site.
    """
    seed_database(db)
    site = db.query(StadiumSite).filter(StadiumSite.site_id == site_id.upper()).first()
    if not site:
        raise HTTPException(status_code=404, detail=f"Site {site_id} not found in database")

    tel = get_site_current_telemetry(site, phase)
    
    # Associated proposed assets
    assets = db.query(InfrastructureAsset).filter(InfrastructureAsset.site_id == site.site_id).all()
    
    # Upgrade recommendation logic based on actual constraints
    recommendation = "Maintain current 10G Fibre & n78 configuration; offload via adjacent COW."
    if site.site_id in ["M4", "M6"]:
        recommendation = f"Urgent: Replace {site.backhaul_type} with 10G optical fibre; deploy 5G n78 carrier."
    elif site.site_id in ["S1", "S2"]:
        recommendation = "Upgrade 1G backhaul to 10G fibre; install dual-mode 4G+5G massive MIMO micro-radio."
    
    en_dc_status = "Available (n78 active, Secondary Node Addition supported)" if site.has_5g else "Unavailable (4G Anchor Only, cannot host 5G devices)"

    return SiteDetail(
        site_id=site.site_id,
        name=site.name,
        site_type=site.site_type,
        distance_m=site.distance_m,
        azimuth_deg=site.azimuth_deg,
        latitude=site.latitude,
        longitude=site.longitude,
        backhaul_type=site.backhaul_type,
        backhaul_capacity_gbps=site.backhaul_capacity_gbps,
        has_5g=site.has_5g,
        rf_bands=site.rf_bands,
        description=site.description,
        is_bottleneck=tel["is_bottleneck"],
        current_load_pct=tel["current_load_pct"],
        current_speed_mbps=tel["current_speed_mbps"],
        status=tel["status"],
        measurements=[MeasurementSchema.model_validate(m) for m in site.measurements],
        associated_assets=[InfrastructureAssetSchema.model_validate(a) for a in assets],
        recommended_upgrade=recommendation,
        en_dc_status=en_dc_status
    )

@router.get("/measurements", response_model=List[MeasurementSchema])
def list_measurements(
    site_id: Annotated[Optional[str], Query(description="Filter by site ID")] = None,
    phase: Annotated[Optional[str], Query(description="Filter by match phase")] = None,
    db: Session = Depends(get_db)
):
    """
    Returns raw telemetry measurements across the 4 match moments.
    """
    seed_database(db)
    query = db.query(NetworkMeasurement)
    if site_id:
        query = query.filter(NetworkMeasurement.site_id == site_id.upper())
    if phase:
        query = query.filter(NetworkMeasurement.match_phase.ilike(f"%{phase}%"))
    
    return [MeasurementSchema.model_validate(m) for m in query.all()]

@router.get("/sites/{site_id}/health", response_model=SiteHealthSummary)
def get_site_health(
    site_id: str,
    phase: Annotated[str, Query()] = "Innings break",
    db: Session = Depends(get_db)
):
    """
    Calculates detailed health score for a specific site.
    """
    seed_database(db)
    site = db.query(StadiumSite).filter(StadiumSite.site_id == site_id.upper()).first()
    if not site:
        raise HTTPException(status_code=404, detail=f"Site {site_id} not found")

    tel = get_site_current_telemetry(site, phase)
    load = tel["current_load_pct"]
    speed = tel["current_speed_mbps"]
    
    # Calculate health score: penalize load > 80% and low speed
    score = int(max(10, min(100, 100 - (load - 50) * 1.6 - max(0, 5 - speed) * 8)))
    
    backhaul_status = "Bottleneck (Over-utilized)" if tel["is_bottleneck"] else "Optimal (10 Gbps High Capacity)"

    return SiteHealthSummary(
        site_id=site.site_id,
        health_score=score,
        status=tel["status"],
        load_pct=load,
        speed_mbps=speed,
        backhaul_status=backhaul_status,
        connection_success_pct=tel["success_pct"]
    )

@router.get("/topology", response_model=TopologyResponse)
def get_stadium_topology(
    phase: Annotated[str, Query()] = "Innings break",
    db: Session = Depends(get_db)
):
    """
    Returns complete digital twin topology payload with spatial coordinates, links, and proposed assets.
    """
    seed_database(db)
    sites = db.query(StadiumSite).all()
    assets = db.query(InfrastructureAsset).all()

    site_summaries = []
    macros = 0
    small_cells = 0
    bottlenecks = 0

    for s in sites:
        tel = get_site_current_telemetry(s, phase)
        if s.site_type == "Macro":
            macros += 1
        else:
            small_cells += 1
        
        if tel["is_bottleneck"]:
            bottlenecks += 1

        site_summaries.append(
            SiteSummary(
                site_id=s.site_id,
                name=s.name,
                site_type=s.site_type,
                distance_m=s.distance_m,
                azimuth_deg=s.azimuth_deg,
                latitude=s.latitude,
                longitude=s.longitude,
                backhaul_type=s.backhaul_type,
                backhaul_capacity_gbps=s.backhaul_capacity_gbps,
                has_5g=s.has_5g,
                rf_bands=s.rf_bands,
                description=s.description,
                is_bottleneck=tel["is_bottleneck"],
                current_load_pct=tel["current_load_pct"],
                current_speed_mbps=tel["current_speed_mbps"],
                status=tel["status"]
            )
        )

    return TopologyResponse(
        stadium_center=STADIUM_CENTER,
        sites=site_summaries,
        proposed_assets=[InfrastructureAssetSchema.model_validate(a) for a in assets],
        total_sites=len(sites),
        macro_count=macros,
        small_cell_count=small_cells,
        bottleneck_count=bottlenecks
    )

@router.get("/before-after", response_model=List[BeforeAfterComparisonResponse])
def get_before_after_comparison(
    db: Session = Depends(get_db)
):
    """
    Returns before vs after deployment technical comparison for all 8 sites.
    Demonstrates network transformation after proposed COWs, Small Cells, and Fibre upgrades.
    """
    seed_database(db)
    sites = db.query(StadiumSite).all()
    comparisons = []

    # Projected post-optimization values:
    # Adding COWs & in-bowl small cells offloads traffic so all sites achieve <= 80% utilization
    # Speeds improve to > 5 Mbps (5G) and > 3 Mbps (4G)
    post_deployment_map = {
        "M1": {"load": 74.5, "speed": 6.8, "has_5g": True, "backhaul": 10.0, "asset": "Offloaded by COW-01 (Gate 1)", "cost": 2500000.0},
        "M2": {"load": 72.0, "speed": 7.2, "has_5g": True, "backhaul": 10.0, "asset": "Augmented by In-Bowl Small Cell East", "cost": 800000.0},
        "M3": {"load": 71.5, "speed": 8.0, "has_5g": True, "backhaul": 10.0, "asset": "Offloaded by COW-02 (South Concourse)", "cost": 2500000.0},
        "M4": {"load": 68.0, "speed": 5.5, "has_5g": True, "backhaul": 10.0, "asset": "0.8km Fibre Upgrade + 5G n78 add", "cost": 4000000.0},
        "M5": {"load": 73.0, "speed": 7.5, "has_5g": True, "backhaul": 10.0, "asset": "Offloaded by COW-03 + In-Bowl West SC", "cost": 3300000.0},
        "M6": {"load": 52.0, "speed": 12.0, "has_5g": True, "backhaul": 10.0, "asset": "1.0km Fibre Upgrade + 5G n78 add", "cost": 5000000.0},
        "S1": {"load": 65.0, "speed": 8.5, "has_5g": True, "backhaul": 10.0, "asset": "Upgraded to 10G Fibre + Dual 4G/5G SC", "cost": 1800000.0},
        "S2": {"load": 64.0, "speed": 8.8, "has_5g": True, "backhaul": 10.0, "asset": "Upgraded to 10G Fibre + Dual 4G/5G SC", "cost": 1800000.0},
    }

    for s in sites:
        tel = get_site_current_telemetry(s, "Innings break")
        post = post_deployment_map.get(s.site_id, {
            "load": 70.0, "speed": 6.0, "has_5g": True, "backhaul": 10.0, "asset": "General optimization", "cost": 0.0
        })

        comparisons.append(
            BeforeAfterComparisonResponse(
                site_id=s.site_id,
                site_name=s.name,
                before_load_pct=tel["current_load_pct"],
                after_load_pct=post["load"],
                before_speed_mbps=tel["current_speed_mbps"],
                after_speed_mbps=post["speed"],
                before_has_5g=s.has_5g,
                after_has_5g=post["has_5g"],
                before_backhaul_gbps=s.backhaul_capacity_gbps,
                after_backhaul_gbps=post["backhaul"],
                proposed_deployment=post["asset"],
                estimated_cost_inr=post["cost"]
            )
        )

    return comparisons

