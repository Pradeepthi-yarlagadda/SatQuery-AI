import os
import numpy as np
from safetensors import safe_open

p18 = "A:/SatQuery-AI-Data/models/resnet18-s2-v0.2.0/model.safetensors"
with safe_open(p18, framework="numpy") as f:
    w_conv1 = f.get_tensor("model.vision_encoder.conv1.weight")
    print("ResNet18 conv1 weight shape:", w_conv1.shape)
    # Notice: 64 output channels, 12 input bands (Sentinel-2), 7x7 kernel!
    print("Input bands supported:", w_conv1.shape[1])

p50 = "A:/SatQuery-AI-Data/models/resnet50-all-v0.2.0/model.safetensors"
with safe_open(p50, framework="numpy") as f:
    w50_conv1 = f.get_tensor("model.vision_encoder.conv1.weight")
    print("ResNet50 conv1 weight shape:", w50_conv1.shape)
    # Notice: 64 output channels, 14 input bands (S1+S2), 7x7 kernel!
    print("Input bands supported:", w50_conv1.shape[1])
