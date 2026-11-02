import React from 'react'
import { Sparkles, Trophy, Users, Wifi, CloudRain, DollarSign } from 'lucide-react'
import { PresetScenario, SimulationParams } from '../../types/simulator'

interface ScenarioPresetsBarProps {
  presets: PresetScenario[]
  activePresetId: string | null
  onSelectPreset: (preset: PresetScenario) => void
}

export const ScenarioPresetsBar: React.FC<ScenarioPresetsBarProps> = ({
  presets,
  activePresetId,
  onSelectPreset,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'world-cup-baseline':
        return Trophy
      case 'super-crowd-120k':
        return Users
      case 'ipl-high-5g':
        return Wifi
      case 'rain-delay-extreme':
        return CloudRain
      case 'budget-constrained':
        return DollarSign
      default:
        return Sparkles
    }
  }

  return (
    <div className="card-gradient rounded-2xl border border-[#223050] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#FF4D4D]" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Rapid Scenario Bench (One-Click Presets)
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Instant Judicial Stress Testing
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {presets.map((preset) => {
          const Icon = getIcon(preset.id)
          const isSelected = activePresetId === preset.id

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 group ${
                isSelected
                  ? 'bg-gradient-to-r from-[#E40000]/25 to-[#E40000]/10 border-[#E40000] shadow-md shadow-red-950/40 text-white'
                  : 'bg-[#0B0F19]/60 border-[#223050] hover:border-slate-600 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`p-1.5 rounded-lg ${
                    isSelected ? 'bg-[#E40000] text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {preset.id === 'super-crowd-120k' && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 font-mono">
                    Judge Demo
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold leading-snug">{preset.name}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                  {preset.description}
                </p>
              </div>

              <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5 flex justify-between">
                <span>{preset.params.capacity?.toLocaleString()} fans</span>
                <span className="text-[#FF4D4D] font-bold">{(preset.params.peak_online_pct! * 100).toFixed(0)}% online</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

