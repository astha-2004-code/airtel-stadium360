"""
Database Seeder for Airtel Stadium360
Populates all 8 stadium sites, 32 historical telemetry records from Sync_V1.xlsx,
and proposed infrastructure assets into the database.
"""

from sqlalchemy.orm import Session
from app.models.network import StadiumSite, NetworkMeasurement, InfrastructureAsset
from app.models.base import Base
from app.core.database import engine
from app.services.data_loader import STADIUM_SITES, MATCH_MEASUREMENTS

STADIUM_CENTER = {"lat": 23.0917, "lon": 72.5975}

SITE_COORDINATES = {
    "M1": {"lat": 23.09374, "lon": 72.59972, "azimuth": 45, "bands": "B3 (1800MHz) + n78 (3.5GHz)"},
    "M2": {"lat": 23.09170, "lon": 72.60152, "azimuth": 90, "bands": "B3 (1800MHz) + n78 (3.5GHz)"},
    "M3": {"lat": 23.08909, "lon": 72.59750, "azimuth": 180, "bands": "B3 (1800MHz) + n78 (3.5GHz)"},
    "M4": {"lat": 23.08928, "lon": 72.59487, "azimuth": 225, "bands": "B1/B3/B40 (4G Only)"},
    "M5": {"lat": 23.09170, "lon": 72.59456, "azimuth": 270, "bands": "B3 (1800MHz) + n78 (3.5GHz)"},
    "M6": {"lat": 23.09457, "lon": 72.59438, "azimuth": 315, "bands": "B1/B3 (4G Only)"},
    "S1": {"lat": 23.09242, "lon": 72.59750, "azimuth": 0, "bands": "B3 In-Bowl (4G Only)"},
    "S2": {"lat": 23.09098, "lon": 72.59750, "azimuth": 180, "bands": "B3 In-Bowl (4G Only)"},
}

PROPOSED_ASSETS = [
    {
        "id": "COW-01",
        "site_id": "M1",
        "asset_type": "COW",
        "name": "Cell on Wheels 1 (North-East Concourse)",
        "capacity_added_gbps": 5.0,
        "cost_inr": 2500000.0,
        "status": "PROPOSED",
        "latitude": 23.0932,
        "longitude": 72.5985,
        "notes": "Relieves Gate 1-3 pedestrian ingress load with dual 4G/5G carrier"
    },
    {
        "id": "COW-02",
        "site_id": "M3",
        "asset_type": "COW",
        "name": "Cell on Wheels 2 (South Concourse & Food Court)",
        "capacity_added_gbps": 5.0,
        "cost_inr": 2500000.0,
        "status": "PROPOSED",
        "latitude": 23.0898,
        "longitude": 72.5965,
        "notes": "Offloads South food court & protects UPI concession traffic"
    },
    {
        "id": "COW-03",
        "site_id": "M5",
        "asset_type": "COW",
        "name": "Cell on Wheels 3 (West Pavilion Entry)",
        "capacity_added_gbps": 5.0,
        "cost_inr": 2500000.0,
        "status": "PROPOSED",
        "latitude": 23.0915,
        "longitude": 72.5950,
        "notes": "Absorbs West VIP stand overflow & prevents M5 sector congestion"
    },
    {
        "id": "SC-PROP-01",
        "site_id": "M2",
        "asset_type": "SMALL_CELL",
        "name": "Proposed 5G In-Bowl Small Cell East",
        "capacity_added_gbps": 2.5,
        "cost_inr": 800000.0,
        "status": "PROPOSED",
        "latitude": 23.0917,
        "longitude": 72.5992,
        "notes": "Dedicated 5G n78 in-bowl small cell covering East Tier 2"
    },
    {
        "id": "SC-PROP-02",
        "site_id": "M5",
        "asset_type": "SMALL_CELL",
        "name": "Proposed 5G In-Bowl Small Cell West",
        "capacity_added_gbps": 2.5,
        "cost_inr": 800000.0,
        "status": "PROPOSED",
        "latitude": 23.0917,
        "longitude": 72.5958,
        "notes": "High-capacity micro-sector for West stand Club Enclosure"
    },
    {
        "id": "SC-PROP-03",
        "site_id": "S1",
        "asset_type": "SMALL_CELL",
        "name": "Upgraded 5G Small Cell North",
        "capacity_added_gbps": 2.5,
        "cost_inr": 800000.0,
        "status": "PROPOSED",
        "latitude": 23.0928,
        "longitude": 72.5975,
        "notes": "Replaces legacy 4G-only S1 with dual-mode 4G+5G small cell"
    },
    {
        "id": "SC-PROP-04",
        "site_id": "S2",
        "asset_type": "SMALL_CELL",
        "name": "Upgraded 5G Small Cell South",
        "capacity_added_gbps": 2.5,
        "cost_inr": 800000.0,
        "status": "PROPOSED",
        "latitude": 23.0905,
        "longitude": 72.5975,
        "notes": "Replaces legacy 4G-only S2 with dual-mode 4G+5G small cell"
    },
    {
        "id": "FIBRE-M4",
        "site_id": "M4",
        "asset_type": "FIBRE_UPGRADE",
        "name": "M4 10G Optical Fibre Backhaul Upgrade",
        "capacity_added_gbps": 8.0,
        "cost_inr": 4000000.0,
        "status": "PROPOSED",
        "latitude": 23.08928,
        "longitude": 72.59487,
        "notes": "0.8 km fibre trenching replacing 2 Gbps microwave bottleneck"
    },
    {
        "id": "FIBRE-M6",
        "site_id": "M6",
        "asset_type": "FIBRE_UPGRADE",
        "name": "M6 10G Optical Fibre Backhaul Upgrade",
        "capacity_added_gbps": 8.0,
        "cost_inr": 5000000.0,
        "status": "PROPOSED",
        "latitude": 23.09457,
        "longitude": 72.59438,
        "notes": "1.0 km fibre trenching replacing 2 Gbps microwave bottleneck"
    }
]

