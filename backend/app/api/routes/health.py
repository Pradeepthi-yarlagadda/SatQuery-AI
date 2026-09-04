from fastapi import APIRouter
from backend.app.api.schemas.responses import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def get_health():
    return HealthResponse(
        status="online",
        system="Orbit-IQ / SatQuery AI",
        version="1.0.0",
        crs_engine="GDAL/Rasterio Active",
        active_tools=[
            "SINGLE_VQA",
            "SCENE_CAPTIONING",
            "REGION_GROUNDING",
            "CHANGE_DETECTION",
            "CHANGE_VQA",
            "CROSS_MODAL_FUSION"
        ]
    )

@router.get("/api/health", response_model=HealthResponse)
def get_api_health():
    return get_health()
