"""
SatQuery AI - Report Generation Service
"""

from typing import Dict, Any
import json
import os

class ReportService:
    """Exports structured audit reports in JSON, Markdown, or HTML formats."""

    @staticmethod
    def generate_report(trace_dict: Dict[str, Any], fmt: str = "json") -> str:
        if fmt.lower() == "json":
            return json.dumps(trace_dict, indent=2)
        elif fmt.lower() == "markdown":
            summary = trace_dict.get("summary", {})
            lines = [
                f"# SatQuery AI Intelligence Report",
                f"- **Query**: {summary.get('query')}",
                f"- **Task**: {summary.get('task')}",
                f"- **Tool Dispatched**: {summary.get('tool_dispatched')}",
                f"- **Confidence**: {int(summary.get('confidence', 0)*100)}%",
                f"- **Latency**: {summary.get('total_latency_ms')} ms",
                "",
                "## Execution Events:"
            ]
            for ev in trace_dict.get("events", []):
                lines.append(f"- **{ev['stage']}** (+{ev['timestamp_ms']}ms)")
            return "\n".join(lines)
        else:
            return json.dumps(trace_dict)
