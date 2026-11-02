import React from 'react'
import { ActivityEvent } from '../../types/dashboard'
import { Radio, AlertOctagon, Zap, ArrowRight, Shield } from 'lucide-react'

interface RecentActivityFeedProps {
  events: ActivityEvent[]
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ events }) => {
  return (
    <div className="card-gradient rounded-2xl p-5 border border-[#223050] space-y-3.5 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Live Network Telemetry Log
            </h3>
            <p className="text-xs text-slate-400">
              Real-time sector events, alarms, and QoS measurements
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-mono text-[10px] text-emerald-400">Streaming</span>
        </div>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {events.map((evt) => {
          const isCrit = evt.status === 'CRITICAL'
          const isAlert = evt.status === 'ALERT'
          const isWarn = evt.status === 'WARNING'

          return (
            <div
              key={evt.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start space-x-2.5 min-w-0">
                <div
                  className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    isCrit
                      ? 'bg-red-950 text-[#FF4D4D]'
                      : isAlert
                      ? 'bg-amber-950 text-amber-400'
                      : isWarn
                      ? 'bg-yellow-950 text-yellow-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCrit ? (
                    <AlertOctagon className="w-3.5 h-3.5" />
                  ) : isAlert ? (
                    <Zap className="w-3.5 h-3.5" />
                  ) : (
                    <Shield className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-slate-200 text-[11px] font-medium leading-snug">
                    {evt.message}
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1 font-mono">
                    <span>Sector: <span className="text-slate-400 font-semibold">{evt.site}</span></span>
                    <span>•</span>
                    <span>{evt.type}</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-500 shrink-0 mt-0.5">
                {evt.time}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
