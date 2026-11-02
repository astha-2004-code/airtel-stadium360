import React from 'react'
import { SiteDetail } from '../../types/network'
import {
  X,
  Radio,
  Wifi,
  Gauge,
  Network,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react'

interface SiteDetailsDrawerProps {
  siteDetail: SiteDetail | null
  onClose: () => void
  isLoading: boolean
}

export const SiteDetailsDrawer: React.FC<SiteDetailsDrawerProps> = ({
  siteDetail,
  onClose,
  isLoading,
}) => {
  if (!siteDetail && !isLoading) return null

  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl border ${siteDetail?.is_bottleneck ? 'bg-amber-950/40 border-amber-800/50 text-amber-400' : 'bg-red-950/40 border-red-800/50 text-[#FF4D4D]'}`}>
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                {siteDetail ? siteDetail.name : 'Loading Site Details...'}
              </h3>
              {siteDetail && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${siteDetail.current_load_pct >= 80 ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
                  {siteDetail.status}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {siteDetail?.description}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
          <span className="text-xs text-slate-400 font-mono">Querying PostgreSQL telemetry...</span>
        </div>
      ) : siteDetail ? (
        <div className="space-y-4 text-xs">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">DISTANCE &amp; ANGLE</span>
              <span className="text-sm font-bold text-white font-mono">{siteDetail.distance_m}m</span>
              <span className="text-[10px] text-slate-500 block">Azimuth: {siteDetail.azimuth_deg}°</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">4G ANCHOR LOAD</span>
              <span className={`text-sm font-bold font-mono ${siteDetail.current_load_pct >= 80 ? 'text-red-400' : 'text-emerald-400'}`}>
                {siteDetail.current_load_pct}%
              </span>
              <span className="text-[10px] text-slate-500 block">Band 3 (1800 MHz)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">USER SPEED</span>
              <span className="text-sm font-bold text-amber-300 font-mono">
                {siteDetail.current_speed_mbps} Mbps
              </span>
              <span className="text-[10px] text-slate-500 block">Target: &ge;3.0 Mbps</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">BACKHAUL CAPACITY</span>
              <span className={`text-sm font-bold font-mono ${siteDetail.is_bottleneck ? 'text-amber-400' : 'text-emerald-400'}`}>
                {siteDetail.backhaul_capacity_gbps} Gbps
              </span>
              <span className="text-[10px] text-slate-500 block">{siteDetail.backhaul_type}</span>
            </div>
          </div>

          {/* 5G Accessibility & EN-DC Diagnostic */}
          <div className={`p-3.5 rounded-xl border flex items-start space-x-3 ${siteDetail.has_5g ? 'bg-blue-950/20 border-blue-800/40' : 'bg-amber-950/20 border-amber-800/40'}`}>
            <Wifi className={`w-5 h-5 shrink-0 mt-0.5 ${siteDetail.has_5g ? 'text-blue-400' : 'text-amber-400'}`} />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-xs">5G Dual Connectivity (EN-DC) Status:</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${siteDetail.has_5g ? 'bg-blue-900 text-blue-200' : 'bg-amber-900 text-amber-200'}`}>
                  {siteDetail.has_5g ? 'Active (n78 100MHz)' : 'Missing 5G Carrier'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {siteDetail.en_dc_status}
              </p>
              {siteDetail.has_5g && (
                <p className="text-[10px] text-slate-400 font-mono">
                  Secondary Node Addition success rate fell to 35-37% during innings break due to 4G anchor saturation.
                </p>
              )}
            </div>
          </div>

          {/* Historical Telemetry across 4 Moments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Historical Match Moments Telemetry (From Sync_V1.xlsx)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Normal vs Match Day</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-medium">
                    <th className="py-2 px-3">Moment</th>
                    <th className="py-2 px-2 text-right">Normal Load</th>
                    <th className="py-2 px-2 text-right">Match Load</th>
                    <th className="py-2 px-2 text-right">Normal Speed</th>
                    <th className="py-2 px-2 text-right">Match Speed</th>
                    <th className="py-2 px-2 text-right">5G Success</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {siteDetail.measurements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2 px-3 font-sans text-slate-300 font-medium">
                        {m.match_phase} ({m.time_of_day})
                      </td>
                      <td className="py-2 px-2 text-right text-emerald-400">{m.normal_4g_load_pct}%</td>
                      <td className={`py-2 px-2 text-right font-bold ${m.match_4g_load_pct >= 80 ? 'text-red-400' : 'text-slate-300'}`}>
                        {m.match_4g_load_pct}%
                      </td>
                      <td className="py-2 px-2 text-right text-slate-400">{m.normal_4g_speed_mbps}M</td>
                      <td className={`py-2 px-2 text-right font-bold ${m.match_4g_speed_mbps <= 1.5 ? 'text-red-400' : 'text-amber-300'}`}>
                        {m.match_4g_speed_mbps}M
                      </td>
                      <td className={`py-2 px-2 text-right ${m.match_5g_connection_success_pct < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {m.match_5g_connection_success_pct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommended Upgrades Box */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-2 text-[#FF4D4D] font-bold text-xs">
              <Wrench className="w-3.5 h-3.5" />
              <span>Recommended Engineering Upgrade:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
              {siteDetail.recommended_upgrade}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

