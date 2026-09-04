"""
SatQuery AI - Remote Sensing Vision-Language Model (VLM)
PyTorch Neural Network with Multi-Band RS Visual Projection & Cross-Attention
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, Any, List
from .rs_encoder import ResNet18RS


class RSVLMModel(nn.Module):
    """
    Vision-Language Model for Remote Sensing VQA & Scene Reasoning.
    Fuses Sentinel-2 visual features with natural language questions.
    """
    def __init__(self, vocab_size: int = 2000, embed_dim: int = 512, num_classes: int = 256):
        super().__init__()
        self.vision_encoder = ResNet18RS.load_pretrained()
        self.visual_proj = nn.Sequential(
            nn.Linear(512, embed_dim),
            nn.LayerNorm(embed_dim),
            nn.ReLU(),
            nn.Dropout(0.1)
        )
        
        # Text embedding and projection
        self.token_embedding = nn.Embedding(vocab_size, embed_dim)
        self.text_encoder = nn.GRU(embed_dim, embed_dim // 2, batch_first=True, bidirectional=True)
        
        # Cross-Modal Attention Fusion
        self.cross_attention = nn.MultiheadAttention(embed_dim=embed_dim, num_heads=4, batch_first=True)
        
        # Output Answer Classifier
        self.classifier = nn.Sequential(
            nn.Linear(embed_dim, embed_dim),
            nn.ReLU(),
            nn.Dropout(0.15),
            nn.Linear(embed_dim, num_classes)
        )

    def forward(self, images: torch.Tensor, question_tokens: torch.Tensor) -> torch.Tensor:
        """
        images: (B, C, H, W) where C is up to 10 bands
        question_tokens: (B, seq_len)
        Returns: logits of shape (B, num_classes)
        """
        # 1. Visual representations
        img_feats = self.vision_encoder(images)  # (B, 512)
        v_proj = self.visual_proj(img_feats).unsqueeze(1)  # (B, 1, embed_dim)

        # 2. Text representations
        t_embed = self.token_embedding(question_tokens)  # (B, seq_len, embed_dim)
        t_out, _ = self.text_encoder(t_embed)  # (B, seq_len, embed_dim)

        # 3. Cross-modal multi-head attention: query=visual, key/value=text
        attn_out, _ = self.cross_attention(v_proj, t_out, t_out)  # (B, 1, embed_dim)
        fused = (v_proj + attn_out).squeeze(1)  # (B, embed_dim)

        # 4. Classification logits
        logits = self.classifier(fused)
        return logits

RemoteSensingVLM = RSVLMModel

