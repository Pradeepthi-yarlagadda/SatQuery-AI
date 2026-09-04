"""
Orbit-IQ / SatQuery AI - Production Backend Application
Problem Statement: SIH26167 | Organization: ISRO / SAC
"""

import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.routes import (
    health_router,
    upload_router,
    analysis_router,
    temporal_router,
    multimodal_router,
    report_router,
    projects_router,
)

app = FastAPI(
    title="Orbit-IQ Backend API",
    version="1.0.0",
    description="Agentic Vision-Language Assistant for Multimodal Remote Sensing (SIH26167)"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health_router)
app.include_router(upload_router)
app.include_router(analysis_router)
app.include_router(temporal_router)
app.include_router(multimodal_router)
app.include_router(report_router)
app.include_router(projects_router)


from backend.app.api.schemas.requests import ValidateRequest
from backend.app.agent.input_validator import AgentInputValidator
from backend.app.api.routes.upload import UPLOADED_IMAGES


@app.post("/v1/validate")
@app.post("/api/v1/validate")
def validate_inputs(req: ValidateRequest):
    payloads = [UPLOADED_IMAGES[iid] for iid in req.image_ids if iid in UPLOADED_IMAGES]
    return AgentInputValidator.validate(payloads, expected_task=req.task or "SINGLE_VQA")


@app.get("/v1/history")
@app.get("/api/v1/history")
def get_mission_history():
    return {
        "missions": [
            {
                "session_id": "session-01",
                "timestamp": "2026-09-03 10:20:00",
                "query": "Is there a water body present?",
                "task": "SINGLE_VQA",
                "confidence": 0.94
            },
            {
                "session_id": "session-02",
                "timestamp": "2026-09-03 11:45:00",
                "query": "What changed between these two dates?",
                "task": "CHANGE_DETECTION",
                "confidence": 0.96
            }
        ]
    }


import httpx
from fastapi import Request
from fastapi.responses import HTMLResponse, JSONResponse, Response

FRONTEND_URL = "http://127.0.0.1:3000"
proxy_client = httpx.AsyncClient(base_url=FRONTEND_URL, timeout=45.0)


async def _proxy_to_frontend(request: Request, path: str = ""):
    target_path = f"/{path.lstrip('/')}"
    query = request.url.query.encode("utf-8") if request.url.query else None
    url = httpx.URL(path=target_path, query=query)
    headers = dict(request.headers)
    headers.pop("host", None)
    headers["host"] = "127.0.0.1:3000"

    try:
        body = await request.body()
        req_proxy = proxy_client.build_request(
            request.method,
            url,
            headers=headers,
            content=body
        )
        resp_proxy = await proxy_client.send(req_proxy, stream=True)
        # aread() automatically decompresses gzip/deflate if needed
        content = await resp_proxy.aread()
        excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
        resp_headers = {
            k: v for k, v in resp_proxy.headers.items()
            if k.lower() not in excluded_headers
        }
        return Response(
            content=content,
            status_code=resp_proxy.status_code,
            headers=resp_headers,
            media_type=resp_proxy.headers.get("content-type")
        )
    except Exception as e:
        return HTMLResponse(
            f"""<!DOCTYPE html><html><body style="background:#030712;color:#f8fafc;font-family:sans-serif;padding:40px;text-align:center;">
            <h2>🛰️ Orbit-IQ Frontend Initializing...</h2>
            <p style="color:#94a3b8;">Connecting to local Next.js instance: {e}</p>
            <p>Please refresh this page in a few seconds.</p>
            </body></html>""",
            status_code=503
        )


@app.get("/")
async def root(request: Request):
    accept = request.headers.get("accept", "")
    # If opened directly in browser, render complete frontend UI
    if "text/html" in accept:
        return await _proxy_to_frontend(request, "")

    # For API test suites and programmatic clients, return system status JSON
    return {
        "system": "Orbit-IQ Geospatial AI",
        "organization": "ISRO / Space Applications Centre (SIH26167)",
        "status": "online",
        "docs": "/docs",
        "health": "/health",
        "frontend": "/",
        "supported_tasks": [
            "SINGLE_VQA",
            "SCENE_CAPTIONING",
            "REGION_GROUNDING",
            "CHANGE_DETECTION",
            "CHANGE_VQA",
            "CROSS_MODAL_FUSION"
        ]
    }


# Catch-all route to transparently serve Next.js assets, pages, and components on localhost:8000
@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
async def catchall_frontend(request: Request, full_path: str):
    return await _proxy_to_frontend(request, full_path)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)

