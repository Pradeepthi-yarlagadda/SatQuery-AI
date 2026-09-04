"""
SatQuery AI - Text Grounding Inference Pipeline
"""

from typing import Dict, Any, Union
from PIL import Image
import numpy as np
from satquery.core.geo_processor import GeoImage
from models.grounding.model import RegionGroundingModel

class GroundingInferencePipeline:
    """End-to-end inference service for text-guided region grounding."""

    def __init__(self, weights_path: str = None):
        self.model = RegionGroundingModel(weights_path=weights_path)

    def predict(self, image: Union[GeoImage, np.ndarray, Image.Image], query: str) -> Dict[str, Any]:
        if not isinstance(image, GeoImage):
            geo_img = GeoImage.from_source(image)
        else:
            geo_img = image
        return self.model.forward(geo_img, query)
