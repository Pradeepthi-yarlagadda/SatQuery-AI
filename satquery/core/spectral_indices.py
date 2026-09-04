"""
SatQuery AI - Remote Sensing Spectral Indices & Biophysical Feature Extraction
Calculates NDVI, NDWI, NDBI, and visible spectral proxies with thematic mask extraction.
"""

from typing import Dict, Any, Tuple
import numpy as np
from satquery.core.geo_processor import GeoImage


class SpectralIndexEngine:
    """
    Computes standard Earth Observation spectral indices and biophysical masks.
    Handles multispectral (NIR/SWIR) as well as RGB-proxy indices (VARI, GLI, ExG, NDWI-proxy).
    """

    @staticmethod
    def compute_ndvi_proxy(geo_img: GeoImage) -> np.ndarray:
        """
        Visible Atmospherically Resistant Index (VARI) / Excess Green proxy for vegetation.
        VARI = (Green - Red) / (Green + Red - Blue + 1e-6)
        Values normalized to [-1, 1].
        """
        r, g, b = geo_img.get_rgb_channels()
        denominator = (g + r - b)
        denominator[np.abs(denominator) < 1e-5] = 1e-5
        vari = (g - r) / denominator
        return np.clip(vari, -1.0, 1.0)

    @staticmethod
    def compute_ndwi_proxy(geo_img: GeoImage) -> np.ndarray:
        """
        Normalized Water Proxy Index based on Green-to-Red/Blue reflectance absorption.
        Water has high reflectance in blue-green and strong absorption in red/NIR.
        Neutral grey surfaces (asphalt roads) are strictly suppressed using chroma.
        """
        r, g, b = geo_img.get_rgb_channels()
        # Water: blue is higher than red and green
        water_score = (b + g * 0.8 - 1.8 * r) / (b + g * 0.8 + 1.8 * r + 1e-5)
        
        # Suppress neutral grey asphalt / shadows
        chroma = np.sqrt((r - g)**2 + (g - b)**2 + (b - r)**2)
        water_score[chroma < 0.04] = -1.0
        
        # Suppress bright clouds / white roofs
        brightness = (r + g + b) / 3.0
        water_score[brightness > 0.70] = -1.0
        return np.clip(water_score, -1.0, 1.0)

    @staticmethod
    def compute_builtup_index(geo_img: GeoImage) -> np.ndarray:
        """
        Built-up and Impervious Surface Proxy.
        Built-up areas (concrete, asphalt, roofs) exhibit low chroma (neutral grey),
        and distinct contrast relative to vegetative green biomass.
        """
        r, g, b = geo_img.get_rgb_channels()
        chroma = np.sqrt((r - g)**2 + (g - b)**2 + (b - r)**2)
        brightness = (r + g + b) / 3.0
        
        # Impervious surfaces: low color saturation (chroma) across dark to bright grey
        builtup_score = (1.0 - np.clip(chroma * 2.5, 0.0, 1.0)) * (0.4 + brightness * 0.6) - (g * 0.3)
        return np.clip(builtup_score, 0.0, 1.0)

    @classmethod
    def extract_thematic_masks(cls, geo_img: GeoImage) -> Dict[str, Any]:
        """
        Computes thematic land-cover masks and land-use area fractions.
        Returns binary masks and coverage statistics.
        """
        h, w = geo_img.height, geo_img.width
        total_pixels = h * w

        # 1. Vegetation Analysis
        ndvi_map = cls.compute_ndvi_proxy(geo_img)
        veg_mask = ndvi_map > 0.12

        # 2. Water Body Analysis
        ndwi_map = cls.compute_ndwi_proxy(geo_img)
        water_mask = (ndwi_map > 0.15) & (~veg_mask)

        # 3. Built-up / Urban Fabric Analysis
        builtup_map = cls.compute_builtup_index(geo_img)
        builtup_mask = (builtup_map > 0.28) & (~veg_mask) & (~water_mask)

        # 4. Bare Soil / Sparsely Vegetated
        bare_soil_mask = (~veg_mask) & (~water_mask) & (~builtup_mask)

        veg_fraction = float(np.sum(veg_mask)) / total_pixels
        water_fraction = float(np.sum(water_mask)) / total_pixels
        builtup_fraction = float(np.sum(builtup_mask)) / total_pixels
        bare_soil_fraction = float(np.sum(bare_soil_mask)) / total_pixels

        return {
            "statistics": {
                "vegetation_cover_percent": round(veg_fraction * 100.0, 2),
                "water_cover_percent": round(water_fraction * 100.0, 2),
                "builtup_cover_percent": round(builtup_fraction * 100.0, 2),
                "bare_soil_percent": round(bare_soil_fraction * 100.0, 2),
            },
            "masks": {
                "vegetation": veg_mask,
                "water": water_mask,
                "builtup": builtup_mask,
                "bare_soil": bare_soil_mask,
            },
            "maps": {
                "ndvi": ndvi_map,
                "ndwi": ndwi_map,
                "builtup": builtup_map,
            }
        }
