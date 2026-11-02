import React from 'react'
import {
  CreditCard,
  CheckCircle2,
  TrendingDown,
  Store,
  DollarSign,
  ShieldCheck,
} from 'lucide-react'
import { SiteUpiTelemetry } from '../../types/criticalServices'

interface SiteUpiTelemetryTableProps {
  sites: SiteUpiTelemetry[]
}

export const SiteUpiTelemetryTable: React.FC<SiteUpiTelemetryTableProps> = ({ sites }) => {
  const totalVolume = sites.reduce((acc, s) => acc + s.estimated_tx_volume, 0)
  const totalGmv = sites.reduce((acc, s) => acc + s.gmv_at_risk_lakhs, 0)
  const totalSavedTx = sites.reduce((acc, s) => acc + (s.baseline_failed_tx - s.proposed_failed_tx), 0)

  return (
    <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E40000]/10 text-[#E40000] border border-red-500/20">
              Merchant Sector Telemetry
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              8 Macro & Concourse Zones
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Site-Wise UPI Transaction Volume & Failure Mitigation
          </h3>
          <p className="text-xs text-slate-400">
            Sector-level monitoring across food courts, merchandise stalls, VIP boxes, and entry turnstiles
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-[#0B0F19] p-2 rounded-xl border border-slate-800">
          <div>
            <span className="text-slate-400 text-[10px] block">Total Volume:</span>
            <span className="font-mono font-bold text-white">{totalVolume.toLocaleString()} tx</span>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <span className="text-slate-400 text-[10px] block">Averted Failures:</span>
            <span className="font-mono font-bold text-emerald-400">+{totalSavedTx.toLocaleString()}</span>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <span className="text-slate-400 text-[10px] block">Total GMV:</span>
            <span className="font-mono font-bold text-white">₹{totalGmv.toFixed(1)}L</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <th className="py-3 px-4">Site & Location</th>
              <th className="py-3 px-3">Commercial Amenity</th>
              <th className="py-3 px-3 text-right">Transactions</th>
              <th className="py-3 px-3 text-center">Baseline Failure</th>
              <th className="py-3 px-3 text-center">Protected Failure</th>
              <th className="py-3 px-3 text-right">Averted Drops</th>
              <th className="py-3 px-3 text-right">GMV (₹ Lakhs)</th>
              <th className="py-3 px-3 text-center">Queue Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
            {sites.map((s) => {
              const averted = s.baseline_failed_tx - s.proposed_failed_tx
              const isFoodCourt = s.site_id === 'S6'

              return (
                <tr
                  key={s.site_id}
                  className={`hover:bg-slate-800/30 transition-colors ${
                    isFoodCourt ? 'bg-red-950/10' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-sans font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#E40000]/20 text-[#E40000] text-center leading-6 font-mono font-bold text-[11px] inline-block">
                      {s.site_id}
                    </span>
                    <span>{s.site_name}</span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">
                    {s.primary_merchants}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 font-bold">
                    {s.estimated_tx_volume.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-red-400 font-bold line-through">
                      {s.baseline_failure_rate_pct}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/20">
                      {s.proposed_failure_rate_pct}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                    +{averted} tx
                  </td>
                  <td className="py-3 px-3 text-right text-white font-bold">
                    ₹{s.gmv_at_risk_lakhs.toFixed(1)}L
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Protected
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
