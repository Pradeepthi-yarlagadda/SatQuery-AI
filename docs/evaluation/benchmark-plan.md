# 📊 Benchmark Evaluation Plan

## 1. Single Scene VQA (RSVQA-HR)
- **Target Accuracy**: >85% Overall Accuracy (OA)
- **Evaluation Script**: `training/evaluation/evaluate_vqa.py`

## 2. Captioning & Grounding (VRSBench)
- **Target BLEU-4**: >0.40
- **Target mIoU**: >0.60
- **Evaluation Script**: `training/evaluation/evaluate_captioning.py`

## 3. Bi-Temporal Change Analysis (CDVQA)
- **Target F1-Score**: >85%
- **Evaluation Script**: `training/evaluation/evaluate_change.py`

## 4. Optical + SAR Fusion (ISRO Cartosat + RISAT)
- **Target Double-Bounce Recall**: >92%
- **Evaluation Script**: `training/evaluation/evaluate_multimodal.py`
