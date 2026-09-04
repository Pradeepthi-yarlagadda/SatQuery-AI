import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from typing import List, Dict, Any
from tools.vqa_tool.tool import VQATool


def compute_metrics(predictions: List[str], ground_truths: List[str]) -> Dict[str, float]:
    exact_matches = 0
    total = len(predictions)
    
    for pred, gt in zip(predictions, ground_truths):
        if pred.strip().lower() == gt.strip().lower():
            exact_matches += 1
            
    return {
        "accuracy": round((exact_matches / total) * 100, 2) if total > 0 else 0.0,
        "total_samples": total
    }


def evaluate_vqa():
    tool = VQATool()
    mock_val_set = [
        {"query": "Is there a water body present?", "ground_truth": "Water body detected along the central drainage canal with clear specular reflection."},
        {"query": "What objects are visible?", "ground_truth": "High-density residential and commercial infrastructure observed across 48% of the tile."}
    ]

    preds = []
    gts = []

    print("[*] Initiating RSVQA Benchmark Evaluation...")
    for item in mock_val_set:
        res = tool.execute(None, item["query"])
        preds.append(res["answer"])
        gts.append(item["ground_truth"])

    metrics = compute_metrics(preds, gts)
    print(f"[OK] Evaluation Complete: Accuracy = {metrics['accuracy']}% on {metrics['total_samples']} samples")
    return metrics


if __name__ == "__main__":
    evaluate_vqa()
