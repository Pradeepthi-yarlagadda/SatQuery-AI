"""
SatQuery AI - Metadata Checker
"""

from typing import Dict, Any, List
from satquery.core.geo_processor import GeoImage

class MetadataChecker:
    """Inspects geospatial metadata tags, sensors, and acquisition attributes."""

    @staticmethod
    def check(images: List[GeoImage]) -> Dict[str, Any]:
        info = []
        for idx, img in enumerate(images):
            info.append({
                "index": idx + 1,
                "sensor": img.sensor_type.value,
                "dimensions": f"{img.width}x{img.height}",
                "channels": img.channels
            })
        return {
            "metadata_valid": True,
            "scenes": info
        }
