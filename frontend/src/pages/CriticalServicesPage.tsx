import React, { useState, useEffect } from 'react'
import {
  ShieldAlert,
  CreditCard,
  PhoneCall,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Activity,
  DollarSign,
} from 'lucide-react'
import {
  UpiReliabilityKpis,
  QosSliceDefinition,
  PaymentHopLatency,
  SiteUpiTelemetry,
  CongestionResponsePolicy,
  CriticalServicesSimulationResponse,
} from '../types/criticalServices'
import {
  fetchUpiReliability,
  fetchQosSlices,
  fetchPaymentHopLatencies,
  fetchSiteUpiTelemetry,
  fetchCongestionPolicies,
  simulateCriticalServices,
} from '../services/criticalServicesService'
import { UpiReliabilityOverview } from '../components/critical/UpiReliabilityOverview'
import { QosSlicingVisualizer } from '../components/critical/QosSlicingVisualizer'
import { EndToEndPaymentLatencyBreakdown } from '../components/critical/EndToEndPaymentLatencyBreakdown'
import { SiteUpiTelemetryTable } from '../components/critical/SiteUpiTelemetryTable'
import { CongestionResponsePolicies } from '../components/critical/CongestionResponsePolicies'

interface CriticalServicesPageProps {
  initialCapacity?: number
}

