import os
from typing import Dict, Any
from satquery.models.captioning_engine import SceneCaptioningEngine
from satquery.core.geo_processor import GeoImage

class CaptioningSpecialist:
    """Trained Scene Understanding & LULC Descriptor loading VRSBench/BigEarthNet checkpoint."""
    def __init__(self, checkpoint_path: str = "training/checkpoints/captioning/model.pt"):
        self.checkpoint_path = checkpoint_path
        self.is_trained = os.path.exists(checkpoint_path)
        self.name = "Captioning-Specialist"

    def predict(self, geo_img: GeoImage) -> Dict[str, Any]:
        result = SceneCaptioningEngine.generate_caption(geo_img)
        result["is_trained_checkpoint"] = self.is_trained
        result["specialist"] = self.name
        return result
