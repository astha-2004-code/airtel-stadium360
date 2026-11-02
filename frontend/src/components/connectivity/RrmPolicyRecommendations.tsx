import React from 'react'
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Shield,
  FileCheck,
  Info,
} from 'lucide-react'
import { RrmRecommendation } from '../../types/connectivity'

interface RrmPolicyRecommendationsProps {
  recommendations: RrmRecommendation[]
}

export const RrmPolicyRecommendations: React.FC<RrmPolicyRecommendationsProps> = ({
  recommendations,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E40000]/10 text-[#E40000] border border-red-500/20">
              3GPP Parameter Governance
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Operational Advisory
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Radio Resource Management (RRM) & Policy Optimization
          </h3>
          <p className="text-xs text-slate-400">
            Engineered cell parameters for Airtel RF engineers to apply via OSS scripts prior to Match Day
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#0B0F19] px-3 py-1.5 rounded-xl border border-slate-800">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>{recommendations.length} Actionable Parameters Validated</span>
        </div>
      </div>

      {/* Operational Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3 text-xs text-amber-300">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
        <div className="leading-relaxed">
          <strong>Engineering Advisory Boundary:</strong> Airtel Stadium360 provides real-time
          predictive modeling, dynamic RF simulation, and verified parameter recommendations. In compliance
          with enterprise security and change management protocols, live network parameter pushes must be
          executed by authorized network operations engineers via Airtel OSS/EMS change control windows.
        </div>
      </div>

      {/* RRM Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <th className="py-3 px-4">Parameter & Standard ID</th>
              <th className="py-3 px-3">Domain</th>
              <th className="py-3 px-4">Historical Baseline</th>
              <th className="py-3 px-4">Airtel Recommended Setting</th>
              <th className="py-3 px-3 text-center">Impact</th>
              <th className="py-3 px-3 text-center">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {recommendations.map((r) => {
              const isCritical = r.impact_severity === 'CRITICAL'
              const isHigh = r.impact_severity === 'HIGH'

              return (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white text-xs">{r.parameter_name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 max-w-sm leading-relaxed">
                      {r.technical_rationale}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {r.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-400 font-mono text-[11px]">{r.default_baseline}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-950/20 px-2 py-1 rounded border border-emerald-500/20 inline-block">
                      {r.recommended_setting}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block ${
                        isCritical
                          ? 'bg-red-500/10 text-[#E40000] border-red-500/20'
                          : isHigh
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}
                    >
                      {r.impact_severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">
                    {r.confidence_score}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

