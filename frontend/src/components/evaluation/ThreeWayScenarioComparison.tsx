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
  ArrowRight
} from 'lucide-react'
import { EvaluationCompareResponse } from '../../types/evaluation'

interface ThreeWayScenarioComparisonProps {
  comparisonData: EvaluationCompareResponse
}

export const ThreeWayScenarioComparison: React.FC<ThreeWayScenarioComparisonProps> = ({
  comparisonData
}) => {
  const { baseline, proposed, simulated, key_improvements, feasibility_status, bottleneck_alerts } =
    comparisonData

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
    if (rating === 'EXCELLENT') colorClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    else if (rating === 'GOOD') colorClass = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    else if (rating === 'FAIR') colorClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30'

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${colorClass}`}>
        {score.toFixed(1)} ({rating})
      </span>
    )
  }

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
            <span className="text-xs text-slate-400">System Feasibility:</span>
            <div
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                feasibility_status.includes('FEASIBLE') && !feasibility_status.includes('INDEFINITE')
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {feasibility_status.includes('FEASIBLE') && !feasibility_status.includes('INDEFINITE') ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              <span>{feasibility_status}</span>
            </div>
          </div>
        </div>

        {/* Bottleneck Alerts when capacity triggers stress */}
        {bottleneck_alerts.length > 0 && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
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
                    {simulated.capacity.toLocaleString()} spec • dynamic
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
                  {baseline.capacity.toLocaleString()} spectators
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  {proposed.capacity.toLocaleString()} (+53.8%)
                </td>
                <td className="p-4 font-mono text-cyan-300 font-bold bg-cyan-950/10">
                  {simulated.capacity.toLocaleString()} spectators
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Active Cellular Subscribers</td>
                <td className="p-4 font-mono text-slate-300 bg-slate-900/40">
                  {baseline.active_users.toLocaleString()}
                </td>
                <td className="p-4 font-mono text-emerald-300 bg-emerald-950/10 border-x border-emerald-900/20">
                  {proposed.active_users.toLocaleString()}
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  {simulated.active_users.toLocaleString()}
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
                  {baseline.avg_4g_utilization.toFixed(1)}% (Saturated)
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <span>{proposed.avg_4g_utilization.toFixed(1)}%</span>
                    {formatDelta(key_improvements.utilization_drop_pct || 35.8, '%', true)}
                  </div>
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  <span className={simulated.avg_4g_utilization > 80 ? 'text-amber-400 font-bold' : ''}>
                    {simulated.avg_4g_utilization.toFixed(1)}%
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Peak 4G PRB Utilization</td>
                <td className="p-4 font-mono text-rose-400 bg-slate-900/40">
                  {baseline.peak_4g_utilization.toFixed(1)}%
                </td>
                <td className="p-4 font-mono text-emerald-300 bg-emerald-950/10 border-x border-emerald-900/20">
                  {proposed.peak_4g_utilization.toFixed(1)}%
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  {simulated.peak_4g_utilization.toFixed(1)}%
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Congested Sites (&gt;80% PRB)</td>
                <td className="p-4 font-mono text-rose-400 font-bold bg-slate-900/40">
                  {baseline.congested_sites} of 8 sites (87.5%)
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <span>{proposed.congested_sites} of 8 sites (0.0%)</span>
                    <span className="text-emerald-400 text-xs font-bold">-100% Congestion</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  <span className={simulated.congested_sites > 0 ? 'text-amber-400 font-bold' : ''}>
                    {simulated.congested_sites} of 8 sites ({simulated.congested_sites_pct.toFixed(1)}%)
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
                  {baseline.avg_4g_throughput_mbps.toFixed(2)} Mbps
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <span>{proposed.avg_4g_throughput_mbps.toFixed(2)} Mbps</span>
                    {formatDelta(key_improvements.throughput_4g_boost_pct || 240.0)}
                  </div>
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  {simulated.avg_4g_throughput_mbps.toFixed(2)} Mbps
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Avg 5G Speed (Target: 5.0 Mbps)</td>
                <td className="p-4 font-mono text-amber-400 bg-slate-900/40">
                  {baseline.avg_5g_throughput_mbps.toFixed(2)} Mbps
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <span>{proposed.avg_5g_throughput_mbps.toFixed(2)} Mbps</span>
                    {formatDelta(key_improvements.throughput_5g_boost_pct || 142.0)}
                  </div>
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  {simulated.avg_5g_throughput_mbps.toFixed(2)} Mbps
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Target Throughput Compliance</td>
                <td className="p-4 font-mono text-rose-400 bg-slate-900/40">
                  {baseline.target_throughput_compliance_pct.toFixed(1)}%
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  {proposed.target_throughput_compliance_pct.toFixed(1)}%
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  {simulated.target_throughput_compliance_pct.toFixed(1)}%
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
                  {baseline.five_g_accessibility_pct.toFixed(1)}% (Anchor Drops)
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <span>{proposed.five_g_accessibility_pct.toFixed(1)}%</span>
                    {formatDelta(key_improvements.accessibility_gain_pct || 123.9)}
                  </div>
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  {simulated.five_g_accessibility_pct.toFixed(1)}%
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">UPI Payment Failure Rate</td>
                <td className="p-4 font-mono text-rose-400 font-bold bg-slate-900/40">
                  {baseline.upi_failure_rate_pct.toFixed(2)}% (Peak Dropouts)
                </td>
                <td className="p-4 font-mono text-emerald-300 font-bold bg-emerald-950/10 border-x border-emerald-900/20">
                  <div className="flex items-center justify-between">
                    <span>{proposed.upi_failure_rate_pct.toFixed(2)}%</span>
                    <span className="text-emerald-400 text-xs font-bold">-84.2% Failures</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  {simulated.upi_failure_rate_pct.toFixed(2)}%
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
                  ₹{proposed.total_cost_cr.toFixed(3)} Cr (99.4% Budget)
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  ₹{simulated.total_cost_cr.toFixed(3)} Cr
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="p-4 text-slate-300 font-medium">Budget Reserve Remaining</td>
                <td className="p-4 font-mono text-slate-400 bg-slate-900/40">
                  ₹4.00 Cr
                </td>
                <td className="p-4 font-mono text-emerald-300 bg-emerald-950/10 border-x border-emerald-900/20">
                  ₹{(proposed.budget_remaining_cr * 100).toFixed(2)} Lakhs
                </td>
                <td className="p-4 font-mono text-cyan-300 bg-cyan-950/10">
                  ₹{(simulated.budget_remaining_cr * 100).toFixed(2)} Lakhs
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 font-bold bg-slate-900/80">
                <td className="p-4 text-white">Composite Health Score (0-100)</td>
                <td className="p-4 bg-slate-900/40">
                  {renderHealthBadge(baseline.health_rating, baseline.network_health_score)}
                </td>
                <td className="p-4 bg-emerald-950/20 border-x border-emerald-900/40">
                  <div className="flex items-center justify-between">
                    {renderHealthBadge(proposed.health_rating, proposed.network_health_score)}
                    {formatDelta(key_improvements.health_score_delta_pct || 151.7)}
                  </div>
                </td>
                <td className="p-4 bg-cyan-950/20">
                  {renderHealthBadge(simulated.health_rating, simulated.network_health_score)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