export const CriticalServicesPage: React.FC<CriticalServicesPageProps> = ({
  initialCapacity = 100000,
}) => {
  const [capacity, setCapacity] = useState<number>(initialCapacity)
  const [qosEnabled, setQosEnabled] = useState<boolean>(true)
  const [prbReservation, setPrbReservation] = useState<number>(3.0)
  const [emergencyPreemption, setEmergencyPreemption] = useState<boolean>(true)

  // Data states
  const [kpis, setKpis] = useState<UpiReliabilityKpis | null>(null)
  const [slices, setSlices] = useState<QosSliceDefinition[]>([])
  const [hops, setHops] = useState<PaymentHopLatency[]>([])
  const [siteTelemetry, setSiteTelemetry] = useState<SiteUpiTelemetry[]>([])
  const [policies, setPolicies] = useState<CongestionResponsePolicy[]>([])
  const [simResult, setSimResult] = useState<CriticalServicesSimulationResponse | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSimulating, setIsSimulating] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'all' | 'slices' | 'latency' | 'telemetry' | 'policies'>('all')

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [kpiData, sliceData, hopData, telemetryData, policyData] = await Promise.all([
          fetchUpiReliability(capacity),
          fetchQosSlices(),
          fetchPaymentHopLatencies(),
          fetchSiteUpiTelemetry(),
          fetchCongestionPolicies(),
        ])
        setKpis(kpiData)
        setSlices(sliceData)
        setHops(hopData)
        setSiteTelemetry(telemetryData)
        setPolicies(policyData)
      } catch (err) {
        console.error('Failed to load critical services data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [capacity])

  // Run live simulation
  const handleRunSimulation = async () => {
    try {
      setIsSimulating(true)
      const res = await simulateCriticalServices({
        stadium_capacity: capacity,
        qos_slicing_enabled: qosEnabled,
        prb_reservation_upi_pct: prbReservation,
        emergency_preemption_enabled: emergencyPreemption,
        video_throttle_threshold_pct: 85.0,
      })
      setSimResult(res)
    } catch (err) {
      console.error('Simulation failed:', err)
    } finally {
      setIsSimulating(false)
    }
  }

  const handleResetSimulation = () => {
    setQosEnabled(true)
    setPrbReservation(3.0)
    setEmergencyPreemption(true)
    setSimResult(null)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E40000]/10 text-[#E40000] border border-red-500/20">
                Module 8
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Airtel Critical Slices Active
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              UPI & Emergency Traffic Protection Suite
            </h1>
            <p className="text-xs text-slate-400">
              3GPP 5QI-5 Payment Prioritization • 5QI-1 Public Safety GBR • End-to-End Handshake Reliability
            </p>
          </div>

          {/* Sub-tab pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0B0F19] p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Overview
            </button>
            <button
              onClick={() => setActiveTab('slices')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'slices' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              3-Tier QoS Slices
            </button>
            <button
              onClick={() => setActiveTab('latency')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'latency' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Latency Waterfall
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'telemetry' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Merchant Sectors
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'policies' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Congestion Policies
            </button>
          </div>
        </div>

        {/* Live Simulation Controls */}
        <div className="p-4 rounded-xl bg-[#0B0F19]/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-[#E40000]" />
              <span>Live QoS Slicing & UPI Reliability Modeler</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-4 py-1.5 rounded-xl bg-[#E40000] text-white text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5 shadow-md shadow-red-900/40"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isSimulating ? 'Evaluating...' : 'Simulate QoS Impact'}</span>
              </button>
              <button
                onClick={handleResetSimulation}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Reset to recommended"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
            {/* QoS Slicing Toggle */}
            <div className="space-y-1">
              <div className="text-xs text-slate-400">3GPP QoS Slicing State</div>
              <button
                onClick={() => setQosEnabled(!qosEnabled)}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  qosEnabled
                    ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-950/30 text-red-400 border-red-500/30'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{qosEnabled ? '5QI-5 Slicing ACTIVE' : 'DISABLED (Bufferbloat)'}</span>
              </button>
            </div>

            {/* Dedicated PRB Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">UPI Reserved PRBs</span>
                <span className="font-mono font-bold text-emerald-400">{prbReservation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                disabled={!qosEnabled}
                value={prbReservation}
                onChange={(e) => setPrbReservation(parseFloat(e.target.value))}
                className="w-full accent-[#E40000] bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer disabled:opacity-30"
              />
              <div className="text-[10px] text-slate-500">
                {prbReservation <= 0.5 ? '⚠️ High risk of packet queuing' : 'Guarantees < 50ms latency'}
              </div>
            </div>

            {/* Stadium Crowd Size */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Match Crowd Size</span>
                <span className="font-mono font-bold text-white">{capacity.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                {[65000, 100000, 120000].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCapacity(c)}
                    className={`flex-1 py-1 rounded text-[10px] font-bold border ${
                      capacity === c
                        ? 'bg-[#E40000] text-white border-red-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {c / 1000}k
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Pre-emption Toggle */}
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Emergency Call Pre-emption</div>
              <button
                onClick={() => setEmergencyPreemption(!emergencyPreemption)}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  emergencyPreemption
                    ? 'bg-blue-950/30 text-blue-400 border-blue-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{emergencyPreemption ? '112 SOS Guaranteed' : 'Best-Effort Queuing'}</span>
              </button>
            </div>
          </div>

          {/* Simulation Output Banner */}
          {simResult && (
            <div
              className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                simResult.status === 'PROTECTED'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-950/30 border-red-500/30 text-red-300'
              }`}
            >
              <div className="space-y-0.5">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>QoS Simulation Status: {simResult.status}</span>
                </div>
                <div className="text-[11px] text-slate-300">{simResult.telecom_explanation}</div>
              </div>
              <div className="flex items-center gap-4 font-mono font-bold text-xs shrink-0">
                <div>
                  <span className="text-slate-400 block text-[10px]">Failure Rate:</span>
                  <span className="text-white text-sm">{simResult.projected_upi_failure_rate_pct}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">RAN Latency:</span>
                  <span className="text-emerald-400 text-sm">{simResult.projected_ran_latency_ms} ms</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">GMV Saved:</span>
                  <span className="text-[#E40000] text-sm">₹{simResult.total_gmv_protected_lakhs}L</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Headline Overview */}
      <UpiReliabilityOverview kpis={kpis} isLoading={isLoading} />

      {/* Sub-tabbed Components */}
      {(activeTab === 'all' || activeTab === 'slices') && (
        <QosSlicingVisualizer slices={slices} />
      )}

      {(activeTab === 'all' || activeTab === 'latency') && (
        <EndToEndPaymentLatencyBreakdown hops={hops} />
      )}

      {(activeTab === 'all' || activeTab === 'telemetry') && (
        <SiteUpiTelemetryTable sites={siteTelemetry} />
      )}

      {(activeTab === 'all' || activeTab === 'policies') && (
        <CongestionResponsePolicies policies={policies} />
      )}
    </div>
  )
}

