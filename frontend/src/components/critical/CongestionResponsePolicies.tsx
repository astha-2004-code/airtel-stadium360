import React from 'react'
import {
  ShieldAlert,
  Zap,
  CheckCircle2,
  Sliders,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { CongestionResponsePolicy } from '../../types/criticalServices'

interface CongestionResponsePoliciesProps {
  policies: CongestionResponsePolicy[]
}

export const CongestionResponsePolicies: React.FC<CongestionResponsePoliciesProps> = ({
  policies,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E40000]/10 text-[#E40000] border border-red-500/20">
              Automated Radio Policies
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Dynamic Mitigation
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Automated Stadium Congestion Response & Pre-emption Policies
          </h3>
          <p className="text-xs text-slate-400">
            Real-time MAC scheduler rules that trigger during boundary moments (wickets, boundary celebrations, innings break)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#0B0F19] px-3 py-1.5 rounded-xl border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>4 Active Defense Mechanisms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((p) => {
          const isActive = p.execution_state === 'ACTIVE'
          return (
            <div
              key={p.policy_id}
              className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                isActive
                  ? 'bg-red-950/20 border-red-500/40 shadow-md shadow-red-500/5'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-800 text-[#E40000] font-bold">
                    {p.policy_id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {p.execution_state}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{p.policy_name}</h4>
                  <div className="text-[11px] text-amber-400 font-mono mt-0.5">
                    Trigger: {p.trigger_condition}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {p.action_description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Target Bearers:</span>
                  <div className="flex flex-wrap gap-1">
                    {p.affected_bearers.map((b, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-slate-400">
                  <strong className="text-slate-300">User Impact:</strong> {p.impact_on_user_experience}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

