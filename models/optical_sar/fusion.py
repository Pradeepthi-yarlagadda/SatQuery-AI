from typing import Tuple, Any, Dict

try:
    import torch
    import torch.nn as nn
    _ = torch.zeros(1)
except (ImportError, OSError):
    from satquery.torch_compat import torch, nn


class OpticalSARCrossAttentionFusion(nn.Module):
    def __init__(self, opt_channels: int = 3, sar_channels: int = 2, embed_dim: int = 256, num_heads: int = 4):
        super().__init__()
        self.opt_proj = nn.Sequential(
            nn.Conv2d(opt_channels, embed_dim, kernel_size=3, padding=1),
            nn.BatchNorm2d(embed_dim),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((16, 16))
        )
        self.sar_proj = nn.Sequential(
            nn.Conv2d(sar_channels, embed_dim, kernel_size=3, padding=1),
            nn.BatchNorm2d(embed_dim),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((16, 16))
        )

        self.cross_attn = nn.MultiheadAttention(embed_dim=embed_dim, num_heads=num_heads, batch_first=True)
        self.norm = nn.LayerNorm(embed_dim)
        
        # Binary classification head: Built-up vs Water
        self.classifier = nn.Sequential(
            nn.Linear(embed_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 2),
            nn.Sigmoid()
        )

    def forward(self, opt: Any, sar: Any) -> Tuple[Any, Any]:
        f_opt = self.opt_proj(opt)
        f_sar = self.sar_proj(sar)

        b, c, h, w = f_opt.shape
        seq_opt = f_opt.view(b, c, -1).permute(0, 2, 1)  # [B, 256, embed_dim]
        seq_sar = f_sar.view(b, c, -1).permute(0, 2, 1)  # [B, 256, embed_dim]

        # Query = Optical (Boundary/Spectral), Key & Value = SAR (Dielectric roughness)
        attn_out, _ = self.cross_attn(query=seq_opt, key=seq_sar, value=seq_sar)
        fused = self.norm(seq_opt + attn_out)

        pooled = fused.mean(dim=1)  # [B, embed_dim]
        preds = self.classifier(pooled)  # [Built-up score, Water score]
        return preds, fused

    @staticmethod
    def execute_fusion(optical_img: Any, sar_img: Any, query: str = "") -> Dict[str, Any]:
        from satquery.models.optical_sar_fusion import OpticalSARFusionEngine
        return OpticalSARFusionEngine.fuse_and_analyze(optical_img, sar_img, query)


# Backward-compatible alias
MultimodalFusionCore = OpticalSARCrossAttentionFusion
