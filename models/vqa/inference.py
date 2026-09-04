"""
SatQuery AI - RS-VQA Inference Pipeline
"""

from typing import Dict, Any, Union
from PIL import Image
import numpy as np
from satquery.core.geo_processor import GeoImage
from models.vqa.model import RSVQAModel

class VQAInferencePipeline:
    """End-to-end inference service for single-image VQA."""

    def __init__(self, weights_path: str = None):
        self.model = RSVQAModel(weights_path=weights_path)

    def predict(self, image: Union[GeoImage, np.ndarray, Image.Image], query: str) -> Dict[str, Any]:
        if not isinstance(image, GeoImage):
            geo_img = GeoImage.from_source(image)
        else:
            geo_img = image
        return self.model.forward(geo_img, query)
