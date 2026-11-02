import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell,
  CartesianGrid,
} from 'recharts'
import { SiteUtilizationItem } from '../../types/dashboard'
import { Radio } from 'lucide-react'

interface SiteUtilizationChartProps {
  data: SiteUtilizationItem[]
  phase: string
}

export const SiteUtilizationChart: React.FC<SiteUtilizationChartProps> = ({ data, phase }) => {
  return (
    <div className="card-gradient rounded-2xl p-5 border border-[#223050] space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-red-950/40 border border-red-800/40 text-[#FF4D4D]">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Site-Wise 4G Anchor Load (B3 Carrier)
            </h3>
            <p className="text-xs text-slate-400">
              8 Stadium-facing cells • Observed vs 80% Utilization Threshold ({phase})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#E40000]"></span>
            <span className="text-slate-300">Congested (&gt;80%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
            <span className="text-slate-300">Target Safe (&le;80%)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="site"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#223050' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              domain={[0, 105]}
              unit="%"
              tickLine={false}
              axisLine={{ stroke: '#223050' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as SiteUtilizationItem
                  return (
                    <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1.5">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>Site {item.site}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${item.is_congested ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-emerald-950 text-emerald-300'}`}>
                          {item.is_congested ? 'CONGESTED' : 'OPTIMAL'}
                        </span>
                      </div>
                      <div className="text-slate-300">
                        Match 4G Load: <span className="font-mono font-bold text-white">{item.load_pct}%</span>
                      </div>
                      <div className="text-slate-400">
                        Normal Day Load: <span className="font-mono">{item.normal_load_pct}%</span>
                      </div>
                      <div className="text-slate-400">
                        User Speed: <span className="font-mono text-amber-300">{item.speed_4g_mbps} Mbps</span>
                      </div>
                      {item.speed_5g_mbps && (
                        <div className="text-slate-400">
                          5G Speed: <span className="font-mono text-blue-300">{item.speed_5g_mbps} Mbps</span>
                        </div>
                      )}
                    </div>
                  )
                }
                return null
              }}
            />
            <ReferenceLine
              y={80}
              stroke="#E40000"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: 'Target Cap 80%',
                fill: '#FF4D4D',
                fontSize: 10,
                position: 'top',
              }}
            />
            <Bar dataKey="load_pct" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.load_pct >= 80 ? '#E40000' : '#10B981'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>7 of 8 sites exceed 80% target limit at peak moments</span>
        <span className="font-mono text-red-400 font-semibold">M4 &amp; M1 at 98.8% - 98.9% saturation</span>
      </div>
    </div>
  )
}
