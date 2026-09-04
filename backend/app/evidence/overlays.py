import numpy as np


class VisualOverlayComposer:
    @staticmethod
    def blend_heatmap(base_rgb: np.ndarray, heatmap: np.ndarray, alpha: float = 0.4) -> np.ndarray:
        h_norm = np.clip(heatmap, 0.0, 1.0)
        red_channel = h_norm
        green_channel = 1.0 - h_norm
        blue_channel = np.zeros_like(h_norm)
        rgb_heat = np.stack([red_channel, green_channel, blue_channel], axis=-1)
        blended = (1 - alpha) * base_rgb + alpha * rgb_heat
        return np.clip(blended, 0.0, 1.0)
