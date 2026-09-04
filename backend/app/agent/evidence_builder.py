from typing import Dict, Any
from backend.app.agent.confidence import ConfidenceEngine


class EvidenceBuilder:
    BENCHMARK_MAP = {
        "SINGLE_VQA": "RSVQA-HR / VRSBench Multi-spectral Benchmark",
        "SCENE_CAPTIONING": "VRSBench Dense Captioning & BigEarthNet LULC",
        "REGION_GROUNDING": "VRSBench Visual Grounding & Spatial Localization",
        "CHANGE_DETECTION": "CDVQA Bi-temporal Change Mapping Benchmark",
        "CHANGE_VQA": "CDVQA Bi-temporal Visual Question Answering",
        "CROSS_MODAL_FUSION": "ISRO Cartosat-2S & RISAT-1A Microwave Synergy"
    }

    @classmethod
    def build_evidence(cls, tool_result: Dict[str, Any], task: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        output = dict(tool_result)
        conf = float(tool_result.get("confidence", 0.88))
        ans = tool_result.get("answer") or tool_result.get("caption") or "Analysis completed successfully."

        spatial_data = (
            tool_result.get("geojson")
            or tool_result.get("bounding_boxes")
            or tool_result.get("spatial_data")
        )

        # Extract structured metrics
        excluded = {
            "tool", "answer", "caption", "confidence", "geojson",
            "bounding_boxes", "spatial_data", "task", "visual_result", "visual_overlay"
        }
        metrics = {}
        if "metrics" in tool_result and isinstance(tool_result["metrics"], dict):
            metrics.update(tool_result["metrics"])
        if "evidence" in tool_result and isinstance(tool_result["evidence"], dict):
            metrics.update(tool_result["evidence"])
        if "statistics" in tool_result and isinstance(tool_result["statistics"], dict):
            metrics.update(tool_result["statistics"])
        for k, v in tool_result.items():
            if k not in excluded and not isinstance(v, (dict, list)):
                metrics[k] = v

        visual_result = (
            tool_result.get("visual_overlay")
            or tool_result.get("fused_composite")
            or tool_result.get("visual_result")
        )

        benchmark = tool_result.get("benchmark_alignment") or cls.BENCHMARK_MAP.get(task, "General Remote Sensing Standard")

        output = dict(tool_result)
        output.update({
            "task": task,
            "tool": tool_result.get("tool", getattr(tool_result, "name", "SpecialistEngine")),
            "answer": ans,
            "confidence": round(conf, 2),
            "confidence_breakdown": ConfidenceEngine.audit_breakdown(conf),
            "spatial_data": spatial_data,
            "visual_result": visual_result,
            "metrics": metrics,
            "benchmark_alignment": benchmark
        })
        return output
