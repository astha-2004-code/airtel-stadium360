import React from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import { UpiFailurePoint } from '../../types/dashboard'
import { AlertCircle } from 'lucide-react'

interface UpiFailureChartProps {
  data: UpiFailurePoint[]
}

export const UpiFailureChart: React.FC<UpiFailureChartProps> = ({ data }) => {
  return (
    <div className="card-gradient rounded-2xl p-5 border border-[#223050] space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-red-950/40 border border-red-800/40 text-[#FF4D4D]">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              UPI Payment Failure Rates (%)
            </h3>
            <p className="text-xs text-slate-400">
              Concession stand &amp; merchandise POS terminal failures • 1% Normal vs 7% Surge
            </p>
          </div>
        </div>

        <div className="text-xs font-mono px-2 py-1 rounded bg-red-950/60 text-red-300 border border-red-800/50">
          Peak Failure: 7.11% (Innings Break)
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
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
              domain={[0, 9]}
              unit="%"
              tickLine={false}
              axisLine={{ stroke: '#223050' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload as UpiFailurePoint
                  return (
                    <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1.5">
                      <div className="font-bold text-white">
                        {p.phase} ({p.time})
                      </div>
                      <div className="text-red-400 font-bold">
                        Match UPI Failure: <span className="font-mono text-white">{p.match_upi_failure_pct}%</span>
                      </div>
                      <div className="text-emerald-400">
                        Normal Day Failure: <span className="font-mono text-white">{p.normal_upi_failure_pct}%</span>
                      </div>
                      <div className="text-amber-400 border-t border-slate-800 pt-1">
                        SLA Threshold: 2.00%
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} iconType="circle" />
            <ReferenceLine
              y={2.0}
              stroke="#F59E0B"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: 'SLA Limit (2%)',
                fill: '#F59E0B',
                fontSize: 10,
                position: 'top',
              }}
            />
            <Bar
              dataKey="match_upi_failure_pct"
              name="Match Day Failures (%)"
              fill="#E40000"
              radius={[6, 6, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="normal_upi_failure_pct"
              name="Normal Day Failures (%)"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Failure caused by uplink TCP handshake timeouts on saturated 4G B3 anchor</span>
        <span className="font-mono text-amber-400 font-semibold">Protected in Module 8</span>
      </div>
    </div>
  )
}
