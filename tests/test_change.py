"""
Unit Tests for Change Analysis Model
"""

from models.change_analysis.inference import ChangeAnalysisInferencePipeline
from satquery.data.sample_generator import generate_bitemporal_pair

def test_change_analysis_pipeline():
    t1, t2 = generate_bitemporal_pair()
    pipe = ChangeAnalysisInferencePipeline()
    res = pipe.predict(t1, t2)
    assert res["change_percentage"] > 5.0
    assert "Urban Expansion" in res["dominant_transition"]
    assert "visual_overlay" in res
