import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import { UserSpeedPoint } from '../../types/dashboard'
import { Gauge } from 'lucide-react'

interface UserSpeedTrendChartProps {
  data: UserSpeedPoint[]
}

export const UserSpeedTrendChart: React.FC<UserSpeedTrendChartProps> = ({ data }) => {
  return (
    <div className="card-gradient rounded-2xl p-5 border border-[#223050] space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              User Throughput Speed Collapse
            </h3>
            <p className="text-xs text-slate-400">
              User download speed (Mbps) • Normal Day vs Congested Match Moments
            </p>
          </div>
        </div>

        <div className="text-xs font-mono px-2 py-1 rounded bg-red-950/60 text-red-300 border border-red-800/50">
          4G: 16 → 1 Mbps Drop
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
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
              unit="M"
              domain={[0, 170]}
              tickLine={false}
              axisLine={{ stroke: '#223050' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload as UserSpeedPoint
                  return (
                    <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1.5">
                      <div className="font-bold text-white">
                        {p.phase} ({p.time})
                      </div>
                      <div className="text-blue-400">
                        Normal 5G Speed: <span className="font-mono text-white">{p.normal_5g_speed} Mbps</span>
                      </div>
                      <div className="text-cyan-400">
                        Match 5G Speed: <span className="font-mono text-white">{p.match_5g_speed} Mbps</span>
                      </div>
                      <div className="text-emerald-400 border-t border-slate-800 pt-1">
                        Normal 4G Speed: <span className="font-mono text-white">{p.normal_4g_speed} Mbps</span>
                      </div>
                      <div className="text-red-400 font-bold">
                        Match 4G Speed: <span className="font-mono text-white">{p.match_4g_speed} Mbps</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} iconType="circle" />
            <Line
              type="monotone"
              dataKey="normal_5g_speed"
              name="Normal 5G Speed (Mbps)"
              stroke="#60A5FA"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="match_5g_speed"
              name="Match 5G Speed (Mbps)"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="normal_4g_speed"
              name="Normal 4G Speed (Mbps)"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="match_4g_speed"
              name="Match 4G Speed (Mbps)"
              stroke="#E40000"
              strokeWidth={3}
              dot={{ r: 5, fill: '#E40000' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>4G speeds in stadium bowl breached the 3.0 Mbps service target</span>
        <span className="font-mono text-red-400 font-semibold">0.9 - 1.0 Mbps at Innings Break</span>
      </div>
    </div>
  )
}
