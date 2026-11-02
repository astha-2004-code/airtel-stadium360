import React, { useState, useEffect } from 'react'
import {
  Wifi,
  Sliders,
  ShieldCheck,
  Radio,
  Layers,
  FileText,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  CheckCircle2,
  Cpu,
} from 'lucide-react'
import {
  ConnectivityKpis,
  EndcArchitecture,
  MassiveMimoSector,
  CoverageTier,
  FallbackRootCause,
  RrmRecommendation,
  ConnectivitySimulationResponse,
} from '../types/connectivity'
import {
  fetchConnectivityOverview,
  fetchEndcArchitecture,
  fetchBeamformingSectors,
  fetchCoverageTiers,
  fetchFallbackAnalysis,
  fetchRrmRecommendations,
  simulateConnectivity,
} from '../services/connectivityService'
import { ConnectivityKpiOverview } from '../components/connectivity/ConnectivityKpiOverview'
import { EndcArchitectureVisualizer } from '../components/connectivity/EndcArchitectureVisualizer'
import { MassiveMimoBeamVisualizer } from '../components/connectivity/MassiveMimoBeamVisualizer'
import { CoverageTierHeatmap } from '../components/connectivity/CoverageTierHeatmap'
import { FallbackDiagnosticMatrix } from '../components/connectivity/FallbackDiagnosticMatrix'
import { RrmPolicyRecommendations } from '../components/connectivity/RrmPolicyRecommendations'

interface ConnectivityPageProps {
  initialCapacity?: number
}