def seed_database(db: Session):
    """
    Creates tables if not existing and seeds baseline sites, measurements, and assets.
    """
    # Create all tables
    Base.metadata.create_all(bind=engine)

    # 1. Seed Sites if empty
    existing_sites_count = db.query(StadiumSite).count()
    if existing_sites_count == 0:
        for s in STADIUM_SITES:
            sid = s["site_id"]
            coord = SITE_COORDINATES.get(sid, {"lat": 23.0917, "lon": 72.5975, "azimuth": 0, "bands": "B3"})
            site_obj = StadiumSite(
                site_id=sid,
                name=f"Site {sid} ({s['type']})",
                site_type=s["type"],
                distance_m=s["distance_m"],
                azimuth_deg=coord["azimuth"],
                latitude=coord["lat"],
                longitude=coord["lon"],
                backhaul_type=s["backhaul"],
                backhaul_capacity_gbps=s["backhaul_capacity_gbps"],
                has_5g=s["has_5g"],
                rf_bands=coord["bands"],
                description=s["description"]
            )
            db.add(site_obj)
        db.commit()

    # 2. Seed Measurements if empty
    existing_measurements_count = db.query(NetworkMeasurement).count()
    if existing_measurements_count == 0:
        for m in MATCH_MEASUREMENTS:
            meas_obj = NetworkMeasurement(
                site_id=m["site"],
                match_phase=m["phase"],
                time_of_day=m["time"],
                normal_4g_load_pct=m["normal_4g_load"],
                match_4g_load_pct=m["match_4g_load"],
                normal_4g_speed_mbps=m["normal_4g_speed"],
                match_4g_speed_mbps=m["match_4g_speed"],
                normal_5g_speed_mbps=m["normal_5g_speed"],
                match_5g_speed_mbps=m["match_5g_speed"],
                match_5g_connection_success_pct=m["match_5g_success"]
            )
            db.add(meas_obj)
        db.commit()

    # 3. Seed Proposed Infrastructure Assets if empty
    existing_assets_count = db.query(InfrastructureAsset).count()
    if existing_assets_count == 0:
        for a in PROPOSED_ASSETS:
            asset_obj = InfrastructureAsset(
                id=a["id"],
                site_id=a["site_id"],
                asset_type=a["asset_type"],
                name=a["name"],
                capacity_added_gbps=a["capacity_added_gbps"],
                cost_inr=a["cost_inr"],
                status=a["status"],
                latitude=a["latitude"],
                longitude=a["longitude"],
                notes=a["notes"]
            )
            db.add(asset_obj)
        db.commit()

