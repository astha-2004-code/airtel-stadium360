/**
 * Airtel Stadium360 - Reporting & Data Exports Service
 * Communicates with backend /reports endpoints.
 */
import { apiClient } from './api'
import { ReportCatalogResponse, ReportExecutiveSummary } from '../types/reports'

export const fetchReportCatalog = async (): Promise<ReportCatalogResponse> => {
  const resp = await apiClient.get<ReportCatalogResponse>('/reports/catalog')
  return resp.data
}

export const fetchReportExecutiveSummary = async (capacity: number = 100000): Promise<ReportExecutiveSummary> => {
  const resp = await apiClient.get<ReportExecutiveSummary>('/reports/summary', {
    params: { capacity },
  })
  return resp.data
}

export const downloadReportFile = async (downloadUrl: string, defaultFilename: string): Promise<void> => {
  const resp = await apiClient.get(downloadUrl, {
    responseType: 'blob',
  })

  // Extract filename from header if present
  let filename = defaultFilename
  const disposition = resp.headers['content-disposition']
  if (disposition && disposition.indexOf('filename=') !== -1) {
    const matches = /filename="?([^"]+)"?/.exec(disposition)
    if (matches && matches[1]) {
      filename = matches[1]
    }
  }

  // Trigger browser download
  const blob = new Blob([resp.data], { type: resp.headers['content-type'] })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
