import React from 'react'
import { Layers, Landmark, Calendar, Repeat, CheckCircle2 } from 'lucide-react'
import { CapexOpexSplit } from '../../types/budget'

interface CapexOpexBreakdownProps {
  split: CapexOpexSplit
}

export const CapexOpexBreakdown: React.FC<CapexOpexBreakdownProps> = ({ split }) => {
  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Asset Lifecycle Classification
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-mono">
              CapEx vs OpEx
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Capital Investment vs Event Operational Expense</h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Long-Term Asset Residual Value: <span className="text-emerald-400 font-bold">74.8% Permanent</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CapEx Panel */}
        <div className="p-5 rounded-xl border border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Permanent Capital Assets (CapEx)</h4>
                <p className="text-xs text-slate-400">Fixed stadium infrastructure (Multi-Year Residual Value)</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono">
              {split.capex_pct.toFixed(1)}% of budget
            </span>
          </div>

          <div className="bg-[#0B0F19]/90 rounded-xl p-4 border border-[#223050] space-y-2">
            <div className="text-xs text-slate-400 font-mono">CapEx Capital Invested</div>
            <div className="text-2xl font-black text-white font-mono">
              ₹{split.capex_crores.toFixed(3)} Crore{' '}
              <span className="text-xs font-normal text-slate-400">(₹{split.capex_lakhs.toFixed(2)} Lakhs)</span>
            </div>
            <div className="text-[11px] text-blue-300 font-mono font-semibold pt-1 border-t border-slate-800">
              Permanent fixtures remaining in stadium post-World Cup
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="font-semibold text-white">Committed Capital Asset Inclusions:</div>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>26 In-Bowl 5G Small Cells (Ericsson Radio Dot arrays) — ₹208.0L</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>0.99 km Underground 96-core armoured dark fibre ducting — ₹49.5L</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>4 Massive MIMO 64T64R & micro-RRH 5G overlays — ₹40.0L</span>
              </li>
            </ul>
          </div>
        </div>

        {/* OpEx Panel */}
        <div className="p-5 rounded-xl border border-red-500/30 bg-gradient-to-b from-red-950/20 to-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-red-500/20 text-[#FF4D4D]">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Event Operational Expense (OpEx)</h4>
                <p className="text-xs text-slate-400">Tactical surge infrastructure & mobile staging</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 font-mono">
              {split.opex_pct.toFixed(1)}% of budget
            </span>
          </div>

          <div className="bg-[#0B0F19]/90 rounded-xl p-4 border border-[#223050] space-y-2">
            <div className="text-xs text-slate-400 font-mono">OpEx Operational Spend</div>
            <div className="text-2xl font-black text-white font-mono">
              ₹{split.opex_crores.toFixed(3)} Crore{' '}
              <span className="text-xs font-normal text-slate-400">(₹{split.opex_lakhs.toFixed(2)} Lakhs)</span>
            </div>
            <div className="text-[11px] text-red-300 font-mono font-semibold pt-1 border-t border-slate-800">
              Per-event mobile capacity deployed only during match days
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="font-semibold text-white">Event Operational Inclusions:</div>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>4 Cells on Wheels (COWs) staged at Gates 1, 3, 5, 7 — ₹100.0L</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>Mobile diesel generators, security escort, and fuel logistics</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>Post-match demobilization and repositioning to Gujarat circle reserves</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Strategic Justification Box */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-1">
        <span className="font-bold text-white uppercase text-[11px] tracking-wider">
          Airtel CFO & Board Strategic Asset Justification:
        </span>
        <p className="leading-relaxed">
          {split.strategic_notes}
          Unlike temporary pure-rental proposals that forfeit 100% of expenditure after match completion,
          our architectural strategy locks in permanent dark fibre transport and in-bowl 5G small cells.
          This transforms Narendra Modi Stadium into India's premier high-density smart arena for all future IPL seasons,
          bilateral series, and major mega-concerts at negligible subsequent marginal cost.
        </p>
      </div>
    </div>
  )
}

