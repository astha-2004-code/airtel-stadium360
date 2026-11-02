import React, { useState, useEffect } from 'react'
import {
  Sliders,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Server,
  ArrowRight,
  TrendingDown,
} from 'lucide-react'
import { simulatorService } from '../services/simulatorService'
import {
  SimulationParams,
  SimulationResponse,
  ComparisonResponse,
  PresetScenario,
} from '../types/simulator'
import { ScenarioPresetsBar } from '../components/simulator/ScenarioPresetsBar'
import { LiveSimulationCascade } from '../components/simulator/LiveSimulationCascade'
import { SideBySideComparisonCard } from '../components/simulator/SideBySideComparisonCard'
import { SiteUtilizationLiveGrid } from '../components/simulator/SiteUtilizationLiveGrid'
import { SimulatorControls } from '../components/simulator/SimulatorControls'

interface SimulatorPageProps {
  initialCapacity?: number
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({ initialCapacity = 100000 }) => {
  // Master Simulation Parameters
  const [params, setParams] = useState<SimulationParams>({
    capacity: initialCapacity,
    airtel_share: 0.40,
    device_share_5g: 0.70,
    peak_online_pct: 0.18,
    target_speed_5g_mbps: 5.0,
    target_speed_4g_mbps: 3.0,
    target_utilization: 0.80,
    budget_cap_crores: 4.0,
    cows_deployed: 4,
    small_cells_deployed: 26,
    fibre_distance_km: 0.99,
    five_g_overlays_count: 4,
  })

  // Baseline scenario for comparison
  const baselineParams: SimulationParams = {
    capacity: 100000,
    airtel_share: 0.40,
    device_share_5g: 0.70,
    peak_online_pct: 0.18,
    target_speed_5g_mbps: 5.0,
    target_speed_4g_mbps: 3.0,
    target_utilization: 0.80,
    budget_cap_crores: 4.0,
    cows_deployed: 4,
    small_cells_deployed: 26,
    fibre_distance_km: 0.99,
    five_g_overlays_count: 4,
  }

  // Active Tab
  const [activeTab, setActiveTab] = useState<'cascade' | 'comparison' | 'sites'>('cascade')
  const [activePresetId, setActivePresetId] = useState<string | null>('world-cup-baseline')

  // Data States
  const [presets, setPresets] = useState<PresetScenario[]>([])
  const [simData, setSimData] = useState<SimulationResponse | null>(null)
  const [compData, setCompData] = useState<ComparisonResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Load presets on mount
  useEffect(() => {
    simulatorService
      .getPresets()
      .then((data) => setPresets(data))
      .catch((err) => console.error('Failed to load presets:', err))
  }, [])

  // Run live simulation on parameter changes
  useEffect(() => {
    let isCancelled = false

    const runSimulation = async () => {
      try {
        setLoading(true)
        const [simRes, compRes] = await Promise.all([
          simulatorService.simulateScenario(params),
          simulatorService.compareScenarios(baselineParams, params),
        ])

        if (!isCancelled) {
          setSimData(simRes)
          setCompData(compRes)
          setError(null)
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Simulation calculation failed:', err)
          setError(err?.message || 'Simulation execution failed.')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    runSimulation()

    return () => {
      isCancelled = true
    }
  }, [params])

  const handleSelectPreset = (preset: PresetScenario) => {
    setActivePresetId(preset.id)
    setParams({
      ...params,
      ...preset.params,
    })
  }

  const handleReset = () => {
    setActivePresetId('world-cup-baseline')
    setParams(baselineParams)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#E40000]/20 text-[#FF4D4D] border border-red-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Signature Feature</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Module 5</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Interactive What-If Scenario Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test arbitrary stadium capacity, concurrency, and infrastructure combinations with instant 10-step mathematical recalculation.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset World Cup Baseline</span>
        </button>
      </div>

      {/* Preset Scenario Quick-Bar */}
      {presets.length > 0 && (
        <ScenarioPresetsBar
          presets={presets}
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
        />
      )}

      {/* Dual Panel Sliders */}
      <SimulatorControls
        params={params}
        onChange={(newParams) => {
          setActivePresetId(null) // Custom tuning
          setParams(newParams)
        }}
      />

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#223050] space-x-2">
        <button
          onClick={() => setActiveTab('cascade')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'cascade'
              ? 'border-[#E40000] text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#FF4D4D]" />
          <span>10-Step Mathematical Cascade</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'comparison'
              ? 'border-[#E40000] text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-purple-400" />
          <span>Side-by-Side Delta Comparison</span>
        </button>

        <button
          onClick={() => setActiveTab('sites')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'sites'
              ? 'border-[#E40000] text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-amber-400" />
          <span>Sector Utilization & Bottlenecks</span>
        </button>
      </div>

      {/* Main Tab Views */}
      {simData && (
        <div className="space-y-6">
          {activeTab === 'cascade' && (
            <LiveSimulationCascade cascade={simData.cascade} />
          )}

          {activeTab === 'comparison' && compData && (
            <SideBySideComparisonCard comparison={compData} />
          )}

          {activeTab === 'sites' && (
            <SiteUtilizationLiveGrid sites={simData.site_simulations} />
          )}
        </div>
      )}
    </div>
  )
}

export default SimulatorPage
