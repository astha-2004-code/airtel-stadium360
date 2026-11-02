import { apiClient } from './api'
import {
  BudgetAllocationParams,
  BudgetSummaryResponse,
  CostEffectivenessResponse,
  AssetItem,
  TimelineMilestone,
} from '../types/budget'

export const budgetService = {
  getBudgetSummary: async (params?: BudgetAllocationParams): Promise<BudgetSummaryResponse> => {
    const response = await apiClient.get<BudgetSummaryResponse>('/budget/summary', {
      params,
    })
    return response.data
  },

  getCostEffectiveness: async (params?: BudgetAllocationParams): Promise<CostEffectivenessResponse> => {
    const response = await apiClient.get<CostEffectivenessResponse>('/budget/cost-effectiveness', {
      params,
    })
    return response.data
  },

  getAssets: async (): Promise<AssetItem[]> => {
    const response = await apiClient.get<AssetItem[]>('/budget/assets')
    return response.data
  },

  getTimeline: async (): Promise<TimelineMilestone[]> => {
    const response = await apiClient.get<TimelineMilestone[]>('/budget/timeline')
    return response.data
  },

  allocateBudget: async (payload: BudgetAllocationParams): Promise<BudgetSummaryResponse> => {
    const response = await apiClient.post<BudgetSummaryResponse>('/budget/allocate', payload)
    return response.data
  },
}

