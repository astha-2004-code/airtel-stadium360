import React from 'react'
import { AlertItem } from '../../types/dashboard'
import { AlertTriangle, AlertCircle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react'

interface CongestionAlertsProps {
  alerts: AlertItem[]
}

export const CongestionAlerts: React.FC<CongestionAlertsProps> = ({ alerts }) => {
  return (
    <div className="card-gradient rounded-2xl p-5 border border-[#223050] space-y-3.5 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-red-950/40 border border-red-800/40 text-[#FF4D4D]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Active Congestion &amp; Bottleneck Alerts
            </h3>
            <p className="text-xs text-slate-400">
              Triggered by real workbook telemetry threshold breaches
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-red-950 border border-red-800 text-red-300 font-bold">
          {alerts.length} Active
        </span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {alerts.map((alert) => {
          const isCrit = alert.severity === 'critical'
          const isWarn = alert.severity === 'warning'

          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border transition-all text-xs space-y-1.5 ${
                isCrit
                  ? 'bg-red-950/20 border-red-800/40 hover:border-red-700/60'
                  : isWarn
                  ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-700/60'
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {isCrit ? (
                    <AlertTriangle className="w-4 h-4 text-[#FF4D4D] shrink-0" />
                  ) : isWarn ? (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                  <span className="font-bold text-white tracking-tight">{alert.title}</span>
                </div>

                <span
                  className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded tracking-wider shrink-0 ${
                    isCrit
                      ? 'bg-[#E40000]/20 text-[#FF4D4D] border border-[#E40000]/40'
                      : isWarn
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}
                >
                  {alert.severity}
                </span>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed">{alert.description}</p>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-mono">
                <span>Affected: <span className="text-slate-400 font-semibold">{alert.site || 'Global'}</span></span>
                <span>{alert.timestamp}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
