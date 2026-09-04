from typing import Dict, Any
from models.change_analysis.model import BiTemporalChangeDetector


class TemporalFusionService:
    def __init__(self):
        self.model = BiTemporalChangeDetector()
        self.model.eval()

    def compare_dates(self, t1_tensor: Any, t2_tensor: Any) -> Dict[str, Any]:
        t1_in = t1_tensor if getattr(t1_tensor, "ndim", 3) == 4 else t1_tensor.unsqueeze(0)
        t2_in = t2_tensor if getattr(t2_tensor, "ndim", 3) == 4 else t2_tensor.unsqueeze(0)
        res = self.model(t1_in, t2_in)
        return {
            "change_type": res["change_type"],
            "change_ratio": round(res["change_ratio"], 4),
            "percentage": round(res["change_ratio"] * 100.0, 2)
        }
