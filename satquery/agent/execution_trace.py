"""
SatQuery AI - Auditable Execution Trace Engine
Generates transparent, auditable execution traces compliant with ISRO/SAC evaluation criteria.
"""

from typing import Dict, Any, List, Optional
import json
import time


class ExecutionTrace:
    """
    Captures end-to-end agentic reasoning telemetry, validation results,
    model dispatch decisions, physical computation parameters, and confidence metrics.
    """

    def __init__(self, query: str):
        self.query = query
        self.start_time = time.time()
        self.steps: List[Dict[str, Any]] = []
        self.summary: Dict[str, Any] = {}

    def log_step(self, stage: str, details: Dict[str, Any]):
        """Records a single phase in the agentic workflow."""
        elapsed = round((time.time() - self.start_time) * 1000, 1)
        self.steps.append({
            "stage": stage,
            "timestamp_ms": elapsed,
            "details": details
        })

    def finalize(
        self,
        task: str,
        model_name: str,
        benchmark: str,
        input_summary: str,
        status: str,
        answer: str,
        confidence: float,
        parameters_used: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Finalizes the execution trace and computes total turnaround time."""
        total_time_ms = round((time.time() - self.start_time) * 1000, 1)
        self.summary = {
            "task": task,
            "query": self.query,
            "input_summary": input_summary,
            "model_dispatched": model_name,
            "benchmark_alignment": benchmark,
            "validation_status": status,
            "parameters": parameters_used,
            "output_answer": answer,
            "confidence_score": round(confidence, 2),
            "execution_latency_ms": total_time_ms,
            "step_count": len(self.steps)
        }
        return self.to_dict()

    def to_dict(self) -> Dict[str, Any]:
        """Returns the full execution trace as a dictionary."""
        return {
            "summary": self.summary,
            "steps": self.steps
        }

    def to_markdown(self) -> str:
        """Formats the trace into an ISRO-compliant auditable markdown report."""
        s = self.summary
        md = [
            "### 🛰️ Auditable Execution Trace (ISRO/SAC Telemetry)",
            f"- **Task**: `{s.get('task', 'N/A')}`",
            f"- **User Query**: *\"{s.get('query', '')}\"*",
            f"- **Input Modality**: `{s.get('input_summary', 'N/A')}`",
            f"- **Input Validation**: **`{s.get('validation_status', 'N/A')}`**",
            f"- **Dispatched Specialist Model**: `{s.get('model_dispatched', 'N/A')}`",
            f"- **Evaluation Benchmark**: `{s.get('benchmark_alignment', 'N/A')}`",
            f"- **Model Parameters**: `{json.dumps(s.get('parameters', {}))}`",
            f"- **Confidence Score**: **`{int(s.get('confidence_score', 0.0) * 100)}%`**",
            f"- **Total Latency**: `{s.get('execution_latency_ms', 0)} ms`",
            "",
            "#### Workflow Sequence:",
        ]
        for step in self.steps:
            md.append(f"1. **{step['stage']}** (`+{step['timestamp_ms']}ms`)")
            for k, v in step["details"].items():
                md.append(f"   - *{k}*: {v}")

        return "\n".join(md)
