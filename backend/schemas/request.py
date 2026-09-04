"""
SatQuery AI - Backend Request Schemas
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class QueryRequest(BaseModel):
    query: str = Field(..., description="Natural language remote-sensing question", json_schema_extra={"example": "Has the built-up area increased?"})
    image_ids: Optional[List[str]] = Field(default=[], description="List of uploaded image IDs")
    override_task: Optional[str] = Field(default=None, description="Explicit task override if desired")

class AnalysisRequest(BaseModel):
    task: str = Field(..., description="Analysis task: vqa, captioning, grounding, change_detection, optical_sar")
    image_ids: List[str] = Field(..., min_length=1)
    parameters: Optional[Dict[str, Any]] = Field(default={})

class ReportRequest(BaseModel):
    analysis_id: str
    format: str = Field(default="json", description="Export format: json, markdown, html")
