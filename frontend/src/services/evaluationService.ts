/**
 * Airtel Stadium360 - Evaluation Service Client
 * Author: ByteForge | NIT Delhi
 * Communicates with backend /api/v1/evaluation and /api/evaluation endpoints.
 */
import axios from 'axios'
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

const API_BASE = '/api/v1/evaluation'

export const fetchEvaluationOverview = async (capacity: number = 100000): Promise<EvaluationOverviewResponse> => {
  const resp = await axios.get<EvaluationOverviewResponse>(`${API_BASE}/overview`, {
    params: { capacity },
  })
  return resp.data
}

export const fetchNetworkEvaluation = async (capacity: number = 100000): Promise<NetworkUtilizationMetrics> => {
  const resp = await axios.get<NetworkUtilizationMetrics>(`${API_BASE}/network`, {
    params: { capacity },
  })
  return resp.data
}

export const fetchThroughputEvaluation = async (capacity: number = 100000): Promise<ThroughputPerformanceMetrics> => {
  const resp = await axios.get<ThroughputPerformanceMetrics>(`${API_BASE}/throughput`, {
    params: { capacity },
  })
  return resp.data
}

export const fetchReliabilityEvaluation = async (capacity: number = 100000): Promise<UpiReliabilityMetrics> => {
  const resp = await axios.get<UpiReliabilityMetrics>(`${API_BASE}/reliability`, {
    params: { capacity },
  })
  return resp.data
}

export const fetchBackhaulEvaluation = async (): Promise<BackhaulPerformanceMetrics> => {
  const resp = await axios.get<BackhaulPerformanceMetrics>(`${API_BASE}/backhaul`)
  return resp.data
}

export const fetchFinancialEvaluation = async (capacity: number = 100000): Promise<FinancialEvaluationMetrics> => {
  const resp = await axios.get<FinancialEvaluationMetrics>(`${API_BASE}/financial`, {
    params: { capacity },
  })
  return resp.data
}

export const compareEvaluationScenarios = async (
  payload: EvaluationCompareRequest
): Promise<EvaluationCompareResponse> => {
  const resp = await axios.post<EvaluationCompareResponse>(`${API_BASE}/compare`, payload)
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

