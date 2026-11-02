import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'
import { EvaluationOverviewResponse } from '../../types/evaluation'

interface BaselineVsProposedChartsProps {
  overview: EvaluationOverviewResponse
}

export const BaselineVsProposedCharts: React.FC<BaselineVsProposedChartsProps> = ({ overview }) => {
  const { utilization, throughput, accessibility, reliability } = overview

  // 1. Site Utilization Dataset
  const siteUtilizationData = utilization.site_utilization_matrix.map((s) => ({
    site: s.site_id,
    Baseline: s.baseline_4g_load_pct,
    Proposed: s.proposed_utilization_pct,
    Ceiling: 80,
  }))

  // 2. Throughput Comparison Dataset
  const throughputData = [
    {
      category: '4G User Speed (Mbps)',
      NormalDay: 15.6,
      MatchBaseline: throughput.avg_4g_speed_baseline_mbps,
      ProposedAirtel: throughput.avg_4g_speed_proposed_mbps,
      Target: 3.0,
    },
    {
      category: '5G User Speed (Mbps)',
      NormalDay: 152.0,
      MatchBaseline: throughput.avg_5g_speed_baseline_mbps,
      ProposedAirtel: throughput.avg_5g_speed_proposed_mbps,
      Target: 5.0,
    },
  ]

  // 3. 5G Accessibility by Site Dataset
  const accessibilityData = accessibility.site_connectivity_comparison.map((s) => ({
    site: s.site_id,
    Existing: s.existing_connection_success_rate_pct,
    ProposedTarget: s.proposed_connection_success_target_pct,
  }))

  // 4. UPI Failure Rate by Phase
  const upiPhasesData = [
    { phase: '17:00 Build-up', NormalDay: 1.08, MatchBaseline: 1.84, ProposedSliced: 1.05 },
    { phase: '21:00 Innings Break', NormalDay: 1.23, MatchBaseline: 7.11, ProposedSliced: 1.12 },
    { phase: '22:45 Final Over', NormalDay: 1.06, MatchBaseline: 6.82, ProposedSliced: 1.10 },
    { phase: '23:15 Post-match', NormalDay: 1.22, MatchBaseline: 5.23, ProposedSliced: 1.08 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Site-Wise Utilization Baseline vs Proposed */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              1. Site Utilization: Baseline vs Proposed
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Innings break load reduction below the 80% SLA saturation threshold
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
            -{utilization.congestion_reduction_pct.toFixed(0)}% Congestion
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={siteUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="site" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 105]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${val}%`]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Baseline" fill="#EF4444" radius={[4, 4, 0, 0]} name="Baseline (65k Match)" />
              <Bar dataKey="Proposed" fill="#10B981" radius={[4, 4, 0, 0]} name="Proposed (100k Final)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: 4G & 5G Throughput Comparison */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              2. User Throughput & Speed Compliance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterioration reversal: 4G target 3 Mbps, 5G target 5 Mbps SLA
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
            {throughput.users_meeting_target_proposed_pct.toFixed(0)}% SLA Met
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={throughputData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 160]} tick={{ fontSize: 11 }} unit="M" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${val} Mbps`]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="NormalDay" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Normal Day Avg" />
              <Bar dataKey="MatchBaseline" fill="#EF4444" radius={[4, 4, 0, 0]} name="Match Collapse" />
              <Bar dataKey="ProposedAirtel" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Airtel Proposed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: 5G Accessibility by Site */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              3. 5G Connection Success: Anchor Shield Impact
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Site-by-site connection success rates from actual workbook measurements
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
            +{accessibility.accessibility_improvement_pct.toFixed(0)}% Gain
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={accessibilityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="site" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 105]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${val}%`]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Existing" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Existing (Innings Break)" />
              <Bar dataKey="ProposedTarget" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Anchor Shield Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: UPI Payment Failure Trend */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              4. UPI Payment Failure Rate Across Match Phases
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              5QI-5 QoS slicing prevents bufferbloat spikes during peak innings break
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            -84% Failures
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={upiPhasesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="phase" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 8]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${val}%`]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="MatchBaseline" stroke="#EF4444" fill="#EF4444" fillOpacity={0.25} name="Match Baseline (7.11% peak)" />
              <Area type="monotone" dataKey="ProposedSliced" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="5QI-5 Sliced (1.12% peak)" />
              <Line type="monotone" dataKey="NormalDay" stroke="#94A3B8" strokeDasharray="4 4" name="Normal Non-Match Day" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
