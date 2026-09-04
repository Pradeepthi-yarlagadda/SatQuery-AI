from typing import Tuple


class CoordinateTransformer:
    """Transforms pixel coordinates to geographic WGS84 coordinates."""

    @staticmethod
    def pixel_to_geo(px: int, py: int, bounds: dict, width: int = 512, height: int = 512) -> Tuple[float, float]:
        lon = bounds["left"] + (px / width) * (bounds["right"] - bounds["left"])
        lat = bounds["top"] - (py / height) * (bounds["top"] - bounds["bottom"])
        return round(lon, 6), round(lat, 6)

    @staticmethod
    def geo_to_pixel(lon: float, lat: float, bounds: dict, width: int = 512, height: int = 512) -> Tuple[int, int]:
        px = int(round((lon - bounds["left"]) / (bounds["right"] - bounds["left"]) * width))
        py = int(round((bounds["top"] - lat) / (bounds["top"] - bounds["bottom"]) * height))
        return max(0, min(width - 1, px)), max(0, min(height - 1, py))

    @staticmethod
    def bbox_pixel_to_geo(bbox: Tuple[int, int, int, int], bounds: dict, width: int = 512, height: int = 512) -> dict:
        min_x, min_y, max_x, max_y = bbox
        min_lon, max_lat = CoordinateTransformer.pixel_to_geo(min_x, min_y, bounds, width, height)
        max_lon, min_lat = CoordinateTransformer.pixel_to_geo(max_x, max_y, bounds, width, height)
        return {"min_lon": min_lon, "min_lat": min_lat, "max_lon": max_lon, "max_lat": max_lat}
