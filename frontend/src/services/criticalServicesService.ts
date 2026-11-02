/**
 * Airtel Stadium360 - Critical Services & UPI Protection Service
 * API client communicating with backend /api/v1/critical-services endpoints.
 */
import axios from 'axios'
import {
  UpiReliabilityKpis,
  QosSliceDefinition,
  PaymentHopLatency,
  SiteUpiTelemetry,
  CongestionResponsePolicy,
  CriticalServicesSimulationRequest,
  CriticalServicesSimulationResponse,
} from '../types/criticalServices'

const API_BASE = '/api/v1/critical-services'

export const fetchUpiReliability = async (capacity: number = 100000): Promise<UpiReliabilityKpis> => {
  const resp = await axios.get<UpiReliabilityKpis>(`${API_BASE}/upi-reliability`, {
    params: { capacity },
  })
  return resp.data
}

export const fetchQosSlices = async (): Promise<QosSliceDefinition[]> => {
  const resp = await axios.get<QosSliceDefinition[]>(`${API_BASE}/qos-slices`)
  return resp.data
}

export const fetchPaymentHopLatencies = async (): Promise<PaymentHopLatency[]> => {
  const resp = await axios.get<PaymentHopLatency[]>(`${API_BASE}/payment-hop-latencies`)
  return resp.data
}

export const fetchSiteUpiTelemetry = async (): Promise<SiteUpiTelemetry[]> => {
  const resp = await axios.get<SiteUpiTelemetry[]>(`${API_BASE}/site-telemetry`)
  return resp.data
}

export const fetchCongestionPolicies = async (): Promise<CongestionResponsePolicy[]> => {
  const resp = await axios.get<CongestionResponsePolicy[]>(`${API_BASE}/congestion-policies`)
  return resp.data
}

export const simulateCriticalServices = async (
  payload: CriticalServicesSimulationRequest
): Promise<CriticalServicesSimulationResponse> => {
  const resp = await axios.post<CriticalServicesSimulationResponse>(`${API_BASE}/simulate`, payload)
  return resp.data
}
