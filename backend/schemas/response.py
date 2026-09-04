"""
SatQuery AI - Backend Response Schemas
"""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    active_tools: List[str]

class QueryResponse(BaseModel):
    success: bool
    answer: str
    task: str
    confidence: float
    benchmark: str
    metrics: Dict[str, Any]
    trace: Dict[str, Any]
    trace_markdown: str

class UploadResponse(BaseModel):
    image_id: str
    filename: str
    width: int
    height: int
    channels: int
    sensor_type: str
    preview_url: Optional[str] = None
