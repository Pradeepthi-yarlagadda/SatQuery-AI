from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    query: Optional[str] = Field(default="Analyze remote sensing scene", description="Natural language prompt / question", json_schema_extra={"example": "What land cover is visible?"})
    image_ids: Optional[List[str]] = Field(default_factory=list, description="Uploaded raster IDs")
    inputs: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Frontend ImageInput descriptors")
    id: Optional[str] = Field(default=None, description="Request ID from frontend")
    mode: Optional[str] = Field(default="single", description="Analysis mode: single, temporal, multimodal, auto")
    targetRegion: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Optional algorithm parameters")
    has_sar: Optional[bool] = Field(default=False, description="Flag indicating SAR raster presence")
    task: Optional[str] = Field(default=None, description="Optional task override")


class TemporalRequest(BaseModel):
    query: Optional[str] = Field(default="What changed between these dates?", description="Temporal analysis query")
    image_id_t1: str = Field(..., description="Pre-event image ID")
    image_id_t2: str = Field(..., description="Post-event image ID")
    difference_threshold: Optional[float] = Field(default=0.15, description="Differencing sensitivity")


class MultimodalRequest(BaseModel):
    query: Optional[str] = Field(default="Fuse optical and SAR imagery", description="Cross-modal query")
    optical_image_id: str = Field(..., description="Optical scene ID")
    sar_image_id: str = Field(..., description="SAR scene ID")
    window_size: Optional[int] = Field(default=5, description="Lee filter window size")


class ReportRequest(BaseModel):
    analysis_id: str
    format: str = Field(default="json", description="Export format: json, markdown, html, pdf")


class CaptioningRequest(BaseModel):
    image_id: str = Field(..., description="Target raster ID for scene description")
    query: Optional[str] = Field(default="Describe the scene and land cover distribution", description="Prompt")


class GroundingRequest(BaseModel):
    image_id: str = Field(..., description="Target raster ID for localization")
    query: str = Field(..., description="Target feature to locate (e.g. runway, river, industrial plant)")


class ValidateRequest(BaseModel):
    image_ids: List[str] = Field(..., description="Rasters to validate")
    task: Optional[str] = Field(default="SINGLE_VQA", description="Target analysis task")


class ProjectCreateRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    aoi_coordinates: Optional[List[List[float]]] = None
