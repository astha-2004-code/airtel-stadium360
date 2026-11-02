"""
Airtel Stadium360 - Reports and Data Exports Endpoints
Exposes REST APIs for downloading audit-grade PDF documents and CSV datasets
representing network demand, site capacity, infrastructure BOM, and scenario comparisons.
"""
from fastapi import APIRouter, Query, Response
from app.schemas.reports import ReportCatalogResponse, ReportExecutiveSummary
from app.services.report_engine import report_engine

router = APIRouter()


@router.get("/catalog", response_model=ReportCatalogResponse)
def get_reports_catalog():
    """Returns metadata catalog of all downloadable audit reports with cryptographic checksums."""
    return report_engine.get_report_catalog()


@router.get("/summary", response_model=ReportExecutiveSummary)
def get_report_executive_summary(
    capacity: int = Query(100000, ge=10000, le=150000, description="Stadium crowd size"),
):
    """Returns high-level scorecard summary for report header cards."""
    return report_engine.get_executive_summary(capacity=capacity)


@router.get("/pdf/network-assessment")
def download_network_assessment_pdf(
    capacity: int = Query(100000, ge=10000, le=150000, description="Stadium crowd size"),
):
    """
    Downloads the official Airtel Stadium360 Technical Network Assessment Report in PDF format.
    Includes scorecard, 8-site matrix, ₹4 Cr BOM budget, and cryptographic audit certification.
    """
    pdf_bytes = report_engine.generate_network_assessment_pdf(capacity=capacity)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="Airtel_Stadium360_Network_Assessment_{capacity}.pdf"',
            "Content-Type": "application/pdf",
        },
    )


@router.get("/csv/site-capacity")
def download_site_capacity_csv(
    capacity: int = Query(100000, ge=10000, le=150000, description="Stadium crowd size"),
):
    """
    Downloads the 8-site capacity, azimuth orientation, PRB load, and backhaul dataset in CSV format.
    """
    csv_str = report_engine.generate_site_capacity_csv(capacity=capacity)
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="Airtel_Stadium360_Site_Capacity_Matrix_{capacity}.csv"',
            "Content-Type": "text/csv; charset=utf-8",
        },
    )


@router.get("/csv/infrastructure-bom")
def download_infrastructure_bom_csv():
    """
    Downloads the detailed Bill of Materials (BOM) asset catalog under the strict ₹4.00 Crore budget cap in CSV format.
    """
    csv_str = report_engine.generate_infrastructure_bom_csv()
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={
            "Content-Disposition": 'attachment; filename="Airtel_Stadium360_Infrastructure_BOM_4Cr.csv"',
            "Content-Type": "text/csv; charset=utf-8",
        },
    )


@router.get("/csv/scenario-comparison")
def download_scenario_comparison_csv():
    """
    Downloads multi-scenario strategy comparisons (65k baseline vs 100k Final vs 120k judicial surge) in CSV format.
    """
    csv_str = report_engine.generate_scenario_comparison_csv()
    return Response(
        content=csv_str,
        media_type="text/csv",
        headers={
            "Content-Disposition": 'attachment; filename="Airtel_Stadium360_Scenario_Comparison.csv"',
            "Content-Type": "text/csv; charset=utf-8",
        },
    )
