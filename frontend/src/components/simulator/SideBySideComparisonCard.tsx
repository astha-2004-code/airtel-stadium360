import React from 'react'
import { ArrowRight, TrendingUp, TrendingDown, Minus, CheckCircle, AlertTriangle } from 'lucide-react'
import { ComparisonResponse } from '../../types/simulator'

interface SideBySideComparisonCardProps {
  comparison: ComparisonResponse
}

export const SideBySideComparisonCard: React.FC<SideBySideComparisonCardProps> = ({ comparison }) => {
  const { baseline, simulated, deltas } = comparison

  const rows = [
    {
      metric: 'Stadium Crowd Size',
      base: `${baseline.cascade.step_1_airtel_spectators.total_spectators.toLocaleString()} fans`,
      sim: `${simulated.cascade.step_1_airtel_spectators.total_spectators.toLocaleString()} fans`,
      delta: deltas.capacity_spectators !== 0 ? `${deltas.capacity_spectators > 0 ? '+' : ''}${deltas.capacity_spectators.toLocaleString()}` : '0',
      isDeltaBad: deltas.capacity_spectators > 0,
    },
    {
      metric: 'Airtel Active Spectators',
      base: `${baseline.cascade.step_1_airtel_spectators.airtel_spectators.toLocaleString()} fans`,
      sim: `${simulated.cascade.step_1_airtel_spectators.airtel_spectators.toLocaleString()} fans`,
      delta: deltas.airtel_spectators !== 0 ? `${deltas.airtel_spectators > 0 ? '+' : ''}${deltas.airtel_spectators.toLocaleString()}` : '0',
      isDeltaBad: deltas.airtel_spectators > 0,
    },
    {
      metric: 'Peak Simultaneous Online Users',
      base: `${baseline.cascade.step_2_active_users.peak_active_airtel_users.toLocaleString()} users`,
      sim: `${simulated.cascade.step_2_active_users.peak_active_airtel_users.toLocaleString()} users`,
      delta: deltas.active_users !== 0 ? `${deltas.active_users > 0 ? '+' : ''}${deltas.active_users.toLocaleString()}` : '0',
      isDeltaBad: deltas.active_users > 0,
    },
    {
      metric: 'Total Throughput Demand',
      base: `${baseline.cascade.step_4_throughput_demand.total_demand_gbps.toFixed(2)} Gbps`,
      sim: `${simulated.cascade.step_4_throughput_demand.total_demand_gbps.toFixed(2)} Gbps`,
      delta: deltas.demand_gbps !== 0 ? `${deltas.demand_gbps > 0 ? '+' : ''}${deltas.demand_gbps.toFixed(2)} Gbps` : '0.00 Gbps',
      isDeltaBad: deltas.demand_gbps > 0,
    },
    {
      metric: 'Required Capacity @ 80% SLA',
      base: `${baseline.cascade.step_5_required_capacity.required_capacity_gbps.toFixed(2)} Gbps`,
      sim: `${simulated.cascade.step_5_required_capacity.required_capacity_gbps.toFixed(2)} Gbps`,
      delta: deltas.required_capacity_gbps !== 0 ? `${deltas.required_capacity_gbps > 0 ? '+' : ''}${deltas.required_capacity_gbps.toFixed(2)} Gbps` : '0.00 Gbps',
      isDeltaBad: deltas.required_capacity_gbps > 0,
    },
    {
      metric: 'Total Deployed Capacity',
      base: `${baseline.cascade.step_6_capacity_evaluation.total_deployed_capacity_gbps.toFixed(2)} Gbps`,
      sim: `${simulated.cascade.step_6_capacity_evaluation.total_deployed_capacity_gbps.toFixed(2)} Gbps`,
      delta: deltas.deployed_capacity_gbps !== 0 ? `${deltas.deployed_capacity_gbps > 0 ? '+' : ''}${deltas.deployed_capacity_gbps.toFixed(2)} Gbps` : '0.00 Gbps',
      isDeltaBad: deltas.deployed_capacity_gbps < 0,
    },
    {
      metric: 'Overall Network Utilization',
      base: `${baseline.cascade.step_7_utilization_metrics.overall_utilization_pct.toFixed(1)}%`,
      sim: `${simulated.cascade.step_7_utilization_metrics.overall_utilization_pct.toFixed(1)}%`,
      delta: deltas.utilization_pct !== 0 ? `${deltas.utilization_pct > 0 ? '+' : ''}${deltas.utilization_pct.toFixed(1)}%` : '0.0%',
      isDeltaBad: deltas.utilization_pct > 0,
    },
    {
      metric: 'Infrastructure Capex Committed',
      base: `₹${baseline.cascade.step_9_financial_impact.total_cost_crores.toFixed(3)} Cr`,
      sim: `₹${simulated.cascade.step_9_financial_impact.total_cost_crores.toFixed(3)} Cr`,
      delta: deltas.expenditure_crores !== 0 ? `${deltas.expenditure_crores > 0 ? '+' : ''}₹${deltas.expenditure_crores.toFixed(3)} Cr` : '₹0.000 Cr',
      isDeltaBad: deltas.expenditure_crores > 0,
    },
  ]

  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Delta Analysis Bench</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 font-mono">
              Side-by-Side Comparison
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Baseline Scenario vs Simulated Stress Scenario</h3>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>Baseline (100k World Cup)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-purple-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Live Simulated Variant</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#223050] text-slate-400 font-mono text-[11px] bg-[#0B0F19]/40">
              <th className="py-3 px-3">Performance Dimension</th>
              <th className="py-3 px-3">Baseline (100,000 SLA)</th>
              <th className="py-3 px-3">Current Simulated Scenario</th>
              <th className="py-3 px-3 text-right">Impact Variance (Δ Delta)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#223050]/50 font-sans">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#131B2E]/60 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-white">{row.metric}</td>
                <td className="py-3.5 px-3 font-mono text-slate-400">{row.base}</td>
                <td className="py-3.5 px-3 font-mono font-bold text-white">{row.sim}</td>
                <td className="py-3.5 px-3 font-mono text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center space-x-1 ${
                      row.delta === '0' || row.delta === '0.00 Gbps' || row.delta === '0.0%' || row.delta === '₹0.000 Cr'
                        ? 'bg-slate-800 text-slate-400'
                        : row.isDeltaBad
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    <span>{row.delta}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

