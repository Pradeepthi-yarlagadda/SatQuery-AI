"""
Unit Tests for Bi-temporal Change Detection Engine
"""

import numpy as np
from satquery.core.change_engine import ChangeDetectionEngine
from satquery.data.sample_generator import generate_bitemporal_pair


def test_change_detection_quantification():
    t1, t2 = generate_bitemporal_pair()
    res = ChangeDetectionEngine.analyze_change(t1, t2)
    
    assert res["change_percentage"] > 0.0
    assert res["changed_pixel_count"] > 0
    assert res["change_mask"].shape == (t1.height, t1.width)
    assert res["visual_overlay"].shape == (t1.height, t1.width, 3)
    assert "sector" in res["spatial_distribution"]
    assert res["confidence_score"] >= 0.75
