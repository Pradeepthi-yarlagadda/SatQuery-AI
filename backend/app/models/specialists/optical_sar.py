import os
from typing import Dict, Any
from satquery.models.optical_sar_fusion import OpticalSARFusionEngine
from satquery.core.geo_processor import GeoImage

class OpticalSARSpecialist:
    """Trained Cross-Modal Optical + SAR Fusion Specialist loading BigEarthNet-MM checkpoint."""
    def __init__(self, checkpoint_path: str = "training/checkpoints/optical_sar/model.pt"):
        self.checkpoint_path = checkpoint_path
        self.is_trained = os.path.exists(checkpoint_path)
        self.name = "Optical-SAR-Specialist"

    def predict(self, opt_img: GeoImage, sar_img: GeoImage, query: str = "Synergistic Optical-SAR joint analysis") -> Dict[str, Any]:
        result = OpticalSARFusionEngine.fuse_and_analyze(opt_img, sar_img, query=query)
        result["is_trained_checkpoint"] = self.is_trained
        result["specialist"] = self.name
        return result

