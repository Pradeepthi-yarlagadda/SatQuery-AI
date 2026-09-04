import time
from typing import List, Dict, Any


class AgentExecutionTracer:
    def __init__(self, query: str):
        self.query = query
        self.start_time = time.time()
        self.trace_steps: List[Dict[str, Any]] = []

    def record_step(self, step: str, details: str):
        self.trace_steps.append({
            "step": step,
            "timestamp": time.strftime("%H:%M:%S"),
            "elapsed_ms": round((time.time() - self.start_time) * 1000, 2),
            "details": details
        })

    def export_trace(self) -> List[Dict[str, Any]]:
        return self.trace_steps
