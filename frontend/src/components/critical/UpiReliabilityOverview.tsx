import React from 'react'
import {
  CreditCard,
  TrendingDown,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowDownRight,
  DollarSign,
} from 'lucide-react'
import { UpiReliabilityKpis } from '../../types/criticalServices'

interface UpiReliabilityOverviewProps {
  kpis: UpiReliabilityKpis | null
  isLoading?: boolean
}

export const UpiReliabilityOverview: React.FC<UpiReliabilityOverviewProps> = ({
  kpis,
  isLoading = false,
}) => {
  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-[#131B2E] rounded-2xl border border-[#223050]" />
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'UPI Failure Rate',
      subtitle: 'Target: < 2.0% during peak match load',
      baseline: `${kpis.baseline_upi_failure_rate_pct}%`,
      proposed: `${kpis.proposed_upi_failure_rate_pct}%`,
      delta: `-${(kpis.baseline_upi_failure_rate_pct - kpis.proposed_upi_failure_rate_pct).toFixed(2)}%`,
      icon: CreditCard,
      accent: 'emerald',
      description: `${kpis.transactions_saved.toLocaleString()} payments successfully saved from timeout`,
    },
    {
      title: 'RAN Air-Interface Delay',
      subtitle: 'Radio scheduling queue waiting time',
      baseline: `${kpis.baseline_ran_latency_ms.toLocaleString()} ms`,
      proposed: `${kpis.proposed_ran_latency_ms} ms`,
      delta: '-99.0%',
      icon: Zap,
      accent: 'blue',
      description: 'Bufferbloat eliminated via 5QI-5 Strict Priority Queuing',
    },
    {
      title: 'Radio Packet Drop Rate',
      subtitle: 'Air interface MAC frame retransmissions',
      baseline: `${kpis.baseline_packet_loss_pct}%`,
      proposed: `${kpis.proposed_packet_loss_pct}%`,
      delta: '-99.5%',
      icon: Activity,
      accent: 'purple',
      description: 'Zero drop target enforced on dedicated 3% PRB slice',
    },
    {
      title: 'Merchant GMV Protected',
      subtitle: 'Financial value saved from payment collapse',
      baseline: '₹0.0 Lakhs',
      proposed: `₹${kpis.gmv_protected_lakhs} Lakhs`,
      delta: `+₹${kpis.gmv_protected_lakhs}L`,
      icon: DollarSign,
      accent: 'cyan',
      description: `Across ₹${kpis.total_gmv_lakhs} Lakhs total transaction volume`,
    },
  ]

  // RAN vs External Non-RAN breakdown
  const totalFailures = kpis.baseline_radio_induced_failures + kpis.external_bank_failures
  const ranPercent = ((kpis.baseline_radio_induced_failures / totalFailures) * 100).toFixed(1)
  const bankPercent = ((kpis.external_bank_failures / totalFailures) * 100).toFixed(1)

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E40000]" />
            UPI & Merchant Payment Reliability (Historical vs Protected)
          </h3>
          <p className="text-xs text-slate-400">
            {kpis.total_match_transactions.toLocaleString()} total attempts • Peak {kpis.peak_transactions_per_minute} tx/min during innings break
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">
            Baseline: <strong className="text-red-400">{kpis.baseline_upi_failure_rate_pct}%</strong>
          </span>
          <span className="text-emerald-400">
            Protected: <strong className="text-white font-mono">{kpis.proposed_upi_failure_rate_pct}%</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#131B2E] border border-[#223050] hover:border-slate-500/40 transition-all space-y-3 relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-[#E40000] group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">{c.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{c.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>{c.delta}</span>
                </div>
              </div>

              {/* Baseline vs Proposed */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#223050]/80">
                <div className="p-2 rounded-xl bg-[#0B0F19]/60 border border-slate-800/60">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Baseline</div>
                  <div className="text-base font-bold text-slate-400 line-through decoration-red-500/50">
                    {c.baseline}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-red-950/20 border border-red-500/20">
                  <div className="text-[10px] text-[#E40000] uppercase font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Protected
                  </div>
                  <div className="text-base font-black text-white">{c.proposed}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-[#0B0F19]/40 p-2 rounded-lg border border-slate-800/40">
                {c.description}
              </div>
            </div>
          )
        })}
      </div>

      {/* Honest Failure Attribution Breakdown Bar */}
      <div className="p-4 rounded-xl bg-[#131B2E] border border-[#223050] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between text-xs gap-2">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white">
              Root-Cause Attribution of Baseline 7.0% Payment Failures
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            {kpis.baseline_radio_induced_failures.toLocaleString()} RAN timeouts • {kpis.external_bank_failures.toLocaleString()} Bank/NPCI downtime
          </span>
        </div>

        {/* Stacked progress bar */}
        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
          <div
            className="bg-[#E40000] h-full"
            style={{ width: `${ranPercent}%` }}
            title={`Airtel RAN Bufferbloat: ${ranPercent}%`}
          />
          <div
            className="bg-amber-500 h-full"
            style={{ width: `${bankPercent}%` }}
            title={`External NPCI / Bank Switch: ${bankPercent}%`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="flex items-start space-x-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-[#E40000] shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Airtel RAN Bufferbloat ({ranPercent}% of failures):</strong>{' '}
              Caused by unmanaged 4G/5G PRB saturation. <strong>100% eliminated</strong> by Airtel
              Stadium360 via 5QI-5 QoS slicing and dedicated PRBs.
            </div>
          </div>
          <div className="flex items-start space-x-2 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">External Banking Infrastructure ({bankPercent}% of failures):</strong>{' '}
              Caused by NPCI national switch throttle & issuer bank core banking downtime. Preserved
              transparently as residual ~1.1% baseline.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
