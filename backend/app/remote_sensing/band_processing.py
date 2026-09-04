import numpy as np


class SpectralIndices:
    """Calculates Normalized Difference Vegetation and Water Indices."""

    @staticmethod
    def calculate_ndvi(nir: np.ndarray, red: np.ndarray) -> np.ndarray:
        denom = nir + red
        denom[denom == 0] = 1e-6
        return (nir - red) / denom

    @staticmethod
    def calculate_ndwi(green: np.ndarray, nir: np.ndarray) -> np.ndarray:
        denom = green + nir
        denom[denom == 0] = 1e-6
        return (green - nir) / denom

    @staticmethod
    def calculate_ndbi(swir: np.ndarray, nir: np.ndarray) -> np.ndarray:
        """Calculates Normalized Difference Built-up Index (NDBI = (SWIR - NIR)/(SWIR + NIR))."""
        denom = swir + nir
        denom[denom == 0] = 1e-6
        return (swir - nir) / denom

    @staticmethod
    def false_color_composite(nir: np.ndarray, red: np.ndarray, green: np.ndarray) -> np.ndarray:
        """Generates standard NIR-Red-Green false-color infrared composite."""
        def norm(b):
            mn, mx = np.percentile(b, 2), np.percentile(b, 98)
            if mx - mn < 1e-6:
                return np.zeros_like(b, dtype=np.float32)
            return np.clip((b - mn) / (mx - mn), 0.0, 1.0)

        return np.stack([norm(nir), norm(red), norm(green)], axis=-1)
