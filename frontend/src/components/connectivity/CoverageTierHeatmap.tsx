import React from 'react'
import {
  Layers,
  MapPin,
  TrendingUp,
  Signal,
  CheckCircle2,
  Shield,
  Zap,
} from 'lucide-react'
import { CoverageTier } from '../../types/connectivity'

interface CoverageTierHeatmapProps {
  tiers: CoverageTier[]
}

export const CoverageTierHeatmap: React.FC<CoverageTierHeatmapProps> = ({ tiers }) => {
  return (
    <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E40000]/10 text-[#E40000] border border-red-500/20">
              Stadium Bowl RF Profiler
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              4 Physical Zones
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Stadium Bowl RF Propagation & Coverage Tiers
          </h3>
          <p className="text-xs text-slate-400">
            Path loss modeling and signal quality (RSRP & SINR) across tiered seating structures
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Optimal (SINR &gt; 18 dB)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold flex items-center gap-1">
            <Signal className="w-3.5 h-3.5" /> Good (SINR &gt; 14 dB)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((t) => {
          const isOptimal = t.coverage_status === 'OPTIMAL'
          const rsrpImprovement = (t.proposed_rsrp_dbm - t.baseline_rsrp_dbm).toFixed(1)
          const sinrImprovement = (t.proposed_sinr_db - t.baseline_sinr_db).toFixed(1)

          return (
            <div
              key={t.tier_id}
              className={`p-5 rounded-2xl border transition-all space-y-4 relative overflow-hidden flex flex-col justify-between ${
                isOptimal
                  ? 'bg-slate-900/90 border-[#223050] hover:border-emerald-500/40'
                  : 'bg-slate-900/90 border-[#223050] hover:border-blue-500/40'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-xl bg-slate-800 text-[#E40000]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isOptimal
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {t.coverage_status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{t.tier_name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {t.mean_distance_m}m dist
                    </span>
                    <span>•</span>
                    <span>{t.spectator_capacity.toLocaleString()} seats</span>
                  </div>
                </div>
              </div>

              {/* RSRP and SINR metrics */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                {/* RSRP */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Signal (RSRP)</span>
                    <span className="font-mono font-bold text-white">
                      {t.proposed_rsrp_dbm} dBm
                      <span className="text-[10px] text-emerald-400 ml-1">(+{rsrpImprovement})</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, Math.max(10, (120 + t.proposed_rsrp_dbm) * 2))}%` }}
                    />
                  </div>
                </div>

                {/* SINR */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Quality (SINR)</span>
                    <span className="font-mono font-bold text-emerald-400">
                      +{t.proposed_sinr_db} dB
                      <span className="text-[10px] text-emerald-400 ml-1">(+{sinrImprovement})</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#E40000] h-full rounded-full"
                      style={{ width: `${Math.min(100, (t.proposed_sinr_db / 25) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Down-tilt & Technology */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Optimal RET Tilt</span>
                  <span className="font-mono font-bold text-white bg-slate-800/80 px-2 py-0.5 rounded">
                    {t.optimal_electrical_tilt_deg}° Down
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate" title={t.primary_serving_technology}>
                  <strong className="text-slate-300">Serving:</strong> {t.primary_serving_technology}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
