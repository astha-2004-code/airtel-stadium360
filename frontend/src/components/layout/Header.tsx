import React, { useState } from 'react'
import {
  Users,
  Clock,
  RefreshCw,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  User as UserIcon,
  Shield,
  ChevronDown,
  Eye,
  Wrench,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { AuthModal } from '../auth/AuthModal'
import { UserProfileDrawer } from '../auth/UserProfileDrawer'

interface HeaderProps {
  capacity: number
  onCapacityChange: (cap: number) => void
  matchPhase: string
  onPhaseChange: (phase: string) => void
  healthScore: number
  healthStatus: 'OPTIMAL' | 'WARNING' | 'CRITICAL'
  onRefresh: () => void
  isRefreshing: boolean
}

export const Header: React.FC<HeaderProps> = ({
  capacity,
  onCapacityChange,
  matchPhase,
  onPhaseChange,
  healthScore,
  healthStatus,
  onRefresh,
  isRefreshing,
}) => {
  const { user, isAuthenticated, role, permissions, quickSwitchDemo } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false)
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState<boolean>(false)

  const matchPhases = [
    { id: 'Crowd building up', label: '17:00 • Crowd building up' },
    { id: 'Innings break', label: '21:00 • Innings break (Peak Congestion)' },
    { id: 'Final over', label: '22:45 • Final over' },
    { id: 'Post-match', label: '23:15 • Post-match egress' },
  ]

  const capacities = [
    { value: 65000, label: '65,000 (Last Match Benchmark)' },
    { value: 100000, label: '1,00,000 (World Cup Final)' },
    { value: 120000, label: '1,20,000 (Overcapacity Surge)' },
  ]

  const initials = user
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  const roleStyles = {
    NETWORK_ADMIN: {
      color: 'text-[#FF4D4D]',
      border: 'border-red-500/40',
      bg: 'bg-red-950/40 text-[#FF4D4D]',
      label: 'NETWORK_ADMIN',
      icon: Shield,
    },
    TELECOM_ENGINEER: {
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/40 text-emerald-400',
      label: 'TELECOM_ENGINEER',
      icon: Wrench,
    },
    EXECUTIVE_VIEWER: {
      color: 'text-blue-400',
      border: 'border-blue-500/40',
      bg: 'bg-blue-950/40 text-blue-400',
      label: 'EXECUTIVE_VIEWER',
      icon: Eye,
    },
  }

  const currentRoleStyle = role ? roleStyles[role] : roleStyles.TELECOM_ENGINEER
  const RoleIcon = currentRoleStyle.icon

  return (
    <>
      <header className="border-b border-[#223050] bg-[#131B2E]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Title & Context */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-red-900/30 border border-red-700/40 text-[#FF4D4D]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Executive Network Command Centre</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E40000]/20 text-[#FF4D4D] font-mono border border-[#E40000]/30 font-semibold">
                Live
              </span>
              {permissions.isReadOnly && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950/50 text-blue-300 font-mono border border-blue-500/40 font-semibold flex items-center gap-1">
                  <Eye className="w-3 h-3 text-blue-400" />
                  <span>Read-Only Viewer</span>
                </span>
              )}
            </h1>
            <p className="text-[11px] text-slate-400">
              Real-Time Network Telemetry • 8 Stadium Sites • ₹4 Cr Cap Optimizer
            </p>
          </div>
        </div>

        {/* Control Filters & Identity */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Match Moment Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs text-slate-300 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#FF4D4D]" />
            <span className="text-slate-400 text-[11px] font-medium">Phase:</span>
            <select
              value={matchPhase}
              onChange={(e) => onPhaseChange(e.target.value)}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {matchPhases.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Attendance Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs text-slate-300 shadow-sm">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 text-[11px] font-medium">Crowd:</span>
            <select
              value={capacity}
              onChange={(e) => onCapacityChange(Number(e.target.value))}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {capacities.map((c) => (
                <option key={c.value} value={c.value} className="bg-slate-900 text-white">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Network Health Badge */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold ${
              healthStatus === 'CRITICAL'
                ? 'bg-red-950/40 border-red-700/50 text-red-300'
                : healthStatus === 'WARNING'
                ? 'bg-amber-950/40 border-amber-700/50 text-amber-300'
                : 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
            }`}
          >
            {healthStatus === 'CRITICAL' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            ) : healthStatus === 'WARNING' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Health: {healthScore}/100</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF4D4D]' : ''}`} />
          </button>

          {/* Quick Persona Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen((prev) => !prev)}
              className="px-2.5 py-1 bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 rounded-xl text-xs font-bold text-red-300 flex items-center gap-1.5 transition-colors"
              title="1-Click Judge Persona Switcher"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E40000]" />
              <span className="hidden sm:inline">Switch Persona</span>
              <ChevronDown className="w-3 h-3 text-red-400" />
            </button>

            {isPersonaMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0B0F19] border border-[#223050] rounded-xl shadow-2xl p-2 z-50 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-800">
                  Select Judge Persona
                </div>
                <button
                  onClick={async () => {
                    await quickSwitchDemo('admin@airtel.com')
                    setIsPersonaMenuOpen(false)
                  }}
                  className={`w-full p-2 text-left rounded-lg text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                    role === 'NETWORK_ADMIN' ? 'bg-red-950/30 border border-red-500/40 text-white' : 'text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-[#FF4D4D]" />
                      <span>Sunil Varma</span>
                    </div>
                    <div className="text-[10px] text-slate-400">NETWORK_ADMIN (Full Clearance)</div>
                  </div>
                  {role === 'NETWORK_ADMIN' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                <button
                  onClick={async () => {
                    await quickSwitchDemo('engineer@airtel.com')
                    setIsPersonaMenuOpen(false)
                  }}
                  className={`w-full p-2 text-left rounded-lg text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                    role === 'TELECOM_ENGINEER' ? 'bg-emerald-950/30 border border-emerald-500/40 text-white' : 'text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <Wrench className="w-3 h-3 text-emerald-400" />
                      <span>Priya Sharma</span>
                    </div>
                    <div className="text-[10px] text-slate-400">TELECOM_ENGINEER (RF & Optimizer)</div>
                  </div>
                  {role === 'TELECOM_ENGINEER' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                <button
                  onClick={async () => {
                    await quickSwitchDemo('viewer@airtel.com')
                    setIsPersonaMenuOpen(false)
                  }}
                  className={`w-full p-2 text-left rounded-lg text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                    role === 'EXECUTIVE_VIEWER' ? 'bg-blue-950/30 border border-blue-500/40 text-white' : 'text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <Eye className="w-3 h-3 text-blue-400" />
                      <span>BCCI Stadium Observer</span>
                    </div>
                    <div className="text-[10px] text-slate-400">EXECUTIVE_VIEWER (Read-Only)</div>
                  </div>
                  {role === 'EXECUTIVE_VIEWER' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>
            )}
          </div>

          {/* User Profile Pill / Auth Button */}
          {isAuthenticated && user ? (
            <button
              onClick={() => setIsProfileDrawerOpen(true)}
              className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 rounded-xl px-2.5 py-1 transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#E40000] to-red-800 text-white font-bold text-[11px] flex items-center justify-center shadow-sm">
                {initials}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-white leading-tight">
                  {user.full_name}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${currentRoleStyle.bg}`}>
                    {currentRoleStyle.label}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-1.5 bg-[#E40000] hover:bg-red-700 text-white text-xs font-bold rounded-xl px-3 py-1.5 shadow-md shadow-red-900/40 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>NOC Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Auth Modal & Profile Drawer */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <UserProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        onOpenSwitchAccount={() => setIsAuthModalOpen(true)}
      />
    </>
  )
}
