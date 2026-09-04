"""
RSVQA Benchmark Evaluation Metrics
"""

from typing import List, Dict, Any
import numpy as np

class RSVQAMetrics:
    """Computes Overall Accuracy (OA), Average Accuracy (AA), and Count RMSE."""

    @staticmethod
    def compute_accuracy(predictions: List[str], ground_truth: List[str]) -> float:
        if not ground_truth:
            return 0.0
        correct = sum(1 for p, g in zip(predictions, ground_truth) if p.strip().lower() == g.strip().lower())
        return round(correct / len(ground_truth) * 100.0, 2)
