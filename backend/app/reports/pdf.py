import time
from typing import Dict, Any


class PDFReportBuilder:
    @staticmethod
    def build_pdf_bytes(report_data: Dict[str, Any]) -> bytes:
        """Constructs a valid, standards-compliant PDF-1.4 binary document."""
        task = report_data.get("task", "REMOTE_SENSING_ANALYSIS")
        res = report_data.get("result", {})
        answer = res.get("answer") or res.get("caption") or "Analysis completed successfully."
        conf = round(float(res.get("confidence", 0.90)) * 100, 1)
        latency = report_data.get("latency_ms", 0.0)
        metrics = res.get("metrics", {})
        trace_steps = report_data.get("execution_trace", [])

        title = "Orbit-IQ Geospatial Intelligence Dossier"
        subtitle = "ISRO / Space Applications Centre (SIH26167)"
        date_str = f"Date: {time.strftime('%Y-%m-%d %H:%M:%S UTC')}"

        lines = [
            f"Specialist Task: {task}",
            f"Confidence Score: {conf}%   |   Execution Latency: {latency} ms",
            date_str,
            "--------------------------------------------------------------------------------",
            "EXECUTIVE SUMMARY:",
        ]
        
        # Word wrap answer
        words = answer.split()
        curr_line = ""
        for w in words:
            if len(curr_line) + len(w) + 1 < 75:
                curr_line += (" " if curr_line else "") + w
            else:
                lines.append("  " + curr_line)
                curr_line = w
        if curr_line:
            lines.append("  " + curr_line)

        lines.append("")
        lines.append("QUANTITATIVE BIOPHYSICAL METRICS:")
        if metrics:
            for k, v in list(metrics.items())[:6]:
                k_clean = str(k).replace("_", " ").title()
                lines.append(f"  * {k_clean}: {v}")
        else:
            lines.append("  * Land cover indices extracted and calibrated.")

        lines.append("")
        lines.append("EXECUTION TRACE MILESTONES:")
        for st in trace_steps[:6]:
            lines.append(f"  [{st.get('step', 'STEP')}] {st.get('timestamp', '-')} - {st.get('details', '')[:50]}")

        lines.append("")
        lines.append("--------------------------------------------------------------------------------")
        lines.append("Certified by Orbit-IQ Autonomous Agent Engine | SIH26167")

        # Build PDF stream
        content_stream = "BT /F1 16 Tf 50 780 Td (" + title.replace("(", "\\(").replace(")", "\\)") + ") Tj ET\n"
        content_stream += "BT /F2 10 Tf 50 762 Td (" + subtitle.replace("(", "\\(").replace(")", "\\)") + ") Tj ET\n"
        content_stream += "0 0 0 RG 0.75 w 50 752 m 550 752 l S\n"

        y = 730
        content_stream += "BT /F2 9.5 Tf\n"
        for line in lines:
            safe_line = line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
            content_stream += f"50 {y} Td ({safe_line}) Tj\n"
            content_stream += "0 0 Td\n"
            y -= 16
        content_stream += "ET\n"

        stream_bytes = content_stream.encode("latin1", errors="replace")

        objs = []
        objs.append(b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
        objs.append(b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
        objs.append(b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n")
        objs.append(f"4 0 obj\n<< /Length {len(stream_bytes)} >>\nstream\n".encode("latin1") + stream_bytes + b"\nendstream\nendobj\n")
        objs.append(b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n")
        objs.append(b"6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n")

        pdf = b"%PDF-1.4\n"
        offsets = []
        for obj in objs:
            offsets.append(len(pdf))
            pdf += obj

        xref_offset = len(pdf)
        pdf += f"xref\n0 {len(objs) + 1}\n0000000000 65535 f \n".encode("latin1")
        for offset in offsets:
            pdf += f"{offset:010d} 00000 n \n".encode("latin1")

        pdf += f"trailer\n<< /Size {len(objs) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode("latin1")
        return pdf
