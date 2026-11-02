import React, { useState } from 'react'
import { SiteSummary, InfrastructureAsset } from '../../types/network'
import {
  Radio,
  Wifi,
  AlertTriangle,
  Layers,
  Truck,
  Eye,
  Zap,
  Info,
  Maximize2,
  CheckCircle2,
} from 'lucide-react'

interface StadiumDigitalTwinProps {
  sites: SiteSummary[]
  proposedAssets: InfrastructureAsset[]
  selectedSiteId: string | null
  onSelectSite: (siteId: string) => void
  showHeatmap: boolean
  showBackhaul: boolean
  showProposed: boolean
  isAfterDeployment: boolean
}

export const StadiumDigitalTwin: React.FC<StadiumDigitalTwinProps> = ({
  sites,
  proposedAssets,
  selectedSiteId,
  onSelectSite,
  showHeatmap,
  showBackhaul,
  showProposed,
  isAfterDeployment,
}) => {
  const [hoveredSite, setHoveredSite] = useState<SiteSummary | null>(null)
  const [hoveredAsset, setHoveredAsset] = useState<InfrastructureAsset | null>(null)

  // Canvas dimensions for the SVG stadium coordinate system
  const size = 700
  const center = size / 2

  // Polar to Cartesian conversion for the SVG layout
  // Center is (350, 350). Stadium boundary is radius ~180px.
  // Macros sit between 220px and 310px. Small cells sit at 60px.
  const getSiteCoordinates = (distanceM: number, azimuthDeg: number) => {
    const scale = 0.58 // 450m -> ~260px
    const r = distanceM * scale
    // Azimuth: 0 is North (up: -y), 90 is East (+x), 180 is South (+y), 270 is West (-x)
    const rad = ((azimuthDeg - 90) * Math.PI) / 180
    const x = center + r * Math.cos(rad)
    const y = center + r * Math.sin(rad)
    return { x, y }
  }

  // Pre-calculated coordinates for proposed assets
  const proposedPositions: Record<string, { x: number; y: number }> = {
    'COW-01': { x: center + 120, y: center - 130 },
    'COW-02': { x: center - 40, y: center + 150 },
    'COW-03': { x: center - 145, y: center - 10 },
    'SC-PROP-01': { x: center + 85, y: center },
    'SC-PROP-02': { x: center - 85, y: center },
    'SC-PROP-03': { x: center, y: center - 85 },
    'SC-PROP-04': { x: center, y: center + 85 },
    'FIBRE-M4': { x: center - 165, y: center + 165 },
    'FIBRE-M6': { x: center - 195, y: center - 195 },
  }

  return (
    <div className="relative w-full aspect-square max-w-[720px] mx-auto bg-gradient-to-b from-[#0F172A] via-[#0B0F19] to-[#080B14] rounded-2xl border border-[#223050] overflow-hidden shadow-2xl p-4 flex flex-col items-center justify-center select-none">
      {/* Top Legend Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 text-xs">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md flex items-center space-x-2 text-slate-300 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="font-semibold text-white">
            {isAfterDeployment ? 'Mode: Post-Optimization (80% Cap)' : 'Mode: Baseline Congestion (Innings Break)'}
          </span>
        </div>

        {showProposed && (
          <div className="px-2.5 py-1 rounded-xl bg-blue-950/80 border border-blue-700/50 text-blue-300 font-mono text-[11px] flex items-center space-x-1">
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>3 COWs + 4 SCs Active</span>
          </div>
        )}
      </div>

      {/* SVG Stadium Digital Twin */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full max-h-[660px]"
      >
        <defs>
          {/* Radial Gradient for Stadium Center */}
          <radialGradient id="fieldGrass" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E3A1E" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#142814" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0F1F10" stopOpacity="0.7" />
          </radialGradient>

          {/* Saturated Sector Heatmap Gradients */}
          <radialGradient id="heatCrit" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E40000" stopOpacity={0.45} />
            <stop offset="60%" stopColor="#E40000" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#E40000" stopOpacity={0.0} />
          </radialGradient>

          <radialGradient id="heatSafe" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
          </radialGradient>

          {/* Glow Filters */}
          <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. OUTER STADIUM CONCOURSE (Radius 210) */}
        <circle
          cx={center}
          cy={center}
          r={210}
          fill="none"
          stroke="#1E293B"
          strokeWidth="28"
          strokeDasharray="4 6"
        />

        {/* 2. TIER 2 SEATING (Radius 180) */}
        <circle
          cx={center}
          cy={center}
          r={180}
          fill="#131B2E"
          stroke="#2A3B5C"
          strokeWidth="4"
        />

        {/* 3. TIER 1 LOWER BOWL (Radius 130) */}
        <circle
          cx={center}
          cy={center}
          r={130}
          fill="#101827"
          stroke="#334155"
          strokeWidth="3"
        />

        {/* 4. CRICKET BOUNDARY & PLAYING FIELD (Radius 95) */}
        <circle
          cx={center}
          cy={center}
          r={95}
          fill="url(#fieldGrass)"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* 30-Yard Circle & Pitch */}
        <circle
          cx={center}
          cy={center}
          r={55}
          fill="none"
          stroke="#334155"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <rect
          x={center - 8}
          y={center - 24}
          width={16}
          height={48}
          fill="#854D0E"
          opacity="0.8"
          rx="2"
        />

        {/* Stadium Label */}
        <text
          x={center}
          y={center - 4}
          fill="#94A3B8"
          fontSize="8"
          fontWeight="bold"
          textAnchor="middle"
          letterSpacing="1"
        >
          1,00,000 SEATS
        </text>
        <text
          x={center}
          y={center + 8}
          fill="#64748B"
          fontSize="7"
          textAnchor="middle"
        >
          NARENDRA MODI STADIUM
        </text>

        {/* Gate Labels */}
        <text x={center} y={center - 192} fill="#64748B" fontSize="9" textAnchor="middle" fontWeight="bold">NORTH (Gates 1-3)</text>
        <text x={center + 192} y={center + 4} fill="#64748B" fontSize="9" textAnchor="middle" fontWeight="bold">EAST</text>
        <text x={center} y={center + 200} fill="#64748B" fontSize="9" textAnchor="middle" fontWeight="bold">SOUTH (Media Box)</text>
        <text x={center - 192} y={center + 4} fill="#64748B" fontSize="9" textAnchor="middle" fontWeight="bold">WEST (Club VIP)</text>

        {/* 5. CONGESTION HEATMAP OVERLAYS */}
        {showHeatmap &&
          sites.map((site) => {
            const { x, y } = getSiteCoordinates(site.distance_m, site.azimuth_deg)
            const isCongested = !isAfterDeployment && site.current_load_pct >= 80

            return (
              <circle
                key={`heat-${site.site_id}`}
                cx={(center + x) / 2}
                cy={(center + y) / 2}
                r={isCongested ? 95 : 65}
                fill={isCongested ? 'url(#heatCrit)' : 'url(#heatSafe)'}
                opacity={isCongested ? 0.85 : 0.4}
                className="pointer-events-none transition-all duration-500"
              />
            )
          })}

        {/* 6. BACKHAUL LINKS (Core at Stadium Center to Sites) */}
        {showBackhaul &&
          sites.map((site) => {
            const { x, y } = getSiteCoordinates(site.distance_m, site.azimuth_deg)
            const isBottleneck = !isAfterDeployment && site.is_bottleneck

            return (
              <g key={`backhaul-${site.site_id}`}>
                <line
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke={isBottleneck ? '#F59E0B' : '#10B981'}
                  strokeWidth={isBottleneck ? 2.5 : 2}
                  strokeDasharray={isBottleneck ? '6 4' : 'none'}
                  opacity={0.7}
                />
                {/* Midpoint Bottleneck Marker */}
                {isBottleneck && (
                  <circle
                    cx={(center + x) / 2}
                    cy={(center + y) / 2}
                    r={6}
                    fill="#F59E0B"
                    stroke="#0B0F19"
                    strokeWidth="1.5"
                  />
                )}
              </g>
            )
          })}

        {/* 7. PROPOSED ASSETS OVERLAY */}
        {showProposed &&
          proposedAssets.map((asset) => {
            const pos = proposedPositions[asset.id]
            if (!pos) return null

            const isCOW = asset.asset_type === 'COW'
            const isFibre = asset.asset_type === 'FIBRE_UPGRADE'

            if (isFibre) {
              return null // represented via upgraded link
            }

            return (
              <g
                key={asset.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredAsset(asset)}
                onMouseLeave={() => setHoveredAsset(null)}
              >
                {/* Outer Pulse */}
                <circle
                  r={isCOW ? 16 : 12}
                  fill={isCOW ? '#3B82F6' : '#8B5CF6'}
                  opacity="0.25"
                  className="animate-ping"
                />
                {/* Asset Node */}
                <circle
                  r={isCOW ? 13 : 10}
                  fill={isCOW ? '#2563EB' : '#7C3AED'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  filter="url(#glowRed)"
                />
                <text
                  y={4}
                  fill="#FFFFFF"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {isCOW ? 'COW' : '5G'}
                </text>
                <text
                  y={22}
                  fill="#93C5FD"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {asset.id}
                </text>
              </g>
            )
          })}

        {/* 8. EXISTING 8 NETWORK SITES (M1-M6, S1-S2) */}
        {sites.map((site) => {
          const { x, y } = getSiteCoordinates(site.distance_m, site.azimuth_deg)
          const isSelected = selectedSiteId === site.site_id
          const isMacro = site.site_type === 'Macro'
          const effectiveLoad = isAfterDeployment
            ? site.current_load_pct * 0.72 // post optimization drop below 80%
            : site.current_load_pct
          const isCongested = effectiveLoad >= 80

          return (
            <g
              key={site.site_id}
              transform={`translate(${x}, ${y})`}
              className="cursor-pointer transition-transform duration-200 hover:scale-110"
              onClick={() => onSelectSite(site.site_id)}
              onMouseEnter={() => setHoveredSite(site)}
              onMouseLeave={() => setHoveredSite(null)}
            >
              {/* Coverage Sector Lobe pointing towards center */}
              {isMacro && (
                <path
                  d="M 0,0 L -35,50 A 60 60 0 0 0 35,50 Z"
                  transform={`rotate(${site.azimuth_deg + 180})`}
                  fill={isCongested ? '#E40000' : '#10B981'}
                  opacity={isCongested ? '0.25' : '0.15'}
                />
              )}

              {/* Selection Halo */}
              {isSelected && (
                <circle
                  r={isMacro ? 24 : 18}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  className="animate-spin"
                />
              )}

              {/* Congestion Pulse Halo */}
              {isCongested && (
                <circle
                  r={isMacro ? 20 : 15}
                  fill="#E40000"
                  opacity="0.3"
                  className="animate-pulse"
                />
              )}

              {/* Site Base Node */}
              <circle
                r={isMacro ? 15 : 11}
                fill={isCongested ? '#E40000' : '#10B981'}
                stroke="#FFFFFF"
                strokeWidth={isSelected ? 3 : 2}
                className="shadow-xl"
              />

              {/* Site ID Label */}
              <text
                y={4}
                fill="#FFFFFF"
                fontSize={isMacro ? '10' : '8'}
                fontWeight="900"
                textAnchor="middle"
              >
                {site.site_id}
              </text>

              {/* 5G Capability Badge */}
              {site.has_5g && (
                <circle
                  cx={isMacro ? 11 : 8}
                  cy={isMacro ? -11 : -8}
                  r={5}
                  fill="#3B82F6"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
              )}

              {/* Bottleneck Warning Icon on Node */}
              {site.is_bottleneck && !isAfterDeployment && (
                <circle
                  cx={isMacro ? -11 : -8}
                  cy={isMacro ? -11 : -8}
                  r={5}
                  fill="#F59E0B"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
              )}

              {/* Text label below node */}
              <text
                y={isMacro ? 26 : 20}
                fill="#F8FAFC"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                className="drop-shadow-md"
              >
                {site.site_id} ({effectiveLoad.toFixed(1)}%)
              </text>
              <text
                y={isMacro ? 36 : 28}
                fill="#94A3B8"
                fontSize="7"
                textAnchor="middle"
              >
                {site.distance_m}m • {site.backhaul_type}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Floating Hover Card */}
      {hoveredSite && (
        <div className="absolute bottom-4 left-4 right-4 z-30 p-3 rounded-xl bg-slate-900/95 border border-slate-700/80 backdrop-blur-md flex items-center justify-between text-xs text-white shadow-2xl pointer-events-none">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${hoveredSite.current_load_pct >= 80 ? 'bg-red-950 text-red-400' : 'bg-emerald-950 text-emerald-400'}`}>
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm">{hoveredSite.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${hoveredSite.has_5g ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-slate-800 text-slate-400'}`}>
                  {hoveredSite.has_5g ? '4G+5G n78' : '4G Only'}
                </span>
                {hoveredSite.is_bottleneck && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                    Backhaul Bottleneck ({hoveredSite.backhaul_type})
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{hoveredSite.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 font-mono text-right shrink-0">
            <div>
              <span className="text-[10px] text-slate-500 block">4G LOAD</span>
              <span className={`font-bold text-sm ${hoveredSite.current_load_pct >= 80 ? 'text-red-400' : 'text-emerald-400'}`}>
                {hoveredSite.current_load_pct}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">USER SPEED</span>
              <span className="font-bold text-sm text-amber-300">
                {hoveredSite.current_speed_mbps} Mbps
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hover Card for Proposed Asset */}
      {hoveredAsset && (
        <div className="absolute bottom-4 left-4 right-4 z-30 p-3 rounded-xl bg-blue-950/95 border border-blue-700/80 backdrop-blur-md flex items-center justify-between text-xs text-white shadow-2xl pointer-events-none">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-900/60 text-blue-300">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm">{hoveredAsset.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-blue-900 text-blue-200">
                  {hoveredAsset.asset_type}
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80 mt-0.5">{hoveredAsset.notes}</p>
            </div>
          </div>

          <div className="text-right font-mono shrink-0">
            <span className="text-[10px] text-blue-300 block">DEPLOYMENT COST</span>
            <span className="font-bold text-sm text-white">
              ₹{(hoveredAsset.cost_inr / 100000).toFixed(1)} Lakh
            </span>
          </div>
        </div>
      )}

      {/* Bottom Map Controls Indicator */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
        <span>Click node to inspect sector telemetry</span>
      </div>
    </div>
  )
}

