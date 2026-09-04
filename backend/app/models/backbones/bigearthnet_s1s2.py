"""
BigEarthNet Sentinel-1 SAR + Sentinel-2 Joint Foundation Backbone (ResNet-50 All)
Loads pretrained weights from A:/SatQuery-AI-Data/models/resnet50-all-v0.2.0
"""

import os
from typing import Any
import numpy as np
from training.models.rs_encoder import RemoteSensingEncoder


class BigEarthNetS1S2Backbone:
    """Pretrained 12-band Sentinel-1 (VV/VH) + Sentinel-2 Joint Optical-SAR Encoder."""
    def __init__(self, weights_root: str = "A:/SatQuery-AI-Data/models"):
        self.encoder = RemoteSensingEncoder(model_type="resnet50_all", weights_root=weights_root)
        self.in_channels = 12
        self.embed_dim = 2048
        self.name = "BigEarthNet-ResNet50-All-S1S2"

    def forward(self, tensor: Any) -> np.ndarray:
        return self.encoder.extract_features(tensor)

    def __call__(self, tensor: Any) -> np.ndarray:
        return self.forward(tensor)
