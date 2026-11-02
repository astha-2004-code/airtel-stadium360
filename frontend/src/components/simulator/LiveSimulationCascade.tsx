import React from 'react'
import {
  Users,
  Activity,
  Smartphone,
  Wifi,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Server,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react'
import { SimulationCascade } from '../../types/simulator'

interface LiveSimulationCascadeProps {
  cascade: SimulationCascade
}

export const LiveSimulationCascade: React.FC<LiveSimulationCascadeProps> = ({ cascade }) => {
  const {
    step_1_airtel_spectators,
    step_2_active_users,
    step_3_user_split,
    step_4_throughput_demand,
    step_5_required_capacity,
    step_6_capacity_evaluation,
    step_7_utilization_metrics,
    step_8_bottlenecks,
    step_9_financial_impact,
    step_10_feasibility,
  } = cascade

  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D4D]">Live 10-Step Cascade</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 font-mono">
              Deterministic Recalculation
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Mathematical What-If Evaluation Pipeline</h3>
        </div>
        <div className="flex items-center space-x-2">
          {step_10_feasibility.is_feasible ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TECHNICALLY FEASIBLE</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{step_10_feasibility.status}</span>
            </span>
          )}
        </div>
      </div>

      {/* 10-Step Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
        {/* Step 1: Airtel Spectators */}
        <div className="p-3.5 rounded-xl bg-[#0B0F19]/80 border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-blue-400">Step 1</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">Airtel Spectators</div>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {step_1_airtel_spectators.airtel_spectators.toLocaleString()}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            {step_1_airtel_spectators.spectators_5g_capable.toLocaleString()} 5G devices
          </p>
        </div>

        {/* Step 2: Active Users */}
        <div className="p-3.5 rounded-xl bg-[#0B0F19]/80 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-amber-400">Step 2</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">Active Users</div>
            <div className="text-lg font-black text-amber-300 font-mono mt-0.5">
              {step_2_active_users.peak_active_airtel_users.toLocaleString()}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            {step_2_active_users.peak_online_pct}% concurrency
          </p>
        </div>

        {/* Step 3: User Split */}
        <div className="p-3.5 rounded-xl bg-[#0B0F19]/80 border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-purple-400">Step 3</span>
            <Smartphone className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">5G / 4G User Split</div>
            <div className="text-lg font-black text-purple-300 font-mono mt-0.5">
              {step_3_user_split.active_5g_users} / {step_3_user_split.active_4g_users}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">70% 5G / 30% 4G ratio</p>
        </div>

        {/* Step 4: Throughput Demand */}
        <div className="p-3.5 rounded-xl bg-[#0B0F19]/80 border border-rose-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-rose-400">Step 4</span>
            <Wifi className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">Total Demand</div>
            <div className="text-lg font-black text-rose-300 font-mono mt-0.5">
              {step_4_throughput_demand.total_demand_gbps.toFixed(2)} Gbps
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            5G: {step_4_throughput_demand.demand_5g_gbps.toFixed(1)} | 4G: {step_4_throughput_demand.demand_4g_gbps.toFixed(1)}
          </p>
        </div>

        {/* Step 5: Required Capacity @ 80% */}
        <div className="p-3.5 rounded-xl bg-[#0B0F19]/80 border border-red-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-red-400">Step 5</span>
            <Zap className="w-4 h-4 text-[#FF4D4D]" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">Required Cap @80%</div>
            <div className="text-lg font-black text-[#FF4D4D] font-mono mt-0.5">
              {step_5_required_capacity.required_capacity_gbps.toFixed(2)} Gbps
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Demand ÷ 0.80 SLA</p>
        </div>

        {/* Step 6: Capacity Evaluation */}
        <div
          className={`p-3.5 rounded-xl bg-[#0B0F19]/80 border space-y-2 ${
            step_6_capacity_evaluation.meets_sla ? 'border-emerald-500/40' : 'border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-emerald-400">Step 6</span>
            {step_6_capacity_evaluation.meets_sla ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div>
            <div className="font-bold text-white text-xs">Deployed vs Demand</div>
            <div
              className={`text-lg font-black font-mono mt-0.5 ${
                step_6_capacity_evaluation.meets_sla ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {step_6_capacity_evaluation.total_deployed_capacity_gbps.toFixed(2)} Gbps
            </div>
          </div>
          <p className="text-[10px] font-mono text-slate-400">
            {step_6_capacity_evaluation.status === 'SURPLUS' ? '+' : ''}
            {(-step_6_capacity_evaluation.capacity_gap_gbps).toFixed(2)} Gbps headroom
          </p>
        </div>

        {/* Step 7: Utilization Across Sites */}
        <div className="p-3.5 rounded-xl bg-[#0B0F19]/80 border border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400">Step 7</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">Network Utilization</div>
            <div
              className={`text-lg font-black font-mono mt-0.5 ${
                step_7_utilization_metrics.overall_utilization_pct <= 80
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              {step_7_utilization_metrics.overall_utilization_pct.toFixed(1)}%
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            {step_7_utilization_metrics.congested_sites_count} sites &gt;80% SLA
          </p>
        </div>

        {/* Step 8: Bottleneck Indicators */}
        <div className="p-3.5 rounded-xl bg-[#0B0F19]/80 border border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400">Step 8</span>
            <Server className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">Backhaul Status</div>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {step_8_bottlenecks.has_backhaul_bottlenecks ? (
                <span className="text-rose-400">{step_8_bottlenecks.bottleneck_count} Capped</span>
              ) : (
                <span className="text-emerald-400">100% 10G Fibre</span>
              )}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Non-blocking core transport</p>
        </div>

        {/* Step 9: Financial Impact */}
        <div className="p-3.5 rounded-xl bg-[#0B0F19]/80 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-emerald-400">Step 9</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">Capex Expenditure</div>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              ₹{step_9_financial_impact.total_cost_crores.toFixed(3)} Cr
            </div>
          </div>
          <p className="text-[10px] text-emerald-400 font-mono font-bold">
            Buffer: ₹{step_9_financial_impact.remaining_budget_lakhs.toFixed(2)}L
          </p>
        </div>

        {/* Step 10: Technical Feasibility */}
        <div
          className={`p-3.5 rounded-xl bg-[#0B0F19]/80 border space-y-2 ${
            step_10_feasibility.is_feasible
              ? 'border-emerald-500/50 bg-emerald-950/20'
              : 'border-rose-500/50 bg-rose-950/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-white">Step 10</span>
            {step_10_feasibility.is_feasible ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div>
            <div className="font-bold text-white text-xs">Technical Feasibility</div>
            <div
              className={`text-base font-black font-mono mt-0.5 ${
                step_10_feasibility.is_feasible ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {step_10_feasibility.status}
            </div>
          </div>
          <p className="text-[9px] text-slate-300 line-clamp-2 leading-tight">
            {step_10_feasibility.reason}
          </p>
        </div>
      </div>
    </div>
  )
}
