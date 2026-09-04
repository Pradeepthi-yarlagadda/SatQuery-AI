import os
import uuid
import json
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import FileResponse
from backend.app.api.schemas.requests import ReportRequest
from backend.app.api.schemas.responses import ReportResponse
from backend.app.reports.generator import IntelligenceReportGenerator
from backend.app.reports.pdf import PDFReportBuilder

router = APIRouter(tags=["Report"])

REPORT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "storage", "reports"))
os.makedirs(REPORT_DIR, exist_ok=True)

# In-memory registry for generated reports
GENERATED_REPORTS: Dict[str, Dict[str, Any]] = {}


@router.post("/api/report", response_model=ReportResponse)
@router.post("/api/reports/generate", response_model=ReportResponse)
@router.post("/v1/reports/generate", response_model=ReportResponse)
def export_report(req: ReportRequest):
    report_id = str(uuid.uuid4())
    fmt = req.format.lower().strip()
    
    mock_trace = {
        "analysis_id": req.analysis_id,
        "task": "REMOTE_SENSING_ANALYSIS",
        "latency_ms": 145.2,
        "result": {
            "answer": f"Analysis complete for mission session {req.analysis_id}. Multispectral indices calibrated.",
            "confidence": 0.93,
            "metrics": {
                "vegetation_cover_percent": 34.8,
                "builtup_cover_percent": 28.5,
                "water_cover_percent": 14.2
            }
        },
        "execution_trace": [
            {"step": "PARSING_INTENT", "timestamp": "00:00:01", "elapsed_ms": 12.1, "details": "Natural language query parsed"},
            {"step": "ROUTER_DISPATCH", "timestamp": "00:00:01", "elapsed_ms": 28.4, "details": "Dispatched to Remote Sensing Specialist"},
            {"step": "INPUT_VALIDATION", "timestamp": "00:00:01", "elapsed_ms": 42.0, "details": "CRS and bounds validated"},
            {"step": "EVIDENCE_SYNTHESIS", "timestamp": "00:00:02", "elapsed_ms": 145.2, "details": "Spatial evidence generated"}
        ]
    }

    if fmt == "pdf":
        file_name = f"{report_id}.pdf"
        file_path = os.path.join(REPORT_DIR, file_name)
        pdf_bytes = PDFReportBuilder.build_pdf_bytes(mock_trace)
        with open(file_path, "wb") as f:
            f.write(pdf_bytes)
        media_type = "application/pdf"
    elif fmt in ["md", "markdown"]:
        file_name = f"{report_id}.md"
        file_path = os.path.join(REPORT_DIR, file_name)
        content = IntelligenceReportGenerator.generate(mock_trace, fmt="markdown")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        media_type = "text/markdown"
    elif fmt in ["html", "htm"]:
        file_name = f"{report_id}.html"
        file_path = os.path.join(REPORT_DIR, file_name)
        content = IntelligenceReportGenerator.generate(mock_trace, fmt="html")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        media_type = "text/html"
    else:
        file_name = f"{report_id}.json"
        file_path = os.path.join(REPORT_DIR, file_name)
        content = IntelligenceReportGenerator.generate(mock_trace, fmt="json")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        media_type = "application/json"

    GENERATED_REPORTS[report_id] = {
        "report_id": report_id,
        "format": fmt,
        "path": file_path,
        "media_type": media_type,
        "filename": file_name,
        "analysis_id": req.analysis_id
    }

    return ReportResponse(
        report_id=report_id,
        format=fmt,
        download_url=f"/api/report/{report_id}/download",
        summary={"status": "GENERATED", "analysis_id": req.analysis_id, "format": fmt, "file": file_name}
    )


@router.get("/api/report/{report_id}/download")
@router.get("/api/reports/{report_id}/download")
def download_report(report_id: str):
    rep = GENERATED_REPORTS.get(report_id)
    if not rep or not os.path.exists(rep["path"]):
        # Check disk directly
        for ext, m_type in [("pdf", "application/pdf"), ("html", "text/html"), ("md", "text/markdown"), ("json", "application/json")]:
            candidate = os.path.join(REPORT_DIR, f"{report_id}.{ext}")
            if os.path.exists(candidate):
                return FileResponse(candidate, media_type=m_type, filename=f"orbit_iq_report_{report_id}.{ext}")
        raise HTTPException(status_code=404, detail="Report not found or has expired.")

    return FileResponse(rep["path"], media_type=rep["media_type"], filename=rep["filename"])


@router.get("/api/report/{report_id}")
def get_report_metadata(report_id: str):
    rep = GENERATED_REPORTS.get(report_id)
    if not rep:
        raise HTTPException(status_code=404, detail="Report metadata not found.")
    return {
        "report_id": report_id,
        "format": rep["format"],
        "filename": rep["filename"],
        "download_url": f"/api/report/{report_id}/download",
        "status": "READY"
    }
