try:
    import torch
    _ = torch.zeros(1)
except (ImportError, OSError):
    from satquery.torch_compat import torch

from models.change_analysis.model import BiTemporalChangeDetector
from models.optical_sar.fusion import OpticalSARCrossAttentionFusion


def test_bitemporal_change_detector():
    model = BiTemporalChangeDetector()
    model.eval()
    t1 = torch.randn(1, 3, 512, 512)
    t2 = torch.randn(1, 3, 512, 512)
    res = model(t1, t2)
    assert "change_ratio" in res
    assert "change_type" in res


def test_optical_sar_fusion():
    model = OpticalSARCrossAttentionFusion(opt_channels=3, sar_channels=2)
    model.eval()
    opt = torch.randn(1, 3, 512, 512)
    sar = torch.randn(1, 2, 512, 512)
    preds, fused = model(opt, sar)
    assert preds.shape[1] == 2
