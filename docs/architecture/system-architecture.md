# 🛰️ Orbit-IQ System Architecture

## Overview
**Orbit-IQ** (SatQuery AI) is a next-generation remote-sensing intelligence platform designed for **SIH26167 (ISRO / Space Applications Centre)**. It bridges the gap between raw, complex multi-modal satellite observations and non-GIS operational decision-makers.

```
┌─────────────────────────────────────────────────────────────┐
│                 Orbit-IQ Frontend Interface                 │
│   (Next.js / React 18 / Three.js r128 / Leaflet / Tailwind) │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON / FormData
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 FastAPI Microservice Layer                  │
│       (/api/upload, /api/analysis, /api/temporal, etc.)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ In-Memory & File Descriptors
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Agentic Orchestrator                     │
│  Intent Parser ➔ Task Classifier ➔ Input Validator ➔ Tracer │
└──────────────────────────────┬──────────────────────────────┘
                               │ Dynamic Dispatch
       ┌───────────────────────┼──────────────────────┐
       ▼                       ▼                      ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ RS-VQA Core  │       │ CDVQA Siamese│       │ Optical-SAR  │
│  (RSVQA-HR)  │       │  Difference  │       │Cross-Attn Hub│
└──────────────┘       └──────────────┘       └──────────────┘
```

## System Tenets
1. **Auditable Execution**: Every tool dispatch is logged with millisecond timestamps and rationale to satisfy strict space agency validation criteria.
2. **Resilient Georeferencing**: Built with GDAL/Rasterio support and graceful pure-Python fallback to ensure portable zero-crash execution.
3. **True Cross-Modal Fusion**: Jointly processes Optical RGB/Multispectral and Synthetic Aperture Radar (SAR) backscatter intensity for cloud penetration and structural verification.
