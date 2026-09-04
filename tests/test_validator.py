"""
Unit Tests for Input Validation and Geospatial Compatibility
"""

from agents.input_validator.validator import AgentInputValidator
from satquery.config import TaskType
from satquery.data.sample_generator import (
    generate_single_scene,
    generate_bitemporal_pair
)

def test_validator_single_image_success():
    img = generate_single_scene()
    res = AgentInputValidator.validate([img], TaskType.VQA)
    assert res["valid"] is True
    assert res["status"] in ["PASSED", "PASSED_WITH_WARNINGS"]

def test_validator_empty_failure():
    res = AgentInputValidator.validate([], TaskType.VQA)
    assert res["valid"] is False
    assert res["status"] == "FAILED"

def test_validator_change_missing_pair():
    img = generate_single_scene()
    res = AgentInputValidator.validate([img], TaskType.CHANGE_DETECTION)
    assert res["valid"] is False
    assert "requires 2 scenes" in res["errors"][0]

def test_validator_change_pair_success():
    t1, t2 = generate_bitemporal_pair()
    res = AgentInputValidator.validate([t1, t2], TaskType.CHANGE_DETECTION)
    assert res["valid"] is True