export const ConnectivityPage: React.FC<ConnectivityPageProps> = ({
  initialCapacity = 100000,
}) => {
  const [capacity, setCapacity] = useState<number>(initialCapacity)
  const [prbReservation, setPrbReservation] = useState<number>(15.0)
  const [beamOptimization, setBeamOptimization] = useState<boolean>(true)
  const [backhaulUpgrade, setBackhaulUpgrade] = useState<boolean>(true)

  // Data states
  const [kpis, setKpis] = useState<ConnectivityKpis | null>(null)
  const [endc, setEndc] = useState<EndcArchitecture | null>(null)
  const [sectors, setSectors] = useState<MassiveMimoSector[]>([])
  const [tiers, setTiers] = useState<CoverageTier[]>([])
  const [fallbackCauses, setFallbackCauses] = useState<FallbackRootCause[]>([])
  const [rrmRecs, setRrmRecs] = useState<RrmRecommendation[]>([])
  const [simResult, setSimResult] = useState<ConnectivitySimulationResponse | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSimulating, setIsSimulating] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'all' | 'endc' | 'beamforming' | 'tiers' | 'fallback' | 'rrm'>('all')

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [kpiData, endcData, sectorData, tierData, fallbackData, rrmData] = await Promise.all([
          fetchConnectivityOverview(capacity),
          fetchEndcArchitecture(),
          fetchBeamformingSectors(),
          fetchCoverageTiers(),
          fetchFallbackAnalysis(),
          fetchRrmRecommendations(),
        ])
        setKpis(kpiData)
        setEndc(endcData)
        setSectors(sectorData)
        setTiers(tierData)
        setFallbackCauses(fallbackData)
        setRrmRecs(rrmData)
      } catch (err) {
        console.error('Failed to load connectivity data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [capacity])

  // Run live simulation
  const handleRunSimulation = async () => {
    try {
      setIsSimulating(true)
      const res = await simulateConnectivity({
        stadium_capacity: capacity,
        anchor_prb_reservation_pct: prbReservation,
        beam_tilt_optimization: beamOptimization,
        small_cell_offload_pct: 35.0,
        backhaul_upgrade: backhaulUpgrade,
      })
      setSimResult(res)
    } catch (err) {
      console.error('Simulation failed:', err)
    } finally {
      setIsSimulating(false)
    }
  }

  const handleResetSimulation = () => {
    setPrbReservation(15.0)
    setBeamOptimization(true)
    setBackhaulUpgrade(true)
    setSimResult(null)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E40000]/10 text-[#E40000] border border-red-500/20">
                Module 7
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Airtel 5G NSA Intelligence
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              5G Connectivity & Accessibility Optimization
            </h1>
            <p className="text-xs text-slate-400">
              3GPP Rel-15 Option 3x Dual Connectivity (EN-DC) • 64T64R Massive MIMO Beam Steering • 4G Fallback Shielding
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0B0F19] p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Blueprint
            </button>
            <button
              onClick={() => setActiveTab('endc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'endc' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN-DC Architecture
            </button>
            <button
              onClick={() => setActiveTab('beamforming')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'beamforming' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              64T64R Beamforming
            </button>
            <button
              onClick={() => setActiveTab('tiers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tiers' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Coverage Tiers
            </button>
            <button
              onClick={() => setActiveTab('fallback')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'fallback' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              4G Fallback Causes
            </button>
            <button
              onClick={() => setActiveTab('rrm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'rrm' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              RRM Policies
            </button>
          </div>
        </div>

        {/* Live Simulation Control Strip */}
        <div className="p-4 rounded-xl bg-[#0B0F19]/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-[#E40000]" />
              <span>Interactive 5G Accessibility Simulator</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-4 py-1.5 rounded-xl bg-[#E40000] text-white text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5 shadow-md shadow-red-900/40"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isSimulating ? 'Evaluating...' : 'Simulate Accessibility'}</span>
              </button>
              <button
                onClick={handleResetSimulation}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Reset to recommended"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
            {/* PRB Reservation Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Anchor Shield PRB (B1)</span>
                <span className="font-mono font-bold text-emerald-400">{prbReservation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={prbReservation}
                onChange={(e) => setPrbReservation(parseFloat(e.target.value))}
                className="w-full accent-[#E40000] bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                {prbReservation === 0 ? '⚠️ Anchor unshielded (Fallback risk)' : 'Protected signaling'}
              </div>
            </div>

            {/* Stadium Crowd Toggle */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Crowd Size</span>
                <span className="font-mono font-bold text-white">{capacity.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                {[65000, 100000, 120000].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCapacity(c)}
                    className={`flex-1 py-1 rounded text-[10px] font-bold border ${
                      capacity === c
                        ? 'bg-[#E40000] text-white border-red-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {c / 1000}k
                  </button>
                ))}
              </div>
            </div>

            {/* Beam Tilt Optimization Toggle */}
            <div className="space-y-1">
              <div className="text-xs text-slate-400">3D Beam Rake Optimization</div>
              <button
                onClick={() => setBeamOptimization(!beamOptimization)}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  beamOptimization
                    ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{beamOptimization ? 'Tier Down-Tilt Active' : 'Default Flat 15°'}</span>
              </button>
            </div>

            {/* Dark Fibre Backhaul Upgrade */}
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Dark Fibre 10G S1-U</div>
              <button
                onClick={() => setBackhaulUpgrade(!backhaulUpgrade)}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  backhaulUpgrade
                    ? 'bg-blue-950/30 text-blue-400 border-blue-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{backhaulUpgrade ? '10 Gbps Dark Fibre' : '1 Gbps Shared'}</span>
              </button>
            </div>
          </div>

          {/* Simulation Output Banner */}
          {simResult && (
            <div
              className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                simResult.status === 'OPTIMIZED'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-950/30 border-red-500/30 text-red-300'
              }`}
            >
              <div className="space-y-0.5">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Simulation Status: {simResult.status}</span>
                </div>
                <div className="text-[11px] text-slate-300">{simResult.engineering_note}</div>
              </div>
              <div className="flex items-center gap-4 font-mono font-bold text-xs shrink-0">
                <div>
                  <span className="text-slate-400 block text-[10px]">Camping Rate:</span>
                  <span className="text-white text-sm">{simResult.projected_camping_rate_pct}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SgNB Success:</span>
                  <span className="text-white text-sm">{simResult.projected_sgnb_success_pct}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Median DL:</span>
                  <span className="text-[#E40000] text-sm">{simResult.projected_median_dl_speed_mbps} Mbps</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <ConnectivityKpiOverview kpis={kpis} isLoading={isLoading} />

      {/* Tabbed Content Sections */}
      {(activeTab === 'all' || activeTab === 'endc') && (
        <EndcArchitectureVisualizer architecture={endc} />
      )}

      {(activeTab === 'all' || activeTab === 'beamforming') && (
        <MassiveMimoBeamVisualizer sectors={sectors} />
      )}

      {(activeTab === 'all' || activeTab === 'tiers') && (
        <CoverageTierHeatmap tiers={tiers} />
      )}

      {(activeTab === 'all' || activeTab === 'fallback') && (
        <FallbackDiagnosticMatrix causes={fallbackCauses} />
      )}

      {(activeTab === 'all' || activeTab === 'rrm') && (
        <RrmPolicyRecommendations recommendations={rrmRecs} />
      )}
    </div>
  )
}

