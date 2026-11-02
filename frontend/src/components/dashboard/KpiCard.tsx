import React from 'react'
import { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  unit?: string
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  badgeText?: string
  badgeType?: 'danger' | 'warning' | 'success' | 'info' | 'neutral'
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  alertBorder?: boolean
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  iconColor = 'text-[#FF4D4D]',
  iconBg = 'bg-[#E40000]/15 border-[#E40000]/30',
  badgeText,
  badgeType = 'neutral',
  trend,
  alertBorder = false,
}) => {
  const badgeStyles = {
    danger: 'bg-red-950/60 text-red-300 border-red-800/50',
    warning: 'bg-amber-950/60 text-amber-300 border-amber-800/50',
    success: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
    info: 'bg-blue-950/60 text-blue-300 border-blue-800/50',
    neutral: 'bg-slate-800/80 text-slate-400 border-slate-700/50',
  }

  return (
    <div
      className={`relative rounded-2xl p-4 bg-gradient-to-b from-[#131B2E] to-[#0E1524] border transition-all duration-300 hover:border-slate-600/80 shadow-lg ${
        alertBorder
          ? 'border-red-600/50 shadow-red-950/30'
          : 'border-[#223050]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 tracking-tight">{title}</p>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-white tracking-tight">{value}</span>
            {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border ${iconBg} ${iconColor} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-[11px]">
        <div className="text-slate-400 truncate max-w-[140px]">{subtitle}</div>

        {badgeText && (
          <span
            className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide shrink-0 ${badgeStyles[badgeType]}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {trend && (
        <div className="mt-1 text-[10px] text-slate-500 font-mono">
          {trend}
        </div>
      )}
    </div>
  )
}
