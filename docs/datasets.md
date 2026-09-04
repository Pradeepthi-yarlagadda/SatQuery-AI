# 🛰️ Datasets & Remote-Sensing Adaptation

## Mandatory Benchmarks for SIH26167

### 1. BigEarthNet (Sentinel-2 & Sentinel-1)
- **Role**: Foundational representation learning and domain adaptation.
- **Classes**: 19 CORINE Land Cover categories.
- **Why it matters**: Adapts the vision backbone to multispectral and dual-pol SAR scattering, overcoming generic web-VLM limitations.

### 2. RSVQA-HR
- **Role**: Single-scene Visual Question Answering.
- **Query Types**: Presence, Counting, Comparison, Rural vs Urban.

### 3. VRSBench
- **Role**: High-resolution Visual Remote Sensing Benchmark.
- **Tasks**: Visual Question Answering, Dense Scene Captioning, and Text-guided Visual Grounding (bounding boxes & segmentation masks).

### 4. CDVQA
- **Role**: Change Detection VQA on bi-temporal satellite image pairs.
- **Target**: Answering questions regarding land-use changes between Date $T_1$ and Date $T_2$.

### 5. ISRO Cartosat-2S + RISAT Testbed
- **Role**: Unseen evaluation benchmark.
- **Characteristics**: Sub-meter Optical (Cartosat-2S) paired with C-Band SAR (RISAT-1A).
