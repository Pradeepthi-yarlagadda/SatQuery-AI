"""
SatQuery AI - Scene Captioning Inference Pipeline
"""

from typing import Dict, Any, Union
from PIL import Image
import numpy as np
from satquery.core.geo_processor import GeoImage
from models.captioning.model import SceneCaptioningModel

class CaptioningInferencePipeline:
    """End-to-end inference service for scene captioning."""

    def __init__(self, weights_path: str = None):
        self.model = SceneCaptioningModel(weights_path=weights_path)

    def predict(self, image: Union[GeoImage, np.ndarray, Image.Image]) -> Dict[str, Any]:
        if not isinstance(image, GeoImage):
            geo_img = GeoImage.from_source(image)
        else:
            geo_img = image
        return self.model.forward(geo_img)
