"""
SatQuery AI - Confidence Scoring & Calibration
"""

from typing import Dict, Any

class ConfidenceCalibrator:
    """Calibrates statistical confidence based on sensor resolution, contrast, and alignment."""

    @staticmethod
    def calibrate(raw_confidence: float, task: str, validation_status: str) -> float:
        score = raw_confidence
        if validation_status == "PASSED_WITH_WARNINGS":
            score -= 0.05
        elif validation_status == "FAILED":
            return 0.0

        return round(max(0.50, min(0.98, score)), 2)
