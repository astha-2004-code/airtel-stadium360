import React, { useState, useEffect } from 'react'
import {
  Cpu,
  Sliders,
  RotateCcw,
  Zap,
  Radio,
  Server,
  Layers,
  Activity,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Info,
} from 'lucide-react'
import { analyticsService } from '../services/analyticsService'
import {
  DemandCalculationResponse,
  SiteCapacityBreakdown,
  SpectralEfficiencyResponse,
  MatchPhaseForecastItem,
} from '../types/analytics'
import { DemandFormulaBreakdown } from '../components/analytics/DemandFormulaBreakdown'
import { SiteCapacityMatrix } from '../components/analytics/SiteCapacityMatrix'
import { SpectralEfficiencyCard } from '../components/analytics/SpectralEfficiencyCard'
import { MatchPhaseDemandChart } from '../components/analytics/MatchPhaseDemandChart'

interface CapacityEnginePageProps {
  initialCapacity?: number
}

export const CapacityEnginePage: React.FC<CapacityEnginePageProps> = ({ initialCapacity = 100000 }) => {
  // Master Interactive Parameters
  const [capacity, setCapacity] = useState<number>(initialCapacity)
  const [airtelShare, setAirtelShare] = useState<number>(0.40)
  const [deviceShare5G, setDeviceShare5G] = useState<number>(0.70)
  const [peakOnlinePct, setPeakOnlinePct] = useState<number>(0.18)
  const [targetSpeed5G, setTargetSpeed5G] = useState<number>(5.0)
  const [targetSpeed4G, setTargetSpeed4G] = useState<number>(3.0)
  const [targetUtilization, setTargetUtilization] = useState<number>(0.80)

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'formulas' | 'matrix' | 'spectral' | 'phases'>('formulas')

  // Data States
  const [demandData, setDemandData] = useState<DemandCalculationResponse | null>(null)
  const [spectralData, setSpectralData] = useState<SpectralEfficiencyResponse | null>(null)
  const [forecastData, setForecastData] = useState<MatchPhaseForecastItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch / Recalculate whenever parameters change
  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [demandRes, spectralRes, forecastRes] = await Promise.all([
        analyticsService.getDemandCalculation({
          capacity,
          airtel_share: airtelShare,
          device_share_5g: deviceShare5G,
          peak_online_pct: peakOnlinePct,
          target_speed_5g_mbps: targetSpeed5G,
          target_speed_4g_mbps: targetSpeed4G,
          target_utilization: targetUtilization,
        }),
        analyticsService.getSpectralEfficiency(),
        analyticsService.getMatchPhaseForecast({
          capacity,
          airtel_share: airtelShare,
          device_share_5g: deviceShare5G,
          target_speed_5g_mbps: targetSpeed5G,
          target_speed_4g_mbps: targetSpeed4G,
        }),
      ])
      setDemandData(demandRes)
      setSpectralData(spectralRes)
      setForecastData(forecastRes)
      setError(null)
    } catch (err: any) {
      console.error('Failed to load capacity analytics:', err)
      setError(err?.message || 'Failed to fetch analytics from backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [capacity, airtelShare, deviceShare5G, peakOnlinePct, targetSpeed5G, targetSpeed4G, targetUtilization])

  const handleReset = () => {
    setCapacity(100000)
    setAirtelShare(0.40)
    setDeviceShare5G(0.70)
    setPeakOnlinePct(0.18)
    setTargetSpeed5G(5.0)
    setTargetSpeed4G(3.0)
    setTargetUtilization(0.80)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#E40000]/20 text-[#FF4D4D] border border-red-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Engine Milestone 3</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Module 3</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">Network Demand & Capacity Engine</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic 3GPP throughput demand, realistic multi-user spectral efficiency, and site capacity gap detection.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Case Study Baseline</span>
        </button>
      </div>

      {/* Parameter Control Panel (Live Recalculation) */}
      <div className="card-gradient rounded-2xl border border-[#223050] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#223050] pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#FF4D4D]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Engineering Parameters (Judges Tuning Bench)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Dynamic Real-time Recalculation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Capacity */}
          <div className="space-y-1.5 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>Stadium Crowd:</span>
              <span className="text-[#FF4D4D] font-mono font-bold">{capacity.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="130000"
              step="5000"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full accent-[#E40000] cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>50k (Base)</span>
              <span>100k (World Cup)</span>
              <span>130k (Max)</span>
            </div>
          </div>

          {/* Airtel Share */}
          <div className="space-y-1.5 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>Airtel Market Share:</span>
              <span className="text-[#FF4D4D] font-mono font-bold">{(airtelShare * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.20"
              max="0.60"
              step="0.05"
              value={airtelShare}
              onChange={(e) => setAirtelShare(Number(e.target.value))}
              className="w-full accent-[#E40000] cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>20%</span>
              <span>40% (Airtel Avg)</span>
              <span>60%</span>
            </div>
          </div>

          {/* 5G Device Penetration */}
          <div className="space-y-1.5 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>5G Device Share:</span>
              <span className="text-blue-400 font-mono font-bold">{(deviceShare5G * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.90"
              step="0.05"
              value={deviceShare5G}
              onChange={(e) => setDeviceShare5G(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30%</span>
              <span>70% (Spec)</span>
              <span>90%</span>
            </div>
          </div>

          {/* Simultaneous Online % */}
          <div className="space-y-1.5 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>Peak Concurrency:</span>
              <span className="text-amber-400 font-mono font-bold">{(peakOnlinePct * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.08"
              max="0.30"
              step="0.01"
              value={peakOnlinePct}
              onChange={(e) => setPeakOnlinePct(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>8% (Arrival)</span>
              <span>18% (Innings)</span>
              <span>30% (Extreme)</span>
            </div>
          </div>

          {/* 5G Target Speed */}
          <div className="space-y-1.5 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>5G Target Speed:</span>
              <span className="text-blue-400 font-mono font-bold">{targetSpeed5G.toFixed(1)} Mbps</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="20.0"
              step="1.0"
              value={targetSpeed5G}
              onChange={(e) => setTargetSpeed5G(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 Mbps</span>
              <span>5 Mbps (Target)</span>
              <span>20 Mbps</span>
            </div>
          </div>

          {/* 4G Target Speed */}
          <div className="space-y-1.5 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>4G Target Speed:</span>
              <span className="text-purple-400 font-mono font-bold">{targetSpeed4G.toFixed(1)} Mbps</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={targetSpeed4G}
              onChange={(e) => setTargetSpeed4G(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 Mbps</span>
              <span>3 Mbps (Target)</span>
              <span>10 Mbps</span>
            </div>
          </div>

          {/* Target Utilization */}
          <div className="space-y-1.5 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>Target Utilization:</span>
              <span className="text-emerald-400 font-mono font-bold">{(targetUtilization * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.50"
              max="0.95"
              step="0.05"
              value={targetUtilization}
              onChange={(e) => setTargetUtilization(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>50%</span>
              <span>80% (Safe SLA)</span>
              <span>95% (Risk)</span>
            </div>
          </div>

          {/* Reset / Live Indicator */}
          <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40 flex flex-col justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E40000] animate-ping" />
              <span className="text-[11px] font-bold text-red-300">Live Computational Engine</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono leading-tight">
              Calculates simultaneous PRB load, 3GPP spectral constraints & capacity deficits.
            </div>
          </div>
        </div>
      </div>

      {/* Top Key Metric KPI Summary Cards */}
      {demandData && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#223050] space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Airtel Fans</span>
            <div className="text-xl font-black text-white font-mono">
              {demandData.spectators.airtel_spectators.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              {demandData.spectators.spectators_5g_capable.toLocaleString()} 5G devices
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#223050] space-y-1">
            <span className="text-[10px] text-amber-400 uppercase font-semibold">Peak Active Users</span>
            <div className="text-xl font-black text-amber-300 font-mono">
              {demandData.active_users.peak_active_airtel_users.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              {demandData.active_users.active_5g_users} 5G / {demandData.active_users.active_4g_users} 4G
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#223050] space-y-1">
            <span className="text-[10px] text-blue-400 uppercase font-semibold">Throughput Demand</span>
            <div className="text-xl font-black text-blue-300 font-mono">
              {demandData.throughput_demand_gbps.total_demand.toFixed(2)} <span className="text-xs">Gbps</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              5G: {demandData.throughput_demand_gbps.demand_5g.toFixed(1)} | 4G: {demandData.throughput_demand_gbps.demand_4g.toFixed(1)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#223050] space-y-1">
            <span className="text-[10px] text-[#FF4D4D] uppercase font-semibold">Target Cap @80%</span>
            <div className="text-xl font-black text-[#FF4D4D] font-mono">
              {demandData.capacity_requirements_gbps.required_total_at_80_pct.toFixed(2)} <span className="text-xs">Gbps</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Requires 20% SLA headroom</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#223050] space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Installed Usable RF</span>
            <div className="text-xl font-black text-slate-300 font-mono">
              {demandData.spectral_efficiency.total_practical_rf_capacity_gbps.toFixed(2)} <span className="text-xs">Gbps</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Existing 8 sites</p>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/60 space-y-1">
            <span className="text-[10px] text-rose-400 uppercase font-bold flex items-center space-x-1">
              <TrendingDown className="w-3 h-3 text-rose-400" />
              <span>Net Capacity Gap</span>
            </span>
            <div className="text-xl font-black text-rose-400 font-mono">
              -{demandData.capacity_gap.overall_gap_gbps.toFixed(2)} <span className="text-xs">Gbps</span>
            </div>
            <p className="text-[10px] text-rose-300 font-mono font-bold">
              {((demandData.capacity_gap.overall_gap_gbps / demandData.capacity_requirements_gbps.required_total_at_80_pct) * 100).toFixed(0)}% Deficit
            </p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#223050] space-x-2">
        <button
          onClick={() => setActiveTab('formulas')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'formulas'
              ? 'border-[#E40000] text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#FF4D4D]" />
          <span>Master Formulation</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'matrix'
              ? 'border-[#E40000] text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-blue-400" />
          <span>Site Deficit Matrix (8 Sites)</span>
        </button>

        <button
          onClick={() => setActiveTab('spectral')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'spectral'
              ? 'border-[#E40000] text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          <span>Spectral Efficiency Model</span>
        </button>

        <button
          onClick={() => setActiveTab('phases')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'phases'
              ? 'border-[#E40000] text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-rose-400" />
          <span>Match Chronology Forecast</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {demandData && (
        <div className="space-y-6">
          {activeTab === 'formulas' && (
            <div className="space-y-6">
              <DemandFormulaBreakdown data={demandData} />
              
              {/* Engineering Rationale Alert */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Capacity Deficit Finding: </span>
                  At 100,000 spectators with 40% Airtel share and 18% peak online concurrency, total simultaneous throughput demand
                  reaches <span className="text-white font-mono font-bold">{demandData.throughput_demand_gbps.total_demand.toFixed(2)} Gbps</span>.
                  To maintain network utilization at or below 80% (SLA threshold), the stadium requires{' '}
                  <span className="text-white font-mono font-bold">
                    {demandData.capacity_requirements_gbps.required_total_at_80_pct.toFixed(2)} Gbps
                  </span>.
                  The current 8 installed sites deliver only{' '}
                  <span className="text-white font-mono font-bold">
                    {demandData.spectral_efficiency.total_practical_rf_capacity_gbps.toFixed(2)} Gbps
                  </span>{' '}
                  of usable practical RF, resulting in a severe deficit of{' '}
                  <span className="text-red-400 font-mono font-bold">
                    {demandData.capacity_gap.overall_gap_gbps.toFixed(2)} Gbps
                  </span>.
                  Without deploying additional COWs and in-bowl Small Cells, 4G utilization will remain pinned at ~99%, user throughput will collapse to &lt;1 Mbps, and UPI failures will spike above 7%.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matrix' && (
            <SiteCapacityMatrix sites={demandData.site_breakdowns} />
          )}

          {activeTab === 'spectral' && (
            <SpectralEfficiencyCard spectralData={spectralData} />
          )}

          {activeTab === 'phases' && (
            <MatchPhaseDemandChart forecast={forecastData} />
          )}
        </div>
      )}
    </div>
  )
}

export default CapacityEnginePage
