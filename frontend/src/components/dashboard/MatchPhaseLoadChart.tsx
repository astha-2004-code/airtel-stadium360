import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import { MatchPhaseLoadPoint } from '../../types/dashboard'
import { Activity } from 'lucide-react'

interface MatchPhaseLoadChartProps {
  data: MatchPhaseLoadPoint[]
}

export const MatchPhaseLoadChart: React.FC<MatchPhaseLoadChartProps> = ({ data }) => {
  return (
    <div className="card-gradient rounded-2xl p-5 border border-[#223050] space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-red-950/40 border border-red-800/40 text-[#FF4D4D]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Match-Phase Network Load Progression
            </h3>
            <p className="text-xs text-slate-400">
              Average 4G anchor load % • Normal Day vs Last Match Day
            </p>
          </div>
        </div>

        <div className="text-xs font-mono px-2 py-1 rounded bg-red-950/60 text-red-300 border border-red-800/50">
          Innings Break Choke: 87.7% Avg Load
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="matchLoadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E40000" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#E40000" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="normalLoadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
              domain={[0, 105]}
              unit="%"
              tickLine={false}
              axisLine={{ stroke: '#223050' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload as MatchPhaseLoadPoint
                  return (
                    <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1.5">
                      <div className="font-bold text-white">
                        {p.phase} ({p.time})
                      </div>
                      <div className="text-red-400">
                        Match Day Load: <span className="font-mono font-bold text-white">{p.match_4g_load}%</span>
                      </div>
                      <div className="text-emerald-400">
                        Normal Day Load: <span className="font-mono">{p.normal_4g_load}%</span>
                      </div>
                      <div className="text-slate-400 border-t border-slate-800 pt-1">
                        UPI Failure: <span className="font-mono text-amber-300">{p.match_upi_failure}%</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} iconType="circle" />
            <ReferenceLine
              y={80}
              stroke="#E40000"
              strokeDasharray="4 4"
              label={{ value: '80% Cap', fill: '#FF4D4D', fontSize: 10, position: 'right' }}
            />
            <Area
              type="monotone"
              dataKey="match_4g_load"
              name="Match Day 4G Load (%)"
              stroke="#E40000"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#matchLoadGrad)"
            />
            <Area
              type="monotone"
              dataKey="normal_4g_load"
              name="Normal Day 4G Load (%)"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#normalLoadGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Normal day baseline maintains comfortable ~20% load</span>
        <span className="font-mono text-red-400 font-semibold">+338% surge during innings break</span>
      </div>
    </div>
  )
}
