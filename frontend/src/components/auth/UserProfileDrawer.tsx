import React, { useState } from 'react'
import {
  X,
  User,
  Shield,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  Clock,
  LogOut,
  Edit2,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface UserProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
  onOpenSwitchAccount: () => void
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSwitchAccount,
}) => {
  const { user, logout, updateUserProfile } = useAuth()

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [fullName, setFullName] = useState<string>(user?.full_name || '')
  const [department, setDepartment] = useState<string>(user?.department || '')
  const [phone, setPhone] = useState<string>(user?.phone || '')
  const [isSaving, setIsSaving] = useState<boolean>(false)

  if (!isOpen || !user) return null

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateUserProfile({
        full_name: fullName,
        department,
        phone,
      })
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const roleBadgeColor =
    user.role === 'NETWORK_ADMIN'
      ? 'bg-red-500/20 text-[#E40000] border-red-500/30'
      : user.role === 'TELECOM_ENGINEER'
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : 'bg-blue-500/20 text-blue-400 border-blue-500/30'

  const permissions =
    user.role === 'NETWORK_ADMIN'
      ? [
          'Full ₹4.00 Crore CapEx/OpEx Budget Reallocation',
          'Macro Site & Small Cell Infrastructure Provisioning',
          '3GPP 5QI QoS Slice Pre-emption Governance',
          'Live Carrier Parameter Push & OSS Scripts',
          'User Management & Security Access Control',
        ]
      : user.role === 'TELECOM_ENGINEER'
      ? [
          '64T64R Massive MIMO 3D Beam Steering Optimization',
          'EN-DC Anchor Shield & PRB Slicing Configuration',
          'Real-Time What-If Capacity Recalculation',
          'Multi-Sector Latency Waterfall Telemetry',
        ]
      : [
          'Read-Only Command Centre & Executive KPIs',
          'Live Digital Twin Stadium Sector Inspection',
          'Auditable Financial & Network Reports Export',
        ]

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B0F19] border-l border-[#223050] w-full max-w-md h-full flex flex-col shadow-2xl p-6 overflow-y-auto space-y-6">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E40000]" />
            <h3 className="text-base font-bold text-white">Airtel Corporate Identity</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card Hero */}
        <div className="p-5 rounded-2xl bg-[#131B2E] border border-[#223050] space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E40000] to-red-900 flex items-center justify-center font-black text-xl text-white shadow-lg border border-red-500/30">
                {user.full_name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{user.full_name}</h4>
                <p className="text-xs text-slate-400 font-mono">{user.email}</p>
                <div className="mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block ${roleBadgeColor}`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsEditing(!isEditing)
                setFullName(user.full_name)
                setDepartment(user.department)
                setPhone(user.phone || '')
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Edit Profile"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-300 bg-[#0B0F19]/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <span>{user.department}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Member since: {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Edit Form if enabled */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="p-4 rounded-xl bg-[#131B2E] border border-blue-500/30 space-y-3 text-xs">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Edit2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit Profile Details</span>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E40000]"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E40000]"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E40000]"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-1.5 rounded-lg bg-[#E40000] text-white font-bold"
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Assigned Operational Privileges */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#E40000]" />
              Role Authorization Privileges
            </span>
            <span className="text-[10px] text-slate-400 font-mono">RBAC Tier 1</span>
          </div>

          <div className="space-y-2">
            {permissions.map((p, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800 flex items-center space-x-2 text-xs text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              onClose()
              onOpenSwitchAccount()
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Switch Evaluator Persona</span>
          </button>

          <button
            onClick={async () => {
              await logout()
              onClose()
            }}
            className="w-full py-2.5 rounded-xl bg-red-950/20 border border-red-500/30 text-[#E40000] text-xs font-bold hover:bg-red-950/40 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>End Corporate Session</span>
          </button>
        </div>
      </div>
    </div>
  )
}
