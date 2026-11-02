import React from 'react'
import { Server, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { SiteIntervention } from '../../types/optimizer'

interface SiteInterventionTableProps {
  interventions: SiteIntervention[]
}

export const SiteInterventionTable: React.FC<SiteInterventionTableProps> = ({ interventions }) => {
  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Site Transformation Plan</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-mono">
              Before vs After Deployment
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Site-by-Site Engineering Interventions</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>All 8 Sites Brought Below 80% Utilization SLA</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#223050] text-slate-400 font-mono text-[11px] bg-[#0B0F19]/40">
              <th className="py-3 px-3">Site ID</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Backhaul Transition</th>
              <th className="py-3 px-3">5G Status</th>
              <th className="py-3 px-3">Capacity (Pre → Post)</th>
              <th className="py-3 px-3">Post Utilization</th>
              <th className="py-3 px-3">Detailed Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#223050]/50 font-sans">
            {interventions.map((site) => {
              const isMacro = site.type === 'Macro'
              const wasUpgraded = site.original_backhaul !== site.new_backhaul || !site.original_has_5g && site.new_has_5g

              return (
                <tr key={site.site_id} className="hover:bg-[#131B2E]/60 transition-colors">
                  {/* Site ID */}
                  <td className="py-3.5 px-3 font-mono font-bold text-white">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                          isMacro
                            ? 'bg-red-500/20 text-[#FF4D4D] border border-red-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {site.site_id}
                      </div>
                      <span className="font-bold text-white text-xs">{site.site_id}</span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-3 text-slate-300 font-medium">{site.type}</td>

                  {/* Backhaul Transition */}
                  <td className="py-3.5 px-3 font-mono">
                    <div className="flex items-center space-x-1.5 text-[10px]">
                      <span
                        className={`px-1.5 py-0.5 rounded ${
                          site.original_backhaul.includes('10G')
                            ? 'bg-slate-800 text-slate-300'
                            : 'bg-rose-950/60 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {site.original_backhaul}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold">
                        {site.new_backhaul}
                      </span>
                    </div>
                  </td>

                  {/* 5G Status */}
                  <td className="py-3.5 px-3 font-mono">
                    {site.original_has_5g ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                        Active 5G
                      </span>
                    ) : site.new_has_5g ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1 w-fit">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Upgraded 5G</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">4G Only</span>
                    )}
                  </td>

                  {/* Capacity Pre -> Post */}
                  <td className="py-3.5 px-3 font-mono">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-400">{site.original_capacity_gbps.toFixed(2)}G</span>
                      <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="text-white font-bold">{site.final_capacity_gbps.toFixed(2)} Gbps</span>
                      {site.added_capacity_gbps > 0 && (
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          (+{site.added_capacity_gbps.toFixed(2)}G)
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Post Utilization */}
                  <td className="py-3.5 px-3 font-mono">
                    <div className="space-y-1 min-w-[100px]">
                      <div className="flex justify-between items-center text-[11px]">
                        <span
                          className={`font-bold ${
                            site.final_utilization_pct <= 80
                              ? 'text-emerald-400'
                              : site.final_utilization_pct <= 90
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {site.final_utilization_pct.toFixed(1)}%
                        </span>
                        <span className="text-[9px] text-slate-500">SLA: ≤80%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            site.final_utilization_pct <= 80
                              ? 'bg-emerald-500'
                              : site.final_utilization_pct <= 90
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, site.final_utilization_pct)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3">
                    <ul className="space-y-1">
                      {site.actions.map((act, aIdx) => (
                        <li key={aIdx} className="text-[11px] text-slate-300 flex items-start space-x-1.5">
                          <span className="text-[#FF4D4D] font-bold mt-0.5">•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
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
