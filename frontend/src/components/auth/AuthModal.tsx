import React, { useState } from 'react'
import {
  X,
  Lock,
  User,
  Mail,
  Shield,
  Radio,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Building,
  Phone,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { UserRole } from '../../types/auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, quickSwitchDemo, isLoading, user } = useAuth()

  const [activeTab, setActiveTab] = useState<'demo' | 'login' | 'register'>('demo')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [fullName, setFullName] = useState<string>('')
  const [role, setRole] = useState<UserRole>('TELECOM_ENGINEER')
  const [department, setDepartment] = useState<string>('Airtel 5G Optimization Lead')
  const [phone, setPhone] = useState<string>('+91 ')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleDemoSwitch = async (demoEmail: string) => {
    setErrorMessage(null)
    try {
      await quickSwitchDemo(demoEmail)
      onClose()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to switch demo account')
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    try {
      await login({ email, password })
      onClose()
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.detail || 'Invalid corporate credentials. Please verify email and password.'
      )
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    try {
      await register({
        email,
        password,
        full_name: fullName,
        role,
        department,
        phone,
      })
      onClose()
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.detail || 'Failed to register account. Please verify input fields.'
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B0F19] border border-[#223050] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-red-950/20">
        {/* Header */}
        <div className="p-6 border-b border-[#223050] flex items-center justify-between bg-[#131B2E]/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E40000] to-red-800 flex items-center justify-center text-white shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[#E40000] font-black text-sm">AIRTEL NOC</span>
                <span className="text-slate-500">•</span>
                <span className="text-white font-bold text-sm">Identity & Access Control</span>
              </div>
              <p className="text-xs text-slate-400">
                Airtel Stadium360 Enterprise Authentication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'demo'
                ? 'border-[#E40000] text-white bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E40000]" />
            <span>Judge Personas</span>
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'login'
                ? 'border-[#E40000] text-white bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Corporate Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'register'
                ? 'border-[#E40000] text-white bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            New Engineer
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="m-5 p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-xs text-red-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1: Demo Personas Switcher */}
        {activeTab === 'demo' && (
          <div className="p-6 space-y-4">
            <div className="text-xs text-slate-400">
              Select a pre-configured Airtel NOC persona to evaluate permission tiers:
            </div>

            <div className="space-y-3">
              {/* Persona 1: Admin */}
              <div
                onClick={() => handleDemoSwitch('admin@airtel.com')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  user?.email === 'admin@airtel.com'
                    ? 'bg-red-950/30 border-[#E40000] shadow-md shadow-red-500/10'
                    : 'bg-[#131B2E] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 text-[#E40000] font-black text-sm flex items-center justify-center">
                    SV
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">Sunil Varma</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-[#E40000] border border-red-500/30">
                        NETWORK_ADMIN
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Executive Director NOC • Full Budget & Policy Governance
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </div>

              {/* Persona 2: Engineer */}
              <div
                onClick={() => handleDemoSwitch('engineer@airtel.com')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  user?.email === 'engineer@airtel.com'
                    ? 'bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-[#131B2E] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center">
                    PS
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">Priya Sharma</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        TELECOM_ENGINEER
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Senior RF Planning Lead • 5G Beamforming & Slicing Control
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </div>

              {/* Persona 3: Executive Viewer */}
              <div
                onClick={() => handleDemoSwitch('viewer@airtel.com')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  user?.email === 'viewer@airtel.com'
                    ? 'bg-blue-950/30 border-blue-500 shadow-md shadow-blue-500/10'
                    : 'bg-[#131B2E] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-black text-sm flex items-center justify-center">
                    BO
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">BCCI Stadium Observer</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        EXECUTIVE_VIEWER
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Match Operations Inspector • Read-Only Telemetry & Audit Reports
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Standard Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="engineer@airtel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-[#E40000]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-[#E40000]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-[#E40000] text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-900/40"
            >
              {isLoading ? 'Verifying with NOC...' : 'Authenticate Corporate Session'}
            </button>
          </form>
        )}

        {/* Tab 3: Register */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                required
                placeholder="Rohit Malhotra"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-[#E40000]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="rohit.m@airtel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-[#E40000]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-[#E40000]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-[#E40000]"
                >
                  <option value="TELECOM_ENGINEER">TELECOM_ENGINEER</option>
                  <option value="NETWORK_ADMIN">NETWORK_ADMIN</option>
                  <option value="EXECUTIVE_VIEWER">EXECUTIVE_VIEWER</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-[#E40000]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 rounded-xl bg-[#E40000] text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-900/40"
            >
              {isLoading ? 'Creating Account...' : 'Register Corporate Engineer'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
