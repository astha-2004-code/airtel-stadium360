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
import { Clock, TrendingUp, AlertTriangle } from 'lucide-react'
import { MatchPhaseForecastItem } from '../../types/analytics'

interface MatchPhaseDemandChartProps {
  forecast: MatchPhaseForecastItem[]
}

export const MatchPhaseDemandChart: React.FC<MatchPhaseDemandChartProps> = ({ forecast }) => {
  const chartData = forecast.map((f) => ({
    name: `${f.time} (${f.phase.split(' ')[0]})`,
    time: f.time,
    phase: f.phase,
    active_users: f.projected_active_users,
    projected_demand: f.projected_demand_gbps,
    required_capacity: f.required_capacity_gbps,
    installed_capacity: f.installed_capacity_gbps,
    historical_4g_load: f.historical_baseline['4g_load_pct'],
    historical_upi_failure: f.historical_baseline['upi_failure_pct'],
    unmitigated_utilization: f.unmitigated_utilization_pct,
  }))

  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#223050] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Match Chronology Analysis</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-mono">
              4 Phases Monitored
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">Match-Phase Demand Progression vs Installed RF Limit</h3>
        </div>
        <div className="text-xs text-slate-400 flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Peak Surge @ 21:00 Innings Break (18% Online)</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#223050" vertical={false} />
            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis
              yAxisId="left"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              unit=" Gbps"
              domain={[0, 45]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0B0F19',
                borderColor: '#223050',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#fff',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            {/* Installed RF Baseline */}
            <ReferenceLine
              yAxisId="left"
              y={6.03}
              stroke="#E40000"
              strokeDasharray="4 4"
              label={{ value: 'Installed Practical RF (6.03 Gbps)', fill: '#FF4D4D', fontSize: 10, position: 'top' }}
            />
            {/* Projected Demand (Gbps) */}
            <Bar
              yAxisId="left"
              dataKey="projected_demand"
              name="Projected Demand (Gbps)"
              fill="#3B82F6"
              radius={[6, 6, 0, 0]}
              barSize={32}
            />
            {/* Required Capacity @ 80% */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="required_capacity"
              name="Target Capacity @80% (Gbps)"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            {/* Historical 4G Load % */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="historical_4g_load"
              name="Hist. 4G Load % (65k Match)"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Match Phase Deep-Dive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {forecast.map((f, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-[#0B0F19]/60 border border-[#223050] space-y-2 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-white">{f.time}</span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  f.risk_level.includes('SEVERE')
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : f.risk_level.includes('HIGH')
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {f.risk_level}
              </span>
            </div>

            <div className="font-bold text-xs text-slate-200">{f.phase}</div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 border-t border-slate-800">
              <div>
                <span className="text-slate-500">Active Online:</span>
                <p className="text-white font-bold">{f.active_online_pct}% ({f.projected_active_users.toLocaleString()})</p>
              </div>
              <div>
                <span className="text-slate-500">Demand:</span>
                <p className="text-amber-400 font-bold">{f.projected_demand_gbps.toFixed(2)} Gbps</p>
              </div>
              <div>
                <span className="text-slate-500">Hist. 4G Speed:</span>
                <p className="text-rose-400 font-bold">{f.historical_baseline['4g_speed_mbps']} Mbps</p>
              </div>
              <div>
                <span className="text-slate-500">Hist. UPI Drop:</span>
                <p className="text-rose-400 font-bold">{f.historical_baseline['upi_failure_pct']}%</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight line-clamp-2 pt-1 border-t border-slate-900">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
