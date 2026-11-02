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
import { CapacityDemandPoint } from '../../types/dashboard'
import { Server } from 'lucide-react'

interface CapacityDemandChartProps {
  data: CapacityDemandPoint[]
}

export const CapacityDemandChart: React.FC<CapacityDemandChartProps> = ({ data }) => {
  return (
    <div className="card-gradient rounded-2xl p-5 border border-[#223050] space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Network Capacity vs Peak Demand (Gbps)
            </h3>
            <p className="text-xs text-slate-400">
              Current Delivered RF Capacity vs Peak Demand vs Target Cap @ 80% Load
            </p>
          </div>
        </div>

        <div className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Target Cap Gap: 22.60 Gbps
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="category"
              stroke="#64748B"
              fontSize={11}
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
                  const p = payload[0].payload as CapacityDemandPoint
                  return (
                    <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1.5">
                      <div className="font-bold text-white">{p.category}</div>
                      <div className="text-emerald-400">
                        Current Delivered Capacity: <span className="font-mono text-white">{p.current_capacity_gbps} Gbps</span>
                      </div>
                      <div className="text-[#FF4D4D] font-bold">
                        Peak Demand: <span className="font-mono text-white">{p.peak_demand_gbps} Gbps</span>
                      </div>
                      <div className="text-blue-400">
                        Required Capacity @ 80%: <span className="font-mono text-white">{p.required_capacity_gbps} Gbps</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} iconType="circle" />
            <Bar
              dataKey="current_capacity_gbps"
              name="Current Delivered RF (Gbps)"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="peak_demand_gbps"
              name="Peak Demand (Gbps)"
              fill="#E40000"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="required_capacity_gbps"
              name="Required @ 80% Utilization (Gbps)"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Current RF delivery (17.0 Gbps) fails to meet 39.60 Gbps target capacity</span>
        <span className="font-mono text-blue-400 font-semibold">Optimization solved in Module 4</span>
      </div>
    </div>
  )
}
