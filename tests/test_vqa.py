"""
Unit Tests for VQA and Captioning Specialists
"""

from models.vqa.inference import VQAInferencePipeline
from models.captioning.inference import CaptioningInferencePipeline
from models.grounding.inference import GroundingInferencePipeline
from satquery.data.sample_generator import generate_single_scene

def test_vqa_inference():
    img = generate_single_scene()
    pipe = VQAInferencePipeline()
    res = pipe.predict(img, "How many water bodies are visible?")
    assert "answer" in res
    assert res["confidence"] > 0.80

def test_captioning_inference():
    img = generate_single_scene()
    pipe = CaptioningInferencePipeline()
    res = pipe.predict(img)
    assert len(res["answer"]) > 50
    assert "detected_land_cover_classes" in res

def test_grounding_inference():
    img = generate_single_scene()
    pipe = GroundingInferencePipeline()
    res = pipe.predict(img, "Highlight water")
    assert "bounding_boxes" in res
    assert "binary_mask" in res
