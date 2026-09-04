"""
Optical + SAR Joint Cross-Modal Fusion Architecture.
Synergistic microwave and optical spectral integration.
"""
from .fusion_model import OpticalSARFusionModel

class OpticalSARModel(OpticalSARFusionModel):
    pass

__all__ = ["OpticalSARModel", "OpticalSARFusionModel"]
