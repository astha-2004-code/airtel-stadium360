import React from 'react'
import { Users, Smartphone, Wifi, Activity, ArrowRight, Zap } from 'lucide-react'
import { DemandCalculationResponse } from '../../types/analytics'

interface DemandFormulaBreakdownProps {
  data: DemandCalculationResponse
}

export const DemandFormulaBreakdown: React.FC<DemandFormulaBreakdownProps> = ({ data }) => {
  const { parameters, spectators, active_users, throughput_demand_gbps, capacity_requirements_gbps } = data

  const steps = [
    {
      step: '1',
      title: 'Airtel Spectators',
      formula: 'Capacity × Airtel Share',
      calculation: `${parameters.capacity.toLocaleString()} × ${(parameters.airtel_share * 100).toFixed(0)}%`,
      result: `${spectators.airtel_spectators.toLocaleString()} fans`,
      subtext: `${spectators.spectators_5g_capable.toLocaleString()} 5G capable (${(parameters.device_share_5g * 100).toFixed(0)}%)`,
      icon: Users,
      color: 'from-blue-600/20 to-blue-500/5',
      borderColor: 'border-blue-500/30',
      badgeColor: 'bg-blue-500/20 text-blue-400',
    },
    {
      step: '2',
      title: 'Peak Active Users',
      formula: 'Airtel Fans × Online %',
      calculation: `${spectators.airtel_spectators.toLocaleString()} × ${(parameters.peak_online_pct * 100).toFixed(0)}%`,
      result: `${active_users.peak_active_airtel_users.toLocaleString()} concurrent`,
      subtext: `Simultaneous data session during peak match tension`,
      icon: Activity,
      color: 'from-amber-600/20 to-amber-500/5',
      borderColor: 'border-amber-500/30',
      badgeColor: 'bg-amber-500/20 text-amber-400',
    },
    {
      step: '3',
      title: 'Technology Split',
      formula: 'Active × 5G / 4G Share',
      calculation: `5G: ${active_users.active_5g_users.toLocaleString()} | 4G: ${active_users.active_4g_users.toLocaleString()}`,
      result: `${((active_users.active_5g_users / active_users.peak_active_airtel_users) * 100).toFixed(0)}% 5G / ${((active_users.active_4g_users / active_users.peak_active_airtel_users) * 100).toFixed(0)}% 4G`,
      subtext: `Assuming uniform device distribution across active users`,
      icon: Smartphone,
      color: 'from-purple-600/20 to-purple-500/5',
      borderColor: 'border-purple-500/30',
      badgeColor: 'bg-purple-500/20 text-purple-400',
    },
    {
      step: '4',
      title: 'Throughput Demand',
      formula: '(5G × 5M) + (4G × 3M)',
      calculation: `(${active_users.active_5g_users} × ${parameters.target_speed_5g_mbps}M) + (${active_users.active_4g_users} × ${parameters.target_speed_4g_mbps}M)`,
      result: `${throughput_demand_gbps.total_demand.toFixed(2)} Gbps`,
      subtext: `5G: ${throughput_demand_gbps.demand_5g.toFixed(2)} Gbps | 4G: ${throughput_demand_gbps.demand_4g.toFixed(2)} Gbps`,
      icon: Wifi,
      color: 'from-rose-600/20 to-rose-500/5',
      borderColor: 'border-rose-500/30',
      badgeColor: 'bg-rose-500/20 text-rose-400',
    },
    {
      step: '5',
      title: 'Target Capacity (80%)',
      formula: 'Total Demand / 0.80',
      calculation: `${throughput_demand_gbps.total_demand.toFixed(2)} Gbps ÷ ${(parameters.target_utilization * 100).toFixed(0)}%`,
      result: `${capacity_requirements_gbps.required_total_at_80_pct.toFixed(2)} Gbps`,
      subtext: `20% headroom margin to prevent packet queuing & UPI drops`,
      icon: Zap,
      color: 'from-red-600/30 to-red-500/10',
      borderColor: 'border-red-500/50',
      badgeColor: 'bg-red-500/20 text-red-400 font-bold',
    },
  ]

  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Master Telecom Formulation</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 font-mono">
              3GPP Compliant
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Mathematical Demand & Capacity Derivation</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Required Network Capacity</span>
          <p className="text-xl font-black text-[#FF4D4D] font-mono">
            {capacity_requirements_gbps.required_total_at_80_pct.toFixed(2)} Gbps
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className={`rounded-xl border ${item.borderColor} bg-gradient-to-b ${item.color} p-4 flex flex-col justify-between relative group hover:border-white/30 transition-all`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    Step {item.step}
                  </span>
                  <div className="p-1.5 rounded-lg bg-[#0B0F19]/60 border border-white/10 text-slate-300">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{item.title}</h4>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">{item.formula}</p>
                </div>

                <div className="bg-[#0B0F19]/80 rounded-lg p-2.5 border border-[#223050] space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono truncate">{item.calculation}</div>
                  <div className="text-base font-black text-white font-mono tracking-tight">{item.result}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 mt-3">
                <p className="text-[10px] text-slate-400 leading-tight">{item.subtext}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

