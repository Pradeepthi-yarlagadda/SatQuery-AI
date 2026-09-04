from fastapi import APIRouter, HTTPException
from backend.app.api.schemas.requests import TemporalRequest
from backend.app.api.schemas.responses import AnalysisResponse
from backend.app.api.routes.upload import UPLOADED_IMAGES
from backend.app.agent.controller import AgentController

router = APIRouter(prefix="/api/temporal", tags=["Temporal"])
controller = AgentController()


@router.post("", response_model=AnalysisResponse)
def run_temporal(req: TemporalRequest):
    img1 = UPLOADED_IMAGES.get(req.image_id_t1)
    img2 = UPLOADED_IMAGES.get(req.image_id_t2)

    if not img1 or not img2:
        raise HTTPException(status_code=400, detail="One or both temporal image IDs are invalid.")

    outcome = controller.process_query(req.query, [img1, img2], has_sar=False)
    if not outcome["success"]:
        raise HTTPException(status_code=422, detail=outcome.get("error", "Temporal analysis failed"))

    return outcome
