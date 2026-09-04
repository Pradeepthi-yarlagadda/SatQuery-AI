# 🔄 End-to-End Data Flow

```text
1. INGESTION
   User uploads GeoTIFF rasters (.tif) via /api/upload
   GeoTIFFHandler extracts CRS, transform bounds, and performs 2-98% radiometric stretch

2. DISPATCH
   User submits natural language question via /api/analysis
   AgentTaskClassifier checks modality tags & keywords (e.g. "change", "sar", "locate")
   InputValidator checks CRS match across pair candidates

3. INFERENCE
   Specialist models run:
   - RS-VQA: presence and count reasoning
   - Grounding: GeoJSON polygon boundary synthesis
   - Change: Siamese difference computation and transition categorization
   - Optical-SAR: Cross-attention fusion over Lee-filtered SAR backscatter

4. TELEMETRY & REPORTING
   Execution tracer synthesizes findings
   EvidenceBuilder packs spatial metadata
   Client receives structured JSON with calibrated confidence and full audit trace
```
