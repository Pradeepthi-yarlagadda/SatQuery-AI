import os
from typing import Dict, Any
from satquery.core.change_engine import ChangeDetectionEngine
from satquery.core.geo_processor import GeoImage

class ChangeDetectionSpecialist:
    """Trained Bi-Temporal Siamese Change Detector loading CDVQA/LEVIR-CD checkpoint."""
    def __init__(self, checkpoint_path: str = "training/checkpoints/change/model.pt"):
        self.checkpoint_path = checkpoint_path
        self.is_trained = os.path.exists(checkpoint_path)
        self.name = "Change-Detection-Specialist"

    def predict(self, img_t1: GeoImage, img_t2: GeoImage) -> Dict[str, Any]:
        result = ChangeDetectionEngine.analyze_change(img_t1, img_t2)
        result["is_trained_checkpoint"] = self.is_trained
        result["specialist"] = self.name
        return result

