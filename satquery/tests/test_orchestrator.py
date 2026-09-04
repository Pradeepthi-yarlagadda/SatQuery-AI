"""
Unit Tests for SatQuery AI Agent Orchestration & Specialist Dispatch
"""

import pytest
from satquery.agent.orchestrator import SatQueryAgent
from satquery.config import TaskType
from satquery.data.sample_generator import (
    generate_bitemporal_pair,
    generate_optical_sar_pair,
    generate_single_scene
)


@pytest.fixture
def agent():
    return SatQueryAgent()


def test_single_image_vqa_routing(agent):
    single_img = generate_single_scene()
    res = agent.process([single_img], "How many water bodies are present?")
    assert res["success"] is True
    assert res["task_type"] == TaskType.VQA
    assert res["confidence"] > 0.80
    assert "RSVQA" in res["trace"].summary["benchmark_alignment"]


def test_single_image_grounding_routing(agent):
    single_img = generate_single_scene()
    res = agent.process([single_img], "Highlight the water body")
    assert res["success"] is True
    assert res["task_type"] == TaskType.GROUNDING
    assert res["visual_result"] is not None
    assert "VRSBench" in res["trace"].summary["benchmark_alignment"]


def test_single_image_captioning_routing(agent):
    single_img = generate_single_scene()
    res = agent.process([single_img], "Describe this satellite image")
    assert res["success"] is True
    assert res["task_type"] == TaskType.CAPTIONING
    assert len(res["answer"]) > 50


def test_bitemporal_change_detection(agent):
    t1, t2 = generate_bitemporal_pair()
    res = agent.process([t1, t2], "What changed between these two dates?")
    assert res["success"] is True
    assert res["task_type"] == TaskType.CHANGE_DETECTION
    assert res["metrics"]["change_percentage"] > 5.0
    assert "Urban Expansion" in res["metrics"]["dominant_transition"]
    assert "CDVQA" in res["trace"].summary["benchmark_alignment"]


def test_optical_sar_fusion(agent):
    opt, sar = generate_optical_sar_pair()
    res = agent.process([opt, sar], "Use both optical and SAR to identify structures through cloud cover")
    assert res["success"] is True
    assert res["task_type"] == TaskType.OPTICAL_SAR_FUSION
    assert res["metrics"]["cloud_penetrated_pixels"] >= 0
    assert "Cartosat" in res["trace"].summary["benchmark_alignment"]
