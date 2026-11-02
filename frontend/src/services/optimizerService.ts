import { apiClient } from './api'
import {
  OptimizationParams,
  OptimizationResponse,
  SiteIntervention,
  CostBreakdownLakhs,
} from '../types/optimizer'

export const optimizerService = {
  getRecommendedOptimization: async (params?: OptimizationParams): Promise<OptimizationResponse> => {
    const response = await apiClient.get<OptimizationResponse>('/optimizer/recommended', {
      params,
    })
    return response.data
  },

  postCustomOptimization: async (payload: OptimizationParams): Promise<OptimizationResponse> => {
    const response = await apiClient.post<OptimizationResponse>('/optimizer/optimize', payload)
    return response.data
  },

  getSiteRecommendations: async (params?: OptimizationParams): Promise<SiteIntervention[]> => {
    const response = await apiClient.get<SiteIntervention[]>('/optimizer/site-recommendations', {
      params,
    })
    return response.data
  },

  getCostBreakdown: async (params?: OptimizationParams): Promise<CostBreakdownLakhs> => {
    const response = await apiClient.get<CostBreakdownLakhs>('/optimizer/cost-breakdown', {
      params,
    })
    return response.data
  },
}

