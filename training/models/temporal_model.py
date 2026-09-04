"""
SatQuery AI - Bi-Temporal Siamese Change Detection Network (PyTorch Native)
Analyzes pre-event (T1) and post-event (T2) satellite image pairs.
"""

import torch
import torch.nn as nn
from .rs_encoder import ResNet18RS


class SiameseChangeModel(nn.Module):
    def __init__(self, in_channels: int = 10, embed_dim: int = 512, num_transitions: int = 5):
        super().__init__()
        self.encoder = ResNet18RS.load_pretrained()
        
        # Dual-temporal difference projection
        # Input has 4 feature interactions: [f1, f2, abs(f2 - f1), f1 * f2] -> 512 * 4 = 2048
        self.diff_head = nn.Sequential(
            nn.Linear(embed_dim * 4, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(512, 256),
            nn.ReLU()
        )
        
        # 1. Binary change probability & magnitude [0, 1]
        self.change_magnitude = nn.Sequential(
            nn.Linear(256, 1),
            nn.Sigmoid()
        )
        
        # 2. Semantic transition multi-class classifier
        self.transition_classifier = nn.Linear(256, num_transitions)

    def forward(self, img_t1: torch.Tensor, img_t2: torch.Tensor) -> Dict[str, torch.Tensor]:
        f1 = self.encoder(img_t1)  # (B, 512)
        f2 = self.encoder(img_t2)  # (B, 512)

        diff = torch.abs(f2 - f1)
        prod = f1 * f2
        combined = torch.cat([f1, f2, diff, prod], dim=1)  # (B, 2048)

        latent = self.diff_head(combined)  # (B, 256)
        magnitude = self.change_magnitude(latent)  # (B, 1)
        transitions = self.transition_classifier(latent)  # (B, num_transitions)

        return {
            "change_magnitude": magnitude,
            "transition_logits": transitions,
            "latent_delta": latent
        }


class TemporalModel(SiameseChangeModel):
    pass

SiameseTemporalModel = SiameseChangeModel

