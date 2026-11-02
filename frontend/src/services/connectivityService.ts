/**
 * Airtel Stadium360 - 5G Connectivity Intelligence Service
 * API client communicating with backend /api/v1/connectivity endpoints.
 */
import axios from 'axios'
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

const API_BASE = '/api/v1/connectivity'

export const fetchConnectivityOverview = async (capacity: number = 100000): Promise<ConnectivityKpis> => {
  const resp = await axios.get<ConnectivityKpis>(`${API_BASE}/overview`, {
    params: { capacity },
  })
  return resp.data
}

export const fetchEndcArchitecture = async (): Promise<EndcArchitecture> => {
  const resp = await axios.get<EndcArchitecture>(`${API_BASE}/endc`)
  return resp.data
}

export const fetchBeamformingSectors = async (): Promise<MassiveMimoSector[]> => {
  const resp = await axios.get<MassiveMimoSector[]>(`${API_BASE}/beamforming`)
  return resp.data
}

export const fetchCoverageTiers = async (): Promise<CoverageTier[]> => {
  const resp = await axios.get<CoverageTier[]>(`${API_BASE}/coverage-tiers`)
  return resp.data
}

export const fetchFallbackAnalysis = async (): Promise<FallbackRootCause[]> => {
  const resp = await axios.get<FallbackRootCause[]>(`${API_BASE}/fallback-analysis`)
  return resp.data
}

export const fetchRrmRecommendations = async (): Promise<RrmRecommendation[]> => {
  const resp = await axios.get<RrmRecommendation[]>(`${API_BASE}/rrm-recommendations`)
  return resp.data
}

export const simulateConnectivity = async (
  payload: ConnectivitySimulationRequest
): Promise<ConnectivitySimulationResponse> => {
  const resp = await axios.post<ConnectivitySimulationResponse>(`${API_BASE}/simulate`, payload)
  return resp.data
}

