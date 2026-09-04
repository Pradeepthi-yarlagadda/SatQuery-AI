"""
SatQuery AI - Task Analysis API Endpoint
"""

from fastapi import APIRouter, HTTPException
from backend.schemas.request import AnalysisRequest
from backend.services.image_service import ImageService
from backend.services.agent_service import AgentService

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])

@router.post("")
async def execute_task_analysis(req: AnalysisRequest):
    """Executes a direct specialist analysis task."""
    images = ImageService.get_images(req.image_ids)
    if not images:
        raise HTTPException(status_code=400, detail="Provided image_ids are invalid.")

    # Synthesize prompt based on task
    prompt_map = {
        "vqa": "Analyze objects and land cover in this scene.",
        "captioning": "Describe this satellite image in detail.",
        "grounding": "Highlight water and infrastructure regions.",
        "change_detection": "What changed between these two dates?",
        "optical_sar": "Use both optical and SAR to verify structures through clouds."
    }
    query = prompt_map.get(req.task, "Analyze satellite scene.")
    return AgentService.process_query(images, query)
