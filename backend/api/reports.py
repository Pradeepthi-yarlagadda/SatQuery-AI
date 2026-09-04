"""
SatQuery AI - Reports API Endpoint
"""

from fastapi import APIRouter, Response
from backend.schemas.request import ReportRequest
from backend.services.report_service import ReportService

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.post("")
async def export_audit_report(req: ReportRequest):
    """Exports structured audit trace report."""
    content = ReportService.generate_report({"analysis_id": req.analysis_id}, fmt=req.format)
    media_type = "application/json" if req.format == "json" else "text/markdown"
    return Response(content=content, media_type=media_type)
