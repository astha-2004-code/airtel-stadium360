import React from 'react'
import { Calendar, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react'
import { TimelineMilestone } from '../../types/budget'

interface DeploymentTimelineViewProps {
  timeline: TimelineMilestone[]
}

export const DeploymentTimelineView: React.FC<DeploymentTimelineViewProps> = ({ timeline }) => {
  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Execution Roadmap
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
              4-Week Pre-Match Schedule
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Pre-Match Infrastructure Deployment Timeline</h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Rollout Phase: <span className="text-emerald-400 font-bold">Week -1 Active Staging</span>
        </div>
      </div>

      <div className="space-y-4">
        {timeline.map((item, idx) => {
          const isDone = item.status === 'COMPLETED'
          const isInProgress = item.status === 'IN_PROGRESS'

          return (
            <div
              key={item.milestone_id}
              className={`p-5 rounded-xl border bg-[#0B0F19]/80 space-y-3 transition-all ${
                isInProgress
                  ? 'border-amber-500/50 bg-amber-950/10'
                  : isDone
                  ? 'border-[#223050]'
                  : 'border-slate-800 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs font-mono ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isInProgress
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.phase}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">{item.dates}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {item.budget_impact_lakhs > 0 && (
                    <span className="text-xs font-mono font-bold text-white">
                      ₹{item.budget_impact_lakhs.toFixed(1)} Lakhs
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                      isDone
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : isInProgress
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.status} ({item.progress_pct}%)
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isDone ? 'bg-emerald-500' : isInProgress ? 'bg-amber-500' : 'bg-slate-600'
                  }`}
                  style={{ width: `${item.progress_pct}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

              {/* Deliverables Checklist */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Key Deliverables:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {item.deliverables.map((deliv, dIdx) => (
                    <div key={dIdx} className="text-xs text-slate-400 flex items-start space-x-2">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          isDone ? 'text-emerald-400' : isInProgress ? 'text-amber-400' : 'text-slate-600'
                        }`}
                      />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

