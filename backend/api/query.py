"""
SatQuery AI - Query API Endpoint
"""

from fastapi import APIRouter, HTTPException
from backend.schemas.request import QueryRequest
from backend.schemas.response import QueryResponse
from backend.services.image_service import ImageService
from backend.services.agent_service import AgentService

router = APIRouter(prefix="/api/query", tags=["Query"])

@router.post("", response_model=QueryResponse)
async def process_satellite_query(req: QueryRequest):
    """Processes natural language remote-sensing question through SatQuery Agent."""
    images = ImageService.get_images(req.image_ids)
    if not images:
        raise HTTPException(status_code=400, detail="No valid images found for provided image_ids.")

    result = AgentService.process_query(images, req.query)
    if not result["success"]:
        raise HTTPException(status_code=422, detail=result["answer"])

    return QueryResponse(
        success=result["success"],
        answer=result["answer"],
        task=result["task"],
        confidence=result["confidence"],
        benchmark=result.get("benchmark", "Standard"),
        metrics=result.get("metrics", {}),
        trace=result["trace"],
        trace_markdown=result["trace_markdown"]
    )
