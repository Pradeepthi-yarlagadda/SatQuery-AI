"""
SatQuery AI - Image Upload API Endpoint
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.services.image_service import ImageService
from backend.schemas.response import UploadResponse

router = APIRouter(prefix="/api/upload", tags=["Upload"])

@router.post("", response_model=UploadResponse)
async def upload_satellite_image(file: UploadFile = File(...)):
    """Ingests GeoTIFF, PNG, or JPEG satellite imagery."""
    try:
        contents = await file.read()
        image_id = ImageService.save_image(contents, file.filename)
        geo_img = ImageService.get_image(image_id)

        return UploadResponse(
            image_id=image_id,
            filename=file.filename,
            width=geo_img.width,
            height=geo_img.height,
            channels=geo_img.channels,
            sensor_type=geo_img.sensor_type.value
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process satellite image: {str(e)}")
