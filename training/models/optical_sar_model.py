"""
SatQuery AI - Cross-Modal Optical + SAR Joint Fusion Network (PyTorch Native)
Fuses Sentinel-2 Optical (10-band) and Sentinel-1 SAR (2-band VV/VH) modalities.
"""

import torch
import torch.nn as nn
from typing import Dict, Any
from .rs_encoder import ResNet18RS, ResNet50RS


class OpticalSARFusionModel(nn.Module):
    def __init__(self, num_classes: int = 19, embed_dim: int = 512):
        super().__init__()
        # Optical backbone: 10 Sentinel-2 bands
        self.optical_encoder = ResNet18RS.load_pretrained()
        self.opt_proj = nn.Sequential(
            nn.Linear(512, embed_dim),
            nn.LayerNorm(embed_dim),
            nn.ReLU()
        )
        
        # SAR backbone: Sentinel-1 SAR (takes 2 channels or 12 channels)
        self.sar_encoder = ResNet50RS.load_pretrained()
        self.sar_proj = nn.Sequential(
            nn.Linear(2048, embed_dim),
            nn.LayerNorm(embed_dim),
            nn.ReLU()
        )
        
        # Bidirectional cross-attention
        self.opt_to_sar_attn = nn.MultiheadAttention(embed_dim=embed_dim, num_heads=4, batch_first=True)
        self.sar_to_opt_attn = nn.MultiheadAttention(embed_dim=embed_dim, num_heads=4, batch_first=True)
        
        # Joint Classification head
        self.classifier = nn.Sequential(
            nn.Linear(embed_dim * 2, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_classes)
        )

    def forward(self, opt_images: torch.Tensor, sar_images: torch.Tensor) -> Dict[str, torch.Tensor]:
        """
        opt_images: (B, 10, H, W) or (B, 3, H, W)
        sar_images: (B, 2, H, W) or (B, 12, H, W)
        """
        # Feature extraction
        f_opt = self.optical_encoder(opt_images)  # (B, 512)
        f_sar = self.sar_encoder(sar_images)      # (B, 2048)

        p_opt = self.opt_proj(f_opt).unsqueeze(1) # (B, 1, embed_dim)
        p_sar = self.sar_proj(f_sar).unsqueeze(1) # (B, 1, embed_dim)

        # Cross-modal attention
        opt_attended, _ = self.opt_to_sar_attn(p_opt, p_sar, p_sar)
        sar_attended, _ = self.sar_to_opt_attn(p_sar, p_opt, p_opt)

        fused = torch.cat([(p_opt + opt_attended).squeeze(1), (p_sar + sar_attended).squeeze(1)], dim=1)
        logits = self.classifier(fused)  # (B, num_classes)

        return {
            "logits": logits,
            "fused_embedding": fused,
            "optical_feat": p_opt.squeeze(1),
            "sar_feat": p_sar.squeeze(1)
        }


class OpticalSARModel(OpticalSARFusionModel):
    pass
