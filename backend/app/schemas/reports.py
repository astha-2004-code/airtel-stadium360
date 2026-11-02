"""
Airtel Stadium360 - Reports & Exports Schemas
Pydantic models for downloadable executive reports, CSV datasets,
cryptographic audit trails, and scenario comparisons.
"""
from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class ReportMetadata(BaseModel):
    report_id: str = Field(..., description="Unique report code")
    title: str = Field(..., description="Document title")
    format: str = Field(..., description="PDF, CSV, or JSON")
    category: str = Field(..., description="Engineering, Financial, or Strategy")
    description: str = Field(..., description="Executive summary of contents")
    download_url: str = Field(..., description="API download endpoint")
    estimated_size_kb: int = Field(..., description="Approximate file size in KB")
    generated_at: str = Field(..., description="ISO timestamp")
    checksum_sha256: str = Field(..., description="Cryptographic integrity hash")


class ReportCatalogResponse(BaseModel):
    stadium_name: str = Field("Narendra Modi Stadium, Motera, Ahmedabad")
    match_event: str = Field("ICC Men's Cricket World Cup Final 2026")
    generated_by: str = Field("Airtel Stadium360 Autonomous Telemetry Engine")
    timestamp_ist: str = Field(...)
    reports: List[ReportMetadata] = Field(...)


class ReportExecutiveSummary(BaseModel):
    stadium_capacity: int
    airtel_spectators: int
    active_concurrent_users: int
    total_demand_gbps: float
    deployed_capacity_gbps: float
    peak_utilization_pct: float
    total_budget_spent_crores: float
    budget_limit_crores: float
    remaining_reserve_lakhs: float
    congested_sites_count: int
    five_g_camping_rate_pct: float
    upi_failure_rate_pct: float
    compliance_status: str
    audit_hash: str
