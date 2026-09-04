from typing import Any
try:
    import torch
    _ = torch.zeros(1)
except (ImportError, OSError):
    from satquery.torch_compat import torch

from agents.execution_engine.executor import AgentExecutor


def test_agent_single_vqa():
    executor = AgentExecutor()
    mock_payload = [{
        "tensor": torch.randn(3, 512, 512),
        "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}
    }]
    
    res = executor.run("Describe the land cover in this scene.", mock_payload)
    assert res["success"] is True
    assert res["task"] == "SINGLE_VQA"
    assert "answer" in res["result"]


def test_agent_change_vqa():
    executor = AgentExecutor()
    mock_payloads = [
        {"tensor": torch.randn(3, 512, 512), "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}},
        {"tensor": torch.randn(3, 512, 512), "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}}
    ]
    
    res = executor.run("What changed between these dates?", mock_payloads)
    assert res["success"] is True
    assert res["task"] == "CHANGE_VQA"
    assert "change_type" in res["result"]


def test_agent_cross_modal_fusion():
    executor = AgentExecutor()
    mock_payloads = [
        {"tensor": torch.randn(3, 512, 512), "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}},
        {"tensor": torch.randn(2, 512, 512), "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 2}}
    ]
    
    res = executor.run("Use optical and SAR to analyze this region", mock_payloads, has_sar=True)
    assert res["success"] is True
    assert res["task"] == "CROSS_MODAL_FUSION"
    assert "built_up_affinity" in res["result"]


def test_agent_region_grounding():
    executor = AgentExecutor()
    mock_payload = [{
        "tensor": torch.randn(3, 512, 512),
        "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3, "bounds": {"left": 77.20, "bottom": 28.60, "right": 77.25, "top": 28.65}}
    }]
    
    res = executor.run("Highlight the water canal", mock_payload)
    assert res["success"] is True
    assert res["task"] == "REGION_GROUNDING"
    assert "geojson" in res["result"]


def test_crs_mismatch_rejection():
    executor = AgentExecutor()
    mock_payloads = [
        {"tensor": torch.randn(3, 512, 512), "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}},
        {"tensor": torch.randn(3, 512, 512), "metadata": {"crs": "EPSG:32643", "driver": "GTiff", "count": 3}}
    ]
    
    res = executor.run("What changed between these two images?", mock_payloads)
    assert res["success"] is False
    assert "CRS Mismatch" in res["error"]
