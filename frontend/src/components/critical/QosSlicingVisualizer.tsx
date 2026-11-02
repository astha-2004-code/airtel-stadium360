import React, { useState } from 'react'
import {
  Layers,
  Shield,
  CreditCard,
  PhoneCall,
  Wifi,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { QosSliceDefinition } from '../../types/criticalServices'

interface QosSlicingVisualizerProps {
  slices: QosSliceDefinition[]
}

export const QosSlicingVisualizer: React.FC<QosSlicingVisualizerProps> = ({ slices }) => {
  const [selectedSliceId, setSelectedSliceId] = useState<string>('SLICE-UPI-FINANCIAL')

  const activeSlice = slices.find((s) => s.slice_id === selectedSliceId) || slices[0]

  return (
    <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E40000]/10 text-[#E40000] border border-red-500/20">
              3GPP Rel-16 Network Slicing
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Strict Priority Scheduling (SPQ)
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            3-Tier QoS Slicing & Radio Resource Allocation
          </h3>
          <p className="text-xs text-slate-400">
            Dedicated Physical Resource Block (PRB) reservations and priority queuing for critical packets
          </p>
        </div>

        {/* Slice Selection Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0B0F19] p-1.5 rounded-xl border border-slate-800">
          {slices.map((s) => {
            const isSelected = s.slice_id === selectedSliceId
            return (
              <button
                key={s.slice_id}
                onClick={() => setSelectedSliceId(s.slice_id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#E40000] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.five_qi === 1 ? 'Emergency (5QI-1)' : s.five_qi === 5 ? 'UPI Payment (5QI-5)' : 'General (5QI-9)'}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3 Slices Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {slices.map((s) => {
          const isSelected = s.slice_id === selectedSliceId
          const isUpi = s.five_qi === 5
          const isEmergency = s.five_qi === 1

          return (
            <div
              key={s.slice_id}
              onClick={() => setSelectedSliceId(s.slice_id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-4 flex flex-col justify-between ${
                isSelected
                  ? 'bg-red-950/20 border-[#E40000] shadow-lg shadow-red-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2 rounded-xl border ${
                      isEmergency
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : isUpi
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {isEmergency ? (
                      <PhoneCall className="w-5 h-5" />
                    ) : isUpi ? (
                      <CreditCard className="w-5 h-5" />
                    ) : (
                      <Wifi className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-white font-bold">
                    5QI: {s.five_qi} • QCI: {s.qci_lte}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{s.service_name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{s.traffic_type}</p>
                </div>
              </div>

              {/* Resource attributes */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Scheduler Priority</span>
                  <span className="font-mono font-bold text-white">
                    Level {s.priority_level} {s.priority_level === 1 ? '(Highest)' : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Delay Budget</span>
                  <span className="font-mono font-bold text-emerald-400">
                    &lt; {s.packet_delay_budget_ms} ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">PRB Reservation</span>
                  <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                    {s.prb_reservation_pct}% Dedicated
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Slice Detail Inspector */}
      {activeSlice && (
        <div className="p-5 rounded-2xl bg-[#0B0F19]/80 border border-[#223050] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#E40000] text-white">
                {activeSlice.slice_id}
              </span>
              <h4 className="text-base font-bold text-white">{activeSlice.service_name}</h4>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Bearer Type:</span>
              <strong className="text-emerald-400">{activeSlice.resource_type}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#131B2E] border border-slate-800">
              <div className="text-[10px] text-slate-400">IP Backhaul DSCP Tag</div>
              <div className="text-xs font-mono font-bold text-white mt-1">
                {activeSlice.dscp_marking}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#131B2E] border border-slate-800">
              <div className="text-[10px] text-slate-400">Target Packet Error Rate</div>
              <div className="text-xs font-mono font-bold text-white mt-1">
                {activeSlice.packet_error_rate}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#131B2E] border border-slate-800">
              <div className="text-[10px] text-slate-400">Pre-emption Setting</div>
              <div className="text-xs font-bold text-slate-300 mt-1">
                {activeSlice.preemption_capability}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#131B2E] border border-slate-800">
              <div className="text-[10px] text-slate-400">Enforcement Engine</div>
              <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strict Priority (SPQ)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

