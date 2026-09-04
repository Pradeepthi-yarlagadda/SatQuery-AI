"""
SatQuery AI - Remote Sensing Input & Co-Registration Validator
Validates image counts, spatial dimensions, sensor metadata, and modality compatibility.
"""

from typing import Dict, Any, List, Optional
from satquery.core.geo_processor import GeoImage, validate_spatial_alignment
from satquery.config import TaskType, SensorType


class InputValidator:
    """
    Ensures input satellite imagery meets physical and algorithmic requirements
    before specialist model execution.
    """

    @classmethod
    def validate(
        cls,
        images: List[GeoImage],
        target_task: TaskType
    ) -> Dict[str, Any]:
        """
        Validates the input scene(s) against the intended task requirements.
        Returns validation status, telemetry, warnings, and error messages if any.
        """
        count = len(images)
        checks = []
        is_valid = True
        warnings = []
        errors = []

        # 1. Image count checks
        if count == 0:
            return {
                "valid": False,
                "status": "FAILED",
                "errors": ["No satellite imagery provided. Please upload at least one image."],
                "checks": ["Image presence: False"]
            }

        checks.append(f"Image count: {count}")

        # 2. Modality & Sensor inspection
        sensor_tags = [img.sensor_type.value for img in images]
        checks.append(f"Detected modalities: {', '.join(sensor_tags)}")

        # 3. Task-specific validation rules
        if target_task in [TaskType.VQA, TaskType.GROUNDING, TaskType.CAPTIONING]:
            if count > 1:
                warnings.append(f"Multiple images provided for single-image task ({target_task.value}). Analyzing primary scene (Image 1).")
            img = images[0]
            checks.append(f"Primary scene dimensions: {img.width}x{img.height} ({img.channels} channels)")

        elif target_task == TaskType.CHANGE_DETECTION:
            if count < 2:
                is_valid = False
                errors.append("Change analysis requires a bi-temporal pair (2 images across different dates). Only 1 image provided.")
            else:
                img1, img2 = images[0], images[1]
                alignment = validate_spatial_alignment(img1, img2)
                checks.append(f"Geometric alignment: {alignment['status']}")
                if alignment["requires_resampling"]:
                    warnings.append(f"Image dimensions differ ({img1.width}x{img1.height} vs {img2.width}x{img2.height}). Automatic spatial resampling will be applied.")

        elif target_task == TaskType.OPTICAL_SAR_FUSION:
            if count < 2:
                is_valid = False
                errors.append("Cross-modal fusion requires both an Optical scene and a SAR scene. Only 1 image provided.")
            else:
                img1, img2 = images[0], images[1]
                has_optical = any(s in [SensorType.OPTICAL_RGB, SensorType.OPTICAL_MULTISPECTRAL] for s in [img1.sensor_type, img2.sensor_type])
                has_sar = any(s in [SensorType.SAR_SINGLE_POL, SensorType.SAR_DUAL_POL] for s in [img1.sensor_type, img2.sensor_type])
                if not (has_optical and has_sar):
                    warnings.append("Dual images detected, but one was not explicitly recognized as SAR. Proceeding with cross-sensor heuristic fusion.")
                alignment = validate_spatial_alignment(img1, img2)
                checks.append(f"Cross-modal co-registration: {alignment['status']}")

        status_str = "PASSED" if is_valid and len(warnings) == 0 else ("PASSED_WITH_WARNINGS" if is_valid else "FAILED")

        return {
            "valid": is_valid,
            "status": status_str,
            "checks": checks,
            "warnings": warnings,
            "errors": errors,
            "image_count": count,
            "sensor_tags": sensor_tags
        }
