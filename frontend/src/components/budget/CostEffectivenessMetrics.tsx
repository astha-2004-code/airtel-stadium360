import React from 'react'
import { Zap, Users, Smartphone, ShieldCheck, TrendingUp, Award } from 'lucide-react'
import { CostEffectivenessResponse } from '../../types/budget'

interface CostEffectivenessMetricsProps {
  metrics: CostEffectivenessResponse
}

export const CostEffectivenessMetrics: React.FC<CostEffectivenessMetricsProps> = ({ metrics }) => {
  const {
    capacity_added_gbps,
    cost_per_gbps_lakhs,
    cost_per_active_user_inr,
    cost_per_spectator_inr,
    upi_preservation,
    telecom_roi_score,
    capital_efficiency_rating,
  } = metrics

  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Telecom Return on Investment (ROI)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-mono">
              Benchmark Verified
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Capital Efficiency & Business Value Protection</h3>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-mono">Rating:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5 font-mono">
            <Award className="w-3.5 h-3.5" />
            <span>{capital_efficiency_rating} ({telecom_roi_score}/100)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cost per Gbps */}
        <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Cost per Gbps Added</span>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            ₹{cost_per_gbps_lakhs.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-400">Lakhs / Gbps</span>
          </div>
          <p className="text-[10px] text-emerald-400 font-mono font-semibold pt-1 border-t border-slate-800">
            +{capacity_added_gbps.toFixed(2)} Gbps practical RF added
          </p>
        </div>

        {/* Cost per Active User */}
        <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Cost per Concurrent User</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            ₹{cost_per_active_user_inr.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">/ active user</span>
          </div>
          <p className="text-[10px] text-amber-400 font-mono font-semibold pt-1 border-t border-slate-800">
            Peak 7,200 simultaneous sessions
          </p>
        </div>

        {/* Cost per Airtel Spectator */}
        <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Cost per Airtel Fan</span>
            <Smartphone className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            ₹{cost_per_spectator_inr.toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-400">/ spectator</span>
          </div>
          <p className="text-[10px] text-purple-400 font-mono font-semibold pt-1 border-t border-slate-800">
            Across 40,000 Airtel subscribers
          </p>
        </div>

        {/* UPI Revenue Protected */}
        <div className="p-4 rounded-xl bg-[#0B0F19]/80 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">UPI Payments Protected</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {upi_preservation.protected_transactions_count.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">payments</span>
          </div>
          <p className="text-[10px] text-emerald-300 font-mono font-semibold pt-1 border-t border-slate-800">
            ₹{upi_preservation.protected_turnover_gmv_lakhs.toFixed(2)}L merchant GMV preserved
          </p>
        </div>
      </div>

      {/* Explanatory Callout */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-1">
        <span className="font-bold text-white uppercase text-[11px] tracking-wider">
          Economic Protection Analysis:
        </span>
        <p className="leading-relaxed">
          During the historical baseline match, UPI failure rate spiked from 1.08% up to 7.11% during the 21:00 Innings Break,
          collapsing concession stands, food ordering, and ride-hailing services.
          By investing ₹49.5L into 10G optical backhaul and dedicating high-priority QCI=1 / 5QI=1 slices,
          the network averts over <span className="text-white font-bold">{upi_preservation.protected_transactions_count.toLocaleString()} failed transactions</span>,
          protecting over <span className="text-emerald-400 font-bold font-mono">₹{upi_preservation.protected_turnover_gmv_lakhs.toFixed(2)} Lakhs</span> in merchant turnover
          and safeguarding Airtel’s brand perception during a live global telecast.
        </p>
      </div>
    </div>
  )
}

