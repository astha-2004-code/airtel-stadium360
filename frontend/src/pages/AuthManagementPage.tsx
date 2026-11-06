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
  Eye,
  Wrench,
  XCircle,
  RefreshCw,
  Search,
  Power,
  Ban,
  Check,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { DemoAccount, User as UserType, UserRole } from '../types/auth'
import { getDemoAccounts, listUsers, updateUserRole, updateUserStatus } from '../services/authService'
import { AuthModal } from '../components/auth/AuthModal'

export const AuthManagementPage: React.FC = () => {
  const { user, token, role, logout, quickSwitchDemo, permissions } = useAuth()
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([])
  const [systemUsers, setSystemUsers] = useState<UserType[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'personas' | 'token' | 'rbac' | 'users'>('overview')
  const [roleUpdateMsg, setRoleUpdateMsg] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

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

  // Load system users if admin
  useEffect(() => {
    if (permissions.canManageUsers && activeTab === 'users') {
      const fetchUsers = async () => {
        setIsLoadingUsers(true)
        try {
          const users = await listUsers()
          setSystemUsers(users)
        } catch (err) {
          console.error('Failed to load system users:', err)
        } finally {
          setIsLoadingUsers(false)
        }
      }
      fetchUsers()
    }
  }, [permissions.canManageUsers, activeTab])

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    try {
      const updated = await updateUserRole(userId, newRole)
      setSystemUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)))
      setRoleUpdateMsg(`Successfully updated ${updated.full_name}'s role to ${newRole}`)
      setTimeout(() => setRoleUpdateMsg(null), 4000)
    } catch (err: any) {
      setRoleUpdateMsg(err?.response?.data?.detail || 'Failed to update user role.')
      setTimeout(() => setRoleUpdateMsg(null), 4000)
    }
  }

  const handleStatusToggle = async (targetUser: UserType) => {
    try {
      const updated = await updateUserStatus(targetUser.id, !targetUser.is_active)
      setSystemUsers((prev) => prev.map((u) => (u.id === targetUser.id ? updated : u)))
      setRoleUpdateMsg(
        `Account for ${updated.full_name} is now ${updated.is_active ? 'ACTIVE' : 'DEACTIVATED'}`
      )
      setTimeout(() => setRoleUpdateMsg(null), 4000)
    } catch (err: any) {
      setRoleUpdateMsg(err?.response?.data?.detail || 'Failed to update user status.')
      setTimeout(() => setRoleUpdateMsg(null), 4000)
    }
  }

  const activeAdminCount = systemUsers.filter(
    (u) => u.role === 'NETWORK_ADMIN' && u.is_active
  ).length

  const filteredUsers = systemUsers.filter((u) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && u.is_active) ||
      (statusFilter === 'INACTIVE' && !u.is_active)
    return matchesSearch && matchesRole && matchesStatus
  })

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
    NETWORK_ADMIN: 'bg-red-500/10 text-[#FF4D4D] border-red-500/30',
    TELECOM_ENGINEER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    EXECUTIVE_VIEWER: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  }

  // Complete 11-module + operational capabilities RBAC Matrix data
  const rbacMatrixItems = [
    {
      category: 'Application Modules',
      capability: 'M1: Command Centre (Live Network Overview)',
      admin: 'Full Access (Live)',
      engineer: 'Full Access (Live)',
      viewer: 'Read-Only Access',
      viewerRestricted: false,
    },
    {
      category: 'Application Modules',
      capability: 'M2: Digital Twin (8-Site Stadium Topology)',
      admin: 'Full Access (Live)',
      engineer: 'Full Access (Live)',
      viewer: 'Read-Only Access',
      viewerRestricted: false,
    },
    {
      category: 'Application Modules',
      capability: 'M3: Capacity Engine & Spectral Analysis',
      admin: 'Full Access (Live)',
      engineer: 'Full Access (Live)',
      viewer: 'Read-Only (Fixed SLA)',
      viewerRestricted: false,
    },
    {
      category: 'Application Modules',
      capability: 'M4: Deployment Optimizer (SciPy MILP)',
      admin: 'Full Solver & Dispatch',
      engineer: 'Full Solver Tuning',
      viewer: 'Restricted (Locked)',
      viewerRestricted: true,
    },
    {
      category: 'Application Modules',
      capability: 'M5: What-If Live Scenario Simulator',
      admin: 'Full 10-Step Cascade',
      engineer: 'Full 10-Step Cascade',
      viewer: 'Restricted (Locked)',
      viewerRestricted: true,
    },
    {
      category: 'Application Modules',
      capability: 'M6: Budget & Asset Allocator (₹4 Cr Cap)',
      admin: 'Full Approval & Commit',
      engineer: 'Simulation Only',
      viewer: 'Restricted (Locked)',
      viewerRestricted: true,
    },
    {
      category: 'Application Modules',
      capability: 'M7: 5G Intelligence & Anchor Shield',
      admin: 'Full Beam & RRM',
      engineer: 'Full Beam & RRM',
      viewer: 'Restricted (Locked)',
      viewerRestricted: true,
    },
    {
      category: 'Application Modules',
      capability: 'M8: Critical Services & UPI QoS Slicing',
      admin: 'Full Slice Pre-emption',
      engineer: 'Full Slice Tuning',
      viewer: 'Restricted (Locked)',
      viewerRestricted: true,
    },
    {
      category: 'Application Modules',
      capability: 'M9: Identity, RBAC & JWT Security',
      admin: 'Full User Management',
      engineer: 'Self Profile & Inspector',
      viewer: 'Self Profile & Inspector',
      viewerRestricted: false,
    },
    {
      category: 'Application Modules',
      capability: 'M10: Reports & Export Engine',
      admin: 'All PDF & CSV Exports',
      engineer: 'All PDF & CSV Exports',
      viewer: 'Download Permitted Reports',
      viewerRestricted: false,
    },
    {
      category: 'Application Modules',
      capability: 'Evaluation Centre (Audit Scorecard)',
      admin: 'Full Audit Analysis',
      engineer: 'Full Technical Audit',
      viewer: 'Read-Only KPI Audit',
      viewerRestricted: false,
    },
    {
      category: 'Governance Operations',
      capability: 'User Provisioning & Role Re-assignment',
      admin: 'Authorized (Admin Only)',
      engineer: 'Restricted (HTTP 403)',
      viewer: 'Restricted (HTTP 403)',
      viewerRestricted: true,
    },
    {
      category: 'Governance Operations',
      capability: '₹4.00 Crore Budget Cap Final Approval',
      admin: 'Authorized (Admin Only)',
      engineer: 'Restricted (HTTP 403)',
      viewer: 'Restricted (HTTP 403)',
      viewerRestricted: true,
    },
    {
      category: 'Governance Operations',
      capability: 'Live HetNet Dispatch & COW Re-allocation',
      admin: 'Authorized',
      engineer: 'Authorized',
      viewer: 'Restricted (HTTP 403)',
      viewerRestricted: true,
    },
    {
      category: 'Governance Operations',
      capability: 'Cryptographic SHA-256 PDF Audit Certification',
      admin: 'Generate & Sign',
      engineer: 'Generate & Sign',
      viewer: 'Verify & Download',
      viewerRestricted: false,
    },
  ]

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
              onClick={() => setActiveTab('rbac')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'rbac' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              RBAC Matrix
            </button>
            <button
              onClick={() => setActiveTab('token')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'token' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              JWT Inspector
            </button>
            {permissions.canManageUsers && (
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'users' ? 'bg-[#E40000] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>User Management</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {roleUpdateMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{roleUpdateMsg}</span>
        </div>
      )}

      {/* Tab: Active Session Overview */}
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
                  {user.is_superuser ? 'Superuser Tier 1 (Full Operational Authority)' : `${user.role} Clearance`}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Permissions State</div>
                <div className="text-xs font-bold text-white">
                  {permissions.isReadOnly ? 'Read-Only Mode' : 'Read & Write Mode'}
                </div>
              </div>
            </div>

            {/* Granular Permission Checklist */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Permission Checklist
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${
                  permissions.canManageUsers ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  {permissions.canManageUsers ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                  <span>Manage Users</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${
                  permissions.canApproveBudgets ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  {permissions.canApproveBudgets ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                  <span>Approve Budget</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${
                  permissions.canModifyNetworkConfig ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  {permissions.canModifyNetworkConfig ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                  <span>Modify HetNet Config</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${
                  permissions.canExecuteSimulations ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  {permissions.canExecuteSimulations ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                  <span>Run Simulations</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${
                  permissions.canRunOptimizer ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  {permissions.canRunOptimizer ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                  <span>Run MILP Solver</span>
                </div>
                <div className="p-2 rounded-lg border bg-emerald-950/20 border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Reports</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Security Status */}
          <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Enterprise Guardrails</span>
              </div>
              <h4 className="text-sm font-bold text-white">Cryptographically Signed RBAC</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tokens are signed via HMAC-SHA256 with role claims validated on every backend REST request.
                Unauthorized endpoints return HTTP 403 Forbidden.
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
                <span className="text-slate-400">Password Encryption:</span>
                <span className="font-mono font-bold text-white">Bcrypt (12 Rounds)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">RBAC Enforcement:</span>
                <span className="font-mono font-bold text-emerald-400">FastAPI Dependencies</span>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="w-full py-2.5 rounded-xl bg-red-950/20 border border-red-500/30 text-[#FF4D4D] text-xs font-bold hover:bg-red-950/40 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Terminate Session</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab: Judge Personas */}
      {activeTab === 'personas' && (
        <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white">Evaluation Personas for Competition Judges</h3>
            <p className="text-xs text-slate-400">
              One-click instant role switching to verify RBAC permissions across the entire platform
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
                          <CheckCircle2 className="w-3 h-3" /> Active Session
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
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
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

      {/* Tab: Comprehensive RBAC Matrix */}
      {activeTab === 'rbac' && (
        <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Role-Based Access Control (RBAC) Matrix</span>
              </h3>
              <p className="text-xs text-slate-400">
                End-to-end matrix showing permissions across all 11 modules and administrative operations.
                The highlighted column reflects your active persona.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Your Active Role:</span>
              <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border ${role ? roleColors[role] : ''}`}>
                {role || 'NONE'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-mono">
                  <th className="py-3 px-4 w-2/5">Capability / Module</th>
                  <th className={`py-3 px-3 text-center transition-colors ${role === 'NETWORK_ADMIN' ? 'bg-red-950/40 text-red-200 border-x border-red-500/30' : ''}`}>
                    <div className="font-bold">NETWORK_ADMIN</div>
                    <div className="text-[10px] text-slate-400 font-normal">Sunil Varma</div>
                    {role !== 'NETWORK_ADMIN' && (
                      <button
                        onClick={() => quickSwitchDemo('admin@airtel.com')}
                        className="mt-1.5 px-2 py-0.5 rounded bg-red-900/40 hover:bg-red-800 text-red-200 text-[10px] font-semibold transition-colors"
                      >
                        Switch Role
                      </button>
                    )}
                    {role === 'NETWORK_ADMIN' && (
                      <span className="mt-1.5 inline-block px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold">
                        ★ Active Clearance
                      </span>
                    )}
                  </th>
                  <th className={`py-3 px-3 text-center transition-colors ${role === 'TELECOM_ENGINEER' ? 'bg-emerald-950/40 text-emerald-200 border-x border-emerald-500/30' : ''}`}>
                    <div className="font-bold">TELECOM_ENGINEER</div>
                    <div className="text-[10px] text-slate-400 font-normal">Priya Sharma</div>
                    {role !== 'TELECOM_ENGINEER' && (
                      <button
                        onClick={() => quickSwitchDemo('engineer@airtel.com')}
                        className="mt-1.5 px-2 py-0.5 rounded bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 text-[10px] font-semibold transition-colors"
                      >
                        Switch Role
                      </button>
                    )}
                    {role === 'TELECOM_ENGINEER' && (
                      <span className="mt-1.5 inline-block px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                        ★ Active Clearance
                      </span>
                    )}
                  </th>
                  <th className={`py-3 px-3 text-center transition-colors ${role === 'EXECUTIVE_VIEWER' ? 'bg-blue-950/40 text-blue-200 border-x border-blue-500/30' : ''}`}>
                    <div className="font-bold">EXECUTIVE_VIEWER</div>
                    <div className="text-[10px] text-slate-400 font-normal">BCCI Stadium Observer</div>
                    {role !== 'EXECUTIVE_VIEWER' && (
                      <button
                        onClick={() => quickSwitchDemo('viewer@airtel.com')}
                        className="mt-1.5 px-2 py-0.5 rounded bg-blue-900/40 hover:bg-blue-800 text-blue-200 text-[10px] font-semibold transition-colors"
                      >
                        Switch Role
                      </button>
                    )}
                    {role === 'EXECUTIVE_VIEWER' && (
                      <span className="mt-1.5 inline-block px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                        ★ Active Clearance
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {rbacMatrixItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-4 text-white">
                      <div className="font-semibold">{item.capability}</div>
                      <div className="text-[10px] text-slate-500">{item.category}</div>
                    </td>
                    <td className={`py-2.5 px-3 text-center font-bold text-emerald-400 ${role === 'NETWORK_ADMIN' ? 'bg-red-950/20 border-x border-red-500/30' : ''}`}>
                      ✓ {item.admin}
                    </td>
                    <td className={`py-2.5 px-3 text-center ${
                      item.engineer.includes('Restricted')
                        ? 'text-red-400'
                        : item.engineer.includes('Simulation')
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    } ${role === 'TELECOM_ENGINEER' ? 'bg-emerald-950/20 border-x border-emerald-500/30' : ''}`}>
                      {item.engineer.includes('Restricted') ? '✕ ' : '✓ '}
                      {item.engineer}
                    </td>
                    <td className={`py-2.5 px-3 text-center ${
                      item.viewerRestricted
                        ? 'text-slate-500 font-normal'
                        : 'text-blue-400 font-semibold'
                    } ${role === 'EXECUTIVE_VIEWER' ? 'bg-blue-950/20 border-x border-blue-500/30' : ''}`}>
                      {item.viewerRestricted ? '✕ ' : '✓ '}
                      {item.viewer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: User Management (Admin Only) */}
      {activeTab === 'users' && (
        <>
          {permissions.canManageUsers ? (
            <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#FF4D4D]" />
                    <span>Enterprise User & Role Governance</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Administrator console to search, promote, deactivate, and govern registered users across Airtel Stadium360.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    setIsLoadingUsers(true)
                    try {
                      const users = await listUsers()
                      setSystemUsers(users)
                    } finally {
                      setIsLoadingUsers(false)
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                  <span>Refresh Users</span>
                </button>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                {/* Search Input */}
                <div className="sm:col-span-6 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users by name, email, or department..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                {/* Role Filter */}
                <div className="sm:col-span-3">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                  >
                    <option value="ALL">All Roles ({systemUsers.length})</option>
                    <option value="NETWORK_ADMIN">NETWORK_ADMIN</option>
                    <option value="TELECOM_ENGINEER">TELECOM_ENGINEER</option>
                    <option value="EXECUTIVE_VIEWER">EXECUTIVE_VIEWER</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="sm:col-span-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                  >
                    <option value="ALL">All Account Statuses</option>
                    <option value="ACTIVE">Active Accounts</option>
                    <option value="INACTIVE">Deactivated Accounts</option>
                  </select>
                </div>
              </div>

              {/* Status Message */}
              {roleUpdateMsg && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{roleUpdateMsg}</span>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-mono">
                      <th className="py-3 px-4">User Identity</th>
                      <th className="py-3 px-3">Organization / Dept</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Active Role</th>
                      <th className="py-3 px-3">Reassign Role</th>
                      <th className="py-3 px-3 text-right">Account Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                          No users found matching query filters.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isSoleAdmin =
                          u.role === 'NETWORK_ADMIN' && u.is_active && activeAdminCount <= 1

                        return (
                          <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                                  {u.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-white flex items-center gap-1.5">
                                    <span>{u.full_name}</span>
                                    {u.is_superuser && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-500/30">
                                        Superuser
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] font-mono text-slate-400">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-300">{u.department}</td>
                            <td className="py-3 px-3">
                              {u.is_active ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/40 text-[#FF4D4D] border border-red-500/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                  Deactivated
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${roleColors[u.role]}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <select
                                value={u.role}
                                disabled={isSoleAdmin}
                                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                                title={isSoleAdmin ? 'Cannot demote the sole active Network Administrator' : 'Assign role'}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="NETWORK_ADMIN">NETWORK_ADMIN</option>
                                <option value="TELECOM_ENGINEER">TELECOM_ENGINEER</option>
                                <option value="EXECUTIVE_VIEWER">EXECUTIVE_VIEWER</option>
                              </select>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                disabled={isSoleAdmin}
                                onClick={() => handleStatusToggle(u)}
                                title={
                                  isSoleAdmin
                                    ? 'Cannot deactivate the sole active Network Administrator'
                                    : u.is_active
                                    ? 'Deactivate account'
                                    : 'Activate account'
                                }
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                                  u.is_active
                                    ? 'bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-500/30'
                                    : 'bg-emerald-950/30 hover:bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                <Power className="w-3 h-3" />
                                <span>{u.is_active ? 'Deactivate' : 'Activate'}</span>
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#131B2E] border border-red-500/30 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-950/40 border border-red-500/40 text-[#FF4D4D] flex items-center justify-center mx-auto">
                <Shield className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Administrator Access Required</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  User management, account activation, and role assignments are strictly restricted to{' '}
                  <span className="font-bold text-red-400 font-mono">NETWORK_ADMIN</span> clearance.
                </p>
              </div>
              <button
                onClick={() => quickSwitchDemo('admin@airtel.com')}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
              >
                Switch to Network Admin Persona
              </button>
            </div>
          )}
        </>
      )}

      {/* Tab: Token Inspector */}
      {activeTab === 'token' && (
        <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-[#FF4D4D]" />
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}
