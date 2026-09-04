from typing import Dict, Any


class AgentTaskClassifier:
    TASK_CHANGE = "CHANGE_VQA"
    TASK_CHANGE_VQA = "CHANGE_VQA"
    TASK_CHANGE_DETECTION = "CHANGE_DETECTION"
    TASK_FUSION = "CROSS_MODAL_FUSION"
    TASK_GROUNDING = "REGION_GROUNDING"
    TASK_CAPTIONING = "SCENE_CAPTIONING"
    TASK_VQA = "SINGLE_VQA"

    @classmethod
    def classify(cls, query: str, num_images: int = 1, has_sar: bool = False, **kwargs) -> Dict[str, Any]:
        q = query.lower()

        # Rule 1: Multi-temporal change patterns
        if num_images == 2 and not has_sar:
            if any(w in q for w in ["map", "difference", "delta", "mask", "detect change"]):
                return {"task": cls.TASK_CHANGE_DETECTION, "confidence": 0.98}
            return {"task": cls.TASK_CHANGE_VQA, "confidence": 0.98}

        if any(w in q for w in ["between these dates", "between these two", "over time", "increase", "decrease", "remained unchanged"]):
            return {"task": cls.TASK_CHANGE_VQA, "confidence": 0.95}

        if "change" in q:
            if any(w in q for w in ["map", "mask", "detect"]):
                return {"task": cls.TASK_CHANGE_DETECTION, "confidence": 0.96}
            return {"task": cls.TASK_CHANGE_VQA, "confidence": 0.95}

        # Rule 2: Cross-modal optical + SAR queries
        if has_sar or any(w in q for w in ["sar", "radar", "optical and sar", "penetrat", "backscatter", "microwave"]):
            return {"task": cls.TASK_FUSION, "confidence": 0.96}

        # Rule 3: Visual Grounding patterns
        if any(w in q for w in ["highlight", "where", "locate", "ground", "bounding box", "bbox", "find"]):
            return {"task": cls.TASK_GROUNDING, "confidence": 0.92}

        # Rule 4: Captioning and Scene Description
        if any(w in q for w in ["generate caption", "dense caption", "scene caption", "image caption", "caption this", "captioning", "describe the scene", "describe this scene", "scene description"]):
            return {"task": cls.TASK_CAPTIONING, "confidence": 0.94}

        # Baseline: Single-Image VQA
        return {"task": cls.TASK_VQA, "confidence": 0.90}
