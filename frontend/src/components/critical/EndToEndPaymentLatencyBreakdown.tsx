import React from 'react'
import {
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Server,
  Building,
  Radio,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { PaymentHopLatency } from '../../types/criticalServices'

interface EndToEndPaymentLatencyBreakdownProps {
  hops: PaymentHopLatency[]
}

export const EndToEndPaymentLatencyBreakdown: React.FC<EndToEndPaymentLatencyBreakdownProps> = ({
  hops,
}) => {
  const totalBaseline = hops.reduce((acc, h) => acc + h.baseline_latency_ms, 0)
  const totalProposed = hops.reduce((acc, h) => acc + h.proposed_latency_ms, 0)

  return (
    <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E40000]/10 text-[#E40000] border border-red-500/20">
              End-to-End Latency Waterfall
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              5-Hop Path Tracing
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            End-to-End UPI Payment Handshake Latency Breakdown
          </h3>
          <p className="text-xs text-slate-400">
            Path latency from spectator handset to National NPCI Switch and Core Banking Servers
          </p>
        </div>

        {/* Total Latency Pill */}
        <div className="flex items-center gap-3 bg-[#0B0F19] p-2 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Baseline Roundtrip:</span>
            <span className="font-mono font-bold text-red-400 line-through">
              {totalBaseline.toFixed(0)} ms (4.65s)
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600" />
          <div>
            <span className="text-slate-400 block text-[10px]">Airtel Protected:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {totalProposed.toFixed(1)} ms
            </span>
          </div>
        </div>
      </div>

      {/* Hop-by-Hop Visual Waterfall */}
      <div className="space-y-3">
        {hops.map((h) => {
          const isRan = h.hop_number === 1
          const delaySaved = (h.baseline_latency_ms - h.proposed_latency_ms).toFixed(1)
          const percentSaved = ((1 - h.proposed_latency_ms / h.baseline_latency_ms) * 100).toFixed(0)

          return (
            <div
              key={h.hop_number}
              className={`p-4 rounded-xl border transition-all space-y-2 ${
                isRan
                  ? 'bg-red-950/20 border-red-500/40 shadow-sm'
                  : 'bg-[#0B0F19]/60 border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      isRan ? 'bg-[#E40000] text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {h.hop_number}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{h.hop_name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {h.entity_owner}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{h.technical_description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono shrink-0 pl-10 md:pl-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Baseline:</span>
                    <span className="text-slate-400 line-through">
                      {h.baseline_latency_ms >= 1000 ? `${(h.baseline_latency_ms / 1000).toFixed(1)}s` : `${h.baseline_latency_ms}ms`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Protected:</span>
                    <span className="font-bold text-emerald-400">{h.proposed_latency_ms}ms</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isRan
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    -{percentSaved}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Honest Architectural Clarification */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start space-x-3 text-xs text-slate-300">
        <Info className="w-5 h-5 shrink-0 text-blue-400 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white">Honest Telecom Engineering Boundary:</strong> In previous matches,
          the radio air-interface queuing delay (Hop 1) ballooned to 4,200ms due to bufferbloat with video traffic.
          When combined with TCP SYN retransmissions, this pushed total transaction time over the 15,000ms payment
          gateway abort threshold, causing 7% failures. Airtel Stadium360 compresses Hop 1 latency to 42.5ms,
          ensuring the entire transaction loop finishes in 285ms. The remaining 242ms is dominated by external
          NPCI and Core Banking processing, which cannot be reduced by any telecom operator.
        </div>
      </div>
    </div>
  )
}

