"""
SatQuery AI - Execution Tracer (ISRO Auditable Standard)
"""

from typing import Dict, Any, List
import time
import json

class ExecutionTracer:
    """Records chronological execution telemetry for transparent model auditing."""

    def __init__(self, query: str):
        self.query = query
        self.start_time = time.time()
        self.events: List[Dict[str, Any]] = []
        self.summary: Dict[str, Any] = {}

    def log(self, stage: str, details: Dict[str, Any]):
        ms = round((time.time() - self.start_time) * 1000, 1)
        self.events.append({
            "stage": stage,
            "timestamp_ms": ms,
            "details": details
        })

    def finish(
        self,
        task: str,
        tool_name: str,
        benchmark: str,
        validation_status: str,
        confidence: float
    ) -> Dict[str, Any]:
        total_time_ms = round((time.time() - self.start_time) * 1000, 1)
        self.summary = {
            "query": self.query,
            "task": task,
            "tool_dispatched": tool_name,
            "benchmark_alignment": benchmark,
            "validation_status": validation_status,
            "confidence": confidence,
            "total_latency_ms": total_time_ms,
            "event_count": len(self.events)
        }
        return self.to_dict()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "summary": self.summary,
            "events": self.events
        }

    def to_markdown(self) -> str:
        s = self.summary
        lines = [
            "### 🛰️ ISRO Auditable Execution Trace",
            f"- **Task**: `{s.get('task', 'N/A')}`",
            f"- **Dispatched Tool**: `{s.get('tool_dispatched', 'N/A')}`",
            f"- **Benchmark**: `{s.get('benchmark_alignment', 'N/A')}`",
            f"- **Validation Status**: `{s.get('validation_status', 'N/A')}`",
            f"- **Latency**: `{s.get('total_latency_ms', 0)} ms`",
            "",
            "#### Pipeline Execution Stages:"
        ]
        for e in self.events:
            lines.append(f"1. **{e['stage']}** (`+{e['timestamp_ms']}ms`): {json.dumps(e['details'])}")
        return "\n".join(lines)
