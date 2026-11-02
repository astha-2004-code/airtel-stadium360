import React, { useEffect, useState } from 'react'
import apiClient from '../services/api'
import {
  TopologyData,
  SiteDetail,
  SiteSummary,
  BeforeAfterRecord,
} from '../types/network'
import { StadiumDigitalTwin } from '../components/network/StadiumDigitalTwin'
import { GeospatialMapView } from '../components/network/GeospatialMapView'
import { SiteDetailsDrawer } from '../components/network/SiteDetailsDrawer'
import { BeforeAfterModal } from '../components/network/BeforeAfterModal'
import {
  Radio,
  Wifi,
  Layers,
  Eye,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  RefreshCw,
  Truck,
  Sparkles,
  ArrowRight,
  MapPin,
  Compass,
} from 'lucide-react'

interface DigitalTwinPageProps {
  matchPhase: string
  refreshTrigger: number
}

export const DigitalTwinPage: React.FC<DigitalTwinPageProps> = ({
  matchPhase,
  refreshTrigger,
}) => {
  const [topology, setTopology] = useState<TopologyData | null>(null)
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>('M4') // Default to bottleneck M4
  const [siteDetail, setSiteDetail] = useState<SiteDetail | null>(null)
  const [beforeAfterData, setBeforeAfterData] = useState<BeforeAfterRecord[]>([])

  const [viewMode, setViewMode] = useState<'conceptual' | 'geospatial'>('conceptual')
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true)
  const [showBackhaul, setShowBackhaul] = useState<boolean>(true)
  const [showProposed, setShowProposed] = useState<boolean>(true)
  const [isAfterDeployment, setIsAfterDeployment] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(true)
  const [detailLoading, setDetailLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial topology and before-after data
  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    Promise.all([
      apiClient.get('/network/topology', { params: { phase: matchPhase } }),
      apiClient.get('/network/before-after'),
    ])
      .then(([topoRes, baRes]) => {
        if (!isMounted) return
        setTopology(topoRes.data)
        setBeforeAfterData(baRes.data)
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('Failed to load topology:', err)
        setError(err.message || 'Error connecting to network APIs')
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [matchPhase, refreshTrigger])

  // Fetch selected site detail whenever selectedSiteId changes
  useEffect(() => {
    if (!selectedSiteId) return
    let isMounted = true
    setDetailLoading(true)

    apiClient
      .get(`/network/sites/${selectedSiteId}`, { params: { phase: matchPhase } })
      .then((res) => {
        if (!isMounted) return
        setSiteDetail(res.data)
        setDetailLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('Failed to load site detail:', err)
        setDetailLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [selectedSiteId, matchPhase])

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#E40000] border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium text-slate-400 font-mono">
          Loading 8-Site Stadium Network Digital Twin from Database...
        </p>
      </div>
    )
  }

  if (error || !topology) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800 text-[#FF4D4D]">
          <AlertTriangle className="w-10 h-10 mx-auto" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Digital Twin Unavailable</h2>
          <p className="text-xs text-slate-400 max-w-md">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Layer Toggles */}
      <div className="card-gradient rounded-2xl p-5 border border-[#223050] flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF4D4D] font-bold">
              Module 2 • Stadium Network Digital Twin
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Interactive RF Topology &amp; Physical Infrastructure
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
            Click any macro tower or small cell node to inspect real-time sector load, 5G n78 status, and backhaul bottlenecks.
          </p>
        </div>

        {/* Visual Layer Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* View Mode Switcher */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-0.5 flex items-center space-x-1">
            <button
              onClick={() => setViewMode('conceptual')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                viewMode === 'conceptual'
                  ? 'bg-[#E40000] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Conceptual</span>
            </button>
            <button
              onClick={() => setViewMode('geospatial')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                viewMode === 'geospatial'
                  ? 'bg-[#E40000] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Leaflet Map</span>
            </button>
          </div>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            disabled={viewMode === 'geospatial'}
            className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 font-medium transition-colors ${
              showHeatmap
                ? 'bg-red-950/60 border-red-700/60 text-red-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            } ${viewMode === 'geospatial' ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <Layers className="w-3.5 h-3.5 text-red-400" />
            <span>Heatmap Overlay</span>
          </button>

          <button
            onClick={() => setShowBackhaul(!showBackhaul)}
            className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 font-medium transition-colors ${
              showBackhaul
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Backhaul Links</span>
          </button>

          <button
            onClick={() => setShowProposed(!showProposed)}
            className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 font-medium transition-colors ${
              showProposed
                ? 'bg-blue-950/60 border-blue-700/60 text-blue-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>Proposed Assets</span>
          </button>

          {/* Before vs After Deployment Strategy Toggle */}
          <button
            onClick={() => setIsAfterDeployment(!isAfterDeployment)}
            className={`px-3.5 py-1.5 rounded-xl border flex items-center space-x-1.5 font-bold transition-all shadow-md ${
              isAfterDeployment
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
                : 'bg-red-900/60 hover:bg-red-800 text-red-200 border-red-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isAfterDeployment ? 'Viewing: Post-Deploy' : 'Viewing: Baseline'}</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-medium flex items-center space-x-1.5"
          >
            <span>Compare Strategy</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Grid: Digital Twin Canvas + Site Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Stadium Digital Twin Visualization (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {viewMode === 'conceptual' ? (
            <StadiumDigitalTwin
              sites={topology.sites}
              proposedAssets={topology.proposed_assets}
              selectedSiteId={selectedSiteId}
              onSelectSite={(id) => setSelectedSiteId(id)}
              showHeatmap={showHeatmap}
              showBackhaul={showBackhaul}
              showProposed={showProposed}
              isAfterDeployment={isAfterDeployment}
            />
          ) : (
            <GeospatialMapView
              sites={topology.sites}
              proposedAssets={topology.proposed_assets}
              stadiumCenter={topology.stadium_center}
              selectedSiteId={selectedSiteId}
              onSelectSite={(id) => setSelectedSiteId(id)}
              showBackhaul={showBackhaul}
              showProposed={showProposed}
            />
          )}

          {/* Quick Site Selector Pill Bar */}
          <div className="p-3 card-gradient rounded-xl border border-[#223050] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold">Quick Select Site:</span>
            <div className="flex flex-wrap gap-1.5">
              {topology.sites.map((s) => (
                <button
                  key={s.site_id}
                  onClick={() => setSelectedSiteId(s.site_id)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all ${
                    selectedSiteId === s.site_id
                      ? 'bg-[#E40000] text-white shadow-md shadow-red-900/50'
                      : s.is_bottleneck
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {s.site_id} {s.is_bottleneck && '⚠'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Site Details Drawer & Subsystem Diagnostics (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <SiteDetailsDrawer
            siteDetail={siteDetail}
            onClose={() => setSelectedSiteId(null)}
            isLoading={detailLoading}
          />

          {/* Infrastructure Assets List */}
          <div className="card-gradient rounded-2xl p-5 border border-[#223050] space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Proposed Infrastructure Assets (9 Modules)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                ₹2.22 Cr Total
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
              {topology.proposed_assets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-white text-[11px]">{asset.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                        {asset.asset_type}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{asset.notes}</p>
                  </div>
                  <span className="font-mono font-bold text-white text-xs shrink-0 ml-2">
                    ₹{(asset.cost_inr / 100000).toFixed(1)} L
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Before vs After Deployment Comparison Modal */}
      <BeforeAfterModal
        data={beforeAfterData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
