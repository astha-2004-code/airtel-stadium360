import React from 'react'
import { DollarSign, PieChart, ShieldCheck, AlertCircle, ArrowUpRight } from 'lucide-react'
import { BudgetSummary, CostBreakdownLakhs } from '../../types/optimizer'

interface BudgetTrackerCardProps {
  budget: BudgetSummary
  costs: CostBreakdownLakhs
}

export const BudgetTrackerCard: React.FC<BudgetTrackerCardProps> = ({ budget, costs }) => {
  const items = [
    {
      name: 'Cell on Wheels (COWs)',
      amountLakhs: costs.cows,
      sharePct: ((costs.cows / budget.total_expenditure_lakhs) * 100).toFixed(1),
      unitPrice: '₹25.0 Lakhs / event',
      color: 'bg-red-500',
      textColor: 'text-red-400',
    },
    {
      name: 'In-Bowl 5G Small Cells',
      amountLakhs: costs.small_cells,
      sharePct: ((costs.small_cells / budget.total_expenditure_lakhs) * 100).toFixed(1),
      unitPrice: '₹8.0 Lakhs / unit',
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
    },
    {
      name: 'Dark Fibre Backhaul (0.99 km)',
      amountLakhs: costs.fiber_backhaul,
      sharePct: ((costs.fiber_backhaul / budget.total_expenditure_lakhs) * 100).toFixed(1),
      unitPrice: '₹50.0 Lakhs / km',
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
    },
    {
      name: '5G Active Antenna Overlays',
      amountLakhs: costs.five_g_overlays,
      sharePct: ((costs.five_g_overlays / budget.total_expenditure_lakhs) * 100).toFixed(1),
      unitPrice: '₹12.0L Macro / ₹8.0L SC',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
    },
  ]

  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Financial Cap Compliance</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
              Strict ₹4.00 Cr Cap
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Capital Expenditure & Budget Allocator</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Total Expenditure</span>
          <p className="text-xl font-black text-white font-mono">
            ₹{budget.total_expenditure_crores.toFixed(3)} <span className="text-sm font-normal text-slate-400">Crore</span>
          </p>
        </div>
      </div>

      {/* Primary Budget Consumption Meter */}
      <div className="bg-[#0B0F19]/90 rounded-xl p-5 border border-[#223050] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs text-slate-400 font-semibold">Budget Cap Limit</div>
            <div className="text-2xl font-black text-white font-mono">
              ₹{budget.budget_limit_crores.toFixed(2)} Crore{' '}
              <span className="text-xs text-slate-500 font-normal">({budget.budget_limit_lakhs.toFixed(0)} Lakhs)</span>
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-xs text-emerald-400 font-semibold flex items-center sm:justify-end space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Contingency Reserve Remaining:</span>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ₹{budget.remaining_budget_lakhs.toFixed(2)} Lakhs{' '}
              <span className="text-xs text-slate-400 font-normal">(₹{budget.remaining_budget_crores.toFixed(3)} Cr)</span>
            </div>
          </div>
        </div>

        {/* Stacked Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold">Committed Capex: {budget.budget_utilization_pct.toFixed(1)}%</span>
            <span className="text-emerald-400 font-bold">Available Buffer: {(100 - budget.budget_utilization_pct).toFixed(1)}%</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex p-0.5">
            <div
              className="h-full bg-red-500 rounded-l-full transition-all"
              style={{ width: `${(costs.cows / budget.budget_limit_lakhs) * 100}%` }}
              title={`COWs: ₹${costs.cows}L`}
            />
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(costs.small_cells / budget.budget_limit_lakhs) * 100}%` }}
              title={`Small Cells: ₹${costs.small_cells}L`}
            />
            <div
              className="h-full bg-amber-500 transition-all"
              style={{ width: `${(costs.fiber_backhaul / budget.budget_limit_lakhs) * 100}%` }}
              title={`Fibre: ₹${costs.fiber_backhaul}L`}
            />
            <div
              className="h-full bg-emerald-500 rounded-r-full transition-all"
              style={{ width: `${(costs.five_g_overlays / budget.budget_limit_lakhs) * 100}%` }}
              title={`5G Overlays: ₹${costs.five_g_overlays}L`}
            />
          </div>
        </div>
      </div>

      {/* Itemized Cost Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#0B0F19]/60 border border-[#223050] space-y-2 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-xs font-bold text-white truncate">{item.name}</span>
            </div>

            <div className="text-xl font-black text-white font-mono">
              ₹{item.amountLakhs.toFixed(2)} <span className="text-xs text-slate-400 font-normal">Lakhs</span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
              <span>{item.sharePct}% of budget</span>
              <span className="text-slate-500">{item.unitPrice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
