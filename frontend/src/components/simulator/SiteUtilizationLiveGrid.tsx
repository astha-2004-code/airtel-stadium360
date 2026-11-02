import React from 'react'
import { Server, Wifi, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react'
import { SiteSimulationItem } from '../../types/simulator'

interface SiteUtilizationLiveGridProps {
  sites: SiteSimulationItem[]
}

export const SiteUtilizationLiveGrid: React.FC<SiteUtilizationLiveGridProps> = ({ sites }) => {
  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Live Load Balancing</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-mono">
              8 Stadium Sectors
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Live Sector Utilization & Backhaul Bottlenecks</h3>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Optimal (≤80%)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Congested (&gt;80%)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sites.map((site) => {
          const isMacro = site.type === 'Macro'
          const isOverloaded = site.utilization_pct > 80.0

          return (
            <div
              key={site.site_id}
              className={`p-4 rounded-xl border bg-[#0B0F19]/80 space-y-3 transition-all ${
                isOverloaded ? 'border-rose-500/40 bg-rose-950/10' : 'border-[#223050] hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
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
                  <div>
                    <span className="font-bold text-white text-xs">{site.site_id}</span>
                    <span className="text-[10px] text-slate-500 ml-1.5">{site.type}</span>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                    site.status === 'OPTIMAL'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : site.status === 'WARNING'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {site.status}
                </span>
              </div>

              {/* Utilization progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Sector Load:</span>
                  <span
                    className={`font-bold ${
                      site.utilization_pct <= 80
                        ? 'text-emerald-400'
                        : site.utilization_pct <= 90
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {site.utilization_pct.toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      site.utilization_pct <= 80
                        ? 'bg-emerald-500'
                        : site.utilization_pct <= 90
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, site.utilization_pct)}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-500">Demand:</span>
                  <p className="text-white font-bold">{site.demand_gbps.toFixed(2)} Gbps</p>
                </div>
                <div>
                  <span className="text-slate-500">Usable Cap:</span>
                  <p className="text-slate-300 font-bold">{site.usable_capacity_gbps.toFixed(2)} Gbps</p>
                </div>
                <div>
                  <span className="text-slate-500">Backhaul:</span>
                  <p className={site.is_backhaul_bottleneck ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                    {site.backhaul}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">5G Layer:</span>
                  <p className={site.has_5g ? 'text-blue-400 font-bold' : 'text-slate-500'}>
                    {site.has_5g ? 'Active' : '4G Only'}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

