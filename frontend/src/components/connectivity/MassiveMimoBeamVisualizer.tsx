import React, { useState } from 'react'
import {
  Radio,
  Compass,
  ArrowDown,
  Layers,
  Activity,
  Zap,
  Sliders,
  CheckCircle2,
} from 'lucide-react'
import { MassiveMimoSector } from '../../types/connectivity'

interface MassiveMimoBeamVisualizerProps {
  sectors: MassiveMimoSector[]
}

export const MassiveMimoBeamVisualizer: React.FC<MassiveMimoBeamVisualizerProps> = ({
  sectors,
}) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>('S1')

  const currentSector = sectors.find((s) => s.site_id === selectedSiteId) || sectors[0]

  return (
    <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E40000]/10 text-[#E40000] border border-red-500/20">
              64T64R Active Antenna Unit (AAU)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              16 MU-MIMO Spatial Layers
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            3D Massive MIMO Beamforming & Elevation Down-Tilt
          </h3>
          <p className="text-xs text-slate-400">
            Sector-by-sector 3D RF beam steering matched to stadium bowl rake angle
          </p>
        </div>

        {/* Site Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0B0F19] p-1.5 rounded-xl border border-slate-800">
          {sectors.map((s) => (
            <button
              key={s.site_id}
              onClick={() => setSelectedSiteId(s.site_id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedSiteId === s.site_id
                  ? 'bg-[#E40000] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {s.site_id}
            </button>
          ))}
        </div>
      </div>

      {currentSector && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compass & Physical Orientation Visualizer */}
          <div className="p-5 rounded-2xl bg-[#0B0F19]/80 border border-[#223050] flex flex-col items-center justify-center space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Azimuth & Horizon Radar
            </div>
            
            <div className="relative w-48 h-48 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center bg-slate-950/60">
              {/* Cardinal markings */}
              <span className="absolute top-2 text-[10px] font-mono font-bold text-slate-500">N 0°</span>
              <span className="absolute right-2 text-[10px] font-mono font-bold text-slate-500">E 90°</span>
              <span className="absolute bottom-2 text-[10px] font-mono font-bold text-slate-500">S 180°</span>
              <span className="absolute left-2 text-[10px] font-mono font-bold text-slate-500">W 270°</span>

              {/* Antenna Center */}
              <div className="w-8 h-8 rounded-full bg-[#E40000] flex items-center justify-center text-white shadow-lg shadow-red-500/50 z-10">
                <Radio className="w-4 h-4" />
              </div>

              {/* Beam Sector Projection */}
              <div
                className="absolute w-36 h-36 rounded-full pointer-events-none transition-transform duration-500"
                style={{
                  transform: `rotate(${currentSector.azimuth_deg - 32.5}deg)`,
                  background: 'conic-gradient(from 0deg, rgba(228,0,0,0.4) 0deg, rgba(228,0,0,0.05) 65deg, transparent 65deg)',
                }}
              />

              {/* Heading Line */}
              <div
                className="absolute top-1/2 left-1/2 w-20 h-0.5 bg-[#E40000] origin-left transition-transform duration-500"
                style={{
                  transform: `rotate(${currentSector.azimuth_deg - 90}deg)`,
                }}
              />
            </div>

            <div className="text-center space-y-1">
              <div className="text-sm font-bold text-white">{currentSector.site_name}</div>
              <div className="text-xs font-mono text-emerald-400">
                Azimuth: {currentSector.azimuth_deg}° • Beamwidth: {currentSector.horizontal_beamwidth_deg}°
              </div>
            </div>
          </div>

          {/* 3D Vertical Tilt & Elevation Modeling */}
          <div className="p-5 rounded-2xl bg-[#0B0F19]/80 border border-[#223050] space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-[#E40000]" />
                Elevation & Bowl Rake Targeting
              </div>
              <p className="text-[11px] text-slate-400">
                Independent electrical down-tilt prevents overshoot over stadium roof and confines RF energy to seats.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#131B2E] border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target Bowl Tier</span>
                  <span className="font-bold text-white">{currentSector.targeted_tier}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#131B2E] border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400">Mechanical Down-Tilt</div>
                  <div className="text-base font-bold text-slate-300 font-mono">
                    {currentSector.mechanical_tilt_deg}°
                  </div>
                  <div className="text-[10px] text-slate-500">Fixed mast bracket</div>
                </div>

                <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1">
                  <div className="text-[10px] text-[#E40000] font-bold">Electrical Tilt (RET)</div>
                  <div className="text-base font-black text-white font-mono">
                    {currentSector.electrical_tilt_deg}°
                  </div>
                  <div className="text-[10px] text-emerald-400">Airtel remote tuned</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#131B2E] border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Vertical 3D Beamwidth</span>
                  <span className="font-mono font-bold text-white">{currentSector.vertical_beamwidth_deg}°</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#E40000] h-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>

            <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Covers target tier with &lt; 1.5 dB edge roll-off</span>
            </div>
          </div>

          {/* RF Predictions & Spatial Multiplexing */}
          <div className="p-5 rounded-2xl bg-[#0B0F19]/80 border border-[#223050] space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                MU-MIMO Multiplexing & Signal
              </div>
              <p className="text-[11px] text-slate-400">
                16 orthogonal beams multiplexed concurrently over 100 MHz n78 spectrum.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#131B2E] border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">Predicted RSRP</div>
                <div className="text-base font-black text-white font-mono">
                  {currentSector.predicted_rsrp_dbm} dBm
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">Strong Coverage</div>
              </div>

              <div className="p-3 rounded-xl bg-[#131B2E] border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">Predicted SINR</div>
                <div className="text-base font-black text-emerald-400 font-mono">
                  +{currentSector.predicted_sinr_db} dB
                </div>
                <div className="text-[10px] text-slate-400">Interference free</div>
              </div>

              <div className="p-3 rounded-xl bg-[#131B2E] border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">Spectral Efficiency</div>
                <div className="text-base font-black text-white font-mono">
                  {currentSector.spectral_efficiency_bps_hz} <span className="text-xs font-normal">bps/Hz</span>
                </div>
                <div className="text-[10px] text-slate-400">256-QAM capable</div>
              </div>

              <div className="p-3 rounded-xl bg-[#131B2E] border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">RF Output Power</div>
                <div className="text-base font-black text-white font-mono">
                  {currentSector.tx_power_watts} W
                </div>
                <div className="text-[10px] text-slate-400">64 x 5W PA modules</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-300 font-medium">
              16 concurrent UEs served simultaneously per TDD scheduling slot
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
