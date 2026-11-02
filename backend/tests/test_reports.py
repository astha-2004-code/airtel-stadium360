"""
Unit and Integration Tests for Module 10: Reporting and Data Exports
Verifies network assessment PDF generation, site capacity CSV exports,
infrastructure BOM reconciliation, scenario comparisons, and download endpoints.
"""
import pytest
from app.services.report_engine import report_engine
from app.api.v1.endpoints.reports import (
    get_reports_catalog,
    get_report_executive_summary,
    download_network_assessment_pdf,
    download_site_capacity_csv,
    download_infrastructure_bom_csv,
    download_scenario_comparison_csv,
)


def test_generate_network_assessment_pdf():
    pdf_bytes = report_engine.generate_network_assessment_pdf(capacity=100000)
    assert isinstance(pdf_bytes, bytes)
    # Valid PDF magic bytes
    assert pdf_bytes.startswith(b"%PDF-")
    assert len(pdf_bytes) > 5000  # Multi-page, formatted audit document


def test_generate_site_capacity_csv():
    csv_str = report_engine.generate_site_capacity_csv(capacity=100000)
    assert isinstance(csv_str, str)
    assert "Site_ID" in csv_str
    assert "Pre_Intervention_4G_PRB_Load_Pct" in csv_str
    assert "Post_Intervention_Utilization_Pct" in csv_str
    # Verify all 8 sites are exported
    for site_id in ["M1", "M2", "M3", "M4", "M5", "M6", "S1", "S2"]:
        assert site_id in csv_str


def test_generate_infrastructure_bom_csv():
    csv_str = report_engine.generate_infrastructure_bom_csv()
    assert isinstance(csv_str, str)
    assert "Cell on Wheels" in csv_str
    assert "Small Cell" in csv_str
    assert "Dark Fibre" in csv_str
    assert "Total Budget Limit (INR Crores),4.0" in csv_str
    assert "Total Expenditure Committed (INR Crores),3.975" in csv_str
    assert "SATISFIED" in csv_str


def test_generate_scenario_comparison_csv():
    csv_str = report_engine.generate_scenario_comparison_csv()
    assert isinstance(csv_str, str)
    assert "Historical Match Benchmark (Baseline)" in csv_str
    assert "Airtel Stadium360 Balanced (Recommended)" in csv_str
    assert "Judicial Stress Test (120k Crowd Surge)" in csv_str
    assert "100000" in csv_str
    assert "120000" in csv_str


def test_report_catalog():
    catalog = report_engine.get_report_catalog()
    assert len(catalog.reports) == 4
    report_ids = [r.report_id for r in catalog.reports]
    assert "REP-PDF-01" in report_ids
    assert "REP-CSV-02" in report_ids
    assert "REP-CSV-03" in report_ids
    assert "REP-CSV-04" in report_ids

    for r in catalog.reports:
        assert len(r.checksum_sha256) > 10
        assert r.download_url.startswith("/api/v1/reports")


def test_report_executive_summary():
    summary = report_engine.get_executive_summary(capacity=100000)
    assert summary.stadium_capacity == 100000
    assert summary.airtel_spectators == 40000
    assert summary.active_concurrent_users == 7200
    assert summary.peak_utilization_pct <= 80.0
    assert summary.total_budget_spent_crores == 3.975
    assert summary.budget_limit_crores == 4.0
    assert summary.congested_sites_count == 0
    assert summary.compliance_status == "FULLY_COMPLIANT_WITH_CAP"


def test_reports_api_endpoints_direct():
    # Catalog
    cat = get_reports_catalog()
    assert len(cat.reports) == 4

    # Summary
    summ = get_report_executive_summary(capacity=100000)
    assert summ.compliance_status == "FULLY_COMPLIANT_WITH_CAP"

    # PDF Download Response
    resp_pdf = download_network_assessment_pdf(capacity=100000)
    assert resp_pdf.media_type == "application/pdf"
    assert resp_pdf.body.startswith(b"%PDF-")

    # CSV Site Download Response
    resp_sites = download_site_capacity_csv(capacity=100000)
    assert resp_sites.media_type == "text/csv"
    assert "S1" in resp_sites.body.decode("utf-8")

    # CSV BOM Download Response
    resp_bom = download_infrastructure_bom_csv()
    assert resp_bom.media_type == "text/csv"
    assert "3.975" in resp_bom.body.decode("utf-8")

    # CSV Scenario Download Response
    resp_scenarios = download_scenario_comparison_csv()
    assert resp_scenarios.media_type == "text/csv"
    assert "Judicial Stress Test" in resp_scenarios.body.decode("utf-8")
