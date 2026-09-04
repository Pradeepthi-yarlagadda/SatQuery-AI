"""
SatQuery AI - Evidence Synthesizer
"""

from typing import Dict, Any
import numpy as np

class EvidenceSynthesizer:
    """Consolidates visual artifacts, spatial masks, and biophysical metrics."""

    @staticmethod
    def format_evidence(tool_output: Dict[str, Any], task: str) -> Dict[str, Any]:
        metrics = {}
        visual = tool_output.get("visual_overlay")
        if visual is None:
            visual = tool_output.get("fused_composite")

        if "evidence" in tool_output:
            metrics = tool_output["evidence"]
        elif "metrics" in tool_output:
            metrics = tool_output["metrics"]
        elif "statistics" in tool_output:
            metrics = tool_output["statistics"]

        return {
            "metrics": metrics,
            "visual_result": visual,
            "benchmark": tool_output.get("benchmark_alignment", "General RS Standard")
        }
