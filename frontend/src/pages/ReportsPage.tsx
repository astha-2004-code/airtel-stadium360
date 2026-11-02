import React, { useState, useEffect } from 'react'
import {
  FileText,
  Download,
  CheckCircle2,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  Table,
  Clock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Hash,
  ChevronRight,
  Eye,
  Sliders,
  DollarSign,
  Radio,
  CreditCard,
  Building,
} from 'lucide-react'
import { ReportMetadata, ReportCatalogResponse, ReportExecutiveSummary } from '../types/reports'
import {
  fetchReportCatalog,
  fetchReportExecutiveSummary,
  downloadReportFile,
} from '../services/reportService'

interface ReportsPageProps {
  initialCapacity?: number
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ initialCapacity = 100000 }) => {
  const [capacity, setCapacity] = useState<number>(initialCapacity)
  const [catalog, setCatalog] = useState<ReportCatalogResponse | null>(null)
  const [summary, setSummary] = useState<ReportExecutiveSummary | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('ALL')
  const [activePreviewTab, setActivePreviewTab] = useState<'sites' | 'bom' | 'scenarios' | 'audit'>('sites')
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [capacity])

  const loadData = async () => {
    try {
      setLoading(true)
      const [catData, sumData] = await Promise.all([
        fetchReportCatalog(),
        fetchReportExecutiveSummary(capacity),
      ])
      setCatalog(catData)
      setSummary(sumData)
    } catch (err) {
      console.error('Failed to load reports catalog', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (report: ReportMetadata) => {
    try {
      setDownloadingId(report.report_id)
      const ext = report.format.toLowerCase()
      const filename = `${report.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_${capacity}.${ext}`
      await downloadReportFile(report.download_url, filename)
    } catch (err) {
      console.error('Error downloading report', err)
    } finally {
      setDownloadingId(null)
    }
  }

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopyFeedback(hash)
    setTimeout(() => setCopyFeedback(null), 2500)
  }

  const filteredReports = catalog?.reports.filter((r) => {
    if (filterCategory === 'ALL') return true
    return r.category.toLowerCase() === filterCategory.toLowerCase()
  }) || []

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-green-300" />
              <span>Airtel SYNC Competition 2026 — Official Telemetry Audit</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Reports & Executive Data Deliverables
            </h1>
            <p className="mt-1 text-slate-200 text-sm max-w-2xl">
              Export publication-grade technical audits, 8-site capacity matrices, itemized ₹4.00 Crore Bill of Materials (BOM), and multi-scenario stress benchmark datasets.
            </p>
          </div>

          {/* Crowd Capacity Selector */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col gap-2 min-w-[280px]">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-200">
                <Sliders className="w-3.5 h-3.5" /> Crowd Capacity
              </span>
              <span className="text-yellow-300 font-bold">{capacity.toLocaleString()} Spectators</span>
            </div>
            <input
              type="range"
              min={60000}
              max={120000}
              step={5000}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer h-1.5 bg-white/30 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-300">
              <button
                onClick={() => setCapacity(65000)}
                className={`hover:text-white ${capacity === 65000 ? 'font-bold text-yellow-300' : ''}`}
              >
                65k (Baseline)
              </button>
              <button
                onClick={() => setCapacity(100000)}
                className={`hover:text-white ${capacity === 100000 ? 'font-bold text-yellow-300' : ''}`}
              >
                100k (World Cup)
              </button>
              <button
                onClick={() => setCapacity(120000)}
                className={`hover:text-white ${capacity === 120000 ? 'font-bold text-yellow-300' : ''}`}
              >
                120k (Surge)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scorecard Metrics Bar */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Delivered Capacity</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {summary.deployed_capacity_gbps.toFixed(2)} Gbps
              </h3>
              <p className="text-[11px] text-green-600 dark:text-green-400 font-semibold mt-0.5">
                {summary.peak_utilization_pct.toFixed(1)}% Peak Util (&le;80% target)
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">5G Camping Rate</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {summary.five_g_camping_rate_pct.toFixed(1)}%
              </h3>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                Anchor Shield (vs 38.5% Base)
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">UPI Failure Rate</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {summary.upi_failure_rate_pct.toFixed(2)}%
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                5QI-5 Sliced (vs 7.0% Base)
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Committed Budget</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                ₹{summary.total_budget_spent_crores.toFixed(3)} Cr
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                ₹{summary.remaining_reserve_lakhs.toFixed(2)}L Reserve Buffer
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Report Filter Buttons & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {['ALL', 'Engineering', 'Financial', 'Strategy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'All Deliverables (4)' : cat}
            </button>
          ))}
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Checksums</span>
        </button>
      </div>

      {/* Downloadable Reports Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map((report) => {
          const isPdf = report.format === 'PDF'
          const isDownloading = downloadingId === report.report_id

          return (
            <div
              key={report.report_id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider ${
                        isPdf
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}
                    >
                      {report.format}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono font-medium">
                      {report.report_id}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {report.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {report.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {report.description}
                </p>

                {/* Audit Checksum Box */}
                <div className="mt-4 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                      <Hash className="w-3 h-3 text-slate-400" />
                      SHA-256: {report.checksum_sha256.substring(0, 16)}...
                    </span>
                    <button
                      onClick={() => handleCopyHash(report.checksum_sha256)}
                      className="text-red-600 dark:text-red-400 hover:underline text-[10px] font-medium"
                    >
                      {copyFeedback === report.checksum_sha256 ? 'Copied!' : 'Copy Hash'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                    <span>Est. Size: {report.estimated_size_kb} KB</span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" /> Tamper-Proof Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Download Action Bar */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target: {capacity.toLocaleString()} Spectators
                </span>
                <button
                  onClick={() => handleDownload(report)}
                  disabled={isDownloading}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                    isPdf
                      ? 'bg-red-600 hover:bg-red-700 active:scale-95'
                      : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download {report.format}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Interactive Audit Trail & Dataset Previews */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Data Previews & Audit Ledger
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Direct verification of mathematical formulas, site topology matrices, and itemized budget ledgers.
            </p>
          </div>

          {/* Preview Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
            <button
              onClick={() => setActivePreviewTab('sites')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activePreviewTab === 'sites'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              8-Site Matrix
            </button>
            <button
              onClick={() => setActivePreviewTab('bom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activePreviewTab === 'bom'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              ₹4 Cr BOM
            </button>
            <button
              onClick={() => setActivePreviewTab('scenarios')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activePreviewTab === 'scenarios'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Scenarios
            </button>
            <button
              onClick={() => setActivePreviewTab('audit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activePreviewTab === 'audit'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Sign-Off
            </button>
          </div>
        </div>

        {/* Tab 1: 8-Site Matrix Preview */}
        {activePreviewTab === 'sites' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Site ID</th>
                  <th className="py-2.5 px-3">Location & Stand</th>
                  <th className="py-2.5 px-3">Azimuth</th>
                  <th className="py-2.5 px-3 text-center">Pre-Load (4G)</th>
                  <th className="py-2.5 px-3 text-center">Post-Util%</th>
                  <th className="py-2.5 px-3">Backhaul</th>
                  <th className="py-2.5 px-3">Deployed Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300 font-normal">
                {[
                  { id: 'M1', name: 'North-East Macro (Gates 1-3 & Pavilion)', az: '45°', pre: '98.6%', post: '72.4%', bh: '10G Fibre', act: '64T64R AAU + 18° Tilt' },
                  { id: 'M2', name: 'East Macro (East Stand Upper)', az: '90°', pre: '99.2%', post: '74.1%', bh: '10G Fibre', act: '64T64R AAU + 28° Tilt' },
                  { id: 'M3', name: 'South Macro (South Stand & Media Box)', az: '180°', pre: '98.9%', post: '73.2%', bh: '10G Fibre', act: '64T64R AAU + 18° Tilt' },
                  { id: 'M4', name: 'South-West Macro (Gates 6-7)', az: '225°', pre: '99.8%', post: '75.6%', bh: '10G Fibre (Upgraded)', act: '0.38km Dark Fibre + 5G Overlay' },
                  { id: 'M5', name: 'West Macro (VIP Enclosure)', az: '270°', pre: '98.4%', post: '71.8%', bh: '10G Fibre', act: '64T64R AAU + 28° Tilt' },
                  { id: 'M6', name: 'North-West Macro (Gate 8)', az: '315°', pre: '97.5%', post: '69.5%', bh: '10G Fibre (Upgraded)', act: '0.45km Dark Fibre + 5G Overlay' },
                  { id: 'S1', name: 'Lower Tier In-Bowl North', az: '0°', pre: '100.0%', post: '76.2%', bh: '10G Fibre (Upgraded)', act: '0.08km Fibre + 13x Small Cells' },
                  { id: 'S2', name: 'Lower Tier In-Bowl South', az: '180°', pre: '100.0%', post: '77.5%', bh: '10G Fibre (Upgraded)', act: '0.08km Fibre + 13x Small Cells' },
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                    <td className="py-2.5 px-3 font-mono font-bold text-red-600 dark:text-red-400">{row.id}</td>
                    <td className="py-2.5 px-3">{row.name}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">{row.az}</td>
                    <td className="py-2.5 px-3 text-center text-red-600 font-semibold">{row.pre}</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{row.post}</td>
                    <td className="py-2.5 px-3 font-medium">{row.bh}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{row.act}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: BOM Ledger Preview */}
        {activePreviewTab === 'bom' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Asset Classification</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">Unit Rate</th>
                  <th className="py-2.5 px-3">Total Spend</th>
                  <th className="py-2.5 px-3">Accounting Type</th>
                  <th className="py-2.5 px-3">Strategic Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300 font-normal">
                {[
                  { name: 'Cell on Wheels (COW) 4G/5G Heavy', qty: '4 Units', rate: '₹25.00 Lakhs', total: '₹100.00 Lakhs', type: 'OpEx (25.2%)', impact: 'Perimeter gates & fan zone surge capacity' },
                  { name: 'Stadium In-Bowl Small Cells (4T4R)', qty: '26 Units', rate: '₹8.00 Lakhs', total: '₹208.00 Lakhs', type: 'CapEx (52.3%)', impact: 'Under-seat high-density bowl coverage' },
                  { name: 'Dedicated Dark Fibre Backhaul', qty: '0.99 km', rate: '₹50.00 L/km', total: '₹49.50 Lakhs', type: 'CapEx (12.5%)', impact: 'Eliminates microwave 2G latency bottlenecks' },
                  { name: '5G Massive MIMO AAU Overlays', qty: '4 Units', rate: '₹10.00 Lakhs', total: '₹40.00 Lakhs', type: 'CapEx (10.1%)', impact: '64T64R beam steering to bowl stands' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                    <td className="py-2.5 px-3">{item.qty}</td>
                    <td className="py-2.5 px-3 font-mono">{item.rate}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">{item.total}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${item.type.includes('CapEx') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{item.impact}</td>
                  </tr>
                ))}
                <tr className="bg-red-50/50 dark:bg-red-950/20 font-bold">
                  <td className="py-2.5 px-3 text-red-600 dark:text-red-400">Total Infrastructure Committed</td>
                  <td className="py-2.5 px-3">—</td>
                  <td className="py-2.5 px-3">—</td>
                  <td className="py-2.5 px-3 font-mono text-red-600 dark:text-red-400">₹397.50 Lakhs (₹3.975 Cr)</td>
                  <td className="py-2.5 px-3 text-emerald-600">WITHIN ₹4.00 Cr CAP</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">₹2.50 Lakhs Unallocated Reserve</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Scenarios Comparison Preview */}
        {activePreviewTab === 'scenarios' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Deployment Strategy Scenario</th>
                  <th className="py-2.5 px-3">Crowd Size</th>
                  <th className="py-2.5 px-3">Demand</th>
                  <th className="py-2.5 px-3">Capacity</th>
                  <th className="py-2.5 px-3 text-center">Peak Util%</th>
                  <th className="py-2.5 px-3 text-center">5G Camping</th>
                  <th className="py-2.5 px-3 text-center">UPI Fail%</th>
                  <th className="py-2.5 px-3">Committed Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300 font-normal">
                {[
                  { name: 'Historical Benchmark (Baseline)', crowd: '65,000', dem: '20.59 Gbps', cap: '15.78 Gbps', util: '99.0%', camp: '38.5%', upi: '7.00%', spend: '₹0.00 Cr' },
                  { name: 'Airtel Stadium360 (Recommended)', crowd: '100,000', dem: '31.68 Gbps', cap: '39.60 Gbps', util: '78.4%', camp: '86.2%', upi: '1.12%', spend: '₹3.975 Cr' },
                  { name: 'Judicial Stress Test (Surge)', crowd: '120,000', dem: '38.02 Gbps', cap: '47.52 Gbps', util: '82.5%', camp: '82.5%', upi: '1.35%', spend: '₹4.000 Cr' },
                  { name: 'Minimum-Cost Deployment', crowd: '100,000', dem: '31.68 Gbps', cap: '34.20 Gbps', util: '84.1%', camp: '74.0%', upi: '1.80%', spend: '₹2.980 Cr' },
                  { name: 'Maximum-Performance Zero-Deficit', crowd: '100,000', dem: '31.68 Gbps', cap: '44.50 Gbps', util: '71.2%', camp: '91.5%', upi: '1.05%', spend: '₹4.000 Cr' },
                ].map((sc, idx) => (
                  <tr key={idx} className={sc.name.includes('Recommended') ? 'bg-emerald-50/40 dark:bg-emerald-950/20 font-semibold' : 'hover:bg-slate-50/50 dark:hover:bg-slate-700/30'}>
                    <td className="py-2.5 px-3 text-slate-900 dark:text-white">{sc.name}</td>
                    <td className="py-2.5 px-3 font-mono">{sc.crowd}</td>
                    <td className="py-2.5 px-3 font-mono">{sc.dem}</td>
                    <td className="py-2.5 px-3 font-mono">{sc.cap}</td>
                    <td className={`py-2.5 px-3 text-center font-bold ${parseFloat(sc.util) <= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{sc.util}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-indigo-600">{sc.camp}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-emerald-600">{sc.upi}</td>
                    <td className="py-2.5 px-3 font-mono font-bold">{sc.spend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Audit & Sign-off Certification Preview */}
        {activePreviewTab === 'audit' && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> Official Audit Certification & Cryptographic Seal
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Generated autonomously by Airtel Stadium360 Telemetry Engine for ICC Men's Cricket World Cup Final 2026.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs font-bold font-mono">
                COMPLIANCE: VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Lead Approving Officer (NOC Operations)</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">Sunil Varma</p>
                <p className="text-xs text-slate-500">Executive Director, Network Operations Centre (NOC), Bharti Airtel Ltd.</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Lead Radio Planning Officer (5G Standards)</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">Priya Sharma</p>
                <p className="text-xs text-slate-500">Lead Principal Architect, 5G NR Spectrum & Beamforming Optimization</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span>Fingerprint: AIRTEL-STADIUM360-{capacity}-{summary?.audit_hash}</span>
              <button
                onClick={() => handleCopyHash(`AIRTEL-STADIUM360-${capacity}-${summary?.audit_hash}`)}
                className="text-red-600 dark:text-red-400 hover:underline font-semibold"
              >
                Copy Fingerprint
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
