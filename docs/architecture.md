# 🛰️ SatQuery AI - Architecture Design

## 1. High-Level Concept
SatQuery AI enables non-GIS experts to query multi-modal remote sensing imagery through natural language. Instead of five disconnected chatbots, SatQuery AI implements **one central SatQuery Agent** coordinating five specialist tools and models.

```
USER
 │
 ▼
┌─────────────────┐
│     WEB GUI     │ (Orbit IQ WebGL / Streamlit)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   BACKEND API   │ (FastAPI: /api/upload, /api/query, /api/reports)
└────────┬────────┘
         │
         ▼
┌───────────────────────┐
│     SATQUERY AGENT    │
│  • Query Router       │
│  • Input Validator    │
│  • Model Selector     │
│  • Execution Engine   │
│  • Result Integrator  │
│  • Execution Trace    │
└───────────┬───────────┘
            │
  ┌─────────┼─────────┬──────────────┬─────────────┐
  ▼         ▼         ▼              ▼             ▼
[ VQA ] [Caption] [Grounding] [Change Detect] [Optical+SAR]
```

## 2. Key Components
1. **`preprocessing/`**: GeoTIFF reader, radiometric normalization (2-98% percentile stretch), scene tiling, and cross-modal co-registration.
2. **`models/`**: Specialist algorithms adapted for nadir remote-sensing physics and microwave scattering.
3. **`agents/`**: Decision-making controller parsing intent, validating spatial constraints, and logging auditable traces.
4. **`tools/`**: Clean wrapper exposing models as modular tools to the agent.
5. **`backend/`**: FastAPI production web server.
