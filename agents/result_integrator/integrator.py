"""
SatQuery AI - Result Integrator
"""

from typing import Dict, Any
from agents.result_integrator.confidence import ConfidenceCalibrator
from agents.result_integrator.evidence import EvidenceSynthesizer

class ResultIntegrator:
    """Merges model output, confidence metrics, and visual evidence into final response."""

    @classmethod
    def integrate(
        cls,
        tool_output: Dict[str, Any],
        task: str,
        validation_status: str
    ) -> Dict[str, Any]:
        raw_conf = tool_output.get("confidence", 0.90)
        calibrated_conf = ConfidenceCalibrator.calibrate(raw_conf, task, validation_status)
        evidence = EvidenceSynthesizer.format_evidence(tool_output, task)

        return {
            "answer": tool_output.get("answer", "Analysis completed."),
            "confidence": calibrated_conf,
            "metrics": evidence["metrics"],
            "visual_result": evidence["visual_result"],
            "benchmark": evidence["benchmark"]
        }
