from typing import List, Dict, Any


class BoundingBoxGenerator:
    @staticmethod
    def generate_geojson(bounds: dict, label: str = "Detected Target") -> Dict[str, Any]:
        min_lon = bounds["left"] + (bounds["right"] - bounds["left"]) * 0.25
        max_lon = bounds["left"] + (bounds["right"] - bounds["left"]) * 0.75
        min_lat = bounds["bottom"] + (bounds["top"] - bounds["bottom"]) * 0.20
        max_lat = bounds["bottom"] + (bounds["top"] - bounds["bottom"]) * 0.65

        return {
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
            "properties": {"label": label, "confidence": 0.89}
        }

    @staticmethod
    def from_pixel_bbox(
        bbox: List[int],
        bounds: dict,
        width: int = 512,
        height: int = 512,
        label: str = "Target",
        confidence: float = 0.90
    ) -> Dict[str, Any]:
        min_x, min_y, max_x, max_y = bbox
        min_lon = bounds["left"] + (min_x / width) * (bounds["right"] - bounds["left"])
        max_lon = bounds["left"] + (max_x / width) * (bounds["right"] - bounds["left"])
        max_lat = bounds["top"] - (min_y / height) * (bounds["top"] - bounds["bottom"])
        min_lat = bounds["top"] - (max_y / height) * (bounds["top"] - bounds["bottom"])

        return {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [round(min_lon, 6), round(min_lat, 6)],
                    [round(max_lon, 6), round(min_lat, 6)],
                    [round(max_lon, 6), round(max_lat, 6)],
                    [round(min_lon, 6), round(max_lat, 6)],
                    [round(min_lon, 6), round(min_lat, 6)]
                ]]
            },
            "properties": {"label": label, "confidence": round(confidence, 2)}
        }

    @staticmethod
    def generate_feature_collection(features: List[Dict[str, Any]]) -> Dict[str, Any]:
        return {
            "type": "FeatureCollection",
            "features": features
        }
