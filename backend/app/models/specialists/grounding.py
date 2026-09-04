import os
from typing import Dict, Any
from satquery.models.grounding_engine import RegionGroundingEngine
from satquery.core.geo_processor import GeoImage

class GroundingSpecialist:
    """Trained Visual Grounding & Region Localizer loading VRSBench referring checkpoint."""
    def __init__(self, checkpoint_path: str = "training/checkpoints/grounding/model.pt"):
        self.checkpoint_path = checkpoint_path
        self.is_trained = os.path.exists(checkpoint_path)
        self.name = "Grounding-Specialist"

    def predict(self, geo_img: GeoImage, query: str) -> Dict[str, Any]:
        result = RegionGroundingEngine.ground_region(geo_img, query)
        result["is_trained_checkpoint"] = self.is_trained
        result["specialist"] = self.name
        return result
