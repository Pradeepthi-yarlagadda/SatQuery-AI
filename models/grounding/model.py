"""
SatQuery AI - Text-Guided Region Grounding Model
"""

from typing import Dict, Any
from satquery.core.geo_processor import GeoImage
from satquery.models.grounding_engine import RegionGroundingEngine

class RegionGroundingModel:
    """Specialist Remote Sensing Grounding Model aligned with VRSBench."""

    def __init__(self, weights_path: str = None):
        self.weights_path = weights_path
        self.engine = RegionGroundingEngine

    def forward(self, geo_img: GeoImage, query: str) -> Dict[str, Any]:
        return self.engine.ground_text(geo_img, query)
