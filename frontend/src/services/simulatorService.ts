import { apiClient } from './api'
import {
  SimulationParams,
  SimulationResponse,
  ComparisonResponse,
  PresetScenario,
} from '../types/simulator'

export const simulatorService = {
  simulateScenario: async (params?: SimulationParams): Promise<SimulationResponse> => {
    const response = await apiClient.post<SimulationResponse>('/simulator/simulate', params || {})
    return response.data
  },

  compareScenarios: async (
    baseline: SimulationParams,
    simulated: SimulationParams
  ): Promise<ComparisonResponse> => {
    const response = await apiClient.post<ComparisonResponse>('/simulator/compare', {
      baseline,
      simulated,
    })
    return response.data
  },

  getPresets: async (): Promise<PresetScenario[]> => {
    const response = await apiClient.get<PresetScenario[]>('/simulator/presets')
    return response.data
  },
}
