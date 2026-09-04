import numpy as np


class ChangeMapRenderer:
    @staticmethod
    def render_diff_map(t1: np.ndarray, t2: np.ndarray) -> np.ndarray:
        return np.abs(t2.astype(np.float32) - t1.astype(np.float32))

    @staticmethod
    def render_categorical_change_map(t1: np.ndarray, t2: np.ndarray, threshold: float = 0.15) -> np.ndarray:
        """Categorizes pixel changes: 0=Unchanged, 1=Urban Expansion, 2=Vegetation Loss, 3=Water Shift."""
        diff = np.mean(np.abs(t2.astype(np.float32) - t1.astype(np.float32)), axis=0) if t1.ndim == 3 else np.abs(t2 - t1)
        cat_map = np.zeros_like(diff, dtype=np.uint8)

        # Heuristic spectral delta categorization
        changed = diff >= threshold
        if t1.ndim == 3 and t1.shape[0] >= 3:
            # t1/t2 channels: Red=0, Green=1, Blue=2
            bright_increase = (t2[0] - t1[0]) > threshold * 0.8
            green_decrease = (t1[1] - t2[1]) > threshold * 0.8
            cat_map[changed & bright_increase] = 1  # Urban expansion
            cat_map[changed & green_decrease] = 2  # Vegetation loss
            cat_map[changed & ~bright_increase & ~green_decrease] = 3  # Water / other shift
        else:
            cat_map[changed] = 1

        return cat_map

    @staticmethod
    def render_color_overlay(cat_map: np.ndarray) -> np.ndarray:
        """Renders RGB color-coded overlay: Unchanged=Transparent, Urban=Red, VegLoss=Yellow, Water=Cyan."""
        h, w = cat_map.shape[:2]
        rgb = np.zeros((h, w, 3), dtype=np.float32)
        rgb[cat_map == 1] = [1.0, 0.2, 0.2]  # Red for urban
        rgb[cat_map == 2] = [0.9, 0.8, 0.1]  # Yellow for veg loss
        rgb[cat_map == 3] = [0.1, 0.7, 1.0]  # Cyan for water shift
        return rgb
