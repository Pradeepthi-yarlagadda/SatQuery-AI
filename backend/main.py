import os
import shutil
import tempfile
from typing import List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from preprocessing.geotiff.reader import GeoTIFFReader
from agents.execution_engine.executor import AgentExecutor

app = FastAPI(
    title="SatQuery AI Backend",
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

executor = AgentExecutor()


class AnalysisResponse(BaseModel):
    success: bool
    task: str
    result: dict
    execution_trace: list
    latency_ms: float


@app.get("/health")
def health_check():
    return {"status": "online", "system": "SatQuery AI", "crs_engine": "GDAL/Rasterio Active"}


@app.get("/api/health")
def api_health_check():
    return {"status": "healthy", "service": "SatQuery AI Backend", "version": "1.0.0", "active_tools": ["SINGLE_VQA", "REGION_GROUNDING", "CHANGE_VQA", "CROSS_MODAL_FUSION"]}


@app.get("/")
def root():
    return {
        "message": "Welcome to SatQuery AI Backend API (SIH26167)",
        "docs": "/docs",
        "health": "/health"
    }


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_query(
    query: str = Form(...),
    has_sar: bool = Form(False),
    files: List[UploadFile] = File(...)
):
    if not files:
        raise HTTPException(status_code=400, detail="At least one GeoTIFF raster must be uploaded.")

    temp_dir = tempfile.mkdtemp()
    image_payloads = []

    try:
        for file in files:
            file_path = os.path.join(temp_dir, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Ingest raster and extract spatial metadata
            tensor, meta = GeoTIFFReader.read_raster(file_path)
            image_payloads.append({
                "filename": file.filename,
                "tensor": tensor,
                "metadata": meta
            })

        # Run agentic workflow
        outcome = executor.run(query=query, image_payloads=image_payloads, has_sar=has_sar)

        if not outcome["success"]:
            raise HTTPException(status_code=422, detail=outcome["error"])

        return outcome

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
