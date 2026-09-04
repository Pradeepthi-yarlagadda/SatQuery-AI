import numpy as np


class BinaryMaskGenerator:
    @staticmethod
    def create_threshold_mask(array: np.ndarray, threshold: float = 0.5) -> np.ndarray:
        return (array >= threshold).astype(np.uint8)

    @staticmethod
    def calculate_coverage_percentage(mask: np.ndarray) -> float:
        if mask.size == 0:
            return 0.0
        return round(float(np.sum(mask > 0) / mask.size * 100.0), 2)

    @staticmethod
    def connected_components(mask: np.ndarray) -> int:
        try:
            from scipy.ndimage import label
            _, num_features = label(mask > 0)
            return int(num_features)
        except Exception:
            return int(np.sum(mask > 0) > 0)
