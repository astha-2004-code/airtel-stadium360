export interface MeasurementRecord {
  id: number
  site_id: string
  match_phase: string
  time_of_day: string
  normal_4g_load_pct: number
  match_4g_load_pct: number
  normal_4g_speed_mbps: number
  match_4g_speed_mbps: number
  normal_5g_speed_mbps: number | null
  match_5g_speed_mbps: number | null
  match_5g_connection_success_pct: number
}

export interface InfrastructureAsset {
  id: string
  site_id?: string
  asset_type: 'COW' | 'SMALL_CELL' | 'FIBRE_UPGRADE'
  name: string
  capacity_added_gbps: number
  cost_inr: number
  status: string
  latitude: number
  longitude: number
  notes?: string
}

export interface SiteSummary {
  site_id: string
  name: string
  site_type: string
  distance_m: number
  azimuth_deg: number
  latitude: number
  longitude: number
  backhaul_type: string
  backhaul_capacity_gbps: number
  has_5g: boolean
  rf_bands: string
  description?: string
  is_bottleneck: boolean
  current_load_pct: number
  current_speed_mbps: number
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL'
}

export interface SiteDetail extends SiteSummary {
  measurements: MeasurementRecord[]
  associated_assets: InfrastructureAsset[]
  recommended_upgrade: string
  en_dc_status: string
}

export interface TopologyData {
  stadium_center: { lat: number; lon: number }
  sites: SiteSummary[]
  proposed_assets: InfrastructureAsset[]
  total_sites: number
  macro_count: number
  small_cell_count: number
  bottleneck_count: number
}

export interface BeforeAfterRecord {
  site_id: string
  site_name: string
  before_load_pct: number
  after_load_pct: number
  before_speed_mbps: number
  after_speed_mbps: number
  before_has_5g: boolean
  after_has_5g: boolean
  before_backhaul_gbps: number
  after_backhaul_gbps: number
  proposed_deployment: string
  estimated_cost_inr: number
}
