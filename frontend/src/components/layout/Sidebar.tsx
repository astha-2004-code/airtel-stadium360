import React from 'react'
import {
  LayoutDashboard,
  Radio,
  Cpu,
  Zap,
  Sliders,
  DollarSign,
  Wifi,
  ShieldAlert,
  FileText,
  Settings,
  Lock,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

interface SidebarProps {
  currentModule: string
  onSelectModule: (module: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentModule, onSelectModule }) => {
  const menuItems = [
    {
      id: 'dashboard',
      name: 'Command Centre',
      description: 'Executive Network Overview',
      icon: LayoutDashboard,
      status: 'active',
      badge: 'Module 1',
    },
    {
      id: 'digital-twin',
      name: 'Digital Twin',
      description: '8-Site Stadium Topology',
      icon: Radio,
      status: 'active',
      badge: 'Module 2',
    },
    {
      id: 'demand-capacity',
      name: 'Capacity Engine',
      description: 'Throughput & Spectral Needs',
      icon: Cpu,
      status: 'active',
      badge: 'Module 3',
    },
    {
      id: 'optimizer',
      name: 'Deployment Optimizer',
      description: 'COW & Small-Cell Placement',
      icon: Zap,
      status: 'active',
      badge: 'Module 4',
    },
    {
      id: 'simulator',
      name: 'What-If Simulator',
      description: 'Live Scenario Modeler',
      icon: Sliders,
      status: 'active',
      badge: 'Module 5',
    },
    {
      id: 'budget',
      name: 'Budget & Assets',
      description: '₹4 Cr Cap Optimizer',
      icon: DollarSign,
      status: 'active',
      badge: 'Module 6',
    },
    {
      id: 'connectivity',
      name: '5G Intelligence',
      description: 'EN-DC & Anchor Shield',
      icon: Wifi,
      status: 'locked',
      badge: 'Module 7',
    },
    {
      id: 'critical-services',
      name: 'UPI & Emergency',
      description: 'QoS Slice Protection',
      icon: ShieldAlert,
      status: 'locked',
      badge: 'Module 8',
    },
    {
      id: 'reports',
      name: 'Reports & Exports',
      description: 'Auditable PDF & CSVs',
      icon: FileText,
      status: 'locked',
      badge: 'Module 10',
    },
  ]

  return (
    <aside className="w-72 bg-[#0B0F19] border-r border-[#223050] flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#223050] flex items-center space-x-3 bg-[#131B2E]/40">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E40000] via-[#C00000] to-[#880000] flex items-center justify-center font-black text-xl text-white shadow-lg shadow-red-900/40 border border-red-500/30">
          360
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[#E40000] font-black tracking-wider text-lg">AIRTEL</span>
            <span className="font-extrabold text-white text-lg tracking-tight">STADIUM360</span>
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-medium">
            <span>Predict</span>
            <span className="text-[#E40000]">•</span>
            <span>Optimize</span>
            <span className="text-[#E40000]">•</span>
            <span>Connect</span>
          </div>
        </div>
      </div>

      {/* Competition & Version Pill */}
      <div className="px-5 py-3 bg-red-950/20 border-b border-red-900/30 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-[#E40000]" />
          <span className="text-red-300 font-medium tracking-wide">Airtel SYNC 2026</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/50 text-red-200 font-mono font-bold">
          v1.0-M6
        </span>
      </div>

      {/* Navigation Modules */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          Application Modules
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentModule === item.id
          const isLocked = item.status === 'locked'

          return (
            <button
              key={item.id}
              onClick={() => {
                if (!isLocked) {
                  onSelectModule(item.id)
                }
              }}
              disabled={isLocked}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#E40000]/20 to-[#E40000]/5 text-white border border-[#E40000]/40 shadow-md shadow-red-950/50'
                  : isLocked
                  ? 'text-slate-500 cursor-not-allowed hover:bg-slate-900/40 opacity-70'
                  : 'text-slate-300 hover:bg-[#131B2E] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#E40000] text-white shadow-sm shadow-red-600'
                      : isLocked
                      ? 'bg-slate-900/80 text-slate-600'
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
                {isLocked ? (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-500 flex items-center space-x-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>{item.badge}</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E40000]/20 border border-[#E40000]/40 text-[#FF4D4D]">
                    Active
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer System Telemetry Status */}
      <div className="p-4 border-t border-[#223050] bg-[#131B2E]/60 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Database Engine:</span>
          <span className="font-mono text-emerald-400 font-semibold">PostgreSQL (Neon)</span>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>FastAPI Backend:</span>
          <span className="font-mono text-emerald-400 font-semibold">Port 8000 (Live)</span>
        </div>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80">
          <span>Digital Twin Sites:</span>
          <span className="text-white font-mono font-bold">8 Sites Loaded</span>
        </div>
      </div>
    </aside>
  )
}
