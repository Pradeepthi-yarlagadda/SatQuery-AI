"""
Unit Tests for SAR Microwave Physics and Cross-Modal Fusion
"""

import numpy as np
from satquery.core.sar_engine import SAREngine
from satquery.models.optical_sar_fusion import OpticalSARFusionEngine
from satquery.data.sample_generator import generate_optical_sar_pair


def test_sar_speckle_filter_and_calibration():
    _, sar = generate_optical_sar_pair()
    res = SAREngine.process_sar_scene(sar, filter_speckle=True)
    
    assert "calibrated_sigma0_db" in res
    assert res["calibrated_sigma0_db"].shape == (sar.height, sar.width)
    assert res["statistics"]["water_detected_percent"] >= 0.0
    assert res["statistics"]["urban_structures_percent"] >= 0.0


def test_optical_sar_joint_fusion():
    opt, sar = generate_optical_sar_pair()
    res = OpticalSARFusionEngine.fuse_and_analyze(opt, sar, "Verify structures and water through clouds")
    
    assert res["confidence"] >= 0.90
    assert "fused_composite" in res
    assert res["fused_composite"].shape == (opt.height, opt.width, 3)
    assert res["metrics"]["confirmed_water_percent"] > 0
    assert res["metrics"]["confirmed_urban_percent"] > 0
