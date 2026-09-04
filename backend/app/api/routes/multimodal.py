from fastapi import APIRouter, HTTPException
from backend.app.api.schemas.requests import MultimodalRequest
from backend.app.api.schemas.responses import AnalysisResponse
from backend.app.api.routes.upload import UPLOADED_IMAGES
from backend.app.agent.controller import AgentController

router = APIRouter(prefix="/api/multimodal", tags=["Multimodal"])
controller = AgentController()


@router.post("", response_model=AnalysisResponse)
def run_multimodal(req: MultimodalRequest):
    opt = UPLOADED_IMAGES.get(req.optical_image_id)
    sar = UPLOADED_IMAGES.get(req.sar_image_id)

    if not opt or not sar:
        raise HTTPException(status_code=400, detail="One or both multimodal image IDs are invalid.")

    outcome = controller.process_query(req.query, [opt, sar], has_sar=True)
    if not outcome["success"]:
        raise HTTPException(status_code=422, detail=outcome.get("error", "Multimodal fusion failed"))

    return outcome
