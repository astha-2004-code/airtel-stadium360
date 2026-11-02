import React from 'react'
import { Server, AlertCircle, CheckCircle, Wifi, ShieldAlert, ArrowUpRight } from 'lucide-react'
import { SiteCapacityBreakdown } from '../../types/analytics'

interface SiteCapacityMatrixProps {
  sites: SiteCapacityBreakdown[]
}

export const SiteCapacityMatrix: React.FC<SiteCapacityMatrixProps> = ({ sites }) => {
  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Site-Level Disaggregation</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 font-mono">
              8 Sites Monitored
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Site-by-Site Capacity Deficit & Bottleneck Matrix</h3>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-slate-400">Critical Overload (&gt;90%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-400">Backhaul Capped</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#223050] text-slate-400 font-mono text-[11px] bg-[#0B0F19]/40">
              <th className="py-3 px-3">Site ID</th>
              <th className="py-3 px-3">Type & Distance</th>
              <th className="py-3 px-3">Installed Backhaul</th>
              <th className="py-3 px-3">Assigned Users</th>
              <th className="py-3 px-3">Total Demand</th>
              <th className="py-3 px-3">Target Cap @80%</th>
              <th className="py-3 px-3">Usable Cap</th>
              <th className="py-3 px-3">Deficit / Gap</th>
              <th className="py-3 px-3">Utilization</th>
              <th className="py-3 px-3 text-right">Status / Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#223050]/50 font-sans">
            {sites.map((site) => {
              const isBottleneck = site.is_backhaul_constrained
              const isCritical = site.status === 'CRITICAL'
              const hasNo5G = !site.has_5g

              return (
                <tr key={site.site_id} className="hover:bg-[#131B2E]/60 transition-colors">
                  {/* Site ID */}
                  <td className="py-3.5 px-3 font-mono font-bold text-white">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                          site.type === 'Macro'
                            ? 'bg-red-500/20 text-[#FF4D4D] border border-red-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {site.site_id}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{site.site_id}</div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          {site.traffic_weight_pct}% crowd
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Type & Distance */}
                  <td className="py-3.5 px-3 text-slate-300">
                    <div>{site.type}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{site.distance_m}m to pitch</div>
                  </td>

                  {/* Backhaul */}
                  <td className="py-3.5 px-3 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        site.backhaul.includes('10G')
                          ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                          : site.backhaul.includes('Microwave')
                          ? 'bg-amber-950/60 border border-amber-800 text-amber-300'
                          : 'bg-rose-950/60 border border-rose-800 text-rose-300'
                      }`}
                    >
                      {site.backhaul}
                    </span>
                  </td>

                  {/* Users */}
                  <td className="py-3.5 px-3 font-mono">
                    <span className="text-white font-bold">{site.assigned_active_users.toLocaleString()}</span>
                    <div className="text-[10px] text-slate-500">
                      {site.assigned_5g_users} 5G / {site.assigned_4g_users} 4G
                    </div>
                  </td>

                  {/* Demand */}
                  <td className="py-3.5 px-3 font-mono text-slate-200">
                    <span className="font-bold">{site.total_demand_gbps.toFixed(2)} Gbps</span>
                    <div className="text-[10px] text-slate-500">
                      5G: {site.demand_5g_gbps.toFixed(2)} | 4G: {site.demand_4g_gbps.toFixed(2)}
                    </div>
                  </td>

                  {/* Required Cap @ 80% */}
                  <td className="py-3.5 px-3 font-mono text-amber-300 font-bold">
                    {site.required_capacity_80_gbps.toFixed(2)} Gbps
                  </td>

                  {/* Usable Capacity */}
                  <td className="py-3.5 px-3 font-mono">
                    <span
                      className={
                        site.usable_capacity_gbps < site.delivered_rf_capacity_gbps
                          ? 'text-rose-400 font-bold'
                          : 'text-slate-300'
                      }
                    >
                      {site.usable_capacity_gbps.toFixed(2)} Gbps
                    </span>
                    {site.usable_capacity_gbps < site.delivered_rf_capacity_gbps && (
                      <div className="text-[9px] text-rose-400">Backhaul limited</div>
                    )}
                  </td>

                  {/* Deficit */}
                  <td className="py-3.5 px-3 font-mono">
                    {site.capacity_deficit_gbps > 0 ? (
                      <span className="text-[#FF4D4D] font-bold">
                        +{site.capacity_deficit_gbps.toFixed(2)} Gbps
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold">0.00 Gbps</span>
                    )}
                  </td>

                  {/* Utilization bar */}
                  <td className="py-3.5 px-3 font-mono min-w-[120px]">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span
                        className={`font-bold ${
                          site.utilization_pct >= 90
                            ? 'text-rose-400'
                            : site.utilization_pct >= 80
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {site.utilization_pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          site.utilization_pct >= 90
                            ? 'bg-rose-500'
                            : site.utilization_pct >= 80
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, site.utilization_pct)}%` }}
                      />
                    </div>
                  </td>

                  {/* Status / Flags */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex flex-col items-end space-y-1">
                      {isCritical && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          OVERLOAD
                        </span>
                      )}
                      {isBottleneck && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          BACKHAUL CAPPED
                        </span>
                      )}
                      {hasNo5G && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          NO 5G
                        </span>
                      )}
                    </div>
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

