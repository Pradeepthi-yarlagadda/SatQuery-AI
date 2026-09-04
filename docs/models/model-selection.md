# 🤖 Specialist Model Selection Matrix

| Specialist Model | Backbone | Benchmark Target | Metric |
| :--- | :--- | :--- | :--- |
| **VQA Reasoning** | Vision-Language Cross-Attention | [RSVQA-HR](https://zenodo.org/records/6344367) / [VRSBench](https://huggingface.co/datasets/xiang709/VRSBench) | Overall Accuracy (OA) |
| **Dense Captioning** | Multi-Scale RS Decoder | [VRSBench Captioning](https://huggingface.co/datasets/xiang709/VRSBench) | BLEU-4, CIDEr |
| **Visual Grounding** | Regional Boundary Grounder | [VRSBench Grounding](https://huggingface.co/datasets/xiang709/VRSBench) | mIoU, AP50 |
| **Change Detection** | Siamese Difference Network | [CDVQA](https://github.com/YZHJessica/CDVQA) | Change F1-Score |
| **Optical-SAR Fusion**| Multi-Head Cross-Attention | [BigEarthNet.txt](https://huggingface.co/datasets/BIFOLD-BigEarthNetv2-0/BigEarthNet.txt) | Cloud Recall, Gain % |
