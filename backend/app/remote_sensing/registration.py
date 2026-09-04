from typing import Dict, Any


class GeoRegistrar:
    @staticmethod
    def verify_alignment(meta1: Dict[str, Any], meta2: Dict[str, Any]) -> bool:
        crs1 = meta1.get("crs")
        crs2 = meta2.get("crs")
        return bool(crs1 and crs2 and str(crs1).upper() == str(crs2).upper())

    @staticmethod
    def calculate_bounds_iou(bounds1: Dict[str, float], bounds2: Dict[str, float]) -> float:
        """Calculates Intersection-over-Union (IoU) between two bounding boxes."""
        inter_left = max(bounds1["left"], bounds2["left"])
        inter_bottom = max(bounds1["bottom"], bounds2["bottom"])
        inter_right = min(bounds1["right"], bounds2["right"])
        inter_top = min(bounds1["top"], bounds2["top"])

        if inter_right <= inter_left or inter_top <= inter_bottom:
            return 0.0

        inter_area = (inter_right - inter_left) * (inter_top - inter_bottom)
        area1 = (bounds1["right"] - bounds1["left"]) * (bounds1["top"] - bounds1["bottom"])
        area2 = (bounds2["right"] - bounds2["left"]) * (bounds2["top"] - bounds2["bottom"])
        union_area = area1 + area2 - inter_area
        return round(float(inter_area / max(1e-6, union_area)), 4)
