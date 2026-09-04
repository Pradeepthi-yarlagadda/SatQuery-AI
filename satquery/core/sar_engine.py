"""
SatQuery AI - Synthetic Aperture Radar (SAR) Physics & Microwave Processing Engine
Implements adaptive speckle filtering (Lee Filter), radiometric decibel calibration,
double-bounce urban extraction, and specular water/flood detection.
"""

from typing import Dict, Any, Tuple
import numpy as np
from scipy.ndimage import uniform_filter
from satquery.core.geo_processor import GeoImage


class SAREngine:
    """
    Dedicated processor for Synthetic Aperture Radar (SAR) imagery (e.g. RISAT, Sentinel-1).
    Leverages microwave backscatter characteristics:
    - Specular reflection (Dark in SAR): Calm water bodies, smooth airport runways.
    - Double-bounce reflection (Extremely bright in SAR): Corner reflectors, urban buildings, bridges.
    - Diffuse / Volume scattering (Medium grey): Forest canopy, agricultural crops, rough soil.
    """

    @staticmethod
    def lee_filter(img_arr: np.ndarray, window_size: int = 5, damping_factor: float = 1.0) -> np.ndarray:
        """
        Adaptive Lee Filter for multiplicative speckle noise reduction.
        Preserves radiometric edges while smoothing homogeneous speckle regions.
        """
        img = img_arr.astype(np.float32)
        mean = uniform_filter(img, (window_size, window_size))
        sq_mean = uniform_filter(img ** 2, (window_size, window_size))
        variance = sq_mean - mean ** 2
        variance[variance < 0] = 0

        # Overall noise variance estimation from homogeneous areas
        noise_var = np.var(img) * 0.25
        weights = variance / (variance + noise_var + 1e-7)
        weights = np.clip(weights * damping_factor, 0.0, 1.0)

        filtered = mean + weights * (img - mean)
        return filtered

    @classmethod
    def process_sar_scene(cls, geo_img: GeoImage, filter_speckle: bool = True) -> Dict[str, Any]:
        """
        Calibrates and analyzes SAR backscatter.
        Returns decibel backscatter, filtered amplitude, and structural target masks.
        """
        # Extract single channel amplitude
        if geo_img.channels >= 3:
            # If 3 channels, average or use intensity
            intensity = np.mean(geo_img.raw_data[:, :, :3], axis=-1)
        elif geo_img.channels == 2:
            # Dual-pol: VV intensity
            intensity = geo_img.raw_data[:, :, 0]
        else:
            intensity = geo_img.raw_data

        # Normalize to positive values
        intensity = np.maximum(intensity, 1e-4)

        # 1. Speckle Filtering
        if filter_speckle:
            denoised = cls.lee_filter(intensity, window_size=5)
        else:
            denoised = intensity

        # 2. Radiometric Decibel Calibration (sigma0 in dB)
        # dB = 10 * log10(denoised^2 + eps) or linear scale DN to dB
        dn_norm = denoised / (np.max(denoised) + 1e-6)
        sigma0_db = 10.0 * np.log10(dn_norm + 1e-4)

        # 3. Microwave Physical Classifiers:
        # A) Specular Water / Flood: dB < -15 dB (or bottom 15% in normalized distribution)
        water_threshold_db = -12.0
        water_mask = sigma0_db < water_threshold_db

        # B) Urban / Double-Bounce: Strong dihedral reflection (top 15-20% high amplitude)
        urban_threshold_db = -3.5
        urban_mask = sigma0_db > urban_threshold_db

        # C) Volume Scattering (Vegetation / Rough Soil): Intermediate range
        vegetation_mask = (sigma0_db >= water_threshold_db) & (sigma0_db <= urban_threshold_db)

        total_pixels = intensity.size
        return {
            "calibrated_sigma0_db": sigma0_db,
            "denoised_amplitude": denoised,
            "masks": {
                "sar_water_mask": water_mask,
                "sar_urban_mask": urban_mask,
                "sar_vegetation_mask": vegetation_mask,
            },
            "statistics": {
                "water_detected_percent": round(float(np.sum(water_mask)) / total_pixels * 100.0, 2),
                "urban_structures_percent": round(float(np.sum(urban_mask)) / total_pixels * 100.0, 2),
                "diffuse_vegetation_percent": round(float(np.sum(vegetation_mask)) / total_pixels * 100.0, 2),
                "mean_backscatter_db": round(float(np.mean(sigma0_db)), 2),
            },
            "speckle_reduction_applied": filter_speckle
        }
