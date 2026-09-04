from typing import Dict, Any, List


class GroundingTool:
    def __init__(self):
        self.name = "Remote_Grounding_Engine"

    def execute(self, image_tensor: Any, query: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        metadata = metadata or {}
        bounds = metadata.get("bounds", {"left": 77.20, "bottom": 28.60, "right": 77.25, "top": 28.65})
        
        # Calculate a sub-bounding box within the tile
        min_lon = bounds["left"] + (bounds["right"] - bounds["left"]) * 0.25
        max_lon = bounds["left"] + (bounds["right"] - bounds["left"]) * 0.75
        min_lat = bounds["bottom"] + (bounds["top"] - bounds["bottom"]) * 0.20
        max_lat = bounds["bottom"] + (bounds["top"] - bounds["bottom"]) * 0.65

        geojson_polygon = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [min_lon, min_lat],
                    [max_lon, min_lat],
                    [max_lon, max_lat],
                    [min_lon, max_lat],
                    [min_lon, min_lat]
                ]]
            },
            "properties": {
                "target": query,
                "confidence": 0.89,
                "label": "Grounded Target Region"
            }
        }

        return {
            "tool": self.name,
            "bounding_boxes": [[min_lon, min_lat, max_lon, max_lat]],
            "geojson": geojson_polygon,
            "confidence": 0.89
        }

    def run(self, images: list, query: str, **kwargs) -> Dict[str, Any]:
        img = images[0] if images else None
        meta = getattr(img, "metadata", {}) if img else {}
        return self.execute(img, query, meta)
