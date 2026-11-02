import React, { useState, useEffect } from 'react'
import {
  Zap,
  Sliders,
  RotateCcw,
  DollarSign,
  ShieldCheck,
  Truck,
  Wifi,
  Layers,
  Server,
  Activity,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { optimizerService } from '../services/optimizerService'
import { OptimizationResponse } from '../types/optimizer'
import { BudgetTrackerCard } from '../components/optimizer/BudgetTrackerCard'
import { DeploymentMixCard } from '../components/optimizer/DeploymentMixCard'
import { SiteInterventionTable } from '../components/optimizer/SiteInterventionTable'
import { PerimeterCowMap } from '../components/optimizer/PerimeterCowMap'

interface OptimizerPageProps {
  initialCapacity?: number
}

export const OptimizerPage: React.FC<OptimizerPageProps> = ({ initialCapacity = 100000 }) => {
  // Optimization Sliders
  const [budgetLimitCrores, setBudgetLimitCrores] = useState<number>(4.0)
  const [capacity, setCapacity] = useState<number>(initialCapacity)
  const [targetUtilization, setTargetUtilization] = useState<number>(0.80)
  const [maxCows, setMaxCows] = useState<number>(6)
  const [maxSmallCells, setMaxSmallCells] = useState<number>(35)
  const [prioritizeBackhaul, setPrioritizeBackhaul] = useState<boolean>(true)

  // Active Tab
  const [activeTab, setActiveTab] = useState<'mix' | 'budget' | 'sites' | 'cows'>('mix')

  // Response State
  const [optData, setOptData] = useState<OptimizationResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const runOptimization = async () => {
    try {
      setLoading(true)
      const data = await optimizerService.getRecommendedOptimization({
        budget_limit_crores: budgetLimitCrores,
        capacity,
        target_utilization: targetUtilization,
        max_cows_allowed: maxCows,
        max_small_cells_allowed: maxSmallCells,
        prioritize_backhaul: prioritizeBackhaul,
      })
      setOptData(data)
      setError(null)
    } catch (err: any) {
      console.error('Optimization failed:', err)
      setError(err?.message || 'Failed to solve optimization problem.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runOptimization()
  }, [budgetLimitCrores, capacity, targetUtilization, maxCows, maxSmallCells, prioritizeBackhaul])

  const handleReset = () => {
    setBudgetLimitCrores(4.0)
    setCapacity(100000)
    setTargetUtilization(0.80)
    setMaxCows(6)
    setMaxSmallCells(35)
    setPrioritizeBackhaul(true)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#E40000]/20 text-[#FF4D4D] border border-red-500/30">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Optimization Milestone 4</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Module 4</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Intelligent Network Deployment Optimizer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            SciPy Mixed-Integer Linear Programming (MILP) minimizing capital expenditure under the ₹4 Crore budget cap.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ₹4 Cr Baseline</span>
        </button>
      </div>

      {/* Interactive Optimization Parameters Bar */}
      <div className="card-gradient rounded-2xl border border-[#223050] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#223050] pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#FF4D4D]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Mathematical Optimization Controls (SciPy MILP Bench)
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-slate-400">Solver:</span>
            <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-mono font-bold">
              HiGHS Mixed-Integer LP
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          {/* Budget Slider */}
          <div className="space-y-1.5 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>Budget Cap:</span>
              <span className="text-emerald-400 font-mono font-bold">₹{budgetLimitCrores.toFixed(2)} Cr</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.25"
              value={budgetLimitCrores}
              onChange={(e) => setBudgetLimitCrores(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹1 Cr</span>
              <span>₹4 Cr (Cap)</span>
              <span>₹6 Cr</span>
            </div>
          </div>

          {/* Crowd Slider */}
          <div className="space-y-1.5 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>Stadium Crowd:</span>
              <span className="text-white font-mono font-bold">{capacity.toLocaleString()}</span>
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
              <span>50k</span>
              <span>100k (World Cup)</span>
              <span>130k</span>
            </div>
          </div>

          {/* Target Utilization SLA */}
          <div className="space-y-1.5 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>Target Utilization:</span>
              <span className="text-amber-400 font-mono font-bold">{(targetUtilization * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.60"
              max="0.90"
              step="0.05"
              value={targetUtilization}
              onChange={(e) => setTargetUtilization(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>60% (Overkill)</span>
              <span>80% (SLA Target)</span>
              <span>90%</span>
            </div>
          </div>

          {/* Max COWs */}
          <div className="space-y-1.5 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>Max COWs:</span>
              <span className="text-red-400 font-mono font-bold">{maxCows} Towers</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={maxCows}
              onChange={(e) => setMaxCows(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1</span>
              <span>6 (Gates)</span>
              <span>10</span>
            </div>
          </div>

          {/* Max Small Cells */}
          <div className="space-y-1.5 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between text-slate-300 font-semibold">
              <span>Max Small Cells:</span>
              <span className="text-blue-400 font-mono font-bold">{maxSmallCells} Cells</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="2"
              value={maxSmallCells}
              onChange={(e) => setMaxSmallCells(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10</span>
              <span>35 (Bowl)</span>
              <span>50</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top High-Impact Optimization Metric Cards */}
      {optData && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total Cost */}
          <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#223050] space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Expenditure</span>
            <div className="text-xl font-black text-white font-mono">
              ₹{optData.budget_summary.total_expenditure_crores.toFixed(3)}{' '}
              <span className="text-xs font-normal text-slate-400">Cr</span>
            </div>
            <p className="text-[10px] text-emerald-400 font-mono font-bold">
              {optData.budget_summary.budget_utilization_pct.toFixed(1)}% of ₹{budgetLimitCrores} Cr cap
            </p>
          </div>

          {/* Remaining Contingency */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/60 space-y-1">
            <span className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Contingency Reserve</span>
            </span>
            <div className="text-xl font-black text-emerald-300 font-mono">
              ₹{optData.budget_summary.remaining_budget_lakhs.toFixed(2)}{' '}
              <span className="text-xs font-normal">Lakhs</span>
            </div>
            <p className="text-[10px] text-emerald-400 font-mono">Unspent buffer</p>
          </div>

          {/* Added Capacity */}
          <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#223050] space-y-1">
            <span className="text-[10px] text-blue-400 uppercase font-semibold">Added Capacity</span>
            <div className="text-xl font-black text-blue-300 font-mono">
              +{optData.capacity_results.added_capacity_gbps.toFixed(2)}{' '}
              <span className="text-xs font-normal">Gbps</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Total: {optData.capacity_results.post_deployment_capacity_gbps.toFixed(2)} Gbps
            </p>
          </div>

          {/* Post Deployment Utilization */}
          <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#223050] space-y-1">
            <span className="text-[10px] text-amber-400 uppercase font-semibold">Post Utilization</span>
            <div className="text-xl font-black text-amber-300 font-mono">
              {optData.capacity_results.post_deployment_utilization_pct.toFixed(1)}%
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Target: ≤{(targetUtilization * 100).toFixed(0)}%</p>
          </div>

          {/* Recommended Assets */}
          <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#223050] space-y-1">
            <span className="text-[10px] text-[#FF4D4D] uppercase font-semibold">Assets Deployed</span>
            <div className="text-xl font-black text-[#FF4D4D] font-mono">
              {optData.recommended_mix.cows_deployed} COW + {optData.recommended_mix.small_cells_deployed} SC
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Gate concourse & bowl</p>
          </div>

          {/* Backhaul Overhaul */}
          <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#223050] space-y-1">
            <span className="text-[10px] text-slate-300 uppercase font-semibold">Fibre Upgrades</span>
            <div className="text-xl font-black text-emerald-400 font-mono">
              {optData.recommended_mix.backhaul_upgrades_count} Sites
            </div>
            <p className="text-[10px] text-slate-400 font-mono">100% 10G Dark Fibre</p>
          </div>
        </div>
      )}

      {/* Unresolved Constraints Banner (Transparent Reporting) */}
      {optData && optData.unresolved_constraints.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/60 text-xs text-amber-300 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white">Engineering Constraint Notification:</span>
            {optData.unresolved_constraints.map((msg, idx) => (
              <p key={idx} className="text-slate-300 leading-relaxed font-mono text-[11px]">
                {msg}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#223050] space-x-2">
        <button
          onClick={() => setActiveTab('mix')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'mix'
              ? 'border-[#E40000] text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF4D4D]" />
          <span>Recommended Portfolio</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'budget'
              ? 'border-[#E40000] text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>Financial Cap & Budget Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab('sites')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'sites'
              ? 'border-[#E40000] text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-blue-400" />
          <span>Site Transformation Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('cows')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'cows'
              ? 'border-[#E40000] text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-red-400" />
          <span>Peripheral COW Stationing</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {optData && (
        <div className="space-y-6">
          {activeTab === 'mix' && (
            <DeploymentMixCard mix={optData.recommended_mix} costs={optData.cost_breakdown_lakhs} />
          )}

          {activeTab === 'budget' && (
            <BudgetTrackerCard budget={optData.budget_summary} costs={optData.cost_breakdown_lakhs} />
          )}

          {activeTab === 'sites' && (
            <SiteInterventionTable interventions={optData.site_interventions} />
          )}

          {activeTab === 'cows' && (
            <PerimeterCowMap cows={optData.cow_deployments} />
          )}
        </div>
      )}
    </div>
  )
}

export default OptimizerPage
