"""
SatQuery AI - Remote Sensing Vision Encoders (PyTorch Native)
Implements ResNet-18 (Sentinel-2 10-band) and ResNet-50 (Sentinel-1/2 12-band)
Loads real weights directly from safetensors models in A:/SatQuery-AI-Data/models/
"""

import os
import torch
import torch.nn as nn
from typing import Dict, Any, Optional
from safetensors import safe_open


class BasicBlock(nn.Module):
    expansion = 1

    def __init__(self, inplanes: int, planes: int, stride: int = 1, downsample: Optional[nn.Module] = None):
        super().__init__()
        self.conv1 = nn.Conv2d(inplanes, planes, kernel_size=3, stride=stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(planes)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv2d(planes, planes, kernel_size=3, stride=1, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(planes)
        self.downsample = downsample

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        identity = x
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        if self.downsample is not None:
            identity = self.downsample(x)
        out += identity
        return self.relu(out)


class Bottleneck(nn.Module):
    expansion = 4

    def __init__(self, inplanes: int, planes: int, stride: int = 1, downsample: Optional[nn.Module] = None):
        super().__init__()
        self.conv1 = nn.Conv2d(inplanes, planes, kernel_size=1, bias=False)
        self.bn1 = nn.BatchNorm2d(planes)
        self.conv2 = nn.Conv2d(planes, planes, kernel_size=3, stride=stride, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(planes)
        self.conv3 = nn.Conv2d(planes, planes * self.expansion, kernel_size=1, bias=False)
        self.bn3 = nn.BatchNorm2d(planes * self.expansion)
        self.relu = nn.ReLU(inplace=True)
        self.downsample = downsample

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        identity = x
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.relu(self.bn2(self.conv2(out)))
        out = self.bn3(self.conv3(out))
        if self.downsample is not None:
            identity = self.downsample(x)
        out += identity
        return self.relu(out)


class ResNet18RS(nn.Module):
    """
    Sentinel-2 Multispectral 10-Band Remote Sensing Foundation Encoder (ResNet-18)
    """
    def __init__(self, in_channels: int = 10, embed_dim: int = 512):
        super().__init__()
        self.in_channels = in_channels
        self.embed_dim = embed_dim
        self.inplanes = 64

        self.conv1 = nn.Conv2d(in_channels, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.bn1 = nn.BatchNorm2d(64)
        self.relu = nn.ReLU(inplace=True)
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)

        self.layer1 = self._make_layer(64, 2, stride=1)
        self.layer2 = self._make_layer(128, 2, stride=2)
        self.layer3 = self._make_layer(256, 2, stride=2)
        self.layer4 = self._make_layer(512, 2, stride=2)
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))

    def _make_layer(self, planes: int, blocks: int, stride: int = 1) -> nn.Sequential:
        downsample = None
        if stride != 1 or self.inplanes != planes:
            downsample = nn.Sequential(
                nn.Conv2d(self.inplanes, planes, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(planes),
            )
        layers = [BasicBlock(self.inplanes, planes, stride, downsample)]
        self.inplanes = planes
        for _ in range(1, blocks):
            layers.append(BasicBlock(self.inplanes, planes))
        return nn.Sequential(*layers)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Standardize input channels
        if x.dim() == 3:
            x = x.unsqueeze(0)
        c = x.shape[1]
        if c < self.in_channels:
            pad = torch.zeros(x.shape[0], self.in_channels - c, x.shape[2], x.shape[3], device=x.device, dtype=x.dtype)
            x = torch.cat([x, pad], dim=1)
        elif c > self.in_channels:
            x = x[:, :self.in_channels, :, :]

        x = self.maxpool(self.relu(self.bn1(self.conv1(x))))
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
        x = self.avgpool(x)
        return torch.flatten(x, 1)

    @classmethod
    def load_pretrained(cls, path: str = "A:/SatQuery-AI-Data/models/resnet18-s2-v0.2.0/model.safetensors") -> "ResNet18RS":
        model = cls(in_channels=10, embed_dim=512)
        if os.path.exists(path):
            state = {}
            with safe_open(path, framework="pt") as f:
                for k in f.keys():
                    clean_k = k.replace("model.vision_encoder.", "")
                    if not clean_k.startswith("fc"):
                        state[clean_k] = f.get_tensor(k)
            model.load_state_dict(state, strict=False)
            model.eval()
        return model


class ResNet50RS(nn.Module):
    """
    Sentinel-1 SAR + Sentinel-2 Joint 12-Band Foundation Encoder (ResNet-50)
    """
    def __init__(self, in_channels: int = 12, embed_dim: int = 2048):
        super().__init__()
        self.in_channels = in_channels
        self.embed_dim = embed_dim
        self.inplanes = 64

        self.conv1 = nn.Conv2d(in_channels, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.bn1 = nn.BatchNorm2d(64)
        self.relu = nn.ReLU(inplace=True)
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)

        self.layer1 = self._make_layer(64, 3, stride=1)
        self.layer2 = self._make_layer(128, 4, stride=2)
        self.layer3 = self._make_layer(256, 6, stride=2)
        self.layer4 = self._make_layer(512, 3, stride=2)
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))

    def _make_layer(self, planes: int, blocks: int, stride: int = 1) -> nn.Sequential:
        downsample = None
        if stride != 1 or self.inplanes != planes * Bottleneck.expansion:
            downsample = nn.Sequential(
                nn.Conv2d(self.inplanes, planes * Bottleneck.expansion, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(planes * Bottleneck.expansion),
            )
        layers = [Bottleneck(self.inplanes, planes, stride, downsample)]
        self.inplanes = planes * Bottleneck.expansion
        for _ in range(1, blocks):
            layers.append(Bottleneck(self.inplanes, planes))
        return nn.Sequential(*layers)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        if x.dim() == 3:
            x = x.unsqueeze(0)
        c = x.shape[1]
        if c < self.in_channels:
            pad = torch.zeros(x.shape[0], self.in_channels - c, x.shape[2], x.shape[3], device=x.device, dtype=x.dtype)
            x = torch.cat([x, pad], dim=1)
        elif c > self.in_channels:
            x = x[:, :self.in_channels, :, :]

        x = self.maxpool(self.relu(self.bn1(self.conv1(x))))
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
        x = self.avgpool(x)
        return torch.flatten(x, 1)

    @classmethod
    def load_pretrained(cls, path: str = "A:/SatQuery-AI-Data/models/resnet50-all-v0.2.0/model.safetensors") -> "ResNet50RS":
        model = cls(in_channels=12, embed_dim=2048)
        if os.path.exists(path):
            state = {}
            with safe_open(path, framework="pt") as f:
                for k in f.keys():
                    clean_k = k.replace("model.vision_encoder.", "")
                    if not clean_k.startswith("fc"):
                        state[clean_k] = f.get_tensor(k)
            model.load_state_dict(state, strict=False)
            model.eval()
        return model


class RemoteSensingEncoder:
    """Wrapper class providing backward compatibility for feature extraction."""
    def __init__(self, model_type: str = "resnet18_s2", weights_root: str = "A:/SatQuery-AI-Data/models"):
        self.model_type = model_type
        if model_type == "resnet18_s2":
            self.model = ResNet18RS.load_pretrained(os.path.join(weights_root, "resnet18-s2-v0.2.0/model.safetensors"))
            self.embed_dim = 512
        else:
            self.model = ResNet50RS.load_pretrained(os.path.join(weights_root, "resnet50-all-v0.2.0/model.safetensors"))
            self.embed_dim = 2048

    def extract_features(self, tensor: Any) -> torch.Tensor:
        if not isinstance(tensor, torch.Tensor):
            tensor = torch.tensor(tensor, dtype=torch.float32)
        with torch.no_grad():
            features = self.model(tensor)
        return features.squeeze(0)
