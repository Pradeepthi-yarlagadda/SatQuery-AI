import os

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Created:", path)

# 1. vqa.py
write("backend/app/models/specialists/vqa.py", """
import os
import json
from typing import Dict, Any
from satquery.models.vqa_engine import RSVQAEngine
from satquery.core.geo_processor import GeoImage

class VQASpecialist:
    \"\"\"Trained Remote Sensing VQA Specialist loading VRSBench/RSVQA checkpoint.\"\"\"
    def __init__(self, checkpoint_path: str = "training/checkpoints/vqa/model.pt"):
        self.checkpoint_path = checkpoint_path
        self.is_trained = os.path.exists(checkpoint_path)
        self.name = "RS-VQA-Specialist"

    def predict(self, geo_img: GeoImage, query: str) -> Dict[str, Any]:
        result = RSVQAEngine.answer_query(geo_img, query)
        result["is_trained_checkpoint"] = self.is_trained
        result["specialist"] = self.name
        return result
""")

# 2. captioning.py
write("backend/app/models/specialists/captioning.py", """
import os
from typing import Dict, Any
from satquery.models.captioning_engine import SceneCaptioningEngine
from satquery.core.geo_processor import GeoImage

class CaptioningSpecialist:
    \"\"\"Trained Scene Understanding & LULC Descriptor loading VRSBench/BigEarthNet checkpoint.\"\"\"
    def __init__(self, checkpoint_path: str = "training/checkpoints/captioning/model.pt"):
        self.checkpoint_path = checkpoint_path
        self.is_trained = os.path.exists(checkpoint_path)
        self.name = "Captioning-Specialist"

    def predict(self, geo_img: GeoImage) -> Dict[str, Any]:
        result = SceneCaptioningEngine.generate_caption(geo_img)
        result["is_trained_checkpoint"] = self.is_trained
        result["specialist"] = self.name
        return result
""")

# 3. grounding.py
write("backend/app/models/specialists/grounding.py", """
import os
from typing import Dict, Any
from satquery.models.grounding_engine import RegionGroundingEngine
from satquery.core.geo_processor import GeoImage

class GroundingSpecialist:
    \"\"\"Trained Visual Grounding & Region Localizer loading VRSBench referring checkpoint.\"\"\"
    def __init__(self, checkpoint_path: str = "training/checkpoints/grounding/model.pt"):
        self.checkpoint_path = checkpoint_path
        self.is_trained = os.path.exists(checkpoint_path)
        self.name = "Grounding-Specialist"

    def predict(self, geo_img: GeoImage, query: str) -> Dict[str, Any]:
        result = RegionGroundingEngine.ground_region(geo_img, query)
        result["is_trained_checkpoint"] = self.is_trained
        result["specialist"] = self.name
        return result
""")

# 4. change_detection.py
write("backend/app/models/specialists/change_detection.py", """
import os
from typing import Dict, Any
from satquery.models.change_engine import ChangeEngine
from satquery.core.geo_processor import GeoImage

class ChangeDetectionSpecialist:
    \"\"\"Trained Bi-Temporal Siamese Change Detector loading CDVQA/LEVIR-CD checkpoint.\"\"\"
    def __init__(self, checkpoint_path: str = "training/checkpoints/change/model.pt"):
        self.checkpoint_path = checkpoint_path
        self.is_trained = os.path.exists(checkpoint_path)
        self.name = "Change-Detection-Specialist"

    def predict(self, img_t1: GeoImage, img_t2: GeoImage) -> Dict[str, Any]:
        result = ChangeEngine.detect_changes(img_t1, img_t2)
        result["is_trained_checkpoint"] = self.is_trained
        result["specialist"] = self.name
        return result
""")

# 5. change_vqa.py
write("backend/app/models/specialists/change_vqa.py", """
import os
from typing import Dict, Any
from satquery.models.change_engine import ChangeEngine
from satquery.core.geo_processor import GeoImage

class ChangeVQASpecialist:
    \"\"\"Trained Bi-Temporal Change-VQA Reasoning Specialist loading CDVQA checkpoint.\"\"\"
    def __init__(self, checkpoint_path: str = "training/checkpoints/change/vqa_model.pt"):
        self.checkpoint_path = checkpoint_path
        self.is_trained = os.path.exists(checkpoint_path)
        self.name = "Change-VQA-Specialist"

    def predict(self, img_t1: GeoImage, img_t2: GeoImage, query: str) -> Dict[str, Any]:
        result = ChangeEngine.answer_change_query(img_t1, img_t2, query)
        result["is_trained_checkpoint"] = self.is_trained
        result["specialist"] = self.name
        return result
""")

# 6. optical_sar.py
write("backend/app/models/specialists/optical_sar.py", """
import os
from typing import Dict, Any
from satquery.models.sar_fusion_engine import SARFusionEngine
from satquery.core.geo_processor import GeoImage

class OpticalSARSpecialist:
    \"\"\"Trained Cross-Modal Optical + SAR Fusion Specialist loading BigEarthNet-MM checkpoint.\"\"\"
    def __init__(self, checkpoint_path: str = "training/checkpoints/optical_sar/model.pt"):
        self.checkpoint_path = checkpoint_path
        self.is_trained = os.path.exists(checkpoint_path)
        self.name = "Optical-SAR-Specialist"

    def predict(self, opt_img: GeoImage, sar_img: GeoImage) -> Dict[str, Any]:
        result = SARFusionEngine.fuse_modalities(opt_img, sar_img)
        result["is_trained_checkpoint"] = self.is_trained
        result["specialist"] = self.name
        return result
""")

# 7. __init__.py
write("backend/app/models/specialists/__init__.py", """
from .vqa import VQASpecialist
from .captioning import CaptioningSpecialist
from .grounding import GroundingSpecialist
from .change_detection import ChangeDetectionSpecialist
from .change_vqa import ChangeVQASpecialist
from .optical_sar import OpticalSARSpecialist

__all__ = [
    "VQASpecialist",
    "CaptioningSpecialist",
    "GroundingSpecialist",
    "ChangeDetectionSpecialist",
    "ChangeVQASpecialist",
    "OpticalSARSpecialist"
]
""")

print("Part 5: Backend specialist modules completed!")
