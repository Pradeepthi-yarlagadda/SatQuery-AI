from typing import Dict, Any
import numpy as np

try:
    import torch
    import torch.nn as nn
    _ = torch.zeros(1)
except (ImportError, OSError):
    from satquery.torch_compat import torch, nn


class BiTemporalChangeDetector(nn.Module):
    def __init__(self, in_channels: int = 3, feature_dim: int = 128, **kwargs):
        super().__init__()
        self.weights_path = kwargs.get("weights_path")
        # Shared Siamese Backbone
        self.backbone = nn.Sequential(
            nn.Conv2d(in_channels, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, feature_dim, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((32, 32))
        )
        
        # Differencing head
        self.diff_conv = nn.Sequential(
            nn.Conv2d(feature_dim, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(64, 1, kernel_size=1),
            nn.Sigmoid()
        )

    def forward(self, t1: Any, t2: Any) -> Dict[str, Any]:
        # Handle GeoImage input
        if hasattr(t1, "normalized_rgb") and hasattr(t2, "normalized_rgb"):
            # Use real physical change computation from satquery
            from satquery.core.change_engine import ChangeDetectionEngine
            return ChangeDetectionEngine.analyze_change(t1, t2)

        t1_in = t1 if getattr(t1, "ndim", 3) == 4 else t1.unsqueeze(0)
        t2_in = t2 if getattr(t2, "ndim", 3) == 4 else t2.unsqueeze(0)

        feat_t1 = self.backbone(t1_in)
        feat_t2 = self.backbone(t2_in)
        
        diff = abs(feat_t1 - feat_t2)
        change_mask = self.diff_conv(diff)  # [B, 1, 32, 32]
        
        change_ratio = float(change_mask.mean().item())
        if change_ratio > 0.15:
            change_type = "INCREASED"
        elif change_ratio < 0.04:
            change_type = "UNCHANGED"
        else:
            change_type = "LOCALIZED_SHIFT"

        return {
            "change_ratio": change_ratio,
            "change_type": change_type,
            "change_mask": change_mask,
            "dominant_transition": "Urban Expansion & Construction" if change_type == "INCREASED" else "Vegetation Stability",
            "change_percentage": round(change_ratio * 100.0, 2),
            "visual_overlay": np.zeros((512, 512, 3), dtype=np.float32)
        }


# Backward-compatible alias
ChangeAnalysisModel = BiTemporalChangeDetector
