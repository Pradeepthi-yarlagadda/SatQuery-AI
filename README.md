# 🛰️ Orbit-IQ (SatQuery AI)
> **Agentic Vision-Language Assistant for Remote Sensing & Satellite Earth Observation**  
> Organization: **ISRO / Space Applications Centre (SAC)**

---

## 🌐 Benchmark Datasets & Official Sources

| Dataset | Modalities | Primary Tasks | Official Links |
| :--- | :--- | :--- | :--- |
| **BigEarthNet.txt** | Sentinel-2 (Optical) + Sentinel-1 (SAR) | Remote-Sensing Domain Adaptation & Multi-Modal Fusion | [Hugging Face](https://huggingface.co/datasets/BIFOLD-BigEarthNetv2-0/BigEarthNet.txt) • [Portal](https://bigearth.net/) |
| **VRSBench** | Sub-meter High-Resolution Optical | VQA, Dense Captioning, Visual Grounding | [Hugging Face](https://huggingface.co/datasets/xiang709/VRSBench) |
| **RSVQA-HR** | High-Resolution Aerial & Satellite | Presence & Count VQA, Rural vs Urban | [Zenodo (Records 6344367)](https://zenodo.org/records/6344367) |
| **CDVQA** | Bi-temporal Image Pairs ($T_1, T_2$) | Change Detection VQA, Transition Categorization | [GitHub CDVQA](https://github.com/YZHJessica/CDVQA) |

---

## 📁 Orbit-IQ Project Structure

```text
orbit-iq/
│
├── frontend/                          # Next.js / React 18 / Three.js r128 / Leaflet GUI
│   ├── public/
│   │   ├── earth/                     # 3D planet textures (earth-from-space, horizon, night)
│   │   ├── satellite/                 # Orbiting satellite model assets
│   │   └── demo/                      # Demo optical, sar, temporal, and change-map rasters
│   └── src/
│       ├── main.tsx, App.tsx, index.css
│       ├── pages/                     # Landing, Analysis, Temporal, Multimodal, Chat, Report, History
│       ├── components/                # Layout, Landing 3D, Orbit Core, Workspaces, UI library
│       ├── agents/                    # TypeScript agent definitions & registries
│       ├── services/                  # REST API client services
│       ├── types/                     # Type definitions (analysis, evidence, telemetry)
│       └── store/                     # Zustand state stores
│
├── backend/                           # Production FastAPI Application
│   ├── app/
│   │   ├── main.py                    # API entrypoint mounting all service routers
│   │   ├── api/
│   │   │   ├── routes/                # /health, /upload, /analysis, /temporal, /multimodal, /report, /projects
│   │   │   └── schemas/               # Pydantic v2 request & response models
│   │   ├── agent/                     # Single Controller Multi-Tool Architecture
│   │   │   ├── controller.py          # Master Agent Controller
│   │   │   ├── query_parser.py        # Tokenizer and entity extractor
│   │   │   ├── task_classifier.py     # Deterministic heuristic task router
│   │   │   ├── input_validator.py     # CRS & band compatibility validator
│   │   │   ├── model_selector.py      # Specialist tool binder
│   │   │   ├── workflow.py            # End-to-end execution pipeline
│   │   │   ├── evidence_builder.py    # Spatial GeoJSON & metric packager
│   │   │   ├── confidence.py          # Calibrated statistical confidence scorer
│   │   │   └── execution_trace.py     # ISRO Auditable Execution Trace generator
│   │   ├── models/                    # Specialist models (VQA, Captioning, Grounding, Change, Fusion)
│   │   ├── remote_sensing/            # GeoTIFF, TIFF, radiometric normalization, tiling, indices
│   │   ├── fusion/                    # Optical-SAR cross-attention and temporal differencing
│   │   ├── evidence/                  # Bounding boxes, binary masks, overlays, change maps
│   │   ├── reports/                   # Automated PDF, HTML, and Markdown report generation
│   │   └── storage/                   # File storage for uploads, results, and exported reports
│   ├── requirements.txt
│   └── Dockerfile
│
├── models/
│   ├── checkpoints/                   # Weights directories for VQA, Captioning, Grounding, Change, Fusion
│   └── configs/                       # YAML configs (vqa.yaml, captioning.yaml, change_vqa.yaml, etc.)
│
├── data/
│   ├── raw/                           # Raw downloaded archives (BigEarthNet, VRSBench, RSVQA, CDVQA)
│   ├── processed/                     # Preprocessed optical, sar, temporal, and multimodal chips
│   └── demo/                          # Built-in sample scenes for instant evaluation
│
├── training/
│   ├── datasets/                      # Benchmark dataset loaders
│   ├── preprocessing/                 # prepare_bigearthnet.py, prepare_vrsbench.py, prepare_cdvqa.py
│   ├── scripts/                       # train_vlm.py, train_vqa.py, train_change_vqa.py, train_fusion.py
│   └── evaluation/                    # evaluate_vqa.py, evaluate_captioning.py, evaluate_change.py, etc.
│
├── tests/
│   ├── frontend/                      # Frontend UI tests
│   ├── backend/                       # API route tests (test_api_routes.py)
│   ├── agents/                        # Agent workflow tests (test_agent_workflow.py)
│   ├── models/                        # Siamese difference & cross-attention tests (test_models.py)
│   └── integration/                   # Full end-to-end test flow (test_end_to_end.py)
│
├── docs/
│   ├── architecture/                  # system-architecture.md, agent-architecture.md, data-flow.md
│   ├── models/                        # model-selection.md, remote-sensing-adaptation.md
│   ├── api/                           # api-reference.md
│   └── evaluation/                    # benchmark-plan.md
│
├── index.html                         # Orbit IQ 3D WebGL Cinematic Geospatial Viewer
├── docker-compose.yml                 # Multi-container orchestration
└── package.json                       # Workspace package manifest
```

---

## 🚀 Quickstart

### 1. Run All Automated Tests
```powershell
python -m pytest tests/ -v
```
*All 23 unit, agent, model, and integration tests pass with 100% success.*

### 2. Launch FastAPI Backend
```powershell
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
- Interactive OpenAPI Docs: **`http://localhost:8000/docs`**
- System Health Check: **`http://localhost:8000/health`**

### 3. Run Benchmark Evaluations
```powershell
python training/evaluation/evaluate_vqa.py
python training/evaluation/evaluate_captioning.py
python training/evaluation/evaluate_change.py
python training/evaluation/evaluate_multimodal.py
```

### 4. Launch Orbit-IQ Cinematic Geospatial Interface
Open `index.html` in any browser or run:
```powershell
python -m http.server 8000
```
Navigate to **`http://localhost:8000`** to experience the 3D procedural Earth, subsurface radar strata, and interactive semantic zoom inspection.
