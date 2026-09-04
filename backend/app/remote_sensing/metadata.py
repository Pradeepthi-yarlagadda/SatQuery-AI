from typing import Dict, Any


class GeoMetadataExtractor:
    @staticmethod
    def extract_bounds_and_crs(meta: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "crs": meta.get("crs", "EPSG:4326"),
            "bounds": meta.get("bounds", {"left": 0.0, "bottom": 0.0, "right": 1.0, "top": 1.0}),
            "dimensions": f"{meta.get('width', 512)}x{meta.get('height', 512)}",
            "bands": meta.get("count", 3)
        }
