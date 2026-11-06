/**
 * Airtel Stadium360 - Evaluation Service Client
 * Author: ByteForge | NIT Delhi
 * Communicates with backend /evaluation endpoints via unified apiClient.
 */
import { apiClient } from './api'
import {
  EvaluationOverviewResponse,
  NetworkUtilizationMetrics,
  ThroughputPerformanceMetrics,
  FiveGAccessibilityMetrics,
  UpiReliabilityMetrics,
  BackhaulPerformanceMetrics,
  FinancialEvaluationMetrics,
  EvaluationCompareRequest,
  EvaluationCompareResponse,
} from '../types/evaluation'

export const fetchEvaluationOverview = async (capacity: number = 100000): Promise<EvaluationOverviewResponse> => {
  const resp = await apiClient.get<EvaluationOverviewResponse>('/evaluation/overview', {
    params: { capacity },
  })
  return resp.data
}

export const fetchNetworkEvaluation = async (capacity: number = 100000): Promise<NetworkUtilizationMetrics> => {
  const resp = await apiClient.get<NetworkUtilizationMetrics>('/evaluation/network', {
    params: { capacity },
  })
  return resp.data
}

export const fetchThroughputEvaluation = async (capacity: number = 100000): Promise<ThroughputPerformanceMetrics> => {
  const resp = await apiClient.get<ThroughputPerformanceMetrics>('/evaluation/throughput', {
    params: { capacity },
  })
  return resp.data
}

export const fetchReliabilityEvaluation = async (capacity: number = 100000): Promise<UpiReliabilityMetrics> => {
  const resp = await apiClient.get<UpiReliabilityMetrics>('/evaluation/reliability', {
    params: { capacity },
  })
  return resp.data
}

export const fetchBackhaulEvaluation = async (): Promise<BackhaulPerformanceMetrics> => {
  const resp = await apiClient.get<BackhaulPerformanceMetrics>('/evaluation/backhaul')
  return resp.data
}

export const fetchFinancialEvaluation = async (capacity: number = 100000): Promise<FinancialEvaluationMetrics> => {
  const resp = await apiClient.get<FinancialEvaluationMetrics>('/evaluation/financial', {
    params: { capacity },
  })
  return resp.data
}

export const compareEvaluationScenarios = async (
  payload: EvaluationCompareRequest
): Promise<EvaluationCompareResponse> => {
  const resp = await apiClient.post<EvaluationCompareResponse>('/evaluation/compare', payload)
  return resp.data
}

export const evaluationService = {
  getOverview: fetchEvaluationOverview,
  getNetwork: fetchNetworkEvaluation,
  getThroughput: fetchThroughputEvaluation,
  getReliability: fetchReliabilityEvaluation,
  getBackhaul: fetchBackhaulEvaluation,
  getFinancial: fetchFinancialEvaluation,
  compareScenarios: compareEvaluationScenarios,
}

export default evaluationService
