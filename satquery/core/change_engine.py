"""
SatQuery AI - Multitemporal Change Detection Engine (CDVQA Standard)
Performs bi-temporal radiometric normalization, structural dissimilarity differencing,
semantic change transition classification, and change heatmap generation.
"""

from typing import Dict, Any, Tuple
import numpy as np
from PIL import Image
from scipy.ndimage import binary_opening, binary_closing, gaussian_filter

from satquery.core.geo_processor import GeoImage, validate_spatial_alignment
from satquery.core.spectral_indices import SpectralIndexEngine


class ChangeDetectionEngine:
    """
    Analyzes bi-temporal satellite image pairs (Time 1 and Time 2) to identify,
    quantify, and semantically categorize surface changes.
    """

    @classmethod
    def analyze_change(
        cls,
        img_t1: GeoImage,
        img_t2: GeoImage,
        sensitivity_threshold: float = 0.30
    ) -> Dict[str, Any]:
        """
        Executes end-to-end bi-temporal change analysis:
        1. Geometric verification
        2. Radiometric normalization
        3. Difference computation (Spectral & Structural)
        4. Semantic transition identification
        5. Visual change map generation
        """
        # Validate spatial alignment
        alignment = validate_spatial_alignment(img_t1, img_t2)
        if alignment["requires_resampling"]:
            img_t2_proc = img_t2.resize((img_t1.width, img_t1.height))
            img_t1_proc = img_t1
        else:
            img_t1_proc = img_t1
            img_t2_proc = img_t2

        # Convert to normalized float arrays
        t1_arr = img_t1_proc.normalized_rgb.astype(np.float32) / 255.0
        t2_arr = img_t2_proc.normalized_rgb.astype(np.float32) / 255.0

        # 1. Radiometric Differencing
        spectral_diff = np.sqrt(np.sum((t2_arr - t1_arr) ** 2, axis=-1)) / np.sqrt(3.0)
        
        # 2. Structural Dissimilarity using local gaussian smoothing
        smooth_t1 = gaussian_filter(t1_arr, sigma=1.5)
        smooth_t2 = gaussian_filter(t2_arr, sigma=1.5)
        structural_diff = np.mean(np.abs(smooth_t2 - smooth_t1), axis=-1)

        # Combined Change Magnitude [0, 1]
        change_magnitude = 0.6 * spectral_diff + 0.4 * structural_diff
        change_magnitude = np.clip(change_magnitude / (np.max(change_magnitude) + 1e-6), 0.0, 1.0)

        # 3. Binary Change Mask with Morphological Filtering
        raw_change_mask = change_magnitude > sensitivity_threshold
        cleaned_mask = binary_opening(raw_change_mask, structure=np.ones((3, 3)))
        cleaned_mask = binary_closing(cleaned_mask, structure=np.ones((3, 3)))

        total_pixels = cleaned_mask.size
        changed_pixels = int(np.sum(cleaned_mask))
        change_percentage = round((changed_pixels / total_pixels) * 100.0, 2)

        # 4. Semantic Transitions (Comparing Spectral Signatures)
        masks_t1 = SpectralIndexEngine.extract_thematic_masks(img_t1_proc)["masks"]
        masks_t2 = SpectralIndexEngine.extract_thematic_masks(img_t2_proc)["masks"]

        # Transitions inside changed areas:
        urban_expansion_mask = cleaned_mask & (masks_t1["vegetation"] | masks_t1["bare_soil"]) & masks_t2["builtup"]
        deforestation_mask = cleaned_mask & masks_t1["vegetation"] & (~masks_t2["vegetation"]) & (~masks_t2["water"])
        inundation_mask = cleaned_mask & (~masks_t1["water"]) & masks_t2["water"]
        water_shrinkage_mask = cleaned_mask & masks_t1["water"] & (~masks_t2["water"])

        # Determine dominant transition type among specific semantic categories
        specific_transitions = {
            "Urban Expansion & Construction": int(np.sum(urban_expansion_mask)),
            "Vegetation / Forest Loss": int(np.sum(deforestation_mask)),
            "Flooding & Surface Inundation": int(np.sum(inundation_mask)),
            "Water Reservoir Shrinkage / Drought": int(np.sum(water_shrinkage_mask)),
        }

        residual_pixels = max(0, changed_pixels - sum(specific_transitions.values()))
        transition_counts = dict(specific_transitions)
        transition_counts["Agricultural / General Surface Modification"] = residual_pixels

        # Prioritize specific semantic drivers over diffuse residual modifications
        best_specific = max(specific_transitions.items(), key=lambda x: x[1])
        if best_specific[1] > 0.15 * changed_pixels or best_specific[1] > 5000:
            dominant_name = best_specific[0]
        else:
            dominant_name = max(transition_counts.items(), key=lambda x: x[1])[0]

        dominant_transition = dominant_name if change_percentage > 1.5 else "No significant change detected"

        # 5. Build Change Heatmap Overlay (Red for high change, blended with T2)
        heatmap_overlay = cls._create_change_heatmap(img_t2_proc.normalized_rgb, change_magnitude, cleaned_mask)

        # 6. Directional Distribution (North, South, East, West, Central)
        spatial_distribution = cls._analyze_spatial_distribution(cleaned_mask)

        return {
            "alignment_validation": alignment,
            "change_percentage": change_percentage,
            "changed_pixel_count": changed_pixels,
            "total_pixels": total_pixels,
            "dominant_transition": dominant_transition,
            "transition_breakdown": transition_counts,
            "spatial_distribution": spatial_distribution,
            "change_mask": cleaned_mask,
            "change_magnitude": change_magnitude,
            "visual_overlay": heatmap_overlay,
            "confidence_score": round(min(0.96, 0.75 + (change_percentage / 100.0) * 0.2), 2)
        }

    @staticmethod
    def _create_change_heatmap(base_rgb: np.ndarray, magnitude: np.ndarray, mask: np.ndarray) -> np.ndarray:
        """Overlays highlighted red/amber change regions on top of the Time 2 scene."""
        overlay = base_rgb.copy().astype(np.float32)
        
        # Where change occurred, blend with bright amber/red color [255, 60, 20]
        change_color = np.array([255.0, 50.0, 30.0], dtype=np.float32)
        alpha = np.expand_dims(np.clip(magnitude * 1.5, 0.3, 0.85), axis=-1)
        
        mask_3d = np.expand_dims(mask, axis=-1)
        blended = (1.0 - alpha * mask_3d) * overlay + (alpha * mask_3d) * change_color
        return np.clip(blended, 0, 255).astype(np.uint8)

    @staticmethod
    def _analyze_spatial_distribution(mask: np.ndarray) -> str:
        """Determines which sector of the scene has the highest concentration of change."""
        h, w = mask.shape
        half_h, half_w = h // 2, w // 2
        
        nw = np.sum(mask[:half_h, :half_w])
        ne = np.sum(mask[:half_h, half_w:])
        sw = np.sum(mask[half_h:, :half_w])
        se = np.sum(mask[half_h:, half_w:])
        center = np.sum(mask[h//4: 3*h//4, w//4: 3*w//4])

        quads = {
            "north-western": nw,
            "north-eastern": ne,
            "south-western": sw,
            "south-eastern": se,
            "central": center
        }
        max_loc = max(quads.items(), key=lambda x: x[1])
        if max_loc[1] == 0:
            return "evenly distributed or negligible"
        return f"predominantly concentrated in the {max_loc[0]} sector"
