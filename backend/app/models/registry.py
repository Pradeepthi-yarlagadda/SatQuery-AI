from typing import Dict, Any


class BackendModelRegistry:
    _models: Dict[str, Any] = {}

    @classmethod
    def register(cls, name: str, model_instance: Any):
        cls._models[name.lower()] = model_instance

    @classmethod
    def get(cls, name: str) -> Any:
        key = name.lower()
        if key not in cls._models:
            cls._lazy_load(key)
        return cls._models.get(key)

    @classmethod
    def list_models(cls) -> Dict[str, str]:
        return {
            "vqa": "RSVQA Reasoning Engine",
            "captioning": "Scene Understanding & LULC Captioner",
            "grounding": "Visual Localization & Bounding Box Engine",
            "change_detection": "Bi-Temporal Siamese Change Detector",
            "change_vqa": "Temporal Delta Reasoning Engine",
            "optical_sar": "Cross-Modal Optical+SAR Fusion Engine"
        }

    @classmethod
    def _lazy_load(cls, name: str):
        try:
            if name in ["vqa", "single_vqa"]:
                from backend.app.models.specialists.vqa import VQASpecialist
                cls._models[name] = VQASpecialist()
            elif name in ["captioning", "scene_captioning"]:
                from backend.app.models.specialists.captioning import CaptioningSpecialist
                cls._models[name] = CaptioningSpecialist()
            elif name in ["grounding", "region_grounding"]:
                from backend.app.models.specialists.grounding import GroundingSpecialist
                cls._models[name] = GroundingSpecialist()
            elif name in ["change_detection", "change"]:
                from backend.app.models.specialists.change_detection import ChangeDetectionSpecialist
                cls._models[name] = ChangeDetectionSpecialist()
            elif name in ["change_vqa"]:
                from backend.app.models.specialists.change_vqa import ChangeVQASpecialist
                cls._models[name] = ChangeVQASpecialist()
            elif name in ["optical_sar", "fusion", "cross_modal_fusion"]:
                from backend.app.models.specialists.optical_sar import OpticalSARSpecialist
                cls._models[name] = OpticalSARSpecialist()
        except Exception:
            pass


class ModelRegistry(BackendModelRegistry):
    """Scaffold-compatible model registry supporting instance and class methods."""
    def get(self, name: str) -> Any:
        return BackendModelRegistry.get(name)

