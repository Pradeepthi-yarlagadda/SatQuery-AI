from typing import List, Dict, Any
from backend.app.agent.task_classifier import AgentTaskClassifier
from backend.app.agent.input_validator import AgentInputValidator
from backend.app.agent.model_selector import AgentModelSelector
from backend.app.agent.evidence_builder import EvidenceBuilder
from backend.app.agent.execution_trace import AgentExecutionTracer


class AgentWorkflow:
    def __init__(self):
        self.selector = AgentModelSelector()

    def execute_workflow(
        self,
        query: str,
        image_payloads: List[Dict[str, Any]],
        has_sar: bool = False,
        task: str = None,
        parameters: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        tracer = AgentExecutionTracer(query)
        tracer.record_step("PARSING_INTENT", f"Query: '{query}'")

        # 1. Routing
        if task:
            task_name = str(task).upper()
            tracer.record_step("TASK_OVERRIDE", f"Explicit task specified: {task_name}")
        else:
            routing = AgentTaskClassifier.classify(query, num_images=len(image_payloads), has_sar=has_sar)
            task_name = routing["task"]
            tracer.record_step("ROUTER_DISPATCH", f"Task: {task_name} (Confidence: {routing['confidence']})")

        # 2. Validation
        validation = AgentInputValidator.validate(image_payloads, expected_task=task_name)
        for log in validation["logs"]:
            tracer.record_step("INPUT_VALIDATION", log)

        if not validation["valid"]:
            return {
                "success": False,
                "error": validation["error"],
                "execution_trace": tracer.export_trace()
            }

        # 3. Model Dispatch
        tool = self.selector.select(task_name)
        tool_name = getattr(tool, "name", str(tool))
        tracer.record_step("LOAD_SPECIALIST", f"Executing specialist tool: {tool_name}")

        meta0 = image_payloads[0].get("metadata", {}) if image_payloads else {}
        t0 = image_payloads[0]["tensor"] if image_payloads else None
        t1 = image_payloads[1]["tensor"] if len(image_payloads) > 1 else None

        if task_name == "SINGLE_VQA":
            raw_res = tool.execute(t0, query)
        elif task_name == "SCENE_CAPTIONING":
            raw_res = tool.execute(t0, query, meta0)
        elif task_name == "REGION_GROUNDING":
            raw_res = tool.execute(t0, query, meta0)
        elif task_name in ["CHANGE_DETECTION", "CHANGE_VQA"]:
            raw_res = tool.execute(t0, t1, query)
        elif task_name in ["CROSS_MODAL_FUSION", "OPTICAL_SAR"]:
            raw_res = tool.execute(t0, t1, query)
        else:
            raw_res = tool.execute(t0, query)

        # 4. Evidence Building
        evidence = EvidenceBuilder.build_evidence(raw_res, task_name, metadata=meta0)
        tracer.record_step("EVIDENCE_SYNTHESIS", "Synthesized findings, spatial evidence, and confidence metrics.")

        trace_list = tracer.export_trace()
        latency = trace_list[-1]["elapsed_ms"] if trace_list else 0.0

        return {
            "success": True,
            "task": task_name,
            "result": evidence,
            "execution_trace": trace_list,
            "latency_ms": latency
        }
