/**
 * Airtel Stadium360 - 5G Connectivity Intelligence Service
 * API client communicating with backend /connectivity endpoints.
 */
import { apiClient } from './api'
import {
  ConnectivityKpis,
  EndcArchitecture,
  MassiveMimoSector,
  CoverageTier,
  FallbackRootCause,
  RrmRecommendation,
  ConnectivitySimulationRequest,
  ConnectivitySimulationResponse,
} from '../types/connectivity'

export const fetchConnectivityOverview = async (capacity: number = 100000): Promise<ConnectivityKpis> => {
  const resp = await apiClient.get<ConnectivityKpis>('/connectivity/overview', {
    params: { capacity },
  })
  return resp.data
}

export const fetchEndcArchitecture = async (): Promise<EndcArchitecture> => {
  const resp = await apiClient.get<EndcArchitecture>('/connectivity/endc')
  return resp.data
}

export const fetchBeamformingSectors = async (): Promise<MassiveMimoSector[]> => {
  const resp = await apiClient.get<MassiveMimoSector[]>('/connectivity/beamforming')
  return resp.data
}

export const fetchCoverageTiers = async (): Promise<CoverageTier[]> => {
  const resp = await apiClient.get<CoverageTier[]>('/connectivity/coverage-tiers')
  return resp.data
}

export const fetchFallbackAnalysis = async (): Promise<FallbackRootCause[]> => {
  const resp = await apiClient.get<FallbackRootCause[]>('/connectivity/fallback-analysis')
  return resp.data
}

export const fetchRrmRecommendations = async (): Promise<RrmRecommendation[]> => {
  const resp = await apiClient.get<RrmRecommendation[]>('/connectivity/rrm-recommendations')
  return resp.data
}

export const simulateConnectivity = async (
  payload: ConnectivitySimulationRequest
): Promise<ConnectivitySimulationResponse> => {
  const resp = await apiClient.post<ConnectivitySimulationResponse>('/connectivity/simulate', payload)
  return resp.data
}
