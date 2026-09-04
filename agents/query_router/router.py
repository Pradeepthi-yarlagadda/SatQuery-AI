from typing import Dict, Any, List
from agents.query_router.task_classifier import TaskClassifier


class QueryRouter:
    """Routes incoming multi-modal requests to the appropriate specialist tool name."""

    @classmethod
    def route(cls, query: str, images: list, has_sar: bool = False) -> Dict[str, Any]:
        res = TaskClassifier.classify(query, num_images=len(images), has_sar=has_sar)

        task_map = {
            "SINGLE_VQA": "vqa_tool",
            "SCENE_CAPTIONING": "captioning_tool",
            "REGION_GROUNDING": "grounding_tool",
            "CHANGE_DETECTION": "change_detection_tool",
            "CHANGE_VQA": "change_detection_tool",
            "CROSS_MODAL_FUSION": "optical_sar_tool"
        }
        res["tool_name"] = task_map.get(res["task"], "vqa_tool")
        return res
