import React from 'react'
import {
  Users,
  Clock,
  RefreshCw,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react'

interface HeaderProps {
  capacity: number
  onCapacityChange: (cap: number) => void
  matchPhase: string
  onPhaseChange: (phase: string) => void
  healthScore: number
  healthStatus: 'OPTIMAL' | 'WARNING' | 'CRITICAL'
  onRefresh: () => void
  isRefreshing: boolean
}

export const Header: React.FC<HeaderProps> = ({
  capacity,
  onCapacityChange,
  matchPhase,
  onPhaseChange,
  healthScore,
  healthStatus,
  onRefresh,
  isRefreshing,
}) => {
  const matchPhases = [
    { id: 'Crowd building up', label: '17:00 • Crowd building up' },
    { id: 'Innings break', label: '21:00 • Innings break (Peak Congestion)' },
    { id: 'Final over', label: '22:45 • Final over' },
    { id: 'Post-match', label: '23:15 • Post-match egress' },
  ]

  const capacities = [
    { value: 65000, label: '65,000 (Last Match Benchmark)' },
    { value: 100000, label: '1,00,000 (World Cup Final)' },
    { value: 120000, label: '1,20,000 (Overcapacity Surge)' },
  ]

  return (
    <header className="border-b border-[#223050] bg-[#131B2E]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Title & Context */}
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-red-900/30 border border-red-700/40 text-[#FF4D4D]">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Executive Network Command Centre</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#E40000]/20 text-[#FF4D4D] font-mono border border-[#E40000]/30 font-semibold">
              Live
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-Time Network Telemetry • 8 Stadium Sites • ₹4 Cr Budget Tracker
          </p>
        </div>
      </div>

      {/* Control Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Match Moment Filter */}
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300 shadow-sm">
          <Clock className="w-4 h-4 text-[#FF4D4D]" />
          <span className="text-slate-400 font-medium">Phase:</span>
          <select
            value={matchPhase}
            onChange={(e) => onPhaseChange(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            {matchPhases.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Attendance Filter */}
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300 shadow-sm">
          <Users className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400 font-medium">Crowd:</span>
          <select
            value={capacity}
            onChange={(e) => onCapacityChange(Number(e.target.value))}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            {capacities.map((c) => (
              <option key={c.value} value={c.value} className="bg-slate-900 text-white">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Network Health Badge */}
        <div
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
            healthStatus === 'CRITICAL'
              ? 'bg-red-950/40 border-red-700/50 text-red-300'
              : healthStatus === 'WARNING'
              ? 'bg-amber-950/40 border-amber-700/50 text-amber-300'
              : 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
          }`}
        >
          {healthStatus === 'CRITICAL' ? (
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          ) : healthStatus === 'WARNING' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>Health: {healthScore}/100 ({healthStatus})</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all disabled:opacity-50"
          title="Refresh Telemetry"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#FF4D4D]' : ''}`} />
        </button>
      </div>
    </header>
  )
}
