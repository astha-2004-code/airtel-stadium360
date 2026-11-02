import React, { useState } from 'react'
import { Server, Search, Filter, ShieldCheck, CheckCircle2, Clock } from 'lucide-react'
import { AssetItem } from '../../types/budget'

interface AssetInventoryTableProps {
  assets: AssetItem[]
}

export const AssetInventoryTable: React.FC<AssetInventoryTableProps> = ({ assets }) => {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'CapEx' | 'OpEx'>('ALL')

  const filteredAssets = assets.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.asset_id.toLowerCase().includes(search.toLowerCase()) ||
      item.vendor.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Hardware & Lease Management
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 font-mono">
              {assets.length} Tracked Assets
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Itemized Telecom Asset Catalog</h3>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search asset, vendor, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#0B0F19] border border-[#223050] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors w-48 sm:w-64"
            />
          </div>

          <div className="flex rounded-xl bg-[#0B0F19] p-0.5 border border-[#223050] text-xs">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                categoryFilter === 'ALL' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCategoryFilter('CapEx')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                categoryFilter === 'CapEx' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              CapEx
            </button>
            <button
              onClick={() => setCategoryFilter('OpEx')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                categoryFilter === 'OpEx' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              OpEx
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#223050] text-slate-400 font-mono text-[11px] bg-[#0B0F19]/40">
              <th className="py-3 px-3">Asset ID</th>
              <th className="py-3 px-3">Asset Name & Specifications</th>
              <th className="py-3 px-3">Type & Class</th>
              <th className="py-3 px-3">Vendor</th>
              <th className="py-3 px-3">Capacity</th>
              <th className="py-3 px-3">Qty</th>
              <th className="py-3 px-3">Total Cost</th>
              <th className="py-3 px-3">Location</th>
              <th className="py-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#223050]/50 font-sans">
            {filteredAssets.map((item) => (
              <tr key={item.asset_id} className="hover:bg-[#131B2E]/60 transition-colors">
                {/* ID */}
                <td className="py-3.5 px-3 font-mono font-bold text-white whitespace-nowrap">
                  {item.asset_id}
                </td>

                {/* Name & Specs */}
                <td className="py-3.5 px-3">
                  <div className="font-bold text-white text-xs">{item.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 max-w-sm truncate">
                    {item.specs}
                  </div>
                </td>

                {/* Class */}
                <td className="py-3.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      item.category === 'CapEx'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {item.category}
                  </span>
                </td>

                {/* Vendor */}
                <td className="py-3.5 px-3 text-slate-300 font-medium whitespace-nowrap">
                  {item.vendor.split(' ')[0]}
                </td>

                {/* Capacity */}
                <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold whitespace-nowrap">
                  +{item.capacity_gbps.toFixed(2)} Gbps
                </td>

                {/* Qty */}
                <td className="py-3.5 px-3 font-mono text-slate-300">
                  {item.quantity}
                </td>

                {/* Cost */}
                <td className="py-3.5 px-3 font-mono font-bold text-white whitespace-nowrap">
                  ₹{item.total_cost_lakhs.toFixed(1)}L
                </td>

                {/* Location */}
                <td className="py-3.5 px-3 text-slate-400 text-[11px] truncate max-w-[160px]">
                  {item.location}
                </td>

                {/* Status */}
                <td className="py-3.5 px-3 text-right whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                    {item.commission_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

