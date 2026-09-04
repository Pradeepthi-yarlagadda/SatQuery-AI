from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    system: str
    version: str
    crs_engine: str
    active_tools: List[str]


class UploadResponse(BaseModel):
    image_id: str
    filename: str
    crs: str
    width: int
    height: int
    count: int
    driver: str
    bounds: Dict[str, float]


class AnalysisResponse(BaseModel):
    success: bool = True
    task: str
    result: Dict[str, Any] = {}
    execution_trace: List[Dict[str, Any]] = []
    latency_ms: float = 0.0

    # Frontend AnalysisResult Contract Fields
    id: Optional[str] = None
    requestId: Optional[str] = None
    taskDisplayName: Optional[str] = None
    specialistId: Optional[str] = None
    specialistDisplayName: Optional[str] = None
    query: Optional[str] = None
    answer: Optional[str] = None
    summary: Optional[str] = None
    keyFindings: Optional[List[str]] = []
    confidence: Optional[Dict[str, Any]] = None
    evidence: Optional[Dict[str, Any]] = None
    executionTrace: Optional[List[Dict[str, Any]]] = []
    inputs: Optional[List[Dict[str, Any]]] = []
    completedAt: Optional[str] = None
    executionDurationMs: Optional[int] = None


class ReportResponse(BaseModel):
    report_id: str
    format: str
    download_url: str
    summary: Dict[str, Any]


class ProjectResponse(BaseModel):
    project_id: str
    name: str
    description: str
    created_at: str
