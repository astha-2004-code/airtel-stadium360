import { apiClient } from './api'
import {
  DemandCalculationParams,
  DemandCalculationResponse,
  SiteCapacityBreakdown,
  SpectralEfficiencyResponse,
  MatchPhaseForecastItem,
  CapacityGapSummary,
} from '../types/analytics'

export const analyticsService = {
  getDemandCalculation: async (params?: DemandCalculationParams): Promise<DemandCalculationResponse> => {
    const response = await apiClient.get<DemandCalculationResponse>('/analytics/calculate', {
      params,
    })
    return response.data
  },

  postDemandCalculation: async (payload: DemandCalculationParams): Promise<DemandCalculationResponse> => {
    const response = await apiClient.post<DemandCalculationResponse>('/analytics/calculate', payload)
    return response.data
  },

  getSiteCapacityBreakdown: async (params?: DemandCalculationParams): Promise<SiteCapacityBreakdown[]> => {
    const response = await apiClient.get<SiteCapacityBreakdown[]>('/analytics/site-capacity-breakdown', {
      params,
    })
    return response.data
  },

  getSpectralEfficiency: async (): Promise<SpectralEfficiencyResponse> => {
    const response = await apiClient.get<SpectralEfficiencyResponse>('/analytics/spectral-efficiency')
    return response.data
  },

  getMatchPhaseForecast: async (params?: DemandCalculationParams): Promise<MatchPhaseForecastItem[]> => {
    const response = await apiClient.get<MatchPhaseForecastItem[]>('/analytics/match-phase-forecast', {
      params,
    })
    return response.data
  },

  getCapacityGapSummary: async (params?: DemandCalculationParams): Promise<CapacityGapSummary> => {
    const response = await apiClient.get<CapacityGapSummary>('/analytics/capacity-gap-analysis', {
      params,
    })
    return response.data
  },
}
