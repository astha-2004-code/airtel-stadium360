import React, { useState } from 'react'
import {
  Network,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Radio,
  Sliders,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { EndcArchitecture } from '../../types/connectivity'

interface EndcArchitectureVisualizerProps {
  architecture: EndcArchitecture | null
}

export const EndcArchitectureVisualizer: React.FC<EndcArchitectureVisualizerProps> = ({
  architecture,
}) => {
  const [selectedNode, setSelectedNode] = useState<'MN' | 'SN' | 'SHIELD'>('SHIELD')

  if (!architecture) {
    return (
      <div className="h-96 rounded-2xl bg-[#131B2E] border border-[#223050] flex items-center justify-center text-slate-400">
        Loading EN-DC Architecture...
      </div>
    )
  }

  return (
    <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-[#E40000] border border-red-500/20">
              3GPP Rel-15 Option 3x
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Anchor Shield Active
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            5G NSA Dual Connectivity (EN-DC) Architecture
          </h3>
          <p className="text-xs text-slate-400">
            E-UTRA-NR Dual Connectivity with SN-Terminated Split Bearer & Dedicated Anchor PRB Reservation
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 bg-[#0B0F19] p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedNode('SHIELD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedNode === 'SHIELD'
                ? 'bg-[#E40000] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Anchor Shield Core
          </button>
          <button
            onClick={() => setSelectedNode('MN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedNode === 'MN'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Master Node (LTE eNB)
          </button>
          <button
            onClick={() => setSelectedNode('SN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedNode === 'SN'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Secondary Node (5G gNB)
          </button>
        </div>
      </div>

      {/* Visual Architectural Data Flow Diagram */}
      <div className="p-6 rounded-2xl bg-[#0B0F19]/80 border border-[#223050] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Core Network Layer */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Core Network
              </span>
              <Cpu className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-[#131B2E] border border-blue-500/30">
                <div className="text-xs font-bold text-white">4G EPC / MME</div>
                <div className="text-[10px] text-slate-400">NAS & S1-MME Signalling</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#131B2E] border border-red-500/30">
                <div className="text-xs font-bold text-[#E40000]">5G Core UPF</div>
                <div className="text-[10px] text-slate-400">High-capacity user plane gateway</div>
              </div>
            </div>
          </div>

          {/* Inter-Node Coordination Layer */}
          <div className="flex flex-col items-center justify-center space-y-3 px-2">
            <div className="w-full text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Fibre X2-C Inter-Node Interface
              </div>
              <div className="flex items-center justify-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/20 py-1.5 px-3 rounded-full border border-emerald-500/30">
                <Network className="w-3.5 h-3.5" />
                <span>Latency: {architecture.inter_node_latency_ms} ms (Dark Fibre)</span>
              </div>
            </div>
            <div className="w-full flex items-center justify-center space-x-2 text-slate-500">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-500/50 via-emerald-500/50 to-purple-500/50" />
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <div className="h-0.5 flex-1 bg-gradient-to-r from-emerald-500/50 to-purple-500/50" />
            </div>
            <div className="text-[11px] text-slate-400 text-center font-medium">
              SgNB Addition Request/Acknowledge & Flow Control
            </div>
          </div>

          {/* Radio Access Network Layer */}
          <div className="space-y-3">
            {/* Master Node Box */}
            <div
              onClick={() => setSelectedNode('MN')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedNode === 'MN'
                  ? 'bg-blue-950/30 border-blue-500 shadow-md shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white">Master Node (LTE eNB)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">
                  70 MHz
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                B1 (2.1GHz) + B3 (1.8GHz) + B40 (2.3GHz)
              </p>
            </div>

            {/* Secondary Node Box */}
            <div
              onClick={() => setSelectedNode('SN')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedNode === 'SN'
                  ? 'bg-purple-950/30 border-purple-500 shadow-md shadow-purple-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">Secondary Node (5G gNB)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">
                  100 MHz n78
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                64T64R Massive MIMO Active Antenna Unit
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Node Detail Inspector */}
      {selectedNode === 'SHIELD' && (
        <div className="p-4 rounded-xl bg-red-950/10 border border-red-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-bold text-[#E40000]">
              <ShieldCheck className="w-4 h-4" />
              <span>Airtel Anchor Shield PRB Protection Engine</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/30 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              PRB Reservation: {architecture.anchor_shield_prb_reservation_pct}%
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In standard 5G NSA networks, the LTE anchor carrier serves both normal 4G user data
            and 5G dual connectivity control signaling. During stadium peak congestion, 4G PRBs reach
            99% utilization, starving RRC signaling and causing 5G phones to fall back to 4G.{' '}
            <strong className="text-white">Airtel Anchor Shield</strong> partitions 15% of Physical
            Resource Blocks on Band 1 (2100 MHz) exclusively for SgNB Addition and RRC Reconfiguration,
            ensuring 98.4% 5G connection success regardless of crowd density.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800">
              <div className="text-[10px] text-slate-400">B1 Addition Threshold</div>
              <div className="text-sm font-mono font-bold text-white">
                {architecture.sgnb_addition_threshold_dbm} dBm
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800">
              <div className="text-[10px] text-slate-400">Time to Trigger (TTT)</div>
              <div className="text-sm font-mono font-bold text-white">
                {architecture.time_to_trigger_ms} ms
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800">
              <div className="text-[10px] text-slate-400">Handover Hysteresis</div>
              <div className="text-sm font-mono font-bold text-white">
                {architecture.hysteresis_db} dB
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800">
              <div className="text-[10px] text-slate-400">Bearer Split Mode</div>
              <div className="text-xs font-bold text-emerald-400">SN-Terminated</div>
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'MN' && (
        <div className="p-4 rounded-xl bg-blue-950/10 border border-blue-500/20 space-y-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-blue-400">
            <Radio className="w-4 h-4" />
            <span>Master Node: {architecture.master_node.node_type}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800">
              <div className="text-[10px] text-slate-400">Spectrum Bandwidth</div>
              <div className="text-sm font-bold text-white">
                {architecture.master_node.spectrum_mhz} MHz Total (70 MHz)
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800">
              <div className="text-[10px] text-slate-400">Duplex Configuration</div>
              <div className="text-sm font-bold text-white">
                {architecture.master_node.duplex_mode}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800">
              <div className="text-[10px] text-slate-400">Antenna Array</div>
              <div className="text-sm font-bold text-white">
                {architecture.master_node.antenna_config}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedNode === 'SN' && (
        <div className="p-4 rounded-xl bg-purple-950/10 border border-purple-500/20 space-y-3">
          <div className="flex items-center space-x-2 text-sm font-bold text-purple-400">
            <Layers className="w-4 h-4" />
            <span>Secondary Node: {architecture.secondary_node.node_type}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800">
              <div className="text-[10px] text-slate-400">Dedicated 5G Bandwidth</div>
              <div className="text-sm font-bold text-white">
                {architecture.secondary_node.spectrum_mhz} MHz Contiguous (Band n78)
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800">
              <div className="text-[10px] text-slate-400">TDD Slot Pattern</div>
              <div className="text-sm font-bold text-white">
                2.5ms Slot Pattern (4:1 DL:UL ratio)
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0B0F19] border border-slate-800">
              <div className="text-[10px] text-slate-400">Antenna Array</div>
              <div className="text-sm font-bold text-white">
                {architecture.secondary_node.antenna_config}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
