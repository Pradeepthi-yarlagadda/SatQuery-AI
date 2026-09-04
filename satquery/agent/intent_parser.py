"""
SatQuery AI - Query Intent Parser & Modality Classifier
Parses natural language queries to infer analytical task types, target categories,
and operational parameters.
"""

from typing import Dict, Any, List, Optional
from satquery.config import TaskType, SensorType


class IntentParser:
    """
    Analyzes natural language queries and input context to route
    to the appropriate specialist remote-sensing tool.
    """

    @classmethod
    def parse(
        cls,
        query: str,
        image_count: int,
        sensor_types: Optional[List[SensorType]] = None
    ) -> Dict[str, Any]:
        """
        Determines the target TaskType and extraction parameters from the user's query
        and available image modalities.
        """
        q = query.lower().strip()
        sensor_types = sensor_types or []

        # Check for multi-image scenarios first
        if image_count >= 2:
            # Check if one is Optical and one is SAR
            has_optical = any(s in [SensorType.OPTICAL_RGB, SensorType.OPTICAL_MULTISPECTRAL] for s in sensor_types)
            has_sar = any(s in [SensorType.SAR_SINGLE_POL, SensorType.SAR_DUAL_POL] for s in sensor_types)

            is_cross_modal_query = any(w in q for w in ["sar", "radar", "microwave", "cloud", "penetrat", "fuse", "both", "joint"])
            is_change_query = any(w in q for w in ["change", "differ", "increase", "decrease", "expand", "shrink", "growth", "between", "202", "compare", "temporal", "date", "then", "now"])

            if has_optical and has_sar and (is_cross_modal_query or not is_change_query):
                return {
                    "task_type": TaskType.OPTICAL_SAR_FUSION,
                    "confidence": 0.96,
                    "rationale": "Dual images with complementary Optical + SAR modalities detected; routing to Cross-Modal Fusion Engine."
                }
            
            # Otherwise default 2 images to Change Detection
            return {
                "task_type": TaskType.CHANGE_DETECTION,
                "confidence": 0.95,
                "rationale": "Bi-temporal image pair detected for change analysis; routing to CDVQA Multitemporal Engine."
            }

        # Single-image tasks
        # 1. Grounding / Region Localization
        if any(w in q for w in ["highlight", "ground", "locate", "outline", "box", "show me where", "find the", "segment", "pinpoint"]):
            return {
                "task_type": TaskType.GROUNDING,
                "confidence": 0.94,
                "rationale": "Query requests spatial localization/highlighting of target features; routing to VRS Grounding Specialist."
            }

        # 2. Scene Captioning / Summary
        if any(w in q for w in ["describe", "caption", "overview", "summary", "summarize", "tell me about this scene", "explain this image", "what does this image show"]):
            return {
                "task_type": TaskType.CAPTIONING,
                "confidence": 0.93,
                "rationale": "Query seeks comprehensive scene description; routing to VRS Captioning Specialist."
            }

        # 3. Default to Visual Question Answering (VQA)
        return {
            "task_type": TaskType.VQA,
            "confidence": 0.92,
            "rationale": "Specific analytical inquiry on single scene; routing to RS-VQA Specialist."
        }
