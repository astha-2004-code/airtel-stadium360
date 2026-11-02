import React from 'react'
import { Truck, Wifi, Cpu, Layers, CheckCircle2, Zap, Radio } from 'lucide-react'
import { RecommendedMix, CostBreakdownLakhs } from '../../types/optimizer'

interface DeploymentMixCardProps {
  mix: RecommendedMix
  costs: CostBreakdownLakhs
}

export const DeploymentMixCard: React.FC<DeploymentMixCardProps> = ({ mix, costs }) => {
  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D4D]">SciPy MILP Recommended Mix</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 font-mono">
              Optimal Global Solution
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Multi-Tier Infrastructure Deployment Portfolio</h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Total Interventions: <span className="text-white font-bold">{mix.cows_deployed + mix.small_cells_deployed + mix.backhaul_upgrades_count + mix.five_g_overlays_count} assets</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* COWs Card */}
        <div className="rounded-xl border border-red-500/30 bg-gradient-to-b from-red-950/20 to-slate-900/60 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-[#FF4D4D]">
                Macro Portable Tier
              </span>
              <div className="p-2 rounded-lg bg-red-500/20 text-[#FF4D4D]">
                <Truck className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Cells on Wheels (COW)</h4>
              <p className="text-xs text-slate-400 mt-0.5">3-sector 5G+4G portable towers for gate concourses</p>
            </div>

            <div className="bg-[#0B0F19]/80 rounded-lg p-3 border border-[#223050] space-y-1">
              <div className="text-xs text-slate-400 font-mono">Units Deployed</div>
              <div className="text-2xl font-black text-white font-mono">{mix.cows_deployed} Towers</div>
              <div className="text-[11px] text-red-400 font-mono font-semibold">
                ₹{costs.cows.toFixed(1)}L total (₹25L / unit)
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 space-y-1 text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Gate 1, 3, 5, 7 Perimeter Plazas</span>
            </div>
            <p>Absorbs entrance footfall; relieves macro towers from concourse crowding.</p>
          </div>
        </div>

        {/* In-Bowl Small Cells Card */}
        <div className="rounded-xl border border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-slate-900/60 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                In-Bowl Micro Tier
              </span>
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Wifi className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">5G Micro Small Cells</h4>
              <p className="text-xs text-slate-400 mt-0.5">Under-seat & canopy mounted 5G n78 micro-RRHs</p>
            </div>

            <div className="bg-[#0B0F19]/80 rounded-lg p-3 border border-[#223050] space-y-1">
              <div className="text-xs text-slate-400 font-mono">Units Deployed</div>
              <div className="text-2xl font-black text-white font-mono">{mix.small_cells_deployed} Cells</div>
              <div className="text-[11px] text-blue-400 font-mono font-semibold">
                ₹{costs.small_cells.toFixed(1)}L total (₹8L / unit)
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 space-y-1 text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Lower & Upper Tiers Distributed</span>
            </div>
            <p>Delivers high-density indoor-like coverage directly to seated spectators.</p>
          </div>
        </div>

        {/* Fibre Backhaul Card */}
        <div className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-slate-900/60 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                10G Dark Fibre Backhaul
              </span>
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Backhaul Modernization</h4>
              <p className="text-xs text-slate-400 mt-0.5">Replaces Microwave & 1G bottlenecks with 10G Fibre</p>
            </div>

            <div className="bg-[#0B0F19]/80 rounded-lg p-3 border border-[#223050] space-y-1">
              <div className="text-xs text-slate-400 font-mono">Sites Upgraded</div>
              <div className="text-2xl font-black text-white font-mono">4 Critical Sites</div>
              <div className="text-[11px] text-amber-400 font-mono font-semibold">
                ₹{costs.fiber_backhaul.toFixed(1)}L total (0.99 km @ ₹50L/km)
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 space-y-1 text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>M4 (380m), M6 (450m), S1 (80m), S2 (80m)</span>
            </div>
            <p>Eliminates packet queuing; guarantees 10G non-blocking backhaul to core.</p>
          </div>
        </div>

        {/* 5G Overlays Card */}
        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900/60 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                5G Massive MIMO Overlays
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Radio className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">5G Layer Expansion</h4>
              <p className="text-xs text-slate-400 mt-0.5">64T64R AAU overlays on previously 4G-only towers</p>
            </div>

            <div className="bg-[#0B0F19]/80 rounded-lg p-3 border border-[#223050] space-y-1">
              <div className="text-xs text-slate-400 font-mono">AAU Overlays</div>
              <div className="text-2xl font-black text-white font-mono">4 Sites Overlaid</div>
              <div className="text-[11px] text-emerald-400 font-mono font-semibold">
                ₹{costs.five_g_overlays.toFixed(1)}L total
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 space-y-1 text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>M4, M6 Macros + S1, S2 Small Cells</span>
            </div>
            <p>Unlocks 100MHz n78 spectrum across 100% of stadium network sites.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

