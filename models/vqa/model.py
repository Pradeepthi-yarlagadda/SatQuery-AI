"""
SatQuery AI - RS-VQA Model Architecture
"""

from typing import Dict, Any, List
import numpy as np
from satquery.core.geo_processor import GeoImage
from satquery.models.vqa_engine import RSVQAEngine

class RSVQAModel:
    """Specialist Remote Sensing VQA Model conforming to RSVQA / VRSBench."""

    def __init__(self, weights_path: str = None):
        self.weights_path = weights_path
        self.engine = RSVQAEngine

    def forward(self, geo_img: GeoImage, query: str) -> Dict[str, Any]:
        """Runs VQA reasoning over the satellite scene and user query."""
        return self.engine.answer_query(geo_img, query)
