import React from 'react'
import {
  Wifi,
  Zap,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { ConnectivityKpis } from '../../types/connectivity'

interface ConnectivityKpiOverviewProps {
  kpis: ConnectivityKpis | null
  isLoading?: boolean
}

export const ConnectivityKpiOverview: React.FC<ConnectivityKpiOverviewProps> = ({
  kpis,
  isLoading = false,
}) => {
  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-40 bg-[#131B2E] rounded-2xl border border-[#223050]" />
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: '5G Camping Rate',
      subtitle: '5G UEs successfully on NR vs stuck on 4G',
      baseline: `${kpis.baseline_camping_rate_pct}%`,
      proposed: `${kpis.proposed_camping_rate_pct}%`,
      delta: `+${(kpis.proposed_camping_rate_pct - kpis.baseline_camping_rate_pct).toFixed(1)}%`,
      deltaPositive: true,
      icon: Wifi,
      accent: 'emerald',
      description: 'Anchor Shield reserves 15% LTE PRBs to guarantee SgNB additions',
    },
    {
      title: 'SgNB Addition Success',
      subtitle: 'X2-AP Dual Connectivity connection rate',
      baseline: `${kpis.baseline_sgnb_addition_rate_pct}%`,
      proposed: `${kpis.proposed_sgnb_addition_rate_pct}%`,
      delta: `+${(kpis.proposed_sgnb_addition_rate_pct - kpis.baseline_sgnb_addition_rate_pct).toFixed(1)}%`,
      deltaPositive: true,
      icon: ShieldCheck,
      accent: 'blue',
      description: 'Control signaling fast-tracked across protected dark fibre',
    },
    {
      title: '5G Median DL Speed',
      subtitle: 'Target: 5.0 Mbps per active spectator',
      baseline: `${kpis.baseline_median_dl_speed_mbps} Mbps`,
      proposed: `${kpis.proposed_median_dl_speed_mbps} Mbps`,
      delta: `+${((kpis.proposed_median_dl_speed_mbps / kpis.baseline_median_dl_speed_mbps - 1) * 100).toFixed(0)}%`,
      deltaPositive: true,
      icon: Zap,
      accent: 'red',
      description: 'Exceeds competition target (5 Mbps) by 24.9x headroom',
    },
    {
      title: 'Average 5G SINR',
      subtitle: 'Signal to Interference & Noise Ratio',
      baseline: `${kpis.baseline_avg_sinr_db} dB`,
      proposed: `${kpis.proposed_avg_sinr_db} dB`,
      delta: `+${(kpis.proposed_avg_sinr_db - kpis.baseline_avg_sinr_db).toFixed(1)} dB`,
      deltaPositive: true,
      icon: Activity,
      accent: 'amber',
      description: '64T64R 3D beamforming suppresses adjacent cell interference',
    },
    {
      title: '5G SCG Drop Rate',
      subtitle: 'Secondary Cell Group connection drops',
      baseline: `${kpis.baseline_scg_drop_rate_pct}%`,
      proposed: `${kpis.proposed_scg_drop_rate_pct}%`,
      delta: `-${(kpis.baseline_scg_drop_rate_pct - kpis.proposed_scg_drop_rate_pct).toFixed(2)}%`,
      deltaPositive: true,
      icon: AlertTriangle,
      accent: 'purple',
      description: '1.5 dB hysteresis margin eliminates bowl edge ping-ponging',
    },
    {
      title: 'Active 5G Data Delivered',
      subtitle: 'Peak throughput delivered on 3.5 GHz n78',
      baseline: '1.42 Gbps',
      proposed: `${kpis.five_g_throughput_delivered_gbps} Gbps`,
      delta: `+${kpis.five_g_active_users_proposed.toLocaleString()} UEs`,
      deltaPositive: true,
      icon: TrendingUp,
      accent: 'cyan',
      description: `${kpis.five_g_active_users_proposed.toLocaleString()} concurrent users supported simultaneously`,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E40000]" />
            5G Accessibility & Quality Benchmarks (Historical vs Proposed)
          </h3>
          <p className="text-xs text-slate-400">
            Narendra Modi Stadium • 100 MHz Band n78 (3.5 GHz) • 3GPP NSA Option 3x
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded bg-slate-600 inline-block" /> Historical Baseline
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded bg-[#E40000] inline-block" /> Airtel Stadium360
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#131B2E] border border-[#223050] hover:border-slate-500/40 transition-all space-y-3 relative overflow-hidden group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-[#E40000] group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">{c.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{c.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{c.delta}</span>
                </div>
              </div>

              {/* Baseline vs Proposed Values */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#223050]/80">
                <div className="p-2.5 rounded-xl bg-[#0B0F19]/60 border border-slate-800/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Baseline</div>
                  <div className="text-lg font-bold text-slate-400 line-through decoration-red-500/50">
                    {c.baseline}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20">
                  <div className="text-[10px] text-[#E40000] uppercase font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Proposed
                  </div>
                  <div className="text-lg font-black text-white">{c.proposed}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed bg-[#0B0F19]/40 p-2 rounded-lg border border-slate-800/40">
                {c.description}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
