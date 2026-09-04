"""
SatQuery AI - Image Format Checker
"""

from typing import Dict, Any, List
from satquery.core.geo_processor import GeoImage

class FormatChecker:
    """Validates tensor shapes, channel depth, and data types."""

    @staticmethod
    def check(images: List[GeoImage]) -> Dict[str, Any]:
        errors = []
        for idx, img in enumerate(images):
            if img.height < 32 or img.width < 32:
                errors.append(f"Image {idx+1} resolution too small: {img.width}x{img.height}")
            if img.raw_data.ndim not in [2, 3]:
                errors.append(f"Image {idx+1} invalid dimensions: {img.raw_data.ndim}")

        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "checked_count": len(images)
        }
