"""
CDVQA Bi-temporal Change Evaluation Metrics
"""

class CDVQAMetrics:
    @staticmethod
    def compute_change_f1(tp: int, fp: int, fn: int) -> float:
        precision = tp / (tp + fp + 1e-6)
        recall = tp / (tp + fn + 1e-6)
        f1 = 2 * (precision * recall) / (precision + recall + 1e-6)
        return round(f1 * 100.0, 2)
