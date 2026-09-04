"""
SatQuery AI - Configuration & Remote Sensing Constants
Aligned with ISRO/SAC standards, BigEarthNet taxonomy, and RSVQA/CDVQA specifications.
"""

from enum import Enum
from typing import List, Dict, Any

class SensorType(str, Enum):
    OPTICAL_RGB = "Optical (RGB)"
    OPTICAL_MULTISPECTRAL = "Optical (Multispectral/NIR)"
    SAR_SINGLE_POL = "SAR (Single-Pol / VV or HH)"
    SAR_DUAL_POL = "SAR (Dual-Pol / VV+VH or HH+HV)"
    UNKNOWN = "Unknown / Generic"

class TaskType(str, Enum):
    VQA = "Visual Question Answering (VQA)"
    GROUNDING = "Text-Guided Region Grounding"
    CAPTIONING = "Scene Captioning & Description"
    CHANGE_DETECTION = "Multitemporal Change Analysis (CDVQA)"
    OPTICAL_SAR_FUSION = "Optical + SAR Cross-Modal Fusion"

# BigEarthNet 19-class Land-Cover / Land-Use (LULC) Taxonomy
BIGEARTHNET_CLASSES = [
    "Urban fabric & built-up structures",
    "Industrial, commercial and transport units",
    "Arable land & non-irrigated arable land",
    "Permanently irrigated land",
    "Rice fields",
    "Vineyards, fruit trees and berry plantations",
    "Pastures & grasslands",
    "Complex cultivation patterns",
    "Land principally occupied by agriculture",
    "Broad-leaved forest",
    "Coniferous forest",
    "Mixed forest",
    "Natural grassland and shrubland",
    "Moors, heathland and sclerophyllous vegetation",
    "Sparsely vegetated areas & bare soil",
    "Inland wetlands (marshes, peat bogs)",
    "Coastal wetlands (salt marshes, salines)",
    "Inland water bodies (rivers, lakes, reservoirs)",
    "Marine waters and coastal lagoons"
]

# Supported evaluation benchmarks
SUPPORTED_BENCHMARKS = {
    "BigEarthNet": "Multimodal (Optical + SAR) representation adaptation",
    "RSVQA": "Remote Sensing Visual Question Answering (LR / HR)",
    "VRSBench": "High-res VQA, dense captioning, and text-guided visual grounding",
    "CDVQA": "Change Detection Visual Question Answering for bi-temporal pairs",
    "ISRO_Cartosat_RISAT": "High-resolution Optical (Cartosat-2S) + C-band SAR (RISAT)"
}

# Image Processing Defaults
DEFAULT_IMAGE_SIZE = (512, 512)
SAR_SPECKLE_FILTER_WINDOW = 5
CHANGE_SENSITIVITY_THRESHOLD = 0.35
GROUNDING_CONFIDENCE_THRESHOLD = 0.50
