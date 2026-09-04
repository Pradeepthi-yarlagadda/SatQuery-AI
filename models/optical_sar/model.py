"""
SatQuery AI - Optical + SAR Cross-Modal Model
"""

from typing import Dict, Any
from satquery.core.geo_processor import GeoImage
from models.optical_sar.fusion import MultimodalFusionCore

class OpticalSARModel:
    """Specialist Optical + SAR Joint Analysis Model."""

    def __init__(self, weights_path: str = None):
        self.weights_path = weights_path

    def forward(self, optical_img: GeoImage, sar_img: GeoImage, query: str = "") -> Dict[str, Any]:
        return MultimodalFusionCore.execute_fusion(optical_img, sar_img, query)
