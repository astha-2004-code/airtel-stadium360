import React from 'react'
import { SiteUtilizationItem } from '../../types/evaluation'
import { Compass, CheckCircle2, AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react'

interface SiteUtilizationHeatmapProps {
  sites: SiteUtilizationItem[]
}

export const SiteUtilizationHeatmap: React.FC<SiteUtilizationHeatmapProps> = ({ sites }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Site-Wise Network Utilization & Congestion Heatmap</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              8 Sectors
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pre-intervention baseline vs post-deployment PRB load matrix across stadium tiers
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Optimal (&le;80%)
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Warning (80-90%)
          </span>
          <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical (&gt;90%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {sites.map((site) => {
          const isBaseCongested = site.baseline_4g_load_pct >= 80.0
          const isPropOptimal = site.proposed_utilization_pct <= 80.0

          return (
            <div
              key={site.site_id}
              className={`rounded-xl p-4 border transition-all ${
                isPropOptimal
                  ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-red-200 dark:border-red-900/50 bg-red-50/20 dark:bg-red-950/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black font-mono text-red-600 dark:text-red-400">
                      {site.site_id}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {site.sector_type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {site.site_name}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{site.azimuth_deg}°</span>
                </div>
              </div>

              {/* Load Metrics Before vs After */}
              <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Baseline</span>
                  <div className="text-base font-bold text-red-600 dark:text-red-400 mt-0.5">
                    {site.baseline_4g_load_pct.toFixed(1)}%
                  </div>
                  <span className="text-[10px] text-red-500 font-medium">99% Saturation</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Proposed</span>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {site.proposed_utilization_pct.toFixed(1)}%
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">&le;80% Target Met</span>
                </div>
              </div>

              {/* Progress Bar comparison */}
              <div className="mt-3 space-y-1.5">
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, site.baseline_4g_load_pct)}%` }}
                  />
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, site.proposed_utilization_pct)}%` }}
                  />
                </div>
              </div>

              {/* Intervention Label */}
              <div className="mt-3 pt-2 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                <ArrowRight className="w-3 h-3 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{site.intervention}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

