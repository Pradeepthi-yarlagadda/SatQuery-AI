"""
SatQuery AI - Change Analysis Inference Pipeline
"""

from typing import Dict, Any, Union
from PIL import Image
import numpy as np
from satquery.core.geo_processor import GeoImage
from models.change_analysis.model import ChangeAnalysisModel

class ChangeAnalysisInferencePipeline:
    """End-to-end inference service for bi-temporal change analysis."""

    def __init__(self, weights_path: str = None):
        self.model = ChangeAnalysisModel(weights_path=weights_path)

    def predict(
        self,
        image_t1: Union[GeoImage, np.ndarray, Image.Image],
        image_t2: Union[GeoImage, np.ndarray, Image.Image]
    ) -> Dict[str, Any]:
        g1 = image_t1 if isinstance(image_t1, GeoImage) else GeoImage.from_source(image_t1)
        g2 = image_t2 if isinstance(image_t2, GeoImage) else GeoImage.from_source(image_t2)
        return self.model.forward(g1, g2)
