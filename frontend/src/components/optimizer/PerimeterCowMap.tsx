import React from 'react'
import { Truck, MapPin, Radio, Compass, ShieldCheck } from 'lucide-react'
import { CowDeployment } from '../../types/optimizer'

interface PerimeterCowMapProps {
  cows: CowDeployment[]
}

export const PerimeterCowMap: React.FC<PerimeterCowMapProps> = ({ cows }) => {
  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Tactical Peripheral Placement</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 font-mono">
              Gates & Plazas
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Cell on Wheels (COW) Deployment Map</h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {cows.length} Units Stationed • Multi-Band 5G/4G
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cows.map((cow) => (
          <div
            key={cow.cow_id}
            className="p-4 rounded-xl bg-[#0B0F19]/80 border border-red-500/30 hover:border-red-500/60 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-[#FF4D4D]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">{cow.cow_id}</h4>
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                    <Compass className="w-3 h-3 text-red-400" />
                    <span>Azimuth {cow.azimuth}°</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                +{cow.capacity_gbps.toFixed(2)}G
              </span>
            </div>

            <div className="text-xs font-medium text-slate-200">
              {cow.location}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#223050] text-[11px] font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Backhaul:</span>
                <span className="text-slate-300 truncate max-w-[150px]">{cow.backhaul}</span>
              </div>
              <div className="flex justify-between">
                <span>Spectrum:</span>
                <span className="text-blue-400 font-bold">{cow.spectrum}</span>
              </div>
              <div className="flex justify-between">
                <span>Cost:</span>
                <span className="text-white font-bold">₹{cow.cost_lakhs} Lakhs</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Engineering note */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Tactical Offloading Role: </span>
          COWs are positioned outside turnstiles at major spectator ingress corridors (Gate 1 VIP, Gate 3 East Concourse, Gate 5 Food Court, Gate 7 Metro Station).
          They absorb high ticket-validation surges (17:00 arrival) and post-match cab booking/social sharing (23:15 departure),
          preventing macro tower coverage beams from being depleted by perimeter traffic.
        </div>
      </div>
    </div>
  )
}

