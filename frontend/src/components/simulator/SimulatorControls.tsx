import React from 'react'
import { Sliders, Activity, Truck, Wifi, Layers, DollarSign } from 'lucide-react'
import { SimulationParams } from '../../types/simulator'

interface SimulatorControlsProps {
  params: SimulationParams
  onChange: (newParams: SimulationParams) => void
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({ params, onChange }) => {
  const update = (key: keyof SimulationParams, value: any) => {
    onChange({
      ...params,
      [key]: value,
    })
  }

  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#223050] pb-3">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#FF4D4D]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Live Scenario Modeler (Dual-Panel Simulation Bench)
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Interactive Parameter Matrix
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Panel 1: Demand & Crowd Dynamics */}
        <div className="space-y-3.5 bg-[#0B0F19]/60 p-4 rounded-xl border border-[#223050]">
          <div className="flex items-center space-x-2 text-white font-bold border-b border-slate-800 pb-2">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Spectator & Traffic Dynamics</span>
          </div>

          {/* Crowd Size */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Stadium Crowd Size:</span>
              <span className="text-white font-mono font-bold">{params.capacity?.toLocaleString()} fans</span>
            </div>
            <input
              type="range"
              min="50000"
              max="130000"
              step="5000"
              value={params.capacity}
              onChange={(e) => update('capacity', Number(e.target.value))}
              className="w-full accent-[#E40000] cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>50,000</span>
              <span className="text-[#FF4D4D] font-bold">100,000 (Base)</span>
              <span className="text-purple-400 font-bold">120,000 (Demo)</span>
              <span>130,000</span>
            </div>
          </div>

          {/* Airtel Share */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Airtel Market Share:</span>
              <span className="text-[#FF4D4D] font-mono font-bold">{((params.airtel_share || 0.40) * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.20"
              max="0.60"
              step="0.05"
              value={params.airtel_share}
              onChange={(e) => update('airtel_share', Number(e.target.value))}
              className="w-full accent-[#E40000] cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>20%</span>
              <span>40% (Airtel Share)</span>
              <span>60%</span>
            </div>
          </div>

          {/* 5G Penetration */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">5G Device Penetration:</span>
              <span className="text-blue-400 font-mono font-bold">{((params.device_share_5g || 0.70) * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.95"
              step="0.05"
              value={params.device_share_5g}
              onChange={(e) => update('device_share_5g', Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30%</span>
              <span>70% (Spec)</span>
              <span>95%</span>
            </div>
          </div>

          {/* Peak Concurrency % */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Simultaneous Online %:</span>
              <span className="text-amber-400 font-mono font-bold">{((params.peak_online_pct || 0.18) * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.08"
              max="0.35"
              step="0.01"
              value={params.peak_online_pct}
              onChange={(e) => update('peak_online_pct', Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>8%</span>
              <span>18% (Innings Break)</span>
              <span>28% (Rain Delay)</span>
              <span>35%</span>
            </div>
          </div>

          {/* Speeds */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                <span>5G Speed Target:</span>
                <span className="text-blue-400 font-mono font-bold">{params.target_speed_5g_mbps} Mbps</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="20.0"
                step="1.0"
                value={params.target_speed_5g_mbps}
                onChange={(e) => update('target_speed_5g_mbps', Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-1 bg-slate-800 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                <span>4G Speed Target:</span>
                <span className="text-purple-400 font-mono font-bold">{params.target_speed_4g_mbps} Mbps</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={params.target_speed_4g_mbps}
                onChange={(e) => update('target_speed_4g_mbps', Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-1 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Panel 2: Infrastructure Deployment Tuning */}
        <div className="space-y-3.5 bg-[#0B0F19]/60 p-4 rounded-xl border border-[#223050]">
          <div className="flex items-center space-x-2 text-white font-bold border-b border-slate-800 pb-2">
            <Truck className="w-3.5 h-3.5 text-red-400" />
            <span>Infrastructure Deployment Strategy</span>
          </div>

          {/* COWs Deployed */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">COWs Deployed (₹25L each):</span>
              <span className="text-red-400 font-mono font-bold">{params.cows_deployed} Towers</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={params.cows_deployed}
              onChange={(e) => update('cows_deployed', Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (None)</span>
              <span>4 (Recommended)</span>
              <span>10 (Max)</span>
            </div>
          </div>

          {/* Small Cells Deployed */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">In-Bowl Small Cells (₹8L each):</span>
              <span className="text-blue-400 font-mono font-bold">{params.small_cells_deployed} Cells</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="2"
              value={params.small_cells_deployed}
              onChange={(e) => update('small_cells_deployed', Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0</span>
              <span>26 (Recommended)</span>
              <span>50 (Max)</span>
            </div>
          </div>

          {/* Fibre Distance km */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">Fibre Backhaul Distance (₹50L/km):</span>
              <span className="text-amber-400 font-mono font-bold">{params.fibre_distance_km} km</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.05"
              value={params.fibre_distance_km}
              onChange={(e) => update('fibre_distance_km', Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 km</span>
              <span>0.99 km (M4, M6, S1, S2)</span>
              <span>3.0 km</span>
            </div>
          </div>

          {/* 5G Overlays */}
          <div className="space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">5G Active Antenna Overlays:</span>
              <span className="text-emerald-400 font-mono font-bold">{params.five_g_overlays_count} Sites</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={params.five_g_overlays_count}
              onChange={(e) => update('five_g_overlays_count', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (None)</span>
              <span>4 (M4, M6, S1, S2)</span>
            </div>
          </div>

          {/* Budget Limit Cap */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] font-semibold text-slate-300">
              <span>Budget Cap Constraint:</span>
              <span className="text-emerald-400 font-mono font-bold">₹{params.budget_cap_crores?.toFixed(2)} Crore</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.25"
              value={params.budget_cap_crores}
              onChange={(e) => update('budget_cap_crores', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
