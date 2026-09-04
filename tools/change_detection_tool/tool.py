from typing import Dict, Any, List

try:
    import torch
    _ = torch.zeros(1)
except (ImportError, OSError):
    from satquery.torch_compat import torch

from models.change_analysis.model import BiTemporalChangeDetector


class ChangeDetectionTool:
    def __init__(self):
        self.name = "BiTemporal_Change_Engine"
        self.model = BiTemporalChangeDetector()
        self.model.eval()

    def execute(self, t1_tensor: Any, t2_tensor: Any, query: str = "") -> Dict[str, Any]:
        t1_in = t1_tensor if getattr(t1_tensor, "ndim", 3) == 4 else t1_tensor.unsqueeze(0)
        t2_in = t2_tensor if getattr(t2_tensor, "ndim", 3) == 4 else t2_tensor.unsqueeze(0)
        res = self.model(t1_in, t2_in)
        
        c_type = res["change_type"]
        ratio = res["change_ratio"]

        if c_type == "INCREASED":
            answer = f"The built-up surface area expanded substantially between the two dates (+{ratio*100:.1f}% shift)."
        elif c_type == "UNCHANGED":
            answer = "No significant structural or land-cover changes observed between the observation dates."
        else:
            answer = f"Localized alterations identified across the perimeter (+{ratio*100:.1f}% variance)."

        return {
            "tool": self.name,
            "change_type": c_type,
            "variance_ratio": round(ratio, 4),
            "answer": answer,
            "confidence": 0.87
        }

    def run(self, images: list, query: str = "", **kwargs) -> Dict[str, Any]:
        if len(images) < 2:
            raise ValueError("ChangeDetectionTool requires at least 2 images.")
        t1 = images[0] if hasattr(images[0], "unsqueeze") else torch.from_numpy(images[0].normalized_rgb).permute(2, 0, 1).float()
        t2 = images[1] if hasattr(images[1], "unsqueeze") else torch.from_numpy(images[1].normalized_rgb).permute(2, 0, 1).float()
        return self.execute(t1, t2, query)
