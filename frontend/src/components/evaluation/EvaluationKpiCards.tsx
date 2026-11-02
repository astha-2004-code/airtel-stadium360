import React from 'react'
import {
  Activity,
  Radio,
  Zap,
  Wifi,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { EvaluationOverviewResponse } from '../../types/evaluation'

interface EvaluationKpiCardsProps {
  overview: EvaluationOverviewResponse
}

export const EvaluationKpiCards: React.FC<EvaluationKpiCardsProps> = ({ overview }) => {
  const { health_score, utilization, throughput, accessibility, reliability, financial } = overview

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Composite Internal Health Score */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Health Index
          </span>
          <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {health_score.composite_score.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
              {health_score.rating}
            </span>
            <span className="text-[10px] text-slate-400 truncate">Internal Score</span>
          </div>
        </div>
      </div>

      {/* 2. Network Utilization */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Avg Utilization
          </span>
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <Radio className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {utilization.avg_4g_utilization_proposed_pct.toFixed(1)}%
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> -{utilization.congestion_reduction_pct.toFixed(0)}%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {utilization.congested_sites_proposed} congested sites (was {utilization.congested_sites_baseline})
          </p>
        </div>
      </div>

      {/* 3. Throughput Compliance */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Speed Compliance
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {throughput.users_meeting_target_proposed_pct.toFixed(1)}%
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +{(throughput.users_meeting_target_proposed_pct - throughput.users_meeting_target_baseline_pct).toFixed(0)}%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            4G: {throughput.avg_4g_speed_proposed_mbps.toFixed(1)}M • 5G: {throughput.avg_5g_speed_proposed_mbps.toFixed(0)}M
          </p>
        </div>
      </div>

      {/* 4. 5G Accessibility */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            5G Accessibility
          </span>
          <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
            <Wifi className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {accessibility.proposed_connection_success_target_pct.toFixed(1)}%
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +{accessibility.accessibility_improvement_pct.toFixed(0)}%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Anchor Shield (was {accessibility.existing_connection_success_rate_pct.toFixed(1)}%)
          </p>
        </div>
      </div>

      {/* 5. UPI Payment Reliability */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            UPI Failure Rate
          </span>
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {reliability.proposed_simulated_failure_rate_pct.toFixed(2)}%
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> -{reliability.improvement_pct.toFixed(0)}%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            5QI-5 Sliced (was {reliability.existing_upi_failure_rate_pct.toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* 6. Budget Compliance */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Spend
          </span>
          <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{financial.total_infrastructure_cost_crores.toFixed(3)}
            </span>
            <span className="text-xs text-slate-400 font-medium">Cr</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            ₹{financial.remaining_budget_lakhs.toFixed(2)}L Reserve Buffer
          </p>
        </div>
      </div>
    </div>
  )
}

