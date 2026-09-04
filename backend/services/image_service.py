"""
SatQuery AI - Image Storage Service
"""

from typing import Dict, Optional, List
import uuid
import numpy as np
from satquery.core.geo_processor import GeoImage

class ImageService:
    """Manages in-memory and disk session imagery for the API."""

    _store: Dict[str, GeoImage] = {}

    @classmethod
    def save_image(cls, file_bytes: bytes, filename: str) -> str:
        image_id = str(uuid.uuid4())
        geo_img = GeoImage.from_source(file_bytes, filename=filename)
        cls._store[image_id] = geo_img
        return image_id

    @classmethod
    def get_image(cls, image_id: str) -> Optional[GeoImage]:
        return cls._store.get(image_id)

    @classmethod
    def get_images(cls, image_ids: List[str]) -> List[GeoImage]:
        return [cls._store[iid] for iid in image_ids if iid in cls._store]
