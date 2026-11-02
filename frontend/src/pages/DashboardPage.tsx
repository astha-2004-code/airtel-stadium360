import React, { useEffect, useState } from 'react'
import apiClient from '../services/api'
import {
  DashboardKPIs,
  TrafficSplitPoint,
  MatchPhaseLoadPoint,
  UserSpeedPoint,
  UpiFailurePoint,
  CapacityDemandPoint,
  AlertItem,
  ActivityEvent,
} from '../types/dashboard'
import { KpiCard } from '../components/dashboard/KpiCard'
import { SiteUtilizationChart } from '../components/dashboard/SiteUtilizationChart'
import { TrafficSplitChart } from '../components/dashboard/TrafficSplitChart'
import { MatchPhaseLoadChart } from '../components/dashboard/MatchPhaseLoadChart'
import { UserSpeedTrendChart } from '../components/dashboard/UserSpeedTrendChart'
import { UpiFailureChart } from '../components/dashboard/UpiFailureChart'
import { CapacityDemandChart } from '../components/dashboard/CapacityDemandChart'
import { CongestionAlerts } from '../components/dashboard/CongestionAlerts'
import { NetworkHealthGauge } from '../components/dashboard/NetworkHealthGauge'
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed'
import {
  Users,
  Smartphone,
  Radio,
  Gauge,
  Cpu,
  AlertTriangle,
  CreditCard,
  DollarSign,
  Wallet,
  Activity,
  Layers,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

interface DashboardPageProps {
  capacity: number
  matchPhase: string
  refreshTrigger: number
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  capacity,
  matchPhase,
  refreshTrigger,
}) => {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null)
  const [trafficSplit, setTrafficSplit] = useState<TrafficSplitPoint[]>([])
  const [matchLoad, setMatchLoad] = useState<MatchPhaseLoadPoint[]>([])
  const [userSpeed, setUserSpeed] = useState<UserSpeedPoint[]>([])
  const [upiFailures, setUpiFailures] = useState<UpiFailurePoint[]>([])
  const [capacityDemand, setCapacityDemand] = useState<CapacityDemandPoint[]>([])
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [activities, setActivities] = useState<ActivityEvent[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    Promise.all([
      apiClient.get('/dashboard/kpis', { params: { capacity, phase: matchPhase } }),
      apiClient.get('/dashboard/charts/traffic-split', { params: { capacity } }),
      apiClient.get('/dashboard/charts/match-phase-load'),
      apiClient.get('/dashboard/charts/user-speed-trends'),
      apiClient.get('/dashboard/charts/upi-failure-trends'),
      apiClient.get('/dashboard/charts/capacity-vs-demand', { params: { capacity } }),
      apiClient.get('/dashboard/alerts'),
      apiClient.get('/dashboard/recent-activity'),
    ])
      .then(
        ([
          kpiRes,
          trafficRes,
          loadRes,
          speedRes,
          upiRes,
          capRes,
          alertRes,
          activityRes,
        ]) => {
          if (!isMounted) return
          setKpis(kpiRes.data)
          setTrafficSplit(trafficRes.data)
          setMatchLoad(loadRes.data)
          setUserSpeed(speedRes.data)
          setUpiFailures(upiRes.data)
          setCapacityDemand(capRes.data)
          setAlerts(alertRes.data)
          setActivities(activityRes.data)
          setLoading(false)
        }
      )
      .catch((err) => {
        if (!isMounted) return
        console.error('Failed to load dashboard data:', err)
        setError(err.message || 'Error connecting to FastAPI backend')
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [capacity, matchPhase, refreshTrigger])

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#E40000] border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium text-slate-400 font-mono">
          Fetching Live Telemetry &amp; Telecom KPIs from FastAPI...
        </p>
      </div>
    )
  }

  if (error || !kpis) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800 text-[#FF4D4D]">
          <AlertCircle className="w-10 h-10 mx-auto" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Connection Error</h2>
          <p className="text-xs text-slate-400 max-w-md">
            {error || 'Unable to load telemetry metrics.'} Ensure the FastAPI backend is running on port 8000.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#E40000] hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-lg transition-all"
        >
          Retry Connection
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Banner */}
      <div className="card-gradient rounded-2xl p-6 border border-[#223050] flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
              Peak Telecom Crisis: Innings Break Saturation
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            World Cup Final • Narendra Modi Stadium (1,00,000 Capacity)
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Historical 65,000 fan baseline exposed severe network degradation: 4G anchor load reached ~99%,
            speeds fell from 16 Mbps to 1 Mbps, and UPI concession failures surged from 1% to 7.11%.
            Airtel Stadium360 provides AI-powered intelligence to maintain utilization &le; 80% under a strict ₹4 Crore budget.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-right">
            <p className="text-[10px] text-slate-500 font-medium">STRICT BUDGET CAP</p>
            <p className="text-lg font-black text-emerald-400 font-mono">₹4.00 Crore</p>
            <p className="text-[10px] text-slate-400">₹40,000,000 Limit</p>
          </div>
        </div>
      </div>

      {/* 11 Executive KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Key Performance Indicators (11 Executive Metrics)
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            Phase: {matchPhase} • Attendance: {capacity.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
          {/* Card 1: Stadium Capacity */}
          <KpiCard
            title="Stadium Capacity"
            value={kpis.stadium_capacity.toLocaleString()}
            subtitle="World Cup Final Venue"
            icon={Users}
            iconColor="text-blue-400"
            iconBg="bg-blue-950/30 border-blue-800/40"
            badgeText="Fixed Seats"
            badgeType="info"
            trend="1,00,000 Max Fans"
          />

          {/* Card 2: Airtel Spectators */}
          <KpiCard
            title="Airtel Spectators"
            value={kpis.airtel_spectators.toLocaleString()}
            subtitle="40% Airtel Market Share"
            icon={Users}
            iconColor="text-[#FF4D4D]"
            iconBg="bg-red-950/30 border-red-800/40"
            badgeText="40% Share"
            badgeType="danger"
            trend="40,000 Airtel Subs"
          />

          {/* Card 3: Active Airtel Users */}
          <KpiCard
            title="Active Airtel Users"
            value={kpis.active_airtel_users.toLocaleString()}
            subtitle="18% Peak Online Concurrent"
            icon={Activity}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-950/30 border-emerald-800/40"
            badgeText="18% Online"
            badgeType="success"
            trend="7,200 Peak Users"
          />

          {/* Card 4: Active 5G Users */}
          <KpiCard
            title="Active 5G Users"
            value={kpis.active_5g_users.toLocaleString()}
            subtitle="70% Handset Penetration"
            icon={Smartphone}
            iconColor="text-cyan-400"
            iconBg="bg-cyan-950/30 border-cyan-800/40"
            badgeText="70% 5G"
            badgeType="info"
            trend="5,040 Handsets"
          />

          {/* Card 5: Active 4G Users */}
          <KpiCard
            title="Active 4G Users"
            value={kpis.active_4g_users.toLocaleString()}
            subtitle="30% Legacy/Fallback"
            icon={Radio}
            iconColor="text-amber-400"
            iconBg="bg-amber-950/30 border-amber-800/40"
            badgeText="30% 4G"
            badgeType="warning"
            trend="2,160 Handsets"
          />

          {/* Card 6: Network Utilization */}
          <KpiCard
            title="Avg 4G Utilization"
            value={`${kpis.network_utilization_pct}%`}
            subtitle="Observed Peak Carrier Load"
            icon={Gauge}
            iconColor="text-[#FF4D4D]"
            iconBg="bg-red-950/30 border-red-800/40"
            badgeText="&gt;80% Cap"
            badgeType="danger"
            trend="Breached by +14.2%"
            alertBorder={true}
          />

          {/* Card 7: Required Throughput */}
          <KpiCard
            title="Throughput Demand"
            value={`${kpis.total_demand_gbps}`}
            unit="Gbps"
            subtitle={`Req: ${kpis.required_capacity_gbps} Gbps @ 80%`}
            icon={Cpu}
            iconColor="text-blue-400"
            iconBg="bg-blue-950/30 border-blue-800/40"
            badgeText="31.68 Gbps"
            badgeType="info"
            trend="5 Mbps 5G / 3 Mbps 4G"
          />

          {/* Card 8: Congested Sites */}
          <KpiCard
            title="Congested Sites"
            value={`${kpis.congested_sites_count} / ${kpis.total_sites}`}
            subtitle="Sectors &gt; 80% Utilization"
            icon={AlertTriangle}
            iconColor="text-[#FF4D4D]"
            iconBg="bg-red-950/30 border-red-800/40"
            badgeText="Critical"
            badgeType="danger"
            trend="M1-M5, S1, S2 Choked"
            alertBorder={true}
          />

          {/* Card 9: UPI Failure Rate */}
          <KpiCard
            title="UPI Failure Rate"
            value={`${kpis.upi_failure_rate_pct}%`}
            subtitle={`vs ${kpis.normal_upi_rate_pct}% Normal Day`}
            icon={CreditCard}
            iconColor="text-amber-400"
            iconBg="bg-amber-950/30 border-amber-800/40"
            badgeText="7.11% Peak"
            badgeType="danger"
            trend="SLA Breach (&gt;2%)"
            alertBorder={true}
          />

          {/* Card 10: Infrastructure Budget */}
          <KpiCard
            title="Infrastructure Cap"
            value="₹4.00"
            unit="Cr"
            subtitle="₹40,000,000 Maximum"
            icon={DollarSign}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-950/30 border-emerald-800/40"
            badgeText="Strict Cap"
            badgeType="success"
            trend="Competition Limit"
          />

          {/* Card 11: Remaining Budget */}
          <KpiCard
            title="Remaining Budget"
            value="₹4.00"
            unit="Cr"
            subtitle="Allocated: ₹0.00 Cr"
            icon={Wallet}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-950/30 border-emerald-800/40"
            badgeText="Available"
            badgeType="success"
            trend="Ready for Module 4 Plan"
          />
        </div>
      </div>

      {/* Primary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Site-wise Network Utilization */}
        <SiteUtilizationChart
          data={kpis.site_utilizations}
          phase={matchPhase}
        />

        {/* Chart 2: 4G vs 5G Throughput Demand */}
        <TrafficSplitChart data={trafficSplit} />

        {/* Chart 3: Match-Phase Network Load Progression */}
        <MatchPhaseLoadChart data={matchLoad} />

        {/* Chart 4: Historical User Speed Trends */}
        <UserSpeedTrendChart data={userSpeed} />

        {/* Chart 5: UPI Failure Trends */}
        <UpiFailureChart data={upiFailures} />

        {/* Chart 6: Network Capacity vs Peak Demand */}
        <CapacityDemandChart data={capacityDemand} />
      </div>

      {/* Operational Intelligence Triad: Alerts, Health, Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CongestionAlerts alerts={alerts} />
        <NetworkHealthGauge
          score={kpis.health_score}
          status={kpis.health_status}
          utilization={kpis.network_utilization_pct}
          upiFailure={kpis.upi_failure_rate_pct}
          congestedCount={kpis.congested_sites_count}
        />
        <RecentActivityFeed events={activities} />
      </div>
    </div>
  )
}
