/**
 * Airtel Stadium360 - Critical Services & UPI Protection Service
 * API client communicating with backend /critical-services endpoints.
 */
import { apiClient } from './api'
import {
  UpiReliabilityKpis,
  QosSliceDefinition,
  PaymentHopLatency,
  SiteUpiTelemetry,
  CongestionResponsePolicy,
  CriticalServicesSimulationRequest,
  CriticalServicesSimulationResponse,
} from '../types/criticalServices'

export const fetchUpiReliability = async (capacity: number = 100000): Promise<UpiReliabilityKpis> => {
  const resp = await apiClient.get<UpiReliabilityKpis>('/critical-services/upi-reliability', {
    params: { capacity },
  })
  return resp.data
}

export const fetchQosSlices = async (): Promise<QosSliceDefinition[]> => {
  const resp = await apiClient.get<QosSliceDefinition[]>('/critical-services/qos-slices')
  return resp.data
}

export const fetchPaymentHopLatencies = async (): Promise<PaymentHopLatency[]> => {
  const resp = await apiClient.get<PaymentHopLatency[]>('/critical-services/payment-hop-latencies')
  return resp.data
}

export const fetchSiteUpiTelemetry = async (): Promise<SiteUpiTelemetry[]> => {
  const resp = await apiClient.get<SiteUpiTelemetry[]>('/critical-services/site-telemetry')
  return resp.data
}

export const fetchCongestionPolicies = async (): Promise<CongestionResponsePolicy[]> => {
  const resp = await apiClient.get<CongestionResponsePolicy[]>('/critical-services/congestion-policies')
  return resp.data
}

export const simulateCriticalServices = async (
  payload: CriticalServicesSimulationRequest
): Promise<CriticalServicesSimulationResponse> => {
  const resp = await apiClient.post<CriticalServicesSimulationResponse>('/critical-services/simulate', payload)
  return resp.data
}
