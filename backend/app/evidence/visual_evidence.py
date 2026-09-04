from typing import Dict, Any


class VisualEvidenceAggregator:
    @staticmethod
    def aggregate(tool_output: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "has_spatial_evidence": "geojson" in tool_output or "change_type" in tool_output,
            "details": tool_output
        }
