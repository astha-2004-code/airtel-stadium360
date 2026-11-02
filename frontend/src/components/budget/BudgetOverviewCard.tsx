import React from 'react'
import { DollarSign, ShieldCheck, ShieldAlert, AlertTriangle, Info, ArrowUpRight } from 'lucide-react'
import { BudgetSummaryResponse } from '../../types/budget'

interface BudgetOverviewCardProps {
  summary: BudgetSummaryResponse
}

export const BudgetOverviewCard: React.FC<BudgetOverviewCardProps> = ({ summary }) => {
  const {
    budget_limit_crores,
    budget_limit_lakhs,
    total_expenditure_crores,
    total_expenditure_lakhs,
    remaining_budget_crores,
    remaining_budget_lakhs,
    budget_utilization_pct,
    is_within_budget,
    status,
    alert,
    breakdown_lakhs,
  } = summary

  const items = [
    {
      title: 'Cells on Wheels (COWs)',
      amount: breakdown_lakhs.cows,
      unitPrice: '₹25.0L per event',
      sharePct: ((breakdown_lakhs.cows / total_expenditure_lakhs) * 100).toFixed(1),
      color: 'bg-red-500',
    },
    {
      title: 'In-Bowl 5G Small Cells',
      amount: breakdown_lakhs.small_cells,
      unitPrice: '₹8.0L per unit',
      sharePct: ((breakdown_lakhs.small_cells / total_expenditure_lakhs) * 100).toFixed(1),
      color: 'bg-blue-500',
    },
    {
      title: 'Dark Fibre Backhaul (0.99 km)',
      amount: breakdown_lakhs.fibre_backhaul,
      unitPrice: '₹50.0L per km',
      sharePct: ((breakdown_lakhs.fibre_backhaul / total_expenditure_lakhs) * 100).toFixed(1),
      color: 'bg-amber-500',
    },
    {
      title: '5G Active Antenna Overlays',
      amount: breakdown_lakhs.five_g_overlays,
      unitPrice: '₹12.0L Macro / ₹8.0L SC',
      sharePct: ((breakdown_lakhs.five_g_overlays / total_expenditure_lakhs) * 100).toFixed(1),
      color: 'bg-emerald-500',
    },
  ]

  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Fiscal Discipline & Governance
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
              Cap: ₹{budget_limit_crores.toFixed(2)} Cr
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">₹4.00 Crore Financial Cap & Expenditure Monitor</h3>
        </div>

        <div className="flex items-center space-x-2">
          {is_within_budget ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>STRICTLY WITHIN CAP</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center space-x-1.5 font-mono">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>BUDGET EXCEEDED</span>
            </span>
          )}
        </div>
      </div>

      {/* Primary Capex Consumption Gauge */}
      <div className="bg-[#0B0F19]/90 rounded-xl p-5 border border-[#223050] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-xs text-slate-400 font-semibold">Maximum Budget Cap</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              ₹{budget_limit_crores.toFixed(2)} Crore
            </div>
            <p className="text-[11px] text-slate-500 font-mono">₹{budget_limit_lakhs.toFixed(0)} Lakhs ceiling</p>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-semibold">Committed Expenditure</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              ₹{total_expenditure_crores.toFixed(3)} Crore
            </div>
            <p className="text-[11px] text-emerald-400 font-mono font-bold">
              {budget_utilization_pct.toFixed(1)}% of budget allocated
            </p>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-semibold">Contingency Buffer Remaining</span>
            <div
              className={`text-2xl font-black font-mono mt-0.5 ${
                remaining_budget_lakhs >= 0 ? 'text-emerald-300' : 'text-rose-400'
              }`}
            >
              ₹{remaining_budget_lakhs.toFixed(2)} Lakhs
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              ₹{remaining_budget_crores.toFixed(3)} Crore unspent reserve
            </p>
          </div>
        </div>

        {/* Stacked Visual Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold">Allocated: {budget_utilization_pct.toFixed(1)}%</span>
            <span className="text-emerald-400 font-bold">Remaining Buffer: {(100 - budget_utilization_pct).toFixed(1)}%</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex p-0.5">
            <div
              className="h-full bg-red-500 rounded-l-full transition-all"
              style={{ width: `${(breakdown_lakhs.cows / budget_limit_lakhs) * 100}%` }}
              title={`COWs: ₹${breakdown_lakhs.cows}L`}
            />
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(breakdown_lakhs.small_cells / budget_limit_lakhs) * 100}%` }}
              title={`Small Cells: ₹${breakdown_lakhs.small_cells}L`}
            />
            <div
              className="h-full bg-amber-500 transition-all"
              style={{ width: `${(breakdown_lakhs.fibre_backhaul / budget_limit_lakhs) * 100}%` }}
              title={`Fibre: ₹${breakdown_lakhs.fibre_backhaul}L`}
            />
            <div
              className="h-full bg-emerald-500 rounded-r-full transition-all"
              style={{ width: `${(breakdown_lakhs.five_g_overlays / budget_limit_lakhs) * 100}%` }}
              title={`5G Overlays: ₹${breakdown_lakhs.five_g_overlays}L`}
            />
          </div>
        </div>
      </div>

      {/* Threshold Alert Notification */}
      <div
        className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs ${
          alert.severity === 'CRITICAL'
            ? 'bg-rose-950/30 border-rose-900/60 text-rose-300'
            : alert.severity === 'WARNING'
            ? 'bg-amber-950/30 border-amber-900/60 text-amber-300'
            : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
        }`}
      >
        {alert.severity === 'CRITICAL' ? (
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-0.5">
          <span className="font-bold text-white uppercase text-[11px] tracking-wider">
            {alert.severity} Governance Status:
          </span>
          <p className="text-slate-300 leading-relaxed font-mono text-[11px]">{alert.message}</p>
        </div>
      </div>

      {/* Itemized Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#0B0F19]/60 border border-[#223050] space-y-2 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-xs font-bold text-white truncate">{item.title}</span>
            </div>

            <div className="text-xl font-black text-white font-mono">
              ₹{item.amount.toFixed(2)} <span className="text-xs text-slate-400 font-normal">Lakhs</span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
              <span className="text-emerald-400 font-bold">{item.sharePct}% of spend</span>
              <span className="text-slate-500">{item.unitPrice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

