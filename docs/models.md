# 🛰️ Specialist AI Models Overview

| Model | Subdirectory | Purpose | Benchmark |
| :--- | :--- | :--- | :--- |
| **VQA** | `models/vqa/` | Answers single-image questions using biophysical indices and spatial statistics | RSVQA-HR |
| **Captioning** | `models/captioning/` | Generates executive summaries, technical reports, and BigEarthNet taxonomy mapping | VRSBench |
| **Grounding** | `models/grounding/` | Localizes text phrases to $[x_{min}, y_{min}, x_{max}, y_{max}]$ boxes & masks | VRSBench |
| **Change Analysis** | `models/change_analysis/` | Computes bi-temporal differencing and classifies semantic transitions | CDVQA |
| **Optical + SAR** | `models/optical_sar/` | Performs Lee filtering, dB calibration, double-bounce urban detection, and cloud penetration | ISRO Cartosat + RISAT |
