import React, { useEffect, useState } from 'react'
import apiClient from './services/api'
import { Activity, Radio, Signal, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'

export function App() {
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiClient
      .get('/health')
      .then((res) => {
        setHealth(res.data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to connect to backend')
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-[#223050] bg-[#131B2E]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E40000] to-[#880000] flex items-center justify-center font-bold text-xl shadow-lg shadow-red-900/40">
            360
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[#E40000] font-black text-xl tracking-wider">AIRTEL</span>
              <span className="font-bold text-xl text-white">STADIUM360</span>
            </div>
            <p className="text-xs text-slate-400">Predict. Optimize. Connect.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300">System Ready: Monorepo Initialized</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center items-center">
        <div className="w-full max-w-3xl card-gradient p-8 rounded-2xl border border-[#223050] shadow-2xl space-y-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-[#E40000]/10 rounded-xl border border-[#E40000]/30 text-[#E40000]">
              <Radio className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Airtel Stadium360 Platform</h1>
              <p className="text-sm text-slate-400">
                AI-Powered Predictive Network Optimization &amp; Stadium Connectivity
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-slate-400 text-xs">
                <Signal className="w-4 h-4 text-[#E40000]" />
                <span>Stadium Capacity</span>
              </div>
              <div className="text-xl font-bold text-white">1,00,000 Fans</div>
              <p className="text-[11px] text-slate-500">World Cup Final Venue</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-slate-400 text-xs">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Airtel Market Share</span>
              </div>
              <div className="text-xl font-bold text-white">40%</div>
              <p className="text-[11px] text-slate-500">40,000 Airtel Users</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-slate-400 text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Budget Cap</span>
              </div>
              <div className="text-xl font-bold text-white">₹4.00 Crore</div>
              <p className="text-[11px] text-slate-500">Strict Cap Enforced</p>
            </div>
          </div>

          {/* Backend Connection Status */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {loading ? (
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              ) : health?.status === 'ok' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              )}
              <div>
                <p className="text-sm font-semibold text-white">
                  FastAPI Backend: {loading ? 'Probing...' : health?.status === 'ok' ? 'Connected & Healthy' : 'Offline / Standalone Mode'}
                </p>
                <p className="text-xs text-slate-400">
                  {health ? `Version ${health.version} • DB: ${health.database_status}` : (error || 'Backend ready on http://127.0.0.1:8000')}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#E40000]/10 border border-[#E40000]/30 text-[#E40000]">
              COMMIT 0 READY
            </span>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#223050] py-4 text-center text-xs text-slate-500">
        Airtel Stadium360 • Developed for Airtel SYNC Competition 2026
      </footer>
    </div>
  )
}

export default App
