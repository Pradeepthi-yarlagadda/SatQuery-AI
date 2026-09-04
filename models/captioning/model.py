"""
SatQuery AI - Remote Sensing Scene Captioning Model
"""

from typing import Dict, Any
from satquery.core.geo_processor import GeoImage
from satquery.models.captioning_engine import SceneCaptioningEngine

class SceneCaptioningModel:
    """Specialist Remote Sensing Scene Captioner aligned with VRSBench & BigEarthNet."""

    def __init__(self, weights_path: str = None):
        self.weights_path = weights_path
        self.engine = SceneCaptioningEngine

    def forward(self, geo_img: GeoImage) -> Dict[str, Any]:
        return self.engine.generate_caption(geo_img)
