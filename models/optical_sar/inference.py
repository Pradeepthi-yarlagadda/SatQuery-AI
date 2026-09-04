"""
SatQuery AI - Optical + SAR Inference Pipeline
"""

from typing import Dict, Any, Union
from PIL import Image
import numpy as np
from satquery.core.geo_processor import GeoImage
from models.optical_sar.model import OpticalSARModel

class OpticalSARInferencePipeline:
    """End-to-end inference service for cross-modal optical + SAR analysis."""

    def __init__(self, weights_path: str = None):
        self.model = OpticalSARModel(weights_path=weights_path)

    def predict(
        self,
        optical_source: Union[GeoImage, np.ndarray, Image.Image],
        sar_source: Union[GeoImage, np.ndarray, Image.Image],
        query: str = ""
    ) -> Dict[str, Any]:
        opt_geo = optical_source if isinstance(optical_source, GeoImage) else GeoImage.from_source(optical_source)
        sar_geo = sar_source if isinstance(sar_source, GeoImage) else GeoImage.from_source(sar_source)
        return self.model.forward(opt_geo, sar_geo, query)
