from app.core.database import SessionLocal
from app.api.v1.endpoints.network import (
    list_sites,
    get_site_detail,
    list_measurements,
    get_site_health,
    get_stadium_topology,
    get_before_after_comparison
)

def test_list_sites():
    db = SessionLocal()
    try:
        sites = list_sites(phase="Innings break", db=db)
        assert len(sites) == 8
        site_ids = [s.site_id for s in sites]
        assert "M1" in site_ids
        assert "M4" in site_ids
        assert "S1" in site_ids
        assert "S2" in site_ids

        # 6 Macros and 2 Small Cells
        macros = [s for s in sites if s.site_type == "Macro"]
        small_cells = [s for s in sites if s.site_type == "Small cell (in-bowl)"]
        assert len(macros) == 6
        assert len(small_cells) == 2

        # Check backhaul bottleneck flags
        m4 = next(s for s in sites if s.site_id == "M4")
        assert m4.is_bottleneck is True
        assert m4.backhaul_capacity_gbps == 2.0

        m1 = next(s for s in sites if s.site_id == "M1")
        assert m1.is_bottleneck is False
        assert m1.backhaul_capacity_gbps == 10.0
    finally:
        db.close()

def test_site_detail():
    db = SessionLocal()
    try:
        detail = get_site_detail(site_id="M4", phase="Innings break", db=db)
        assert detail.site_id == "M4"
        assert detail.has_5g is False
        assert detail.backhaul_type == "Microwave 2G"
        assert len(detail.measurements) == 4
        assert "fibre" in detail.recommended_upgrade.lower()

        m1_detail = get_site_detail(site_id="M1", phase="Innings break", db=db)
        assert m1_detail.has_5g is True
        assert m1_detail.backhaul_type == "Fibre 10G"
    finally:
        db.close()

def test_list_measurements():
    db = SessionLocal()
    try:
        # All 32 measurements
        all_meas = list_measurements(db=db)
        assert len(all_meas) == 32

        # Filtered by site
        m1_meas = list_measurements(site_id="M1", db=db)
        assert len(m1_meas) == 4

        # Filtered by phase
        innings_meas = list_measurements(phase="Innings break", db=db)
        assert len(innings_meas) == 8
    finally:
        db.close()

def test_site_health():
    db = SessionLocal()
    try:
        # M4 during innings break has 98.9% load
        health_m4 = get_site_health(site_id="M4", phase="Innings break", db=db)
        assert health_m4.status == "CRITICAL"
        assert health_m4.health_score < 50
        assert "Bottleneck" in health_m4.backhaul_status
    finally:
        db.close()

def test_stadium_topology():
    db = SessionLocal()
    try:
        topo = get_stadium_topology(phase="Innings break", db=db)
        assert topo.total_sites == 8
        assert topo.macro_count == 6
        assert topo.small_cell_count == 2
        assert topo.bottleneck_count == 4  # M4, M6, S1, S2
        assert len(topo.proposed_assets) >= 7
        assert topo.stadium_center["lat"] == 23.0917
    finally:
        db.close()

def test_before_after_comparison():
    db = SessionLocal()
    try:
        comparison = get_before_after_comparison(db=db)
        assert len(comparison) == 8
        for c in comparison:
            # Saturated before load transformed to <= 80% after load
            assert c.after_load_pct <= 80.0
            # User speeds improved to >= 5.0 Mbps
            assert c.after_speed_mbps >= 5.0
            # All sites upgraded to 10G backhaul and 5G capability
            assert c.after_has_5g is True
            assert c.after_backhaul_gbps == 10.0
    finally:
        db.close()
