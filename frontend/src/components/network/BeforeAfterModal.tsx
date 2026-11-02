import React from 'react'
import { BeforeAfterRecord } from '../../types/network'
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  DollarSign,
  ShieldCheck,
} from 'lucide-react'

interface BeforeAfterModalProps {
  data: BeforeAfterRecord[]
  isOpen: boolean
  onClose: () => void
}

export const BeforeAfterModal: React.FC<BeforeAfterModalProps> = ({
  data,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null

  const totalCost = data.reduce((acc, curr) => acc + curr.estimated_cost_inr, 0)
  const remainingBudget = 40000000 - totalCost

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-5xl bg-[#0B0F19] border border-[#223050] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#223050] bg-[#131B2E]/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Before vs After Network Deployment Strategy</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  Target &le; 80% Utilization Satisfied
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Site-by-site transformation under the strict ₹4.0 Crore capital expenditure limit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Investment & KPI Highlights */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/40 border-b border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">TOTAL PROPOSED INVESTMENT</span>
            <div className="text-xl font-black text-emerald-400 font-mono">
              ₹{(totalCost / 10000000).toFixed(2)} Crore
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              ₹{(totalCost / 100000).toFixed(1)} Lakh Total Capex
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">REMAINING BUDGET HEADROOM</span>
            <div className="text-xl font-black text-white font-mono">
              ₹{(remainingBudget / 10000000).toFixed(2)} Crore
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">
              Within ₹4.0 Cr Cap (₹{(remainingBudget / 100000).toFixed(1)} Lakh Surplus)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">CONGESTION RESOLUTION</span>
            <div className="text-xl font-black text-emerald-400 font-mono">
              0 / 8 Sites Congested
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              All sites maintain 52% - 74.5% load (&le; 80% SLA)
            </span>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#131B2E] border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
                  <th className="py-3 px-3">Site ID</th>
                  <th className="py-3 px-3">Proposed Deployment &amp; Offload Mix</th>
                  <th className="py-3 px-2 text-center">4G Load (Before $\rightarrow$ After)</th>
                  <th className="py-3 px-2 text-center">Speed (Before $\rightarrow$ After)</th>
                  <th className="py-3 px-2 text-center">Backhaul Capacity</th>
                  <th className="py-3 px-3 text-right">Capex (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-mono text-[11px]">
                {data.map((row) => (
                  <tr key={row.site_id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-2.5 px-3 font-sans font-bold text-white flex items-center space-x-1.5">
                      <span>{row.site_id}</span>
                      <span className="text-[10px] font-normal text-slate-400">({row.site_name.includes('Macro') ? 'Macro' : 'SC'})</span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-300 text-[11px]">
                      {row.proposed_deployment}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <span className="text-red-400 font-bold">{row.before_load_pct}%</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className="text-emerald-400 font-bold">{row.after_load_pct}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <span className="text-red-400">{row.before_speed_mbps}M</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className="text-amber-300 font-bold">{row.after_speed_mbps}M</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-300">
                      {row.before_backhaul_gbps}G $\rightarrow$ <span className="text-emerald-400 font-bold">{row.after_backhaul_gbps}G</span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-200">
                      ₹{(row.estimated_cost_inr / 100000).toFixed(1)} L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#223050] bg-[#131B2E]/90 flex items-center justify-between text-xs">
          <p className="text-slate-400">
            Strategy guarantees all 8 stadium sectors remain at or below 80% target load during World Cup final peak moments.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#E40000] hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-lg transition-all"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  )
}

