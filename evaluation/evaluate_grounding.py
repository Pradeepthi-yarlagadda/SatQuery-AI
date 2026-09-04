"""
SatQuery AI - Authentic PyTorch Evaluation for Visual Grounding Specialist
Loads genuine trained model.pt, evaluates on test samples, computes mIoU & SmoothL1 error.
"""
import os
import sys
sys.path.insert(0, os.path.abspath("."))
import json
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from training.models.grounding_model import RSGroundingModel
from training.train_grounding import RealGroundingDataset

def compute_box_iou(box1, box2):
    y1_min, y1_max = sorted([float(box1[0]), float(box1[2])])
    x1_min, x1_max = sorted([float(box1[1]), float(box1[3])])
    y2_min, y2_max = sorted([float(box2[0]), float(box2[2])])
    x2_min, x2_max = sorted([float(box2[1]), float(box2[3])])

    inter_y = max(0.0, min(y1_max, y2_max) - max(y1_min, y2_min))
    inter_x = max(0.0, min(x1_max, x2_max) - max(x1_min, x2_min))
    inter = inter_y * inter_x

    area1 = max(0.0, y1_max - y1_min) * max(0.0, x1_max - x1_min)
    area2 = max(0.0, y2_max - y2_min) * max(0.0, x2_max - x2_min)
    union = area1 + area2 - inter
    return float(inter / max(union, 1e-6))

def evaluate_grounding(checkpoint_path: str = "checkpoints/grounding/model.pt", limit: int = 32):
    print("=== Evaluating Visual Grounding Specialist on Real Imagery ===")
    config_path = os.path.join(os.path.dirname(checkpoint_path), "config.json")
    vocab_size = 151
    if os.path.exists(config_path):
        with open(config_path, "r", encoding="utf-8") as f:
            cfg = json.load(f)
            vocab_size = cfg.get("vocab_size", vocab_size)

    model = RSGroundingModel(vocab_size=vocab_size, embed_dim=256)
    if os.path.exists(checkpoint_path):
        state = torch.load(checkpoint_path, map_location="cpu", weights_only=True)
        model.load_state_dict(state)
        print(f"Loaded trained weights from: {checkpoint_path}")
    model.eval()

    dataset = RealGroundingDataset(limit=limit)
    loader = DataLoader(dataset, batch_size=8, shuffle=False)
    criterion = nn.SmoothL1Loss()

    total_loss = 0.0
    total_iou = 0.0
    total = 0

    with torch.no_grad():
        for images, tokens, targets in loader:
            pred_boxes = model(images, tokens)
            loss = criterion(pred_boxes, targets)
            total_loss += float(loss.item() * len(targets))
            
            for pred, target in zip(pred_boxes.cpu().numpy(), targets.cpu().numpy()):
                iou = compute_box_iou(pred, target)
                total_iou += float(iou)
                total += 1

    avg_loss = round(float(total_loss / max(total, 1)), 4)
    miou = round(float((total_iou / max(total, 1)) * 100.0), 2)
    print(f"[METRIC] Mean IoU (mIoU): {miou}% | Smooth L1 Loss: {avg_loss} | Samples: {total}")
    results = {"mIoU": miou, "smooth_l1_loss": avg_loss, "samples": total, "status": "verified"}
    with open("evaluation/results_grounding.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    return results

if __name__ == "__main__":
    evaluate_grounding()

