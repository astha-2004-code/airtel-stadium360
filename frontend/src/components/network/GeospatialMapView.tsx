import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SiteSummary, InfrastructureAsset } from '../../types/network'

// Custom marker icons using Leaflet DivIcon with Airtel styling
const createSiteIcon = (site: SiteSummary, isSelected: boolean) => {
  const isCongested = site.current_load_pct >= 80
  const color = isCongested ? '#E40000' : '#10B981'
  const size = site.site_type === 'Macro' ? 34 : 26

  return L.divIcon({
    className: 'custom-site-icon',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 2px solid ${isSelected ? '#FFFFFF' : '#0B0F19'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 900;
        font-size: ${size > 30 ? '11px' : '9px'};
        font-family: monospace;
        box-shadow: 0 0 12px ${color}80;
        cursor: pointer;
      ">
        ${site.site_id}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

const createAssetIcon = (asset: InfrastructureAsset) => {
  const isCOW = asset.asset_type === 'COW'
  const color = isCOW ? '#2563EB' : '#7C3AED'

  return L.divIcon({
    className: 'custom-asset-icon',
    html: `
      <div style="
        padding: 2px 6px;
        background-color: ${color};
        border: 1.5px solid white;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        font-size: 10px;
        font-family: monospace;
        box-shadow: 0 0 10px ${color};
        white-space: nowrap;
      ">
        ${asset.id}
      </div>
    `,
    iconSize: [40, 20],
    iconAnchor: [20, 10],
  })
}

interface GeospatialMapViewProps {
  sites: SiteSummary[]
  proposedAssets: InfrastructureAsset[]
  stadiumCenter: { lat: number; lon: number }
  selectedSiteId: string | null
  onSelectSite: (siteId: string) => void
  showBackhaul: boolean
  showProposed: boolean
}

export const GeospatialMapView: React.FC<GeospatialMapViewProps> = ({
  sites,
  proposedAssets,
  stadiumCenter,
  selectedSiteId,
  onSelectSite,
  showBackhaul,
  showProposed,
}) => {
  return (
    <div className="relative w-full aspect-square max-w-[720px] mx-auto rounded-2xl overflow-hidden border border-[#223050] shadow-2xl">
      <MapContainer
        center={[stadiumCenter.lat, stadiumCenter.lon]}
        zoom={16}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', backgroundColor: '#0B0F19' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Stadium Perimeter Circle (1,00,000 Capacity Bowl) */}
        <Circle
          center={[stadiumCenter.lat, stadiumCenter.lon]}
          radius={120}
          pathOptions={{
            color: '#E40000',
            fillColor: '#E40000',
            fillOpacity: 0.12,
            weight: 2,
            dashArray: '4 4',
          }}
        />

        {/* Stadium Center Label Marker */}
        <Circle
          center={[stadiumCenter.lat, stadiumCenter.lon]}
          radius={15}
          pathOptions={{ color: '#FFFFFF', fillColor: '#10B981', fillOpacity: 0.8, weight: 2 }}
        >
          <Popup>
            <div className="text-xs p-1">
              <strong className="block text-slate-900 font-bold">Narendra Modi Stadium</strong>
              <span className="text-slate-600">Capacity: 1,00,000 Seats</span>
            </div>
          </Popup>
        </Circle>

        {/* Backhaul Optical/Microwave Links */}
        {showBackhaul &&
          sites.map((site) => (
            <Polyline
              key={`link-${site.site_id}`}
              positions={[
                [stadiumCenter.lat, stadiumCenter.lon],
                [site.latitude, site.longitude],
              ]}
              pathOptions={{
                color: site.is_bottleneck ? '#F59E0B' : '#10B981',
                weight: site.is_bottleneck ? 2.5 : 2,
                dashArray: site.is_bottleneck ? '6 6' : undefined,
                opacity: 0.7,
              }}
            />
          ))}

        {/* 8 Existing Sites */}
        {sites.map((site) => (
          <Marker
            key={site.site_id}
            position={[site.latitude, site.longitude]}
            icon={createSiteIcon(site, selectedSiteId === site.site_id)}
            eventHandlers={{
              click: () => onSelectSite(site.site_id),
            }}
          >
            <Popup>
              <div className="text-xs space-y-1 p-1">
                <div className="font-bold text-slate-900">{site.name}</div>
                <div className="text-slate-600 font-mono">
                  Load: <strong>{site.current_load_pct}%</strong> ({site.status})
                </div>
                <div className="text-slate-600">
                  Speed: <strong>{site.current_speed_mbps} Mbps</strong>
                </div>
                <div className="text-slate-600">
                  Backhaul: <strong>{site.backhaul_type}</strong>
                </div>
                {site.is_bottleneck && (
                  <div className="text-amber-600 font-semibold font-mono text-[10px]">
                    ⚠ Backhaul Bottleneck
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Proposed Assets (COWs & Small Cells) */}
        {showProposed &&
          proposedAssets
            .filter((a) => a.asset_type !== 'FIBRE_UPGRADE')
            .map((asset) => (
              <Marker
                key={asset.id}
                position={[asset.latitude, asset.longitude]}
                icon={createAssetIcon(asset)}
              >
                <Popup>
                  <div className="text-xs p-1 space-y-1">
                    <strong className="block text-slate-900">{asset.name}</strong>
                    <div className="text-slate-600 text-[11px]">{asset.notes}</div>
                    <div className="text-emerald-700 font-bold font-mono">
                      Cost: ₹{(asset.cost_inr / 100000).toFixed(1)} Lakh
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
      </MapContainer>
    </div>
  )
}
