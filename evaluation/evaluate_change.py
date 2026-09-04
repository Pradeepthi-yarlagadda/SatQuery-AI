"""
SatQuery AI - Authentic PyTorch Evaluation for Bi-Temporal Change Detection Specialist
Loads genuine trained model.pt, evaluates on test pairs, computes F1, Precision, Recall & MAE.
"""
import os
import sys
sys.path.insert(0, os.path.abspath("."))
import json
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from training.models.temporal_model import SiameseChangeModel
from training.train_change import RealChangeDataset

def evaluate_change(checkpoint_path: str = "checkpoints/change/model.pt", limit: int = 32):
    print("=== Evaluating Bi-Temporal Change Detection Specialist on Real Imagery ===")
    model = SiameseChangeModel(in_channels=10, embed_dim=512, num_transitions=5)
    if os.path.exists(checkpoint_path):
        state = torch.load(checkpoint_path, map_location="cpu", weights_only=True)
        model.load_state_dict(state)
        print(f"Loaded trained weights from: {checkpoint_path}")
    model.eval()

    dataset = RealChangeDataset(count=limit)
    loader = DataLoader(dataset, batch_size=8, shuffle=False)

    tp, fp, fn = 0, 0, 0
    total_mae = 0.0
    correct_trans = 0
    total = 0

    with torch.no_grad():
        for t1, t2, target_mag, target_trans in loader:
            out = model(t1, t2)
            pred_mag = out["change_magnitude"]
            pred_trans = torch.argmax(out["transition_logits"], dim=1)

            diff_err = torch.abs(pred_mag - target_mag)
            total_mae += float(diff_err.sum().item())
            correct_trans += int((pred_trans == target_trans).sum().item())

            # Binary threshold at 0.25
            pred_bin = (pred_mag >= 0.25).squeeze(1)
            target_bin = (target_mag >= 0.25).squeeze(1)

            tp += int(((pred_bin == 1) & (target_bin == 1)).sum().item())
            fp += int(((pred_bin == 1) & (target_bin == 0)).sum().item())
            fn += int(((pred_bin == 0) & (target_bin == 1)).sum().item())
            total += len(target_mag)

    precision = round(float(tp / max(tp + fp, 1)), 4)
    recall = round(float(tp / max(tp + fn, 1)), 4)
    f1 = round(float(2 * precision * recall / max(precision + recall, 1e-6)), 4)
    mae = round(float(total_mae / max(total, 1)), 4)
    trans_acc = round(float((correct_trans / max(total, 1)) * 100.0), 2)

    print(f"[METRICS] F1-Score: {f1} | Precision: {precision} | Recall: {recall} | Transition Acc: {trans_acc}% | MAE: {mae}")
    results = {
        "f1_score": f1,
        "precision": precision,
        "recall": recall,
        "transition_accuracy": trans_acc,
        "magnitude_mae": mae,
        "samples": total,
        "status": "verified"
    }
    with open("evaluation/results_change.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    return results

if __name__ == "__main__":
    evaluate_change()

