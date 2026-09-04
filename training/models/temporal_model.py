import numpy as np
from typing import Dict, Any, Tuple

class SiameseTemporalModel:
    """
    Siamese difference network computing temporal delta embeddings between T1 and T2 rasters.
    """
    def __init__(self, feature_dim: int = 512, diff_threshold: float = 0.15):
        self.feature_dim = feature_dim
        self.diff_threshold = diff_threshold

    def compute_difference(self, feat_t1: np.ndarray, feat_t2: np.ndarray) -> Dict[str, Any]:
        delta_vec = np.abs(feat_t2 - feat_t1)
        l2_dist = float(np.linalg.norm(delta_vec))
        cos_sim = float(np.dot(feat_t1, feat_t2) / (np.linalg.norm(feat_t1) * np.linalg.norm(feat_t2) + 1e-7))
        is_changed = (1.0 - cos_sim) > self.diff_threshold

        return {
            "delta_vector": delta_vec,
            "l2_distance": round(l2_dist, 4),
            "cosine_similarity": round(cos_sim, 4),
            "change_detected": is_changed,
            "change_magnitude_percent": round(min(100.0, (1.0 - cos_sim) * 100), 2)
        }
