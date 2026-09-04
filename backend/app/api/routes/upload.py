import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.app.api.schemas.responses import UploadResponse
from backend.app.remote_sensing.geotiff import GeoTIFFHandler

router = APIRouter(tags=["Upload"])

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "storage", "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

# In-memory registry for uploaded images
UPLOADED_IMAGES = {}


@router.get("/api/upload")
def list_uploaded_rasters():
    return [
        {
            "image_id": k,
            "filename": v.get("filename"),
            "crs": v.get("metadata", {}).get("crs", "EPSG:4326"),
            "width": v.get("metadata", {}).get("width", 512),
            "height": v.get("metadata", {}).get("height", 512),
            "count": v.get("metadata", {}).get("count", 3)
        }
        for k, v in UPLOADED_IMAGES.items()
    ]


@router.post("/api/upload", response_model=UploadResponse)
@router.post("/v1/storage/upload", response_model=UploadResponse)
@router.post("/api/v1/storage/upload", response_model=UploadResponse)
async def upload_raster(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Invalid filename.")

    image_id = str(uuid.uuid4())
    save_path = os.path.join(UPLOAD_DIR, f"{image_id}_{file.filename}")

    try:
        with open(save_path, "wb") as buf:
            shutil.copyfileobj(file.file, buf)

        tensor, meta = GeoTIFFHandler.read_raster(save_path)
        UPLOADED_IMAGES[image_id] = {
            "path": save_path,
            "filename": file.filename,
            "tensor": tensor,
            "metadata": meta
        }

        return UploadResponse(
            image_id=image_id,
            filename=file.filename,
            crs=meta.get("crs", "EPSG:4326"),
            width=meta.get("width", 512),
            height=meta.get("height", 512),
            count=meta.get("count", 3),
            driver=meta.get("driver", "GTiff"),
            bounds=meta.get("bounds", {"left": 0.0, "bottom": 0.0, "right": 1.0, "top": 1.0})
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process raster: {str(e)}")
