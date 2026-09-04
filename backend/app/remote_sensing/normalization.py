import numpy as np


class RadiometricNormalizer:
    """Performs radiometric adjustments including 2-98% percentile linear stretch."""

    @staticmethod
    def percentile_stretch(band: np.ndarray, lower_p: float = 2.0, upper_p: float = 98.0) -> np.ndarray:
        valid_mask = np.isfinite(band)
        if not np.any(valid_mask):
            return np.zeros_like(band, dtype=np.float32)

        p_low = np.percentile(band[valid_mask], lower_p)
        p_high = np.percentile(band[valid_mask], upper_p)

        if p_high <= p_low:
            return np.clip(band, 0.0, 1.0).astype(np.float32)

        stretched = (band - p_low) / (p_high - p_low)
        return np.clip(stretched, 0.0, 1.0).astype(np.float32)
