import React, { useState } from 'react'
import {
  AlertOctagon,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Zap,
  Radio,
  FileCode,
} from 'lucide-react'
import { FallbackRootCause } from '../../types/connectivity'

interface FallbackDiagnosticMatrixProps {
  causes: FallbackRootCause[]
}

export const FallbackDiagnosticMatrix: React.FC<FallbackDiagnosticMatrixProps> = ({
  causes,
}) => {
  const [activeCauseId, setActiveCauseId] = useState<string>(causes[0]?.id || 'RC-01')

  const activeCause = causes.find((c) => c.id === activeCauseId) || causes[0]

  return (
    <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Diagnostic Root-Cause Analysis
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              100% Mitigated
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Why 5G Compatible Handsets Remain Camped on Saturated 4G
          </h3>
          <p className="text-xs text-slate-400">
            Telecom root causes for 5G fallback during peak stadium congestion and deployed engineering remedies
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-[#0B0F19] px-3 py-1.5 rounded-xl border border-slate-800">
          Historical 5G Fallback Rate: <span className="text-red-400 font-bold">61.5%</span> → Proposed:{' '}
          <span className="text-emerald-400 font-bold">13.8%</span>
        </div>
      </div>

      {/* Cause Selection Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {causes.map((c) => {
          const isActive = c.id === activeCauseId
          return (
            <button
              key={c.id}
              onClick={() => setActiveCauseId(c.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-red-950/30 border-[#E40000] shadow-md shadow-red-500/10'
                  : 'bg-[#0B0F19]/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-slate-400">{c.id}</span>
                <span className="text-xs font-mono font-black text-[#E40000]">
                  {c.prevalence_pct}%
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate">{c.name}</div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{c.mitigation_status}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Deep-Dive Active Cause Inspector */}
      {activeCause && (
        <div className="p-5 rounded-2xl bg-[#0B0F19]/80 border border-[#223050] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-red-500/10 text-[#E40000] font-bold">
                {activeCause.id}
              </span>
              <h4 className="text-base font-bold text-white">{activeCause.name}</h4>
            </div>
            <div className="text-xs text-slate-400">
              Contribution to 4G Fallback:{' '}
              <span className="text-[#E40000] font-mono font-bold text-sm">
                {activeCause.prevalence_pct}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Symptom */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                <AlertOctagon className="w-4 h-4" />
                <span>Observed Match Symptom</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeCause.baseline_symptom}
              </p>
            </div>

            {/* 3GPP Telecom Root Cause */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-400">
                <FileCode className="w-4 h-4" />
                <span>3GPP Technical Root Cause</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeCause.telecom_root_cause}
              </p>
            </div>

            {/* Stadium360 Engineering Mitigation */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#E40000]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Stadium360 Deployed Mitigation</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeCause.engineering_mitigation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

