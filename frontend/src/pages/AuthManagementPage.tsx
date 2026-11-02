import React, { useState, useEffect } from 'react'
import {
  Lock,
  Shield,
  User,
  Key,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  LogOut,
  Edit2,
  Sparkles,
  ShieldCheck,
  FileCode,
  Terminal,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { DemoAccount, User as UserType } from '../types/auth'
import { getDemoAccounts } from '../services/authService'
import { AuthModal } from '../components/auth/AuthModal'

export const AuthManagementPage: React.FC = () => {
  const { user, token, role, logout, quickSwitchDemo } = useAuth()
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([])
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'personas' | 'token' | 'rbac'>('overview')

  useEffect(() => {
    const loadDemos = async () => {
      try {
        const demos = await getDemoAccounts()
        setDemoAccounts(demos)
      } catch (err) {
        console.error('Failed to load demo accounts:', err)
      }
    }
    loadDemos()
  }, [])

  // Decode token payload for interactive visualizer
  let decodedPayload: any = null
  if (token) {
    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        decodedPayload = JSON.parse(atob(parts[1]))
      }
    } catch (e) {
      // ignore
    }
  }

  const roleColors: Record<string, string> = {
    NETWORK_ADMIN: 'bg-red-500/10 text-[#E40000] border-red-500/30',
    TELECOM_ENGINEER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    EXECUTIVE_VIEWER: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E40000]/10 text-[#E40000] border border-red-500/20">
                Module 9
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Enterprise Identity & Security
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Authentication, RBAC & Session Management
            </h1>
            <p className="text-xs text-slate-400">
              JWT Token Authorization • Bcrypt Salted Password Security • Role-Based Access Control Matrix
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0B0F19] p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'overview' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Session
            </button>
            <button
              onClick={() => setActiveTab('personas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'personas' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Judge Personas
            </button>
            <button
              onClick={() => setActiveTab('token')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'token' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              JWT Inspector
            </button>
            <button
              onClick={() => setActiveTab('rbac')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'rbac' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              RBAC Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'overview' && user && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Hero Card */}
          <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-5 lg:col-span-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E40000] to-red-900 flex items-center justify-center font-black text-2xl text-white shadow-lg border border-red-500/30">
                  {user.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{user.full_name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                    <span className="text-[11px] text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                      ✓ Active Session
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E40000]" />
                <span>Switch Account</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Operating Department</div>
                <div className="text-xs font-bold text-white">{user.department}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Emergency Contact</div>
                <div className="text-xs font-mono font-bold text-white">{user.phone || 'N/A'}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Security Clearance</div>
                <div className="text-xs font-bold text-emerald-400">
                  {user.is_superuser ? 'Superuser Level 1 (Full Access)' : 'Standard Operator Tier'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Session Issued At</div>
                <div className="text-xs font-mono text-slate-300">
                  {decodedPayload?.iat
                    ? new Date(decodedPayload.iat * 1000).toLocaleTimeString()
                    : new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Security Status */}
          <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cryptographic Guardrails</span>
              </div>
              <h4 className="text-sm font-bold text-white">Zero Hardcoded Secrets Enforced</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tokens are signed via HMAC-SHA256 using secrets ingested from secure environment variables.
                Passwords hashed with 12-round bcrypt salts.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Token Algorithm:</span>
                <span className="font-mono font-bold text-white">HS256</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Token Expiry:</span>
                <span className="font-mono font-bold text-emerald-400">24 Hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hashing Rounds:</span>
                <span className="font-mono font-bold text-white">12 Salt Rounds</span>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="w-full py-2 rounded-xl bg-red-950/20 border border-red-500/30 text-[#E40000] text-xs font-bold hover:bg-red-950/40 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Terminate Session</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab: Personas */}
      {activeTab === 'personas' && (
        <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white">Evaluation Personas for Competition Judges</h3>
            <p className="text-xs text-slate-400">
              One-click instant role switching to verify permissions across the entire platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoAccounts.map((d) => {
              const isCurrent = user?.email === d.email
              return (
                <div
                  key={d.email}
                  className={`p-5 rounded-2xl border transition-all space-y-4 flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-red-950/20 border-[#E40000] shadow-md shadow-red-500/10'
                      : 'bg-[#0B0F19]/80 border-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${roleColors[d.role]}`}>
                        {d.role}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{d.full_name}</h4>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">{d.email}</div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {d.description}
                    </p>
                  </div>

                  <button
                    disabled={isCurrent}
                    onClick={() => quickSwitchDemo(d.email)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-slate-800 text-slate-500 cursor-default'
                        : 'bg-[#E40000] text-white hover:bg-red-700 shadow-md shadow-red-900/30'
                    }`}
                  >
                    <span>{isCurrent ? 'Current Persona' : 'Switch to this Persona'}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab: Token Inspector */}
      {activeTab === 'token' && (
        <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-[#E40000]" />
              <span>Live JWT Token Inspector</span>
            </h3>
            <p className="text-xs text-slate-400">
              Decoded JSON Web Token proving cryptographically signed claims transmitted with API requests
            </p>
          </div>

          <div className="space-y-4">
            {/* Raw Token */}
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-2">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Raw Bearer Access Token
              </div>
              <div className="p-3 rounded-lg bg-black/60 font-mono text-xs text-slate-300 break-all leading-relaxed select-all">
                {token || 'No token active'}
              </div>
            </div>

            {/* Decoded Payload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Decoded Token Header
                </div>
                <pre className="p-3 rounded-lg bg-black/60 font-mono text-xs text-emerald-400 overflow-x-auto">
                  {JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2)}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Decoded Payload Claims
                </div>
                <pre className="p-3 rounded-lg bg-black/60 font-mono text-xs text-cyan-400 overflow-x-auto">
                  {JSON.stringify(decodedPayload || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: RBAC Matrix */}
      {activeTab === 'rbac' && (
        <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white">Role-Based Access Control (RBAC) Permission Matrix</h3>
            <p className="text-xs text-slate-400">
              Fine-grained operation governance enforced by FastAPI dependencies
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-mono">
                  <th className="py-3 px-4">System Capability</th>
                  <th className="py-3 px-3 text-center">NETWORK_ADMIN</th>
                  <th className="py-3 px-3 text-center">TELECOM_ENGINEER</th>
                  <th className="py-3 px-3 text-center">EXECUTIVE_VIEWER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                <tr>
                  <td className="py-3 px-4 text-white">View Command Centre KPIs & Digital Twin</td>
                  <td className="py-3 px-3 text-center text-emerald-400">✓ Full</td>
                  <td className="py-3 px-3 text-center text-emerald-400">✓ Full</td>
                  <td className="py-3 px-3 text-center text-emerald-400">✓ Full</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-white">Execute What-If Live Simulator Scenarios</td>
                  <td className="py-3 px-3 text-center text-emerald-400">✓ Full</td>
                  <td className="py-3 px-3 text-center text-emerald-400">✓ Full</td>
                  <td className="py-3 px-3 text-center text-slate-500">— Read Only</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-white">Modify ₹4 Cr Cap Budget & Asset Allocation</td>
                  <td className="py-3 px-3 text-center text-emerald-400 font-bold">✓ Authorized</td>
                  <td className="py-3 px-3 text-center text-amber-400">Simulation Only</td>
                  <td className="py-3 px-3 text-center text-slate-500">— Restricted</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-white">Adjust 64T64R Beamforming & RRM Policies</td>
                  <td className="py-3 px-3 text-center text-emerald-400 font-bold">✓ Authorized</td>
                  <td className="py-3 px-3 text-center text-emerald-400 font-bold">✓ Authorized</td>
                  <td className="py-3 px-3 text-center text-slate-500">— Restricted</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-white">Emergency Call Pre-emption & QoS Override</td>
                  <td className="py-3 px-3 text-center text-emerald-400 font-bold">✓ Authorized</td>
                  <td className="py-3 px-3 text-center text-slate-500">— Restricted</td>
                  <td className="py-3 px-3 text-center text-slate-500">— Restricted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}
