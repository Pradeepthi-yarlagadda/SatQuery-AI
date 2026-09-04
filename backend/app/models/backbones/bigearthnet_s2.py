"""
BigEarthNet Sentinel-2 Multispectral Foundation Backbone (ResNet-18 S2)
Loads pretrained weights from A:/SatQuery-AI-Data/models/resnet18-s2-v0.2.0
"""

import os
from typing import Any
import numpy as np
from training.models.rs_encoder import RemoteSensingEncoder


class BigEarthNetS2Backbone:
    """Pretrained 10-band Sentinel-2 Multispectral Encoder."""
    def __init__(self, weights_root: str = "A:/SatQuery-AI-Data/models"):
        self.encoder = RemoteSensingEncoder(model_type="resnet18_s2", weights_root=weights_root)
        self.in_channels = 10
        self.embed_dim = 512
        self.name = "BigEarthNet-ResNet18-S2"

    def forward(self, tensor: Any) -> np.ndarray:
        return self.encoder.extract_features(tensor)

    def __call__(self, tensor: Any) -> np.ndarray:
        return self.forward(tensor)
