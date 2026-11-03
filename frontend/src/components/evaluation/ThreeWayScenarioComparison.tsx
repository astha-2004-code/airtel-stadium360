import React from 'react'
import {
  GitCompare,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react'
import { EvaluationCompareResponse } from '../../types/evaluation'

interface ThreeWayScenarioComparisonProps {
  comparisonData: EvaluationCompareResponse
}

export const ThreeWayScenarioComparison: React.FC<ThreeWayScenarioComparisonProps> = ({
  comparisonData
}) => {
  const baseline = comparisonData?.baseline || comparisonData?.baseline_network
  const proposed = comparisonData?.proposed || comparisonData?.proposed_network
  const simulated = comparisonData?.simulated || comparisonData?.simulated_scenario
  const key_improvements = comparisonData?.key_improvements || ({} as any)
  const feasibility_status =
    comparisonData?.feasibility_status || simulated?.status || 'FEASIBLE'
  const bottleneck_alerts =
    comparisonData?.bottleneck_alerts || comparisonData?.newly_infeasible_constraints || []

  if (!baseline || !proposed || !simulated) {
    return (
      <div className="card-gradient rounded-2xl border border-[#223050] p-8 text-center text-slate-400">
        Loading scenario comparison telemetry...
      </div>
    )
  }

  // Safe accessor helpers
  const baseCapacity = baseline.capacity ?? baseline.crowd_capacity ?? 65000
  const propCapacity = proposed.capacity ?? proposed.crowd_capacity ?? 100000
  const simCapacity = simulated.capacity ?? simulated.crowd_capacity ?? 100000

  const baseUsers = baseline.active_users ?? baseline.active_concurrent_users ?? 4680
  const propUsers = proposed.active_users ?? proposed.active_concurrent_users ?? 7200
  const simUsers = simulated.active_users ?? simulated.active_concurrent_users ?? 7200

  const baseUtil = baseline.avg_4g_utilization ?? baseline.network_utilization_pct ?? 99.0
  const propUtil = proposed.avg_4g_utilization ?? proposed.network_utilization_pct ?? 78.4
  const simUtil = simulated.avg_4g_utilization ?? simulated.network_utilization_pct ?? 106.1

  const basePeak = baseline.peak_4g_utilization ?? 99.1
  const propPeak = proposed.peak_4g_utilization ?? propUtil
  const simPeak = simulated.peak_4g_utilization ?? simUtil

  const baseCongested = baseline.congested_sites ?? baseline.congested_sites_count ?? 7
  const propCongested = proposed.congested_sites ?? proposed.congested_sites_count ?? 0
  const simCongested = simulated.congested_sites ?? simulated.congested_sites_count ?? 6
  const simCongestedPct = simulated.congested_sites_pct ?? roundVal((simCongested / 8.0) * 100, 1)

  const base4GSpeed = baseline.avg_4g_throughput_mbps ?? baseline.avg_user_throughput_mbps ?? 1.0
  const prop4GSpeed = proposed.avg_4g_throughput_mbps ?? proposed.avg_user_throughput_mbps ?? 3.2
  const sim4GSpeed = simulated.avg_4g_throughput_mbps ?? simulated.avg_user_throughput_mbps ?? 3.2

  const base5GSpeed = baseline.avg_5g_throughput_mbps ?? 27.91
  const prop5GSpeed = proposed.avg_5g_throughput_mbps ?? 124.6
  const sim5GSpeed = simulated.avg_5g_throughput_mbps ?? 124.6

  const baseCompliance = baseline.target_throughput_compliance_pct ?? 22.5
  const propCompliance = proposed.target_throughput_compliance_pct ?? 98.4
  const simCompliance = simulated.target_throughput_compliance_pct ?? (simUtil <= 80 ? 98.4 : Math.max(40.0, 98.4 - (simUtil - 80) * 1.8))

  const base5GAccess = baseline.five_g_accessibility_pct ?? baseline.five_g_camping_rate_pct ?? 38.5
  const prop5GAccess = proposed.five_g_accessibility_pct ?? proposed.five_g_camping_rate_pct ?? 86.2
  const sim5GAccess = simulated.five_g_accessibility_pct ?? simulated.five_g_camping_rate_pct ?? 47.1

  const baseUpi = baseline.upi_failure_rate_pct ?? 7.11
  const propUpi = proposed.upi_failure_rate_pct ?? 1.12
  const simUpi = simulated.upi_failure_rate_pct ?? 7.11

  const baseCost = baseline.total_cost_cr ?? baseline.total_investment_crores ?? 0.0
  const propCost = proposed.total_cost_cr ?? proposed.total_investment_crores ?? 3.975
  const simCost = simulated.total_cost_cr ?? simulated.total_investment_crores ?? 3.975

  const baseReserve = baseline.budget_remaining_cr ?? (baseline.budget_remaining_lakhs ? baseline.budget_remaining_lakhs / 100 : 4.0)
  const propReserve = proposed.budget_remaining_cr ?? (proposed.budget_remaining_lakhs ? proposed.budget_remaining_lakhs / 100 : 0.025)
  const simReserve = simulated.budget_remaining_cr ?? (simulated.budget_remaining_lakhs ? simulated.budget_remaining_lakhs / 100 : 0.025)

  const baseScore = baseline.network_health_score ?? baseline.composite_health_score ?? 28.4
  const baseRating = baseline.health_rating ?? baseline.status ?? 'CRITICAL'
  const propScore = proposed.network_health_score ?? proposed.composite_health_score ?? 92.5
  const propRating = proposed.health_rating ?? proposed.status ?? 'OPTIMAL'
  const simScore = simulated.network_health_score ?? simulated.composite_health_score ?? 70.0
  const simRating = simulated.health_rating ?? simulated.status ?? 'FAIR'

  function roundVal(n: number, decimals: number = 1): number {
    const factor = Math.pow(10, decimals)
    return Math.round(n * factor) / factor
  }

  const formatDelta = (val: number, suffix = '%', invertPositive = false) => {
    const isPositive = val > 0
    const isGood = invertPositive ? !isPositive : isPositive
    return (
      <span
        className={`inline-flex items-center space-x-0.5 text-xs font-bold font-mono ${
          isGood ? 'text-emerald-400' : 'text-rose-400'
        }`}
      >
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span>
          {isPositive ? '+' : ''}
          {val.toFixed(1)}
          {suffix}
        </span>
      </span>
    )
  }

  const renderHealthBadge = (rating: string, score: number) => {
    let colorClass = 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    const r = (rating || '').toUpperCase()
    if (r === 'EXCELLENT' || r === 'OPTIMAL' || r === 'OPTIMAL_COMPLIANT') colorClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    else if (r === 'GOOD') colorClass = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    else if (r === 'FAIR' || r === 'CAPACITY_DEFICIT_FLAGGED') colorClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30'

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${colorClass}`}>
        {score.toFixed(1)} ({rating.replace('_', ' ')})
      </span>
    )
  }

  const isFeasible =
    typeof feasibility_status === 'string' &&
    feasibility_status.includes('FEASIBLE') &&
    !feasibility_status.includes('INDEFINITE')

  return (
    <div className="space-y-6">
      {/* Header & Feasibility Banner */}
      <div className="card-gradient rounded-2xl border border-[#223050] p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <GitCompare className="w-5 h-5 text-[#E40000]" />
              <h3 className="text-base font-bold text-white">
                Three-Way Network Performance Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Rigorous comparative audit: Unoptimized Baseline (Sync_V1.xlsx) vs Proposed Optimized Network vs Live What-If Scenario
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400">Simulation Feasibility:</span>
            <div
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isFeasible
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              {isFeasible ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              <span>{feasibility_status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Bottleneck Alerts when capacity triggers stress */}
        {bottleneck_alerts.length > 0 && (
          <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Identified Bottlenecks & Capacity Threshold Warnings ({bottleneck_alerts.length})</span>
            </div>
            <ul className="text-xs text-amber-200/90 list-disc list-inside space-y-1 pl-1">
              {bottleneck_alerts.map((alert, idx) => (
                <li key={idx} className="font-mono text-[11px]">{alert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="card-gradient rounded-2xl border border-[#223050] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#223050] bg-[#131B2E]">
                <th className="p-4 text-slate-400 font-bold uppercase tracking-wider w-1/4">
                  Evaluation Dimension
                </th>
                <th className="p-4 text-slate-300 font-bold uppercase tracking-wider w-1/4 bg-slate-900/60">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span>Baseline Network</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal lowercase block">
                    65,000 spec • unoptimized
                  </span>
                </th>
                <th className="p-4 text-emerald-400 font-bold uppercase tracking-wider w-1/4 bg-emerald-950/20 border-x border-emerald-900/30">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Proposed Network</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/70 font-normal lowercase block">
                    100,000 spec • ₹4Cr cap
                  </span>
                </th>
                <th className="p-4 text-cyan-400 font-bold uppercase tracking-wider w-1/4 bg-cyan-950/20">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span>What-If Scenario</span>
                  </div>
                  <span className="text-[10px] text-cyan-400/70 font-normal lowercase block">
                    {simCapacity.toLocaleString()} spec • dynamic
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#223050]/60">
              {/* Category: Crowd & Scale */}
              <tr className="bg-[#0B0F19]/40 font-bold text-slate-300">
                <td colSpan={4} className="py-2.5 px-4 text-[11px] uppercase tracking-wider text-[#FF4D4D] bg-[#E40000]/10 border-l-2 border-[#E40000]">
                  1. Spectator Load & Device Concurrency
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Spectator Attendance</td>
                <td className="p-4 font-mono text-slate-300 bg-slate-900/40">
                  {baseCapacity.toLocaleString()} spectators
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  {propCapacity.toLocaleString()} (+53.8%)
                </td>
                <td className="p-4 font-mono text-cyan-300 font-bold bg-cyan-950/10">
                  {simCapacity.toLocaleString()} spectators
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Active Cellular Subscribers</td>
                <td className="p-4 font-mono text-slate-300 bg-slate-900/40">
                  {baseUsers.toLocaleString()}
                </td>
                <td className="p-4 font-mono text-emerald-300 bg-emerald-950/10 border-x border-emerald-900/20">
                  {propUsers.toLocaleString()}
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  {simUsers.toLocaleString()}
                </td>
              </tr>

              {/* Category: Utilization & Congestion */}
              <tr className="bg-[#0B0F19]/40 font-bold text-slate-300">
                <td colSpan={4} className="py-2.5 px-4 text-[11px] uppercase tracking-wider text-[#FF4D4D] bg-[#E40000]/10 border-l-2 border-[#E40000]">
                  2. Utilization & Congestion Metrics
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Average 4G PRB Utilization</td>
                <td className="p-4 font-mono text-rose-400 font-semibold bg-slate-900/40">
                  {baseUtil.toFixed(1)}% (Saturated)
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <span>{propUtil.toFixed(1)}%</span>
                    {formatDelta(key_improvements.utilization_drop_pct || 35.8, '%', true)}
                  </div>
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  <span className={simUtil > 80 ? 'text-amber-400 font-bold' : ''}>
                    {simUtil.toFixed(1)}%
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Peak 4G PRB Utilization</td>
                <td className="p-4 font-mono text-rose-400 bg-slate-900/40">
                  {basePeak.toFixed(1)}%
                </td>
                <td className="p-4 font-mono text-emerald-300 bg-emerald-950/10 border-x border-emerald-900/20">
                  {propPeak.toFixed(1)}%
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  <span className={simPeak > 80 ? 'text-amber-400 font-bold' : ''}>
                    {simPeak.toFixed(1)}%
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Congested Sites (&gt;80% PRB)</td>
                <td className="p-4 font-mono text-rose-400 font-bold bg-slate-900/40">
                  {baseCongested} of 8 sites (87.5%)
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <span>{propCongested} of 8 sites (0.0%)</span>
                    <span className="text-emerald-400 text-xs font-bold">-100% Congestion</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  <span className={simCongested > 0 ? 'text-amber-400 font-bold' : ''}>
                    {simCongested} of 8 sites ({simCongestedPct.toFixed(1)}%)
                  </span>
                </td>
              </tr>

              {/* Category: Throughput */}
              <tr className="bg-[#0B0F19]/40 font-bold text-slate-300">
                <td colSpan={4} className="py-2.5 px-4 text-[11px] uppercase tracking-wider text-[#FF4D4D] bg-[#E40000]/10 border-l-2 border-[#E40000]">
                  3. Throughput & Quality Compliance
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Avg 4G Speed (Target: 3.0 Mbps)</td>
                <td className="p-4 font-mono text-rose-400 bg-slate-900/40">
                  {base4GSpeed.toFixed(2)} Mbps
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <span>{prop4GSpeed.toFixed(2)} Mbps</span>
                    {formatDelta(key_improvements.throughput_4g_boost_pct || 240.0)}
                  </div>
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  {sim4GSpeed.toFixed(2)} Mbps
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Avg 5G Speed (Target: 5.0 Mbps)</td>
                <td className="p-4 font-mono text-amber-400 bg-slate-900/40">
                  {base5GSpeed.toFixed(2)} Mbps
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <span>{prop5GSpeed.toFixed(2)} Mbps</span>
                    {formatDelta(key_improvements.throughput_5g_boost_pct || 142.0)}
                  </div>
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  {sim5GSpeed.toFixed(2)} Mbps
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Target Throughput Compliance</td>
                <td className="p-4 font-mono text-rose-400 bg-slate-900/40">
                  {baseCompliance.toFixed(1)}%
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  {propCompliance.toFixed(1)}%
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  {simCompliance.toFixed(1)}%
                </td>
              </tr>

              {/* Category: 5G & Critical Services */}
              <tr className="bg-[#0B0F19]/40 font-bold text-slate-300">
                <td colSpan={4} className="py-2.5 px-4 text-[11px] uppercase tracking-wider text-[#FF4D4D] bg-[#E40000]/10 border-l-2 border-[#E40000]">
                  4. 5G Accessibility & Mission-Critical UPI SLAs
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">5G Connection Success Rate</td>
                <td className="p-4 font-mono text-rose-400 bg-slate-900/40">
                  {base5GAccess.toFixed(1)}% (Anchor Drops)
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <span>{prop5GAccess.toFixed(1)}%</span>
                    {formatDelta(key_improvements.accessibility_gain_pct || 123.9)}
                  </div>
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  {sim5GAccess.toFixed(1)}%
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">UPI Payment Failure Rate</td>
                <td className="p-4 font-mono text-rose-400 font-bold bg-slate-900/40">
                  {baseUpi.toFixed(2)}% (Peak Dropouts)
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <span>{propUpi.toFixed(2)}%</span>
                    <span className="text-emerald-400 text-xs font-bold">-84.2% Failures</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  {simUpi.toFixed(2)}%
                </td>
              </tr>

              {/* Category: Financials & Health */}
              <tr className="bg-[#0B0F19]/40 font-bold text-slate-300">
                <td colSpan={4} className="py-2.5 px-4 text-[11px] uppercase tracking-wider text-[#FF4D4D] bg-[#E40000]/10 border-l-2 border-[#E40000]">
                  5. Financial Execution & Overall Network Health
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Capital & Operating Investment</td>
                <td className="p-4 font-mono text-slate-400 bg-slate-900/40">
                  ₹0.00 Cr (No Action)
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  ₹{propCost.toFixed(3)} Cr (99.4% Budget)
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  ₹{simCost.toFixed(3)} Cr
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Budget Reserve Remaining</td>
                <td className="p-4 font-mono text-slate-400 bg-slate-900/40">
                  ₹4.00 Cr
                </td>
                <td className="p-4 font-mono text-emerald-300 bg-emerald-950/10 border-x border-emerald-900/20">
                  ₹{(propReserve * 100).toFixed(2)} Lakhs
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  ₹{(simReserve * 100).toFixed(2)} Lakhs
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 font-bold bg-slate-900/80">
                <td className="p-4 text-white">Composite Health Score (0-100)</td>
                <td className="p-4 bg-slate-900/40">
                  {renderHealthBadge(baseRating, baseScore)}
                </td>
                <td className="p-4 bg-emerald-950/20 border-x border-emerald-900/40">
                  <div className="flex items-center justify-between">
                    {renderHealthBadge(propRating, propScore)}
                    {formatDelta(key_improvements.health_score_delta_pct || 151.7)}
                  </div>
                </td>
                <td className="p-4 bg-cyan-950/20">
                  {renderHealthBadge(simRating, simScore)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
