from typing import Dict, Any
import json
import time


class IntelligenceReportGenerator:
    @staticmethod
    def generate(trace: Dict[str, Any], fmt: str = "json") -> str:
        fmt_clean = fmt.lower().strip()
        task = trace.get("task", "REMOTE_SENSING_ANALYSIS")
        latency = trace.get("latency_ms", 0.0)
        res = trace.get("result", {})
        answer = res.get("answer") or res.get("caption") or "Analysis completed successfully."
        confidence = res.get("confidence", 0.90)
        metrics = res.get("metrics", {})
        exec_trace = trace.get("execution_trace", [])

        if fmt_clean == "json":
            return json.dumps({
                "title": "Orbit-IQ Geospatial Intelligence Dossier",
                "organization": "ISRO / Space Applications Centre (SIH26167)",
                "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "task": task,
                "latency_ms": latency,
                "confidence": confidence,
                "summary": answer,
                "metrics": metrics,
                "execution_trace": exec_trace,
                "raw_payload": trace
            }, indent=2)

        elif fmt_clean in ["md", "markdown"]:
            lines = [
                "# 🛰️ Orbit-IQ Geospatial Intelligence Dossier",
                "**Organization:** Indian Space Research Organisation (ISRO) / Space Applications Centre",
                f"**Generated:** {time.strftime('%Y-%m-%d %H:%M:%S UTC')}  ",
                f"**Specialist Task:** `{task}` | **Confidence:** `{round(confidence * 100, 1)}%` | **Latency:** `{latency} ms`",
                "",
                "---",
                "",
                "## 📋 Executive Summary",
                answer,
                "",
                "## 📊 Quantitative Biophysical Metrics",
            ]
            if metrics:
                lines.append("| Metric Parameter | Value |")
                lines.append("| :--- | :--- |")
                for k, v in metrics.items():
                    k_clean = str(k).replace("_", " ").title()
                    lines.append(f"| {k_clean} | `{v}` |")
            else:
                lines.append("- No secondary spectral parameters derived.")

            lines.extend([
                "",
                "## 🔍 Agentic Execution Trace",
                "| Milestone | Timestamp | Latency | Observation / Action |",
                "| :--- | :--- | :--- | :--- |"
            ])
            for step in exec_trace:
                s_name = step.get("step", "STEP")
                s_time = step.get("timestamp", "-")
                s_el = f"{step.get('elapsed_ms', 0)}ms"
                s_det = step.get("details", "")
                lines.append(f"| `{s_name}` | {s_time} | {s_el} | {s_det} |")

            lines.extend([
                "",
                "---",
                "*Digital dossier synthesized autonomously by Orbit-IQ Multi-Modal Agent Engine.*"
            ])
            return "\n".join(lines)

        elif fmt_clean in ["html", "htm"]:
            metric_rows = "".join([
                f"<tr><td style='padding:8px;border-bottom:1px solid #1f2937;'><strong>{str(k).replace('_', ' ').title()}</strong></td>"
                f"<td style='padding:8px;border-bottom:1px solid #1f2937;color:#38bdf8;'><code>{v}</code></td></tr>"
                for k, v in metrics.items()
            ])
            trace_rows = "".join([
                f"<tr><td style='padding:8px;border-bottom:1px solid #1f2937;'><code>{st.get('step')}</code></td>"
                f"<td style='padding:8px;border-bottom:1px solid #1f2937;'>{st.get('timestamp')}</td>"
                f"<td style='padding:8px;border-bottom:1px solid #1f2937;'>{st.get('details')}</td></tr>"
                for st in exec_trace
            ])

            return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Orbit-IQ Intelligence Dossier - {task}</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #030712; color: #f9fafb; margin: 40px auto; max-width: 900px; line-height: 1.6; }}
        .header {{ border-bottom: 2px solid #06b6d4; padding-bottom: 16px; margin-bottom: 24px; }}
        .badge {{ background: #0e7490; color: #e0f2fe; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; }}
        .card {{ background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 20px; margin-bottom: 20px; }}
        table {{ width: 100%; border-collapse: collapse; text-align: left; }}
        th {{ background: #1f2937; padding: 10px; color: #94a3b8; font-size: 13px; text-transform: uppercase; }}
        code {{ background: #1e293b; padding: 2px 6px; border-radius: 4px; color: #38bdf8; }}
    </style>
</head>
<body>
    <div class="header">
        <span class="badge">ISRO / SAC SIH26167</span>
        <h1 style="margin-top:10px;">🛰️ Orbit-IQ Mission Intelligence Dossier</h1>
        <p style="color:#94a3b8;">Autonomous Multimodal Remote Sensing Analysis | Generated {time.strftime('%Y-%m-%d %H:%M:%S')}</p>
    </div>
    <div class="card">
        <h3>Executive Summary</h3>
        <p>{answer}</p>
        <p><strong>Dispatched Specialist:</strong> <code>{task}</code> &nbsp;|&nbsp; <strong>Calibrated Confidence:</strong> <span style="color:#4ade80;font-weight:bold;">{round(confidence * 100, 1)}%</span> &nbsp;|&nbsp; <strong>Latency:</strong> {latency} ms</p>
    </div>
    <div class="card">
        <h3>Quantitative Biophysical Findings</h3>
        <table>
            <thead><tr><th>Metric Parameter</th><th>Computed Value</th></tr></thead>
            <tbody>{metric_rows if metric_rows else "<tr><td colspan='2' style='padding:8px;'>No specific scalar metrics.</td></tr>"}</tbody>
        </table>
    </div>
    <div class="card">
        <h3>Agent Execution Audit Trail</h3>
        <table>
            <thead><tr><th>Milestone</th><th>Time</th><th>Details</th></tr></thead>
            <tbody>{trace_rows}</tbody>
        </table>
    </div>
</body>
</html>"""

        return json.dumps(trace)
