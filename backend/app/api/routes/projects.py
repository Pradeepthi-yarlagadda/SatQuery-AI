import uuid
import time
from typing import List
from fastapi import APIRouter
from backend.app.api.schemas.requests import ProjectCreateRequest
from backend.app.api.schemas.responses import ProjectResponse

router = APIRouter(prefix="/api/projects", tags=["Projects"])

_PROJECTS: List[ProjectResponse] = [
    ProjectResponse(
        project_id="proj-delhi-ncr",
        name="Delhi NCR Urban Expansion Monitoring",
        description="Bi-temporal Cartosat & Sentinel-2 analysis tracking built-up infrastructure growth along suburban corridors.",
        created_at="2026-08-15 10:30:00"
    ),
    ProjectResponse(
        project_id="proj-brahmaputra",
        name="Brahmaputra Flood Risk Inundation",
        description="All-weather RISAT-1A microwave radar backscatter mapping for monsoon flood boundary delineation.",
        created_at="2026-08-20 14:15:00"
    ),
    ProjectResponse(
        project_id="proj-western-ghats",
        name="Western Ghats Forest Canopy Health",
        description="Dense vegetation NDVI proxy and multi-temporal deforestation detection over biodiversity hotspots.",
        created_at="2026-09-01 09:45:00"
    )
]


@router.get("", response_model=List[ProjectResponse])
@router.get("/", response_model=List[ProjectResponse])
def list_projects():
    return _PROJECTS


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str):
    for p in _PROJECTS:
        if p.project_id == project_id:
            return p
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Project not found.")


@router.post("", response_model=ProjectResponse)
@router.post("/", response_model=ProjectResponse)
def create_project(req: ProjectCreateRequest):
    p = ProjectResponse(
        project_id=str(uuid.uuid4()),
        name=req.name,
        description=req.description or "",
        created_at=time.strftime("%Y-%m-%d %H:%M:%S")
    )
    _PROJECTS.append(p)
    return p


@router.delete("/{project_id}")
def delete_project(project_id: str):
    global _PROJECTS
    initial_len = len(_PROJECTS)
    _PROJECTS = [p for p in _PROJECTS if p.project_id != project_id]
    if len(_PROJECTS) == initial_len:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Project not found.")
    return {"deleted": True, "project_id": project_id}
