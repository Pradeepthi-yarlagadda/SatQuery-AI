import time
from typing import List, Dict, Any

try:
    import torch
    _ = torch.zeros(1)
except (ImportError, OSError):
    from satquery.torch_compat import torch

from agents.query_router.task_classifier import TaskClassifier
from agents.input_validator.validator import InputValidator
from agents.model_selector.registry import ToolRegistry


class AgentExecutor:
    def __init__(self):
        self.registry = ToolRegistry()

    def run(self, query: str, image_payloads: List[Dict[str, Any]], has_sar: bool = False) -> Dict[str, Any]:
        trace = []
        start_time = time.time()
        
        # 1. Intent Classification
        trace.append({"step": "PARSING_INTENT", "timestamp": time.strftime("%H:%M:%S"), "details": f"Query: '{query}'"})
        routing = TaskClassifier.classify(query, num_images=len(image_payloads), has_sar=has_sar)
        task = routing["task"]
        trace.append({"step": "ROUTER_DISPATCH", "timestamp": time.strftime("%H:%M:%S"), "details": f"Task selected: {task} (Confidence: {routing['confidence']})"})

        # 2. Input Validation
        validation = InputValidator.validate(image_payloads, expected_task=task)
        for log in validation["logs"]:
            trace.append({"step": "INPUT_VALIDATION", "timestamp": time.strftime("%H:%M:%S"), "details": log})

        if not validation["valid"]:
            return {
                "success": False,
                "error": validation["error"],
                "trace": trace
            }

        # 3. Model Tool Execution
        tool = self.registry.get_tool(task)
        trace.append({"step": "LOAD_SPECIALIST", "timestamp": time.strftime("%H:%M:%S"), "details": f"Invoking tool: {tool.name}"})

        if task == "SINGLE_VQA":
            result = tool.execute(image_payloads[0]["tensor"], query)
        elif task == "SCENE_CAPTIONING":
            result = tool.execute(image_payloads[0]["tensor"], query, image_payloads[0].get("metadata", {}))
        elif task == "REGION_GROUNDING":
            result = tool.execute(image_payloads[0]["tensor"], query, image_payloads[0].get("metadata", {}))
        elif task in ["CHANGE_DETECTION", "CHANGE_VQA"]:
            result = tool.execute(image_payloads[0]["tensor"], image_payloads[1]["tensor"], query)
        elif task == "CROSS_MODAL_FUSION":
            result = tool.execute(image_payloads[0]["tensor"], image_payloads[1]["tensor"], query)
        else:
            result = {"answer": "Unhandled specialist operation.", "confidence": 0.0}

        elapsed = round((time.time() - start_time) * 1000, 2)
        trace.append({"step": "EVIDENCE_SYNTHESIS", "timestamp": time.strftime("%H:%M:%S"), "details": f"Execution completed in {elapsed}ms"})

        return {
            "success": True,
            "task": task,
            "result": result,
            "execution_trace": trace,
            "latency_ms": elapsed
        }

    def execute(self, images: list, query: str) -> Dict[str, Any]:
        """Convenience method adapting GeoImage or Tensor lists to run()."""
        payloads = []
        has_sar = False
        for idx, img in enumerate(images):
            if isinstance(img, dict):
                payloads.append(img)
            elif hasattr(img, "unsqueeze"):
                payloads.append({
                    "tensor": img,
                    "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": img.shape[0]}
                })
            else:
                # GeoImage object
                t = torch.from_numpy(img.normalized_rgb).permute(2, 0, 1).float()
                if "sar" in str(getattr(img, "sensor_type", "")).lower():
                    has_sar = True
                payloads.append({
                    "tensor": t,
                    "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": img.channels}
                })

        return self.run(query=query, image_payloads=payloads, has_sar=has_sar)
