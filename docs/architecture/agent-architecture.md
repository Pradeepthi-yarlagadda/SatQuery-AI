# 🧠 Orbit-IQ Agent Architecture

## Single Controller, Multi-Tool Design
Rather than spawning disparate ungrounded LLM instances, Orbit-IQ employs **one centralized controller** that routes requests across five deterministic remote-sensing tools:

| Component | Responsibility |
| :--- | :--- |
| **`QueryParser`** | Extracts keywords, temporal modifiers, and sensor indicators |
| **`TaskClassifier`** | Routes prompt into `SINGLE_VQA`, `REGION_GROUNDING`, `CHANGE_VQA`, or `CROSS_MODAL_FUSION` |
| **`InputValidator`** | Verifies CRS tags, band dimensions, and temporal co-registration |
| **`ModelSelector`** | Binds and invokes specialist tool singletons |
| **`EvidenceBuilder`**| Translates tensor outputs into GeoJSON polygons, change heatmaps, and metrics |
| **`ExecutionTracer`**| Records timestamped audit events conforming to ISRO standards |
