export interface ReportMetadata {
  report_id: string;
  title: string;
  format: 'PDF' | 'CSV' | 'JSON' | string;
  category: 'Engineering' | 'Financial' | 'Strategy' | string;
  description: string;
  download_url: string;
  estimated_size_kb: number;
  generated_at: string;
  checksum_sha256: string;
}

export interface ReportCatalogResponse {
  stadium_name: string;
  match_event: string;
  generated_by: string;
  timestamp_ist: string;
  reports: ReportMetadata[];
}

export interface ReportExecutiveSummary {
  stadium_capacity: number;
  airtel_spectators: number;
  active_concurrent_users: number;
  total_demand_gbps: number;
  deployed_capacity_gbps: number;
  peak_utilization_pct: number;
  total_budget_spent_crores: number;
  budget_limit_crores: number;
  remaining_reserve_lakhs: number;
  congested_sites_count: number;
  five_g_camping_rate_pct: number;
  upi_failure_rate_pct: number;
  compliance_status: string;
  audit_hash: string;
}
