from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class MeasurementSchema(BaseModel):
    id: int
    site_id: str
    match_phase: str
    time_of_day: str
    normal_4g_load_pct: float
    match_4g_load_pct: float
    normal_4g_speed_mbps: float
    match_4g_speed_mbps: float
    normal_5g_speed_mbps: Optional[float] = None
    match_5g_speed_mbps: Optional[float] = None
    match_5g_connection_success_pct: float

    model_config = ConfigDict(from_attributes=True)

class InfrastructureAssetSchema(BaseModel):
    id: str
    site_id: Optional[str] = None
    asset_type: str
    name: str
    capacity_added_gbps: float
    cost_inr: float
    status: str
    latitude: float
    longitude: float
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class SiteSummary(BaseModel):
    site_id: str
    name: str
    site_type: str
    distance_m: int
    azimuth_deg: int
    latitude: float
    longitude: float
    backhaul_type: str
    backhaul_capacity_gbps: float
    has_5g: bool
    rf_bands: str
    description: Optional[str] = None
    is_bottleneck: bool
    current_load_pct: float
    current_speed_mbps: float
    status: str

    model_config = ConfigDict(from_attributes=True)

class SiteDetail(SiteSummary):
    measurements: List[MeasurementSchema]
    associated_assets: List[InfrastructureAssetSchema]
    recommended_upgrade: str
    en_dc_status: str

class SiteHealthSummary(BaseModel):
    site_id: str
    health_score: int
    status: str
    load_pct: float
    speed_mbps: float
    backhaul_status: str
    connection_success_pct: float

class TopologyResponse(BaseModel):
    stadium_center: dict
    sites: List[SiteSummary]
    proposed_assets: List[InfrastructureAssetSchema]
    total_sites: int
    macro_count: int
    small_cell_count: int
    bottleneck_count: int

class BeforeAfterComparisonResponse(BaseModel):
    site_id: str
    site_name: str
    before_load_pct: float
    after_load_pct: float
    before_speed_mbps: float
    after_speed_mbps: float
    before_has_5g: bool
    after_has_5g: bool
    before_backhaul_gbps: float
    after_backhaul_gbps: float
    proposed_deployment: str
    estimated_cost_inr: float
