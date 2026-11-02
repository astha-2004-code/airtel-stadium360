import React from 'react'
import { Activity, ShieldCheck, AlertTriangle, Radio, Network, CreditCard } from 'lucide-react'

interface NetworkHealthGaugeProps {
  score: number
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL'
  utilization: number
  upiFailure: number
  congestedCount: number
}

export const NetworkHealthGauge: React.FC<NetworkHealthGaugeProps> = ({
  score,
  status,
  utilization,
  upiFailure,
  congestedCount,
}) => {
  const isCritical = status === 'CRITICAL'
  const isWarning = status === 'WARNING'

  return (
    <div className="card-gradient rounded-2xl p-5 border border-[#223050] space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div
            className={`p-2 rounded-lg border ${
              isCritical
                ? 'bg-red-950/40 border-red-800/40 text-[#FF4D4D]'
                : isWarning
                ? 'bg-amber-950/40 border-amber-800/40 text-amber-400'
                : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400'
            }`}
          >
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Network Health &amp; SLA Index
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated KPI Score • Real-time QoS Telemetry
            </p>
          </div>
        </div>

        <span
          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
            isCritical
              ? 'bg-[#E40000]/20 text-[#FF4D4D] border-[#E40000]/40'
              : isWarning
              ? 'bg-amber-950 text-amber-300 border-amber-800'
              : 'bg-emerald-950 text-emerald-300 border-emerald-800'
          }`}
        >
          {status}
        </span>
      </div>

      {/* Main Score Display */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-3xl font-black tracking-tight text-white flex items-baseline space-x-1.5">
            <span>{score}</span>
            <span className="text-xs font-semibold text-slate-500">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isCritical
              ? 'Severe degradation: 7 saturated macro/small cells'
              : isWarning
              ? 'Elevated congestion: performance impacted'
              : 'Network parameters within 80% safe operational limit'}
          </p>
        </div>

        <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
          <div
            className={`absolute inset-0 rounded-full border-4 ${
              isCritical ? 'border-red-500' : isWarning ? 'border-amber-400' : 'border-emerald-500'
            }`}
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% ${score}%, 0 ${score}%)`,
            }}
          />
          <span className="text-xs font-bold font-mono text-white">{score}%</span>
        </div>
      </div>

      {/* Subsystem Health Breakdown */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[10px]">
            <Radio className="w-3.5 h-3.5 text-red-400" />
            <span>4G Anchor RF</span>
          </div>
          <div className="font-mono font-bold text-red-400">{utilization}% Load</div>
          <div className="text-[10px] text-slate-500">{congestedCount}/8 sites &gt;80%</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[10px]">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>UPI Concession SLA</span>
          </div>
          <div className="font-mono font-bold text-amber-400">{upiFailure}% Fail</div>
          <div className="text-[10px] text-slate-500">Threshold 2.0% (Breach)</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[10px]">
            <Network className="w-3.5 h-3.5 text-blue-400" />
            <span>Backhaul Integrity</span>
          </div>
          <div className="font-mono font-bold text-amber-400">4 Bottlenecks</div>
          <div className="text-[10px] text-slate-500">M4, M6 (2G) · S1, S2 (1G)</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Optimization Status</span>
          </div>
          <div className="font-mono font-bold text-slate-300">Unmitigated</div>
          <div className="text-[10px] text-slate-500">Pending Module 4 Plan</div>
        </div>
      </div>
    </div>
  )
}
