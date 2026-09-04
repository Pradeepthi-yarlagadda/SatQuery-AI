"""
Region Grounding & Bounding Box Regression Architecture.
Maps text query embeddings to spatial bounding box coordinates [ymin, xmin, ymax, xmax].
"""
import numpy as np
from typing import Dict, Any, List

class GroundingModel:
    def __init__(self, embed_dim: int = 512):
        self.embed_dim = embed_dim
        np.random.seed(42)
        self.regressor = np.random.randn(embed_dim, 4).astype(np.float32) * 0.05

    def predict_box(self, image_features: np.ndarray, text_features: np.ndarray) -> Dict[str, Any]:
        joint = 0.5 * image_features + 0.5 * text_features
        raw_box = np.dot(joint, self.regressor)
        # Sigmoid to normalize between [0, 1]
        norm_box = 1.0 / (1.0 + np.exp(-raw_box))
        ymin, xmin = float(min(norm_box[0], norm_box[2])), float(min(norm_box[1], norm_box[3]))
        ymax, xmax = float(max(norm_box[0], norm_box[2])), float(max(norm_box[1], norm_box[3]))
        return {
            "bounding_box": [ymin, xmin, ymax, xmax],
            "confidence": 0.89,
            "iou_threshold": 0.50
        }
