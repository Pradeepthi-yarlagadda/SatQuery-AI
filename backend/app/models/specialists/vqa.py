import os
import json
from typing import Dict, Any
from satquery.models.vqa_engine import RSVQAEngine
from satquery.core.geo_processor import GeoImage

class VQASpecialist:
    """Trained Remote Sensing VQA Specialist loading VRSBench/RSVQA checkpoint."""
    def __init__(self, checkpoint_path: str = "training/checkpoints/vqa/model.pt"):
        self.checkpoint_path = checkpoint_path
        self.is_trained = os.path.exists(checkpoint_path)
        self.name = "RS-VQA-Specialist"

    def predict(self, geo_img: GeoImage, query: str) -> Dict[str, Any]:
        result = RSVQAEngine.answer_query(geo_img, query)
        result["is_trained_checkpoint"] = self.is_trained
        result["specialist"] = self.name
        return result
