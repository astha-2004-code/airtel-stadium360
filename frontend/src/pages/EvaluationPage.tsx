import React, { useState, useEffect } from 'react'
import {
  Activity,
  GitCompare,
  BarChart3,
  Grid,
  ShieldCheck,
  Cable,
  BookOpen,
  Download,
  RotateCcw,
  Sliders,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
  Printer
} from 'lucide-react'
import { evaluationService } from '../services/evaluationService'
import {
  EvaluationOverviewResponse,
  EvaluationCompareResponse
} from '../types/evaluation'
import { EvaluationKpiCards } from '../components/evaluation/EvaluationKpiCards'
import { BaselineVsProposedCharts } from '../components/evaluation/BaselineVsProposedCharts'
import { SiteUtilizationHeatmap } from '../components/evaluation/SiteUtilizationHeatmap'
import { NetworkHealthScorecard } from '../components/evaluation/NetworkHealthScorecard'
import { ThreeWayScenarioComparison } from '../components/evaluation/ThreeWayScenarioComparison'
import { BackhaulAndFinancialBreakdown } from '../components/evaluation/BackhaulAndFinancialBreakdown'

interface EvaluationPageProps {
  initialCapacity?: number
}

export const EvaluationPage: React.FC<EvaluationPageProps> = ({ initialCapacity = 100000 }) => {
  // Scenario interactive states
  const [capacity, setCapacity] = useState<number>(initialCapacity)
  const [activeTab, setActiveTab] = useState<
    'matrix' | 'charts' | 'heatmap' | 'health' | 'backhaul' | 'methodology'
  >('matrix')

  // API Data States
  const [overview, setOverview] = useState<EvaluationOverviewResponse | null>(null)
  const [comparison, setComparison] = useState<EvaluationCompareResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showExportModal, setShowExportModal] = useState<boolean>(false)

  // Fetch evaluation data when capacity changes
  useEffect(() => {
    let isMounted = true

    const fetchEvaluation = async () => {
      try {
        setLoading(true)
        setError(null)
        const [overviewRes, compareRes] = await Promise.all([
          evaluationService.getOverview(capacity),
          evaluationService.compareScenarios({ capacity })
        ])

        if (isMounted) {
          setOverview(overviewRes)
          setComparison(compareRes)
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Failed to load evaluation telemetry:', err)
          setError(err.message || 'Error connecting to Evaluation Engine backend.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchEvaluation()

    return () => {
      isMounted = false
    }
  }, [capacity])

  // Quick preset triggers
  const setPreset = (val: number) => {
    setCapacity(val)
  }

  // Export functions
  const handleExportJson = () => {
    if (!overview) return
    const exportData = {
      project: 'Airtel Stadium360',
      team: 'ByteForge | NIT Delhi',
      module: 'Network Performance & Evaluation Centre',
      timestamp: new Date().toISOString(),
      evaluated_capacity: capacity,
      overview,
      comparison
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Airtel_Stadium360_Evaluation_Report_${capacity}pax.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setShowExportModal(false)
  }

  const handleExportCsv = () => {
    if (!overview || !comparison) return
    const rows = [
      ['Metric Category', 'Metric Name', 'Baseline Network (65k)', 'Proposed Network (100k)', `What-If Scenario (${capacity}k)`],
      ['Scale', 'Spectators', comparison.baseline.capacity, comparison.proposed.capacity, comparison.simulated.capacity],
      ['Scale', 'Active Subscribers', comparison.baseline.active_users, comparison.proposed.active_users, comparison.simulated.active_users],
      ['Utilization', 'Avg 4G PRB (%)', comparison.baseline.avg_4g_utilization, comparison.proposed.avg_4g_utilization, comparison.simulated.avg_4g_utilization],
      ['Utilization', 'Peak 4G PRB (%)', comparison.baseline.peak_4g_utilization, comparison.proposed.peak_4g_utilization, comparison.simulated.peak_4g_utilization],
      ['Utilization', 'Congested Sites Count', comparison.baseline.congested_sites, comparison.proposed.congested_sites, comparison.simulated.congested_sites],
      ['Throughput', 'Avg 4G Speed (Mbps)', comparison.baseline.avg_4g_throughput_mbps, comparison.proposed.avg_4g_throughput_mbps, comparison.simulated.avg_4g_throughput_mbps],
      ['Throughput', 'Avg 5G Speed (Mbps)', comparison.baseline.avg_5g_throughput_mbps, comparison.proposed.avg_5g_throughput_mbps, comparison.simulated.avg_5g_throughput_mbps],
      ['Throughput', 'Target Compliance (%)', comparison.baseline.target_throughput_compliance_pct, comparison.proposed.target_throughput_compliance_pct, comparison.simulated.target_throughput_compliance_pct],
      ['5G Accessibility', '5G Connection Success (%)', comparison.baseline.five_g_accessibility_pct, comparison.proposed.five_g_accessibility_pct, comparison.simulated.five_g_accessibility_pct],
      ['UPI Reliability', 'Payment Failure Rate (%)', comparison.baseline.upi_failure_rate_pct, comparison.proposed.upi_failure_rate_pct, comparison.simulated.upi_failure_rate_pct],
      ['Financial', 'Total Cost (Cr INR)', comparison.baseline.total_cost_cr, comparison.proposed.total_cost_cr, comparison.simulated.total_cost_cr],
      ['Health', 'Airtel Stadium360 Health Score', comparison.baseline.network_health_score, comparison.proposed.network_health_score, comparison.simulated.network_health_score]
    ]

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Airtel_Stadium360_Performance_Audit_${capacity}pax.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowExportModal(false)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="card-gradient rounded-2xl border border-[#223050] p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-950/70 border border-red-700/60 text-red-300">
                Evaluation Centre
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#131B2E] border border-[#223050] text-slate-300">
                Team: ByteForge | NIT Delhi
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Airtel SYNC 2026
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
              <span>Network Performance & Evaluation Centre</span>
            </h1>

            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Exhaustive before-and-after audit comparing the unoptimized baseline network (measured in{' '}
              <span className="text-white font-mono font-semibold">Sync_V1.xlsx</span>) against the proposed{' '}
              <span className="text-white font-mono font-semibold">₹4 Cr</span> HetNet deployment and live simulation scenarios.
            </p>
          </div>

          {/* Interactive Capacity Controller */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="p-3 bg-[#0B0F19]/80 rounded-xl border border-[#223050] flex flex-col justify-center min-w-[240px]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-semibold flex items-center space-x-1">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Crowd Stress Level</span>
                </span>
                <span className="font-mono font-bold text-white text-sm">
                  {capacity.toLocaleString()} spectators
                </span>
              </div>

              <input
                type="range"
                min="60000"
                max="120000"
                step="5000"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value))}
                className="w-full accent-[#E40000] cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/80">
                <button
                  onClick={() => setPreset(65000)}
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    capacity === 65000
                      ? 'bg-slate-700 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  65k (Base)
                </button>
                <button
                  onClick={() => setPreset(100000)}
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    capacity === 100000
                      ? 'bg-[#E40000] text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  100k (Target)
                </button>
                <button
                  onClick={() => setPreset(120000)}
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    capacity === 120000
                      ? 'bg-amber-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  120k (Stress)
                </button>
              </div>
            </div>

            {/* Export Report CTA */}
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-3 bg-gradient-to-r from-[#E40000] to-[#B30000] hover:from-[#FF1A1A] hover:to-[#CC0000] text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950/50 flex items-center justify-center space-x-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading & Error Indicators */}
      {loading && !overview && (
        <div className="card-gradient rounded-2xl border border-[#223050] p-12 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#E40000] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">
            Synthesizing Evaluation Telemetry from Dataset & Optimization Engine...
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-rose-300 text-xs">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Telemetry Error: {error}</span>
          </div>
          <button
            onClick={() => setCapacity(capacity)}
            className="px-3 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs font-bold text-rose-200"
          >
            Retry
          </button>
        </div>
      )}

      {overview && comparison && (
        <>
          {/* Executive KPI Scorecard */}
          <EvaluationKpiCards overview={overview} />

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#223050] overflow-x-auto space-x-1 text-xs">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center space-x-2 px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'matrix'
                  ? 'border-[#E40000] text-white bg-[#131B2E]/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]/30'
              }`}
            >
              <GitCompare className="w-4 h-4 text-[#FF4D4D]" />
              <span>3-Way Evaluation Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('charts')}
              className={`flex items-center space-x-2 px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'charts'
                  ? 'border-[#E40000] text-white bg-[#131B2E]/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]/30'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Comparative Visualizations</span>
            </button>

            <button
              onClick={() => setActiveTab('heatmap')}
              className={`flex items-center space-x-2 px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'heatmap'
                  ? 'border-[#E40000] text-white bg-[#131B2E]/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]/30'
              }`}
            >
              <Grid className="w-4 h-4 text-amber-400" />
              <span>Site Heatmap & Congestion</span>
            </button>

            <button
              onClick={() => setActiveTab('health')}
              className={`flex items-center space-x-2 px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'health'
                  ? 'border-[#E40000] text-white bg-[#131B2E]/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]/30'
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Network Health Scorecard</span>
            </button>

            <button
              onClick={() => setActiveTab('backhaul')}
              className={`flex items-center space-x-2 px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'backhaul'
                  ? 'border-[#E40000] text-white bg-[#131B2E]/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]/30'
              }`}
            >
              <Cable className="w-4 h-4 text-indigo-400" />
              <span>Backhaul & Budget ROI</span>
            </button>

            <button
              onClick={() => setActiveTab('methodology')}
              className={`flex items-center space-x-2 px-4 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'methodology'
                  ? 'border-[#E40000] text-white bg-[#131B2E]/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]/30'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Audit Methodology & Assumptions</span>
            </button>
          </div>

          {/* TAB CONTENTS */}
          <div className="pt-2">
            {activeTab === 'matrix' && (
              <ThreeWayScenarioComparison comparisonData={comparison} />
            )}

            {activeTab === 'charts' && (
              <BaselineVsProposedCharts
                utilization={overview.network_utilization}
                throughput={overview.throughput_performance}
                accessibility={overview.five_g_accessibility}
                financial={overview.financial_evaluation}
              />
            )}

            {activeTab === 'heatmap' && (
              <SiteUtilizationHeatmap sites={overview.network_utilization.site_utilization} />
            )}

            {activeTab === 'health' && (
              <NetworkHealthScorecard healthScore={overview.network_health} />
            )}

            {activeTab === 'backhaul' && (
              <BackhaulAndFinancialBreakdown
                backhaul={overview.backhaul_performance}
                financial={overview.financial_evaluation}
              />
            )}

            {activeTab === 'methodology' && (
              <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-6 text-xs">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <span>Evaluation Methodologies, Formulas & Data Provenance</span>
                  </h3>
                  <p className="text-slate-400 mt-1">
                    Transparent documentation for Airtel Stadium360 performance indicators and algorithmic proofs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Utilization formula */}
                  <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#223050] space-y-2">
                    <h4 className="font-bold text-white text-sm">1. Congestion Reduction Formula</h4>
                    <p className="text-slate-400">
                      Evaluates the absolute reduction in cell sites suffering from PRB overload (&gt;80% PRB utilization):
                    </p>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-cyan-300 text-[11px]">
                      Congestion Reduction (%) = ((Baseline Congested Sites - Proposed Congested Sites) / Baseline Congested Sites) × 100
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Denominator safety: If Baseline Congested Sites = 0, formula returns 0.0% to prevent division by zero.
                    </p>
                  </div>

                  {/* Throughput Target */}
                  <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#223050] space-y-2">
                    <h4 className="font-bold text-white text-sm">2. Throughput Compliance Targets</h4>
                    <p className="text-slate-400">
                      Standard Quality of Service (QoS) SLAs calibrated for sports venues:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px]">
                      <li>4G Target: 3.0 Mbps per active user</li>
                      <li>5G Target: 5.0 Mbps per active user</li>
                      <li>Capacity headroom = (Delivered Gbps / Peak Demand Gbps) × 100</li>
                    </ul>
                    <p className="text-[11px] text-slate-500">
                      Ensures concurrent live video streaming, instant replay, and social uploads without stalling.
                    </p>
                  </div>

                  {/* 5G Accessibility */}
                  <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#223050] space-y-2">
                    <h4 className="font-bold text-white text-sm">3. 5G Accessibility Measurement</h4>
                    <p className="text-slate-400">
                      Derived directly from the recorded <code className="text-red-400">Sync_V1.xlsx</code> field measurement:
                    </p>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-emerald-300 text-[11px]">
                      Baseline 5G Success = 38.5% (Severe NSA EN-DC Anchor Drops on LTE Band 1)
                      Proposed 5G Target = 86.2% (Anchor Shield on Band 1 + Dedicated C-Band n78 Carriers)
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Verified across all 8 sectors without synthetic fabrication.
                    </p>
                  </div>

                  {/* UPI Reliability */}
                  <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#223050] space-y-2">
                    <h4 className="font-bold text-white text-sm">4. UPI Reliability Distinction</h4>
                    <p className="text-slate-400">
                      Distinguishes local telecom access failures from external banking server latency:
                    </p>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-amber-300 text-[11px]">
                      Baseline Failure = 7.11% (Peak Match Dropouts) vs 1.14% (Normal Day)
                      Simulated 5QI-5 Sliced = 1.12% (Eliminates 82.9% RAN bufferbloat; 1.00% core residual)
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Preserves merchant confidence and secures ₹13.78 Lakhs in concession gross merchandise value (GMV).
                    </p>
                  </div>
                </div>

                {/* Data Provenance Table */}
                <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#223050] space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>Telemetry Provenance & Dataset Calibration Table</span>
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="border-b border-[#223050] bg-[#131B2E]">
                          <th className="p-2.5 text-slate-300 font-bold">Metric</th>
                          <th className="p-2.5 text-slate-300 font-bold">Data Source</th>
                          <th className="p-2.5 text-slate-300 font-bold">Baseline Value</th>
                          <th className="p-2.5 text-slate-300 font-bold">Proposed Engine Source</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#223050]/50 text-slate-400 font-mono text-[11px]">
                        <tr>
                          <td className="p-2.5 text-white font-sans font-semibold">4G PRB Load</td>
                          <td className="p-2.5">Sync_V1.xlsx: 4G_Load sheet (Innings Break)</td>
                          <td className="p-2.5 text-rose-400">93.9% Avg (7 Sites &gt;80%)</td>
                          <td className="p-2.5 text-emerald-400">Capacity & Optimizer Engine (58.1%)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-white font-sans font-semibold">5G Connection Success</td>
                          <td className="p-2.5">Sync_V1.xlsx: 5G_Accessibility sheet</td>
                          <td className="p-2.5 text-rose-400">38.5%</td>
                          <td className="p-2.5 text-emerald-400">Anchor Shield + Carrier Aggregation (86.2%)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-white font-sans font-semibold">UPI Payment Failure</td>
                          <td className="p-2.5">Sync_V1.xlsx: Critical_Services sheet</td>
                          <td className="p-2.5 text-rose-400">7.11% (Match Peak)</td>
                          <td className="p-2.5 text-emerald-400">5QI-5 Low-Latency QoS Slice (1.12%)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-white font-sans font-semibold">Backhaul Links</td>
                          <td className="p-2.5">Sync_V1.xlsx: Backhaul_Sites sheet</td>
                          <td className="p-2.5 text-rose-400">4 Bottlenecks (M4, M6, S1, S2)</td>
                          <td className="p-2.5 text-emerald-400">0.99 km Dark Fibre Upgrades to 10G</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 text-white font-sans font-semibold">Infrastructure Budget</td>
                          <td className="p-2.5">Project Scope Cap</td>
                          <td className="p-2.5">₹0.00 Cr (Unoptimized)</td>
                          <td className="p-2.5 text-emerald-400">₹3.975 Cr (99.4% of ₹4.00 Cr limit)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Export Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="card-gradient rounded-2xl border border-[#223050] max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#E40000]" />
                <span>Export Performance Evaluation Audit</span>
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Export the auditable evaluation report for the current scenario of{' '}
              <strong className="text-white font-mono">{capacity.toLocaleString()} spectators</strong>.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleExportJson}
                className="w-full p-3 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-[#223050] flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Download Full JSON Payload</span>
                  <span className="text-[10px] text-slate-500">Includes complete telemetry, site heatmaps, and scores</span>
                </div>
                <Download className="w-4 h-4 text-cyan-400 shrink-0" />
              </button>

              <button
                onClick={handleExportCsv}
                className="w-full p-3 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-[#223050] flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Export Formatted CSV Matrix</span>
                  <span className="text-[10px] text-slate-500">Baseline vs Proposed vs Simulated spreadsheet</span>
                </div>
                <Download className="w-4 h-4 text-emerald-400 shrink-0" />
              </button>

              <button
                onClick={() => {
                  window.print()
                  setShowExportModal(false)
                }}
                className="w-full p-3 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-[#223050] flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Print / Save as PDF</span>
                  <span className="text-[10px] text-slate-500">Browser print formatted evaluation sheets</span>
                </div>
                <Printer className="w-4 h-4 text-amber-400 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

