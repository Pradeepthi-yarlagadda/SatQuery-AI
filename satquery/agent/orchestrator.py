"""
SatQuery AI - Master Agent Controller & Orchestration Engine
Implements the central agent manager: Understands query, validates inputs,
selects and executes specialist models, and returns an evidence-grounded response.
"""

from typing import List, Dict, Any, Optional, Union
import numpy as np
from PIL import Image

from satquery.config import TaskType, SensorType
from satquery.core.geo_processor import GeoImage
from satquery.agent.intent_parser import IntentParser
from satquery.agent.input_validator import InputValidator
from satquery.agent.execution_trace import ExecutionTrace
from satquery.models.registry import ModelRegistry


class SatQueryAgent:
    """
    Intelligent manager for remote sensing vision-language inquiries.
    Decouples user queries from specialized algorithmic selection.
    """

    def __init__(self):
        ModelRegistry._ensure_initialized()

    def process(
        self,
        images: List[Union[GeoImage, Image.Image, np.ndarray, str]],
        query: str,
        override_task: Optional[TaskType] = None
    ) -> Dict[str, Any]:
        """
        End-to-end agentic pipeline:
        1. Ingests and normalizes scenes into GeoImage objects
        2. Parses user intent from natural language
        3. Validates inputs & geometry
        4. Dispatches specialist tool
        5. Logs full execution trace
        6. Returns structured response with visual evidence
        """
        trace = ExecutionTrace(query=query)

        # Step 1: Ingest & Preprocess Scenes
        geo_images: List[GeoImage] = []
        for idx, img in enumerate(images):
            if isinstance(img, GeoImage):
                geo_images.append(img)
            else:
                geo_images.append(GeoImage.from_source(img, filename=f"image_{idx+1}.tif"))

        sensor_types = [img.sensor_type for img in geo_images]
        input_desc = f"{len(geo_images)} scene(s) [{' + '.join(s.value for s in sensor_types)}]"

        trace.log_step("Scene Ingestion & Normalization", {
            "scene_count": len(geo_images),
            "modalities_detected": [s.value for s in sensor_types],
            "resolutions": [f"{img.width}x{img.height}" for img in geo_images]
        })

        # Step 2: Intent Analysis & Task Inference
        if override_task:
            task_type = override_task
            intent_rationale = f"User explicitly selected mode: {override_task.value}"
        else:
            intent_result = IntentParser.parse(query, len(geo_images), sensor_types)
            task_type = intent_result["task_type"]
            intent_rationale = intent_result["rationale"]

        trace.log_step("Natural Language Intent Analysis", {
            "resolved_task": task_type.value,
            "routing_rationale": intent_rationale
        })

        # Step 3: Input Verification
        validation = InputValidator.validate(geo_images, task_type)
        trace.log_step("Input & Co-registration Validation", {
            "status": validation["status"],
            "checks": validation["checks"],
            "warnings": validation["warnings"]
        })

        if not validation["valid"]:
            error_msg = " ".join(validation["errors"])
            trace.finalize(
                task=task_type.value,
                model_name="N/A (Validation Aborted)",
                benchmark="N/A",
                input_summary=input_desc,
                status=validation["status"],
                answer=error_msg,
                confidence=0.0,
                parameters_used={}
            )
            return {
                "success": False,
                "answer": error_msg,
                "task_type": task_type,
                "confidence": 0.0,
                "visual_result": None,
                "metrics": {},
                "trace": trace
            }

        # Step 4: Model Selection & Execution from Registry
        specialist_info = ModelRegistry.get(task_type)
        if not specialist_info:
            raise RuntimeError(f"Specialist model for {task_type.value} not found in registry.")

        model_name = specialist_info["model_name"]
        engine_cls = specialist_info["engine_class"]
        benchmark = specialist_info["benchmark"]

        trace.log_step("Specialist Dispatch", {
            "selected_model": model_name,
            "benchmark": benchmark,
            "engine": engine_cls.__name__
        })

        # Step 5: Execute Specialist Model
        params_used = {}
        visual_result = None
        metrics = {}

        if task_type == TaskType.VQA:
            res = engine_cls.answer_query(geo_images[0], query)
            answer = res["answer"]
            confidence = res["confidence"]
            metrics = res["evidence"]
            params_used = {"spectral_indices": ["NDVI", "NDWI", "NDBI"], "analysis": "presence_count_comparison"}
            visual_result = geo_images[0].normalized_rgb

        elif task_type == TaskType.GROUNDING:
            res = engine_cls.ground_text(geo_images[0], query)
            answer = res["answer"]
            confidence = res["confidence"]
            visual_result = res["visual_overlay"]
            metrics = {
                "detected_regions": res["detected_regions_count"],
                "coverage_percent": res["total_coverage_percent"],
                "target_category": res["target_category"]
            }
            params_used = {"target": res["target_category"], "bbox_count": len(res["bounding_boxes"])}

        elif task_type == TaskType.CAPTIONING:
            res = engine_cls.generate_caption(geo_images[0])
            answer = res["answer"]
            confidence = res["confidence"]
            metrics = res["statistics"]
            params_used = {"classes_matched": res["detected_land_cover_classes"]}
            visual_result = geo_images[0].normalized_rgb

        elif task_type == TaskType.CHANGE_DETECTION:
            res = engine_cls.analyze_change(geo_images[0], geo_images[1])
            answer = (
                f"Multitemporal change analysis identified {res['change_percentage']}% total surface change, "
                f"{res['spatial_distribution']}. Dominant transition: **{res['dominant_transition']}**."
            )
            confidence = res["confidence_score"]
            visual_result = res["visual_overlay"]
            metrics = {
                "change_percentage": res["change_percentage"],
                "dominant_transition": res["dominant_transition"],
                "spatial_distribution": res["spatial_distribution"],
                "changed_pixel_count": res["changed_pixel_count"],
                "transition_breakdown": res["transition_breakdown"]
            }
            params_used = {"sensitivity_threshold": 0.30, "smoothing_sigma": 1.5}

        elif task_type == TaskType.OPTICAL_SAR_FUSION:
            # Determine which is Optical and which is SAR
            if geo_images[0].sensor_type in [SensorType.SAR_SINGLE_POL, SensorType.SAR_DUAL_POL]:
                sar_img, opt_img = geo_images[0], geo_images[1]
            else:
                opt_img, sar_img = geo_images[0], geo_images[1]

            res = engine_cls.fuse_and_analyze(opt_img, sar_img, query)
            answer = res["answer"]
            confidence = res["confidence"]
            visual_result = res["fused_composite"]
            metrics = res["metrics"]
            params_used = {"lee_filter_window": 5, "water_threshold_db": -12.0, "urban_threshold_db": -3.5}

        trace.log_step("Result Synthesis & Verification", {
            "confidence_computed": round(confidence, 2),
            "visual_evidence_generated": visual_result is not None,
            "metrics_extracted": len(metrics)
        })

        # Step 6: Finalize Trace
        trace.finalize(
            task=task_type.value,
            model_name=model_name,
            benchmark=benchmark,
            input_summary=input_desc,
            status=validation["status"],
            answer=answer,
            confidence=confidence,
            parameters_used=params_used
        )

        return {
            "success": True,
            "answer": answer,
            "task_type": task_type,
            "confidence": confidence,
            "visual_result": visual_result,
            "metrics": metrics,
            "trace": trace
        }
