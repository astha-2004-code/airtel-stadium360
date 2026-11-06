import React, { useState } from 'react'
import {
  LayoutDashboard,
  Radio,
  Cpu,
  Zap,
  Sliders,
  DollarSign,
  Wifi,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Lock,
  Sparkles,
  Activity,
  UserCheck,
  Eye,
  Wrench,
  Shield,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  currentModule: string
  onSelectModule: (module: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentModule, onSelectModule }) => {
  const { user, role, canAccessModule, permissions, logout } = useAuth()
  const [showRestricted, setShowRestricted] = useState<boolean>(true)

  const allMenuItems = [
    {
      id: 'dashboard',
      name: 'Command Centre',
      description: 'Executive Network Overview',
      icon: LayoutDashboard,
      badge: 'Module 1',
    },
    {
      id: 'digital-twin',
      name: 'Digital Twin',
      description: '8-Site Stadium Topology',
      icon: Radio,
      badge: 'Module 2',
    },
    {
      id: 'demand-capacity',
      name: 'Capacity Engine',
      description: 'Throughput & Spectral Needs',
      icon: Cpu,
      badge: 'Module 3',
    },
    {
      id: 'optimizer',
      name: 'Deployment Optimizer',
      description: 'COW & Small-Cell Placement',
      icon: Zap,
      badge: 'Module 4',
    },
    {
      id: 'simulator',
      name: 'What-If Simulator',
      description: 'Live Scenario Modeler',
      icon: Sliders,
      badge: 'Module 5',
    },
    {
      id: 'budget',
      name: 'Budget & Assets',
      description: '₹4 Cr Cap Optimizer',
      icon: DollarSign,
      badge: 'Module 6',
    },
    {
      id: 'connectivity',
      name: '5G Intelligence',
      description: 'EN-DC & Anchor Shield',
      icon: Wifi,
      badge: 'Module 7',
    },
    {
      id: 'critical-services',
      name: 'UPI & Emergency',
      description: 'QoS Slice Protection',
      icon: ShieldAlert,
      badge: 'Module 8',
    },
    {
      id: 'auth',
      name: 'Access & Security',
      description: 'JWT & RBAC Governance',
      icon: ShieldCheck,
      badge: 'Module 9',
    },
    {
      id: 'reports',
      name: 'Reports & Exports',
      description: 'Auditable PDF & CSVs',
      icon: FileText,
      badge: 'Module 10',
    },
    {
      id: 'evaluation',
      name: 'Evaluation Centre',
      description: 'Network Performance Audit',
      icon: Activity,
      badge: 'Evaluation',
    },
  ]

  const roleStyles = {
    NETWORK_ADMIN: {
      color: 'text-[#FF4D4D]',
      bg: 'bg-red-950/40 border-red-500/40 text-[#FF4D4D]',
      label: 'NETWORK_ADMIN',
      icon: Shield,
    },
    TELECOM_ENGINEER: {
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400',
      label: 'TELECOM_ENGINEER',
      icon: Wrench,
    },
    EXECUTIVE_VIEWER: {
      color: 'text-blue-400',
      bg: 'bg-blue-950/40 border-blue-500/40 text-blue-400',
      label: 'EXECUTIVE_VIEWER',
      icon: Eye,
    },
  }

  const currentRoleStyle = role ? roleStyles[role] : roleStyles.TELECOM_ENGINEER
  const RoleIcon = currentRoleStyle.icon

  return (
    <aside className="w-72 bg-[#0B0F19] border-r border-[#223050] flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#223050] flex items-center space-x-3 bg-[#131B2E]/40">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E40000] via-[#C00000] to-[#880000] flex items-center justify-center font-black text-xl text-white shadow-lg shadow-red-900/40 border border-red-500/30">
          360
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[#E40000] font-black tracking-wider text-base">AIRTEL</span>
            <span className="font-extrabold text-white text-base tracking-tight">STADIUM360</span>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-medium">
            <span>Predict</span>
            <span className="text-[#E40000]">•</span>
            <span>Optimize</span>
            <span className="text-[#E40000]">•</span>
            <span>Connect</span>
          </div>
        </div>
      </div>

      {/* Active Persona & Clearance Banner */}
      <div className="px-4 py-2.5 bg-[#131B2E]/80 border-b border-[#223050] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
            <UserCheck className="w-3 h-3 text-[#E40000]" />
            <span>Active Session</span>
          </span>
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${currentRoleStyle.bg} flex items-center gap-1`}>
            <RoleIcon className="w-2.5 h-2.5" />
            <span>{currentRoleStyle.label}</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-white font-semibold truncate max-w-[170px]">
            {user?.full_name || 'Loading user...'}
          </span>
          {permissions.isReadOnly ? (
            <span className="text-[9px] text-blue-400 font-mono font-semibold bg-blue-950/50 px-1.5 py-0.2 rounded border border-blue-500/30">
              Read-Only
            </span>
          ) : (
            <span className="text-[9px] text-emerald-400 font-mono font-semibold bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-500/30">
              Full Edit
            </span>
          )}
        </div>
      </div>

      {/* Navigation Modules */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          <span>Application Modules</span>
          {role === 'EXECUTIVE_VIEWER' && (
            <button
              onClick={() => setShowRestricted((prev) => !prev)}
              className="text-[10px] text-slate-400 hover:text-white transition-colors lowercase font-mono"
            >
              {showRestricted ? 'hide locked' : 'show locked'}
            </button>
          )}
        </div>

        {allMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentModule === item.id
          const hasAccess = canAccessModule(item.id)

          // If viewer chose to hide restricted modules, skip them
          if (!hasAccess && !showRestricted) {
            return null
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                if (hasAccess) {
                  onSelectModule(item.id)
                }
              }}
              disabled={!hasAccess}
              title={!hasAccess ? `Restricted to TELECOM_ENGINEER & NETWORK_ADMIN clearance` : item.name}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#E40000]/20 to-[#E40000]/5 text-white border border-[#E40000]/40 shadow-md shadow-red-950/50'
                  : !hasAccess
                  ? 'text-slate-500 cursor-not-allowed bg-slate-950/30 opacity-60 border border-transparent'
                  : 'text-slate-300 hover:bg-[#131B2E] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#E40000] text-white shadow-sm shadow-red-600'
                      : !hasAccess
                      ? 'bg-slate-900/60 text-slate-600'
                      : 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold tracking-tight">{item.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                {!hasAccess ? (
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-500 flex items-center space-x-1">
                    <Lock className="w-2.5 h-2.5 text-amber-500/70" />
                    <span>Locked</span>
                  </span>
                ) : (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#E40000]/20 border border-[#E40000]/40 text-[#FF4D4D]'
                      : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer System Telemetry Status & Session Exit */}
      <div className="p-3 border-t border-[#223050] bg-[#131B2E]/60 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 text-[10px]">
          <span>Security Clearance:</span>
          <span className={`font-mono font-bold ${currentRoleStyle.color}`}>{role || 'AUTHENTICATING'}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-[10px]">
          <span>Database Engine:</span>
          <span className="font-mono text-emerald-400 font-semibold">PostgreSQL (Neon)</span>
        </div>
        <button
          onClick={() => logout()}
          className="w-full mt-1 py-1.5 px-3 rounded-lg bg-red-950/20 hover:bg-red-950/50 border border-red-500/20 hover:border-red-500/40 text-red-400 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Session</span>
        </button>
      </div>
    </aside>
  )
}
