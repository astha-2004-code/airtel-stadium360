import React from 'react'
import {
  ShieldCheck,
  Info,
  HelpCircle,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight
} from 'lucide-react'
import { NetworkHealthScore } from '../../types/evaluation'

interface NetworkHealthScorecardProps {
  healthScore: NetworkHealthScore
}

export const NetworkHealthScorecard: React.FC<NetworkHealthScorecardProps> = ({ healthScore }) => {
  const getRatingColor = (rating: string) => {
    switch (rating.toUpperCase()) {
      case 'EXCELLENT':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      case 'GOOD':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
      case 'FAIR':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'
    if (score >= 70) return '#06B6D4'
    if (score >= 50) return '#F59E0B'
    return '#EF4444'
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with Composite Gauge and Disclaimer */}
      <div className="card-gradient rounded-2xl border border-[#223050] p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Gauge / Score circle */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#0B0F19]/60 rounded-xl border border-[#223050]/60 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-red-400" />
              <span>Composite Network Health</span>
            </span>

            <div className="relative flex items-center justify-center my-3">
              {/* SVG circular progress */}
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#1E293B"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke={getScoreColor(healthScore.composite_score)}
                  strokeWidth="12"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * healthScore.composite_score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white tracking-tight">
                  {healthScore.composite_score.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">out of 100</span>
              </div>
            </div>

            <div className="mt-2 flex items-center space-x-2">
              <span className={`text-xs px-3 py-1 rounded-full font-bold border uppercase tracking-wider ${getRatingColor(healthScore.rating)}`}>
                {healthScore.rating} Quality Grade
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 text-center max-w-[280px]">
              Multi-dimensional weighted aggregate across utilization, throughput compliance, 5G accessibility, UPI SLAs, and backhaul headrooms.
            </p>
          </div>

          {/* Transparent Formula & Attribution */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Airtel Stadium360 Internal Evaluation Methodology</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/60 text-red-300 border border-red-800/60">
                    ByteForge Proprietary Index
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Designed specifically for ultra-dense sporting venues under high-concurrency match conditions.
                </p>
              </div>
            </div>

            {/* Disclaimer Alert */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <strong className="text-amber-300">Mandatory Governance Notice:</strong> This composite health score is an{' '}
                <span className="underline decoration-amber-400 underline-offset-2 font-semibold">Airtel Stadium360 internal evaluation score</span>{' '}
                derived from calibrated mathematical simulation cascades and baseline dataset metrics. It is not an ITU-T or 3GPP standardized telecom metric.
              </div>
            </div>

            {/* Formula formula box */}
            <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#223050] font-mono text-xs text-slate-300 space-y-1.5">
              <div className="text-[11px] text-slate-400 font-sans font-semibold uppercase tracking-wider flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Weighted Scoring Formula</span>
              </div>
              <div className="p-2 bg-[#0B0F19] rounded-lg border border-slate-800 text-cyan-300 text-[11px] overflow-x-auto">
                Score = (Utilization × 25%) + (Throughput × 25%) + (5G Access × 20%) + (UPI Reliability × 15%) + (Backhaul × 15%)
              </div>
            </div>

            {/* Weight Breakdown Summary Chips */}
            <div className="grid grid-cols-5 gap-2 pt-1 text-center">
              {Object.entries(healthScore?.component_breakdown || {}).map(([k, comp]) => (
                <div key={k} className="p-2 rounded-lg bg-[#0B0F19]/60 border border-[#223050]/60">
                  <span className="text-[10px] text-slate-400 uppercase block truncate">{k.replace('_', ' ')}</span>
                  <span className="text-xs font-bold text-white font-mono">{Math.round(comp.weight_pct)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5 Component Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(healthScore?.component_breakdown || {}).map(([key, comp]) => {
          const weightPct = Math.round(comp.weight_pct)
          const rawScore = comp.score
          const scoreColor = getScoreColor(rawScore)
          const weightedScore = comp.weighted_contribution

          return (
            <div
              key={key}
              className="card-gradient rounded-xl border border-[#223050] p-4 flex flex-col justify-between hover:border-slate-600 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Weight: {weightPct}%
                  </span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}
                  >
                    +{weightedScore.toFixed(1)} pts
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mt-1 capitalize">
                  {key.replace('_', ' ')}
                </h4>

                <div className="flex items-baseline space-x-1.5 my-2">
                  <span className="text-2xl font-black text-white font-mono">
                    {rawScore.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">/ 100</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(100, Math.max(0, rawScore))}%`,
                      backgroundColor: scoreColor
                    }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                  {comp.metric_basis}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#223050]/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>Contribution</span>
                <span className="font-mono font-semibold text-slate-300">
                  {weightedScore.toFixed(1)} / {weightPct}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Scoring Interpretation Matrix */}
      <div className="card-gradient rounded-xl border border-[#223050] p-5">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Health Score Interpretation Thresholds</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="font-bold text-emerald-400 mb-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>80.0 – 100.0 : EXCELLENT</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Optimal spectral efficiency, zero congested sectors, 5G connection success &gt;85%, UPI latency &lt;1.2s.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <div className="font-bold text-cyan-400 mb-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>70.0 – 79.9 : GOOD</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Stable carrier performance with manageable load &lt;75%, minor throughput variance during peak overs.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="font-bold text-amber-400 mb-1 flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>50.0 – 69.9 : FAIR</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Approaching capacity limits. 1-2 sectors &gt;80% PRB load, elevated retransmissions, possible UPI retry bursts.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
            <div className="font-bold text-rose-400 mb-1 flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>&lt; 50.0 : CRITICAL</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Severe congestion (Baseline 65k state = 35.2). 7+ sites congested at ~99% PRB load, 7.11% UPI failure, 5G drops.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

