import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import { TrafficSplitPoint } from '../../types/dashboard'
import { Wifi } from 'lucide-react'

interface TrafficSplitChartProps {
  data: TrafficSplitPoint[]
}

export const TrafficSplitChart: React.FC<TrafficSplitChartProps> = ({ data }) => {
  return (
    <div className="card-gradient rounded-2xl p-5 border border-[#223050] space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-400">
            <Wifi className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              4G vs 5G Throughput Demand (Gbps)
            </h3>
            <p className="text-xs text-slate-400">
              Demand split across match timeline (5 Mbps 5G / 3 Mbps 4G target)
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Peak Demand: <span className="font-bold text-white">31.68 Gbps</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#223050' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              unit="G"
              tickLine={false}
              axisLine={{ stroke: '#223050' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload as TrafficSplitPoint
                  return (
                    <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1.5">
                      <div className="font-bold text-white">
                        {p.phase} ({p.time})
                      </div>
                      <div className="text-blue-400">
                        5G Demand: <span className="font-mono font-bold text-white">{p.demand_5g_gbps} Gbps</span> ({p.traffic_5g_pct}%)
                      </div>
                      <div className="text-[#FF4D4D]">
                        4G Demand: <span className="font-mono font-bold text-white">{p.demand_4g_gbps} Gbps</span> ({p.traffic_4g_pct}%)
                      </div>
                      <div className="text-slate-300 border-t border-slate-800 pt-1 font-semibold">
                        Total: {round2(p.demand_5g_gbps + p.demand_4g_gbps)} Gbps
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 6 }}
              iconType="circle"
            />
            <Bar
              dataKey="demand_5g_gbps"
              name="5G Demand (Gbps)"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="demand_4g_gbps"
              name="4G Demand (Gbps)"
              fill="#E40000"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>70% 5G handset share drives 79.5% of total throughput demand</span>
        <span className="font-mono text-blue-400 font-semibold">25.20 Gbps (5G) + 6.48 Gbps (4G)</span>
      </div>
    </div>
  )
}

function round2(val: number) {
  return Math.round(val * 100) / 100
}
