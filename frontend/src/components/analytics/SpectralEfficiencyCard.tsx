import React from 'react'
import { Radio, AlertTriangle, Layers, Activity, Info, CheckCircle2 } from 'lucide-react'
import { SpectralEfficiencyResponse } from '../../types/analytics'

interface SpectralEfficiencyCardProps {
  spectralData: SpectralEfficiencyResponse | null
}

export const SpectralEfficiencyCard: React.FC<SpectralEfficiencyCardProps> = ({ spectralData }) => {
  if (!spectralData) {
    return (
      <div className="card-gradient rounded-2xl border border-[#223050] p-6 text-center text-slate-400">
        Loading spectral efficiency parameters...
      </div>
    )
  }

  const { comparison, engineering_methodology } = spectralData

  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Telecom Engineering Rigor
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-mono">
              Practical vs Peak
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Spectral Efficiency & Usable Throughput Modeling</h3>
        </div>
        <div className="text-xs text-slate-400 max-w-sm text-right">
          Standard: <span className="text-white font-mono">{engineering_methodology.standard}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {comparison.map((item, idx) => {
          const is5G = item.tech.includes('5G')
          return (
            <div
              key={idx}
              className={`rounded-xl border p-5 space-y-4 ${
                is5G
                  ? 'bg-gradient-to-b from-blue-950/20 to-slate-900/60 border-blue-500/30'
                  : 'bg-gradient-to-b from-amber-950/20 to-slate-900/60 border-amber-500/30'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Radio className={`w-4 h-4 ${is5G ? 'text-blue-400' : 'text-amber-400'}`} />
                    <h4 className="text-base font-bold text-white">{item.tech}</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {item.frequency} • {item.bandwidth_mhz} MHz
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    is5G ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {item.mimo_config.split(' ')[0]} MIMO
                </span>
              </div>

              {/* Spectral Efficiency Comparison Meter */}
              <div className="bg-[#0B0F19]/90 rounded-xl p-4 border border-[#223050] space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-slate-400">Theoretical Peak (Lab)</span>
                    <div className="text-xl font-black text-slate-300 font-mono">
                      {item.theoretical_bps_hz} <span className="text-xs text-slate-500">bps/Hz</span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Max: {item.theoretical_macro_gbps} Gbps / site
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-red-400 font-semibold">Practical Stadium (3GPP)</span>
                    <div className="text-xl font-black text-[#FF4D4D] font-mono">
                      {item.practical_bps_hz} <span className="text-xs text-slate-500">bps/Hz</span>
                    </div>
                    <div className="text-xs text-emerald-400 font-mono mt-0.5 font-bold">
                      Usable: {item.practical_macro_gbps} Gbps / site
                    </div>
                  </div>
                </div>

                {/* Progress bar showing loss */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Stadium Environmental Attenuation</span>
                    <span className="text-rose-400 font-bold font-mono">-{item.efficiency_loss_pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${is5G ? 'bg-blue-500' : 'bg-amber-500'}`}
                      style={{ width: `${100 - item.efficiency_loss_pct}%` }}
                    />
                    <div className="h-full bg-rose-900/60" style={{ width: `${item.efficiency_loss_pct}%` }} />
                  </div>
                </div>
              </div>

              {/* Why Practical is Lower */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Documented Physical Degradation Factors:</span>
                </span>
                <ul className="space-y-1.5">
                  {item.primary_loss_factors.map((factor, fIdx) => (
                    <li key={fIdx} className="text-xs text-slate-400 flex items-start space-x-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Judicial Engineering Verification Note: </span>
          Theoretical peak spectral efficiency assumes line-of-sight propagation, single isolated users, and zero interference.
          In a 100,000-spectator concrete bowl, human RF water content absorbs 8 dB of signal, uplink noise rises by 22 dB,
          and inter-cell interference (ICIC) reduces usable throughput to <span className="text-white font-mono font-bold">3.2 bps/Hz (5G)</span> and <span className="text-white font-mono font-bold">1.5 bps/Hz (4G)</span>.
          Deploying models based on theoretical peak will cause catastrophic network collapse during match hours.
        </div>
      </div>
    </div>
  )
}

