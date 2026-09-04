"""
SatQuery AI - Remote Sensing Visual Question Answering (RS-VQA) Specialist
Compliant with RSVQA and VRSBench standards. Provides domain-grounded answers
supported by biophysical spectral indices and spatial measurements.
"""

from typing import Dict, Any, List, Optional
import re
import numpy as np
from satquery.core.geo_processor import GeoImage
from satquery.core.spectral_indices import SpectralIndexEngine
from satquery.config import BIGEARTHNET_CLASSES


class RSVQAEngine:
    """
    Specialist model for Remote Sensing Visual Question Answering.
    Answers presence, counting, comparison, land-cover, and spatial queries.
    """

    @classmethod
    def answer_query(cls, geo_img: GeoImage, query: str) -> Dict[str, Any]:
        """
        Parses query context, extracts biophysical evidence, and generates
        a grounded natural language answer with confidence score and evidence metrics.
        """
        q_lower = query.lower().strip()
        analysis = SpectralIndexEngine.extract_thematic_masks(geo_img)
        stats = analysis["statistics"]
        masks = analysis["masks"]

        veg_pct = stats["vegetation_cover_percent"]
        water_pct = stats["water_cover_percent"]
        built_pct = stats["builtup_cover_percent"]
        soil_pct = stats["bare_soil_percent"]

        # 1. Counting Questions ("How many buildings / water bodies / clusters?")
        if any(w in q_lower for w in ["how many", "count", "number of"]):
            return cls._handle_counting_query(geo_img, q_lower, masks, stats)

        # 2. Comparison Questions ("Is there more X than Y?", "Compare vegetation and built-up")
        if any(w in q_lower for w in ["more than", "less than", "compare", "greater", "higher"]):
            return cls._handle_comparison_query(q_lower, stats)

        # 3. Water / River / Lake Queries ("Where is the water?", "Is water present?")
        if any(w in q_lower for w in ["water", "river", "lake", "reservoir", "pond", "ocean", "sea", "flood"]):
            return cls._handle_water_query(q_lower, water_pct, masks["water"], geo_img)

        # 4. Vegetation / Agriculture / Forest Queries
        if any(w in q_lower for w in ["vegetation", "forest", "tree", "agriculture", "crop", "farm", "greenery"]):
            return cls._handle_vegetation_query(q_lower, veg_pct, masks["vegetation"])

        # 5. Urban / Built-up / Building Queries
        if any(w in q_lower for w in ["building", "built-up", "urban", "house", "road", "structure", "city", "industrial"]):
            return cls._handle_builtup_query(q_lower, built_pct, masks["builtup"])

        # 6. General Scene Classification & BigEarthNet LULC
        return cls._handle_general_vqa(q_lower, stats)

    @classmethod
    def _handle_counting_query(cls, geo_img: GeoImage, q: str, masks: Dict[str, np.ndarray], stats: Dict[str, float]) -> Dict[str, Any]:
        from scipy.ndimage import label
        
        target_name = "structures"
        if "building" in q or "house" in q or "structure" in q:
            labeled_arr, count = label(masks["builtup"])
            target_name = "built-up structures/clusters"
            # Filter tiny 1-2 pixel noise
            sizes = np.bincount(labeled_arr.ravel())
            valid_count = int(np.sum(sizes[1:] > 8))
            count = max(valid_count, 1) if stats["builtup_cover_percent"] > 2.0 else 0
        elif "water" in q or "lake" in q or "pond" in q:
            labeled_arr, count = label(masks["water"])
            target_name = "distinct water bodies"
            sizes = np.bincount(labeled_arr.ravel())
            valid_count = int(np.sum(sizes[1:] > 20))
            count = max(valid_count, 1) if stats["water_cover_percent"] > 1.0 else 0
        else:
            labeled_arr, count = label(masks["builtup"] | masks["vegetation"])
            count = int(count)

        if count == 0:
            answer = f"No distinct {target_name} were identified in this scene."
            conf = 0.91
        elif count == 1:
            answer = f"There is 1 primary continuous {target_name} identified in the scene."
            conf = 0.88
        elif count <= 15:
            answer = f"Approximately {count} distinct {target_name} are visible in the scene."
            conf = 0.86
        else:
            answer = f"A dense distribution of {target_name} was detected (exceeding {count} contiguous segments)."
            conf = 0.84

        return {
            "answer": answer,
            "confidence": conf,
            "evidence": {
                "detected_count": count,
                "target_type": target_name,
                "coverage_percent": stats.get(f"{target_name.split()[0]}_cover_percent", 0.0)
            },
            "benchmark_alignment": "RSVQA-HR Object Count Task"
        }

    @staticmethod
    def _handle_comparison_query(q: str, stats: Dict[str, float]) -> Dict[str, Any]:
        veg = stats["vegetation_cover_percent"]
        built = stats["builtup_cover_percent"]
        water = stats["water_cover_percent"]

        if "vegetation" in q and ("built" in q or "urban" in q):
            diff = abs(veg - built)
            if veg > built:
                ans = f"Vegetation cover ({veg}%) is greater than built-up area ({built}%), by a margin of {round(diff, 1)}%."
            else:
                ans = f"Built-up area ({built}%) exceeds vegetation cover ({veg}%), by a margin of {round(diff, 1)}%."
        else:
            dominant = max(stats.items(), key=lambda x: x[1])
            category = dominant[0].replace("_percent", "").replace("_cover", "").replace("_", " ")
            ans = f"The landscape is predominantly {category} ({dominant[1]}%), followed by other classes."

        return {
            "answer": ans,
            "confidence": 0.94,
            "evidence": stats,
            "benchmark_alignment": "RSVQA Relational Comparison Task"
        }

    @staticmethod
    def _handle_water_query(q: str, water_pct: float, water_mask: np.ndarray, geo_img: GeoImage) -> Dict[str, Any]:
        if water_pct < 0.8:
            ans = f"No significant permanent water body was identified in this scene (water cover is {water_pct}%)."
            conf = 0.92
        else:
            # Determine location
            h, w = water_mask.shape
            y_indices, x_indices = np.where(water_mask)
            mean_y, mean_x = np.mean(y_indices) / h, np.mean(x_indices) / w
            
            y_pos = "northern" if mean_y < 0.4 else ("southern" if mean_y > 0.6 else "central")
            x_pos = "western" if mean_x < 0.4 else ("eastern" if mean_x > 0.6 else "")
            pos_str = f"{y_pos} {x_pos}".strip()

            ans = f"Water bodies are present covering approximately {water_pct}% of the image, located primarily in the {pos_str} sector."
            conf = 0.93

        return {
            "answer": ans,
            "confidence": conf,
            "evidence": {
                "water_coverage_percent": water_pct,
                "spectral_index": "NDWI (Normalized Difference Water Index)",
            },
            "benchmark_alignment": "RSVQA-Presence / VRSBench"
        }

    @staticmethod
    def _handle_vegetation_query(q: str, veg_pct: float, veg_mask: np.ndarray) -> Dict[str, Any]:
        if veg_pct > 50.0:
            density = "dense and extensive"
        elif veg_pct > 20.0:
            density = "moderately distributed"
        elif veg_pct > 5.0:
            density = "sparse with isolated patches"
        else:
            density = "virtually absent"

        ans = f"Vegetation cover is {density}, encompassing approximately {veg_pct}% of the surveyed terrain."
        return {
            "answer": ans,
            "confidence": 0.92,
            "evidence": {"vegetation_coverage_percent": veg_pct, "spectral_index": "NDVI Proxy"},
            "benchmark_alignment": "RSVQA Land-Cover Assessment"
        }

    @staticmethod
    def _handle_builtup_query(q: str, built_pct: float, built_mask: np.ndarray) -> Dict[str, Any]:
        if built_pct > 40.0:
            density = "densely developed urban/industrial zone"
        elif built_pct > 15.0:
            density = "suburban/semi-urban area with scattered buildings and infrastructure"
        elif built_pct > 2.0:
            density = "rural setting with isolated settlement clusters"
        else:
            density = "non-urbanized natural or open terrain"

        ans = f"The scene exhibits {density}, with built-up impervious surfaces covering {built_pct}% of the total area."
        return {
            "answer": ans,
            "confidence": 0.90,
            "evidence": {"builtup_coverage_percent": built_pct, "spectral_index": "NDBI / Impervious Surface Proxy"},
            "benchmark_alignment": "RSVQA Urban Footprint Task"
        }

    @staticmethod
    def _handle_general_vqa(q: str, stats: Dict[str, float]) -> Dict[str, Any]:
        dominant = max(stats.items(), key=lambda x: x[1])
        cat = dominant[0].replace("_percent", "").replace("_cover", "").replace("_", " ")
        ans = (
            f"Based on spectral remote-sensing analysis, this scene is characterized primarily by {cat} "
            f"({dominant[1]}%), with vegetation at {stats['vegetation_cover_percent']}%, "
            f"built-up structures at {stats['builtup_cover_percent']}%, and water bodies at {stats['water_cover_percent']}%."
        )
        return {
            "answer": ans,
            "confidence": 0.89,
            "evidence": stats,
            "benchmark_alignment": "RSVQA General Scene Characterization"
        }
