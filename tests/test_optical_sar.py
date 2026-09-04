"""
Unit Tests for Optical + SAR Model
"""

from models.optical_sar.inference import OpticalSARInferencePipeline
from satquery.data.sample_generator import generate_optical_sar_pair

def test_optical_sar_pipeline():
    opt, sar = generate_optical_sar_pair()
    pipe = OpticalSARInferencePipeline()
    res = pipe.predict(opt, sar, "Verify structures and water through clouds")
    assert res["confidence"] >= 0.90
    assert "fused_composite" in res
    assert res["metrics"]["confirmed_water_percent"] > 0
    assert res["metrics"]["confirmed_urban_percent"] > 0
