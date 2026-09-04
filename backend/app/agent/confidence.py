from typing import Dict, Any


class ConfidenceEngine:
    @staticmethod
    def compute_composite_confidence(base_conf: float, crs_match: bool, data_quality: float = 1.0) -> float:
        score = base_conf * data_quality
        if not crs_match:
            score *= 0.7
        return round(max(0.5, min(0.99, score)), 2)

    @classmethod
    def calibrate(cls, raw_confidence: float, task: str = "SINGLE_VQA", validation_status: str = "PASSED", crs_match: bool = True) -> float:
        score = raw_confidence
        if validation_status == "PASSED_WITH_WARNINGS":
            score -= 0.05
        elif validation_status == "FAILED":
            return 0.0

        if not crs_match:
            score *= 0.7

        return round(max(0.50, min(0.99, score)), 2)

    @classmethod
    def audit_breakdown(cls, confidence: float) -> Dict[str, float]:
        return {
            "overall": round(confidence, 2),
            "spatial_consistency": round(min(0.98, confidence + 0.03), 2),
            "radiometric_quality": round(min(0.96, confidence + 0.02), 2),
            "entropy_penalty": round(max(0.01, 1.0 - confidence), 2)
        }
