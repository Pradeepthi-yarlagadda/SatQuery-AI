"""
SatQuery AI - Region Grounding & Bounding Box Regressor (PyTorch Native)
Regresses spatial bounding box coordinates [ymin, xmin, ymax, xmax] from text queries.
"""

import torch
import torch.nn as nn
from typing import Dict, Any
from .rs_encoder import ResNet18RS


class RSGroundingModel(nn.Module):
    def __init__(self, vocab_size: int = 500, embed_dim: int = 256):
        super().__init__()
        self.vision_encoder = ResNet18RS.load_pretrained()
        self.vis_proj = nn.Sequential(
            nn.Linear(512, embed_dim),
            nn.LayerNorm(embed_dim),
            nn.ReLU()
        )
        
        # Text query branch
        self.token_embed = nn.Embedding(vocab_size, embed_dim)
        self.text_gru = nn.GRU(embed_dim, embed_dim // 2, batch_first=True, bidirectional=True)
        
        # Cross-attention fusion
        self.cross_attn = nn.MultiheadAttention(embed_dim=embed_dim, num_heads=4, batch_first=True)
        
        # Box regressor head: outputs 4 coordinates [ymin, xmin, ymax, xmax] in [0, 1]
        self.box_head = nn.Sequential(
            nn.Linear(embed_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 4),
            nn.Sigmoid()
        )

    def forward(self, images: torch.Tensor, query_tokens: torch.Tensor) -> torch.Tensor:
        # Visual tokens
        v_feat = self.vis_proj(self.vision_encoder(images)).unsqueeze(1)  # (B, 1, embed_dim)
        
        # Text tokens
        t_embed = self.token_embed(query_tokens)  # (B, seq_len, embed_dim)
        t_out, _ = self.text_gru(t_embed)  # (B, seq_len, embed_dim)
        
        # Cross attention: query=visual, key/val=text
        attn_out, _ = self.cross_attn(v_feat, t_out, t_out)
        fused = (v_feat + attn_out).squeeze(1)  # (B, embed_dim)
        
        pred_boxes = self.box_head(fused)  # (B, 4)
        return pred_boxes


class GroundingModel(RSGroundingModel):
    pass
