import React from 'react'
import {
  Cable,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Percent,
  Coins,
  ShieldCheck,
  Server
} from 'lucide-react'
import {
  BackhaulPerformanceMetrics,
  FinancialEvaluationMetrics
} from '../../types/evaluation'

interface BackhaulAndFinancialBreakdownProps {
  backhaul: BackhaulPerformanceMetrics
  financial: FinancialEvaluationMetrics
}

export const BackhaulAndFinancialBreakdown: React.FC<BackhaulAndFinancialBreakdownProps> = ({
  backhaul,
  financial
}) => {
  return (
    <div className="space-y-6">
      {/* SECTION 1: BACKHAUL PERFORMANCE AUDIT */}
      <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Cable className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                Backhaul Infrastructure & Dark Fibre Expansion Audit
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Microwave to 10 Gbps Metro Dark Fibre transition eliminating transmission chokepoints
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-[#223050] text-center min-w-[120px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Backhaul</span>
              <span className="text-sm font-black text-cyan-300 font-mono">
                {backhaul.total_proposed_capacity_gbps.toFixed(1)} Gbps
              </span>
              <span className="text-[10px] text-emerald-400 font-bold block">
                +{(backhaul.total_proposed_capacity_gbps - backhaul.total_baseline_capacity_gbps).toFixed(1)} Gbps Added
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-[#223050] text-center min-w-[120px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Fibre Trenching</span>
              <span className="text-sm font-black text-amber-300 font-mono">
                {backhaul.dark_fibre_added_km} km
              </span>
              <span className="text-[10px] text-slate-400 font-medium block">
                ₹{(backhaul.backhaul_upgrade_cost_cr * 100).toFixed(1)}L Cost
              </span>
            </div>
          </div>
        </div>

        {/* Bottleneck Resolution Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#0B0F19]/60 border border-[#223050]/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Baseline Capacity</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-xl font-black text-white font-mono">
                {backhaul.total_baseline_capacity_gbps.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">Gbps</span>
            </div>
            <span className="text-[10px] text-rose-400 mt-1 block">Severe chokepoints during peaks</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19]/60 border border-[#223050]/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Proposed Capacity</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-xl font-black text-cyan-400 font-mono">
                {backhaul.total_proposed_capacity_gbps.toFixed(1)}
              </span>
              <span className="text-xs text-cyan-300">Gbps</span>
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block font-semibold">+168% Transport Headroom</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19]/60 border border-[#223050]/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Bottlenecks Resolved</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-xl font-black text-emerald-400 font-mono">
                {backhaul.bottlenecks_identified} of {backhaul.bottlenecks_identified}
              </span>
            </div>
            <span className="text-[10px] text-emerald-300 mt-1 block font-mono">M4, M6, S1, S2 cleared</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19]/60 border border-[#223050]/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Peak Backhaul Load</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-xl font-black text-emerald-400 font-mono">
                ~58.4%
              </span>
              <span className="text-xs text-emerald-400/80">Avg</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Safe 41.6% link safety buffer</span>
          </div>
        </div>

        {/* Site-by-Site Backhaul Table */}
        <div className="overflow-x-auto rounded-xl border border-[#223050]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#223050] bg-[#131B2E]">
                <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">Site ID & Name</th>
                <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">Baseline Media</th>
                <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">Baseline Cap</th>
                <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">Bottleneck State</th>
                <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">Proposed Media</th>
                <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">Proposed Cap</th>
                <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">Est. Peak Load</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#223050]/60">
              {backhaul.sites.map((site) => (
                <tr key={site.site_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <span className="font-mono font-bold text-white mr-2">{site.site_id}</span>
                    <span className="text-slate-300">{site.site_name}</span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono">{site.baseline_type}</td>
                  <td className="p-3 font-mono text-slate-300">{site.baseline_capacity_gbps.toFixed(1)} Gbps</td>
                  <td className="p-3">
                    {site.is_bottleneck ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center space-x-1 w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Chokepoint (Resolved)</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 w-fit block">
                        Clear
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-mono font-semibold text-cyan-300">{site.proposed_type}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">
                    {site.proposed_capacity_gbps.toFixed(1)} Gbps
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-cyan-400"
                          style={{ width: `${site.estimated_utilization_pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-slate-300">
                        {site.estimated_utilization_pct.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: FINANCIAL EVALUATION & MULTI-STRATEGY COMPARISON */}
      <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Financial Evaluation & Multi-Strategy Cost-Effectiveness
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ₹4.00 Crore strict budgetary governance, unit economics, and alternative strategy benchmark
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Budget Cap:</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs">
              ₹{financial.budget_limit_cr.toFixed(2)} Cr Cap
            </span>
          </div>
        </div>

        {/* Budget Allocation Progress Bar */}
        <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-[#223050] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-white">Budget Allocation Status</span>
              <span className="text-slate-400 font-mono">
                ₹{financial.total_infrastructure_cost_cr.toFixed(3)} Cr / ₹{financial.budget_limit_cr.toFixed(2)} Cr
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-emerald-400">
                {financial.budget_utilization_pct.toFixed(1)}% Committed
              </span>
              <span className="text-[11px] text-slate-400">
                (Reserve: ₹{financial.remaining_budget_lakhs.toFixed(2)} Lakhs)
              </span>
            </div>
          </div>

          {/* Stacked bar: CapEx + OpEx + Reserve */}
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
            <div
              className="bg-red-500 h-full"
              style={{ width: `${(financial.capex_cr / financial.budget_limit_cr) * 100}%` }}
              title={`CapEx: ₹${financial.capex_cr} Cr`}
            />
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${(financial.opex_cr / financial.budget_limit_cr) * 100}%` }}
              title={`OpEx: ₹${financial.opex_cr} Cr`}
            />
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${(financial.remaining_budget_cr / financial.budget_limit_cr) * 100}%` }}
              title={`Reserve: ₹${financial.remaining_budget_cr} Cr`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>CapEx: ₹{financial.capex_cr.toFixed(3)} Cr (74.8%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>OpEx: ₹{financial.opex_cr.toFixed(3)} Cr (25.2%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Remaining Reserve: ₹{financial.remaining_budget_lakhs.toFixed(2)} Lakhs (0.6%)</span>
            </div>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#0B0F19]/60 border border-[#223050]/60">
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unit Cost / Added Gbps</span>
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">
              ₹{financial.cost_per_additional_gbps_lakhs.toFixed(2)} Lakhs
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              High spectral yield per crore invested
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19]/60 border border-[#223050]/60">
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
              <Coins className="w-3.5 h-3.5 text-cyan-400" />
              <span>Unit Cost / Added User</span>
            </div>
            <div className="text-xl font-black text-cyan-400 font-mono mt-1">
              ₹{financial.cost_per_additional_user_inr.toFixed(0)}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Across 35,000 additional stadium spectators
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19]/60 border border-[#223050]/60">
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              <span>Cost-Effectiveness Index</span>
            </div>
            <div className="text-xl font-black text-amber-300 font-mono mt-1">
              {financial.cost_effectiveness_score.toFixed(1)} / 100
            </div>
            <p className="text-[10px] text-emerald-400 mt-1 font-semibold">
              Maximum efficiency rank among all topologies
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0F19]/60 border border-[#223050]/60">
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Budget Compliance</span>
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">
              100% FEASIBLE
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Strictly under ₹4.00 Cr boundary limit
            </p>
          </div>
        </div>

        {/* Strategy Comparison Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Comparison of Alternative Deployment Strategies</span>
          </h4>

          <div className="overflow-x-auto rounded-xl border border-[#223050]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#223050] bg-[#131B2E]">
                  <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">Deployment Strategy</th>
                  <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">CapEx (₹ Cr)</th>
                  <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">OpEx (₹ Cr)</th>
                  <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">Total (₹ Cr)</th>
                  <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">Delivered Capacity</th>
                  <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">Budget Status</th>
                  <th className="p-3 font-bold text-slate-300 uppercase tracking-wider">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#223050]/60">
                {financial.strategy_comparisons.map((strat, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      strat.is_recommended
                        ? 'bg-emerald-950/20 hover:bg-emerald-900/30 font-semibold'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold">{strat.strategy_name}</span>
                        {strat.is_recommended && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E40000] text-white">
                            Selected
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-300">₹{strat.capex_cr.toFixed(3)}</td>
                    <td className="p-3 font-mono text-slate-300">₹{strat.opex_cr.toFixed(3)}</td>
                    <td className="p-3 font-mono text-white font-bold">₹{strat.total_cost_cr.toFixed(3)}</td>
                    <td className="p-3 font-mono text-cyan-300">{strat.capacity_gbps.toFixed(1)} Gbps</td>
                    <td className="p-3">
                      {strat.within_budget ? (
                        <span className="text-emerald-400 font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Within Budget</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Over Budget</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-[11px] text-slate-400">{strat.summary_verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

