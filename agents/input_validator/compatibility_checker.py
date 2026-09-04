"""
SatQuery AI - Geometric Compatibility Checker
"""

from typing import Dict, Any, List
from satquery.core.geo_processor import GeoImage, validate_spatial_alignment

class CompatibilityChecker:
    """Checks geometric alignment, aspect ratio, and resolution parity between multiple scenes."""

    @staticmethod
    def check_pair(img1: GeoImage, img2: GeoImage) -> Dict[str, Any]:
        return validate_spatial_alignment(img1, img2)
