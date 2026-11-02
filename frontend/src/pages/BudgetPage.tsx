import React, { useState, useEffect } from 'react'
import {
  DollarSign,
  Landmark,
  Layers,
  Award,
  Server,
  Calendar,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { budgetService } from '../services/budgetService'
import {
  BudgetAllocationParams,
  BudgetSummaryResponse,
  CostEffectivenessResponse,
  AssetItem,
  TimelineMilestone,
} from '../types/budget'
import { BudgetOverviewCard } from '../components/budget/BudgetOverviewCard'
import { CapexOpexBreakdown } from '../components/budget/CapexOpexBreakdown'
import { CostEffectivenessMetrics } from '../components/budget/CostEffectivenessMetrics'
import { AssetInventoryTable } from '../components/budget/AssetInventoryTable'
import { DeploymentTimelineView } from '../components/budget/DeploymentTimelineView'

interface BudgetPageProps {
  initialCapacity?: number
}

export const BudgetPage: React.FC<BudgetPageProps> = ({ initialCapacity = 100000 }) => {
  // Budget Allocation Sliders
  const [budgetLimitCrores, setBudgetLimitCrores] = useState<number>(4.0)
  const [cowsCount, setCowsCount] = useState<number>(4)
  const [smallCellsCount, setSmallCellsCount] = useState<number>(26)
  const [fibreKm, setFibreKm] = useState<number>(0.99)
  const [macro5GOverlays, setMacro5GOverlays] = useState<number>(2)
  const [smallCell5GOverlays, setSmallCell5GOverlays] = useState<number>(2)

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'capex-opex' | 'roi' | 'inventory' | 'timeline'>('overview')

  // Response States
  const [summaryData, setSummaryData] = useState<BudgetSummaryResponse | null>(null)
  const [roiData, setRoiData] = useState<CostEffectivenessResponse | null>(null)
  const [assets, setAssets] = useState<AssetItem[]>([])
  const [timeline, setTimeline] = useState<TimelineMilestone[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const params: BudgetAllocationParams = {
        budget_limit_crores: budgetLimitCrores,
        cows_count: cowsCount,
        small_cells_count: smallCellsCount,
        fibre_km: fibreKm,
        macro_5g_overlays_count: macro5GOverlays,
        small_cell_5g_overlays_count: smallCell5GOverlays,
        capacity: initialCapacity,
      }

      const [summaryRes, roiRes, assetsRes, timelineRes] = await Promise.all([
        budgetService.getBudgetSummary(params),
        budgetService.getCostEffectiveness(params),
        budgetService.getAssets(),
        budgetService.getTimeline(),
      ])

      setSummaryData(summaryRes)
      setRoiData(roiRes)
      setAssets(assetsRes)
      setTimeline(timelineRes)
      setError(null)
    } catch (err: any) {
      console.error('Failed to load budget data:', err)
      setError(err?.message || 'Failed to load budget data from backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [budgetLimitCrores, cowsCount, smallCellsCount, fibreKm, macro5GOverlays, smallCell5GOverlays])

  const handleReset = () => {
    setBudgetLimitCrores(4.0)
    setCowsCount(4)
    setSmallCellsCount(26)
    setFibreKm(0.99)
    setMacro5GOverlays(2)
    setSmallCell5GOverlays(2)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Financial Governance</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Module 6</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            ₹4.00 Crore Financial Cap & Asset Allocator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict capital cap enforcement, CapEx vs OpEx lifecycle accounting, telecom ROI metrics, asset inventory, and 4-week rollout schedule.
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

      {/* Allocation Tuning Controls */}
      <div className="card-gradient rounded-2xl border border-[#223050] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#223050] pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Asset Allocation & Unit Cost Controls
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Unit Costs: COW ₹25L • Small Cell ₹8L • Fibre ₹50L/km
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          {/* Budget Limit */}
          <div className="space-y-1 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Budget Cap:</span>
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
              <span className="text-emerald-400 font-bold">₹4 Cr (Cap)</span>
              <span>₹6 Cr</span>
            </div>
          </div>

          {/* COWs Count */}
          <div className="space-y-1 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">COWs (₹25L/event):</span>
              <span className="text-red-400 font-mono font-bold">{cowsCount} Units</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={cowsCount}
              onChange={(e) => setCowsCount(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0</span>
              <span className="text-red-400 font-bold">4 (Gates)</span>
              <span>10</span>
            </div>
          </div>

          {/* Small Cells Count */}
          <div className="space-y-1 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Small Cells (₹8L):</span>
              <span className="text-blue-400 font-mono font-bold">{smallCellsCount} Units</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="2"
              value={smallCellsCount}
              onChange={(e) => setSmallCellsCount(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0</span>
              <span className="text-blue-400 font-bold">26 (Bowl)</span>
              <span>50</span>
            </div>
          </div>

          {/* Fibre Distance km */}
          <div className="space-y-1 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Fibre (₹50L/km):</span>
              <span className="text-amber-400 font-mono font-bold">{fibreKm.toFixed(2)} km</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.05"
              value={fibreKm}
              onChange={(e) => setFibreKm(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 km</span>
              <span className="text-amber-400 font-bold">0.99 km (4 sites)</span>
              <span>3.0 km</span>
            </div>
          </div>

          {/* Overlays */}
          <div className="space-y-1 bg-[#0B0F19]/60 p-3 rounded-xl border border-[#223050]">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">5G Overlays:</span>
              <span className="text-emerald-400 font-mono font-bold">{macro5GOverlays + smallCell5GOverlays} Sites</span>
            </div>
            <div className="flex items-center space-x-2 pt-1 font-mono text-[11px] text-slate-400">
              <span>M4, M6 (₹24L) + S1, S2 (₹16L)</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-bold font-mono">
              Total Overlays: ₹40.0 Lakhs
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#223050] space-x-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'overview'
              ? 'border-emerald-500 text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>Budget Cap & Monitor</span>
        </button>

        <button
          onClick={() => setActiveTab('capex-opex')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'capex-opex'
              ? 'border-emerald-500 text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Landmark className="w-3.5 h-3.5 text-blue-400" />
          <span>CapEx vs OpEx Split</span>
        </button>

        <button
          onClick={() => setActiveTab('roi')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'roi'
              ? 'border-emerald-500 text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Telecom ROI & UPI Protection</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'inventory'
              ? 'border-emerald-500 text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-purple-400" />
          <span>Asset Inventory Catalog</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'timeline'
              ? 'border-emerald-500 text-white bg-[#131B2E]'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Deployment Timeline</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && summaryData && (
          <BudgetOverviewCard summary={summaryData} />
        )}

        {activeTab === 'capex-opex' && summaryData && (
          <CapexOpexBreakdown split={summaryData.capex_opex_split} />
        )}

        {activeTab === 'roi' && roiData && (
          <CostEffectivenessMetrics metrics={roiData} />
        )}

        {activeTab === 'inventory' && (
          <AssetInventoryTable assets={assets} />
        )}

        {activeTab === 'timeline' && (
          <DeploymentTimelineView timeline={timeline} />
        )}
      </div>
    </div>
  )
}

export default BudgetPage

