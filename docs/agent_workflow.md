# 🧠 Agent Workflow & Auditable Execution Trace

## Step-by-Step Agent Execution Sequence

```text
1. USER INGESTION
   │  Images (GeoTIFF/PNG) + Natural Language Question
   ▼
2. QUERY ROUTING (agents/query_router/)
   │  Parses text intent & counts modalities
   │  Resolves: vqa, captioning, grounding, change_detection, optical_sar
   ▼
3. INPUT VALIDATION (agents/input_validator/)
   │  Checks channel depth, dimensions, CRS alignment
   │  Verifies required pair count for bi-temporal & multimodal tasks
   ▼
4. MODEL SELECTION & DISPATCH (agents/model_selector/)
   │  Binds corresponding tool from AgentToolRegistry
   │  Invokes tool execution with parameters
   ▼
5. EVIDENCE INTEGRATION (agents/result_integrator/)
   │  Extracts visual overlays (bounding boxes, change heatmap, false-color composite)
   │  Calculates calibrated confidence score
   ▼
6. TELEMETRY LOGGING (agents/execution_trace/)
   │  Generates timestamped execution events
   │  Outputs ISRO-compliant Auditable Execution Trace (JSON & Markdown)
```
