"""
SatQuery AI - Model Registry & Specialist Tool Discovery
Implements a decoupled registry pattern for remote sensing specialist models.
"""

from typing import Dict, Any, Type, List, Optional
from satquery.config import TaskType


class ModelRegistry:
    """Central registry of remote sensing specialist engines and tools."""
    
    _registry: Dict[TaskType, Dict[str, Any]] = {}
    _initialized: bool = False

    @classmethod
    def register(
        cls,
        task_type: TaskType,
        model_name: str,
        description: str,
        benchmark: str,
        supported_sensors: List[str],
        engine_class: Any
    ):
        """Registers a specialist model with its capabilities and metadata."""
        cls._registry[task_type] = {
            "model_name": model_name,
            "description": description,
            "benchmark": benchmark,
            "supported_sensors": supported_sensors,
            "engine_class": engine_class
        }

    @classmethod
    def get(cls, task_type: TaskType) -> Optional[Dict[str, Any]]:
        """Retrieves specialist model metadata and class by task type."""
        cls._ensure_initialized()
        return cls._registry.get(task_type)

    @classmethod
    def list_available_models(cls) -> Dict[str, Dict[str, Any]]:
        """Returns all registered specialist models."""
        cls._ensure_initialized()
        return {
            task.value: {
                "name": info["model_name"],
                "benchmark": info["benchmark"],
                "sensors": info["supported_sensors"],
                "description": info["description"]
            }
            for task, info in cls._registry.items()
        }

    @classmethod
    def _ensure_initialized(cls):
        """Lazy auto-registration of all remote sensing specialist models."""
        if cls._initialized:
            return

        from satquery.models.vqa_engine import RSVQAEngine
        from satquery.models.grounding_engine import RegionGroundingEngine
        from satquery.models.captioning_engine import SceneCaptioningEngine
        from satquery.models.optical_sar_fusion import OpticalSARFusionEngine
        from satquery.core.change_engine import ChangeDetectionEngine

        cls.register(
            task_type=TaskType.VQA,
            model_name="RS-VQA Reasoning Specialist",
            description="Domain-adapted visual question answering on single optical/SAR scenes.",
            benchmark="RSVQA / VRSBench VQA Benchmark",
            supported_sensors=["Optical (RGB)", "Optical (Multispectral)", "SAR (Single/Dual)"],
            engine_class=RSVQAEngine
        )

        cls.register(
            task_type=TaskType.GROUNDING,
            model_name="VRS-Grounding Region Localizer",
            description="Text-guided spatial grounding predicting bounding boxes and semantic masks.",
            benchmark="VRSBench Visual Grounding Benchmark",
            supported_sensors=["Optical (RGB)", "Optical (Multispectral)"],
            engine_class=RegionGroundingEngine
        )

        cls.register(
            task_type=TaskType.CAPTIONING,
            model_name="VRS-Captioner & LULC Descriptor",
            description="Dense multi-scale scene captioning and BigEarthNet taxonomy mapping.",
            benchmark="VRSBench Dense Captioning / BigEarthNet LULC",
            supported_sensors=["Optical (RGB)", "Optical (Multispectral)", "SAR (Single/Dual)"],
            engine_class=SceneCaptioningEngine
        )

        cls.register(
            task_type=TaskType.CHANGE_DETECTION,
            model_name="CDVQA Multitemporal Change Engine",
            description="Bi-temporal differencing, semantic change classification, and change mapping.",
            benchmark="CDVQA (Change Detection VQA) Benchmark",
            supported_sensors=["Bi-temporal Optical Pair", "Bi-temporal SAR Pair"],
            engine_class=ChangeDetectionEngine
        )

        cls.register(
            task_type=TaskType.OPTICAL_SAR_FUSION,
            model_name="Cross-Modal Optical-SAR Fusion Specialist",
            description="Synergistic spectral-microwave fusion for cloud penetration and structure verification.",
            benchmark="ISRO Cartosat-2S + RISAT Cross-Modal Evaluation",
            supported_sensors=["Co-registered Optical + SAR Pair"],
            engine_class=OpticalSARFusionEngine
        )

        cls._initialized = True
