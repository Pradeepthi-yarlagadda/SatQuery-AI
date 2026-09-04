try:
    import torch
    _ = torch.zeros(1)
except (ImportError, OSError):
    from satquery.torch_compat import torch

from backend.app.agent.controller import AgentController
from backend.app.agent.task_classifier import AgentTaskClassifier
from backend.app.agent.input_validator import AgentInputValidator


def test_agent_controller_single_vqa():
    ctrl = AgentController()
    payload = [{
        "tensor": torch.randn(3, 512, 512),
        "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}
    }]
    res = ctrl.process_query("What land cover is visible?", payload)
    assert res["success"] is True
    assert res["task"] == "SINGLE_VQA"
    assert "answer" in res["result"]
    assert len(res["execution_trace"]) >= 4


def test_agent_controller_change_vqa():
    ctrl = AgentController()
    payloads = [
        {"tensor": torch.randn(3, 512, 512), "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}},
        {"tensor": torch.randn(3, 512, 512), "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}}
    ]
    res = ctrl.process_query("What changed between these dates?", payloads)
    assert res["success"] is True
    assert res["task"] == "CHANGE_VQA"
    assert "change_type" in res["result"]


def test_agent_controller_cross_modal():
    ctrl = AgentController()
    payloads = [
        {"tensor": torch.randn(3, 512, 512), "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}},
        {"tensor": torch.randn(2, 512, 512), "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 2}}
    ]
    res = ctrl.process_query("Analyze optical and radar backscatter", payloads, has_sar=True)
    assert res["success"] is True
    assert res["task"] == "CROSS_MODAL_FUSION"
    assert "built_up_affinity" in res["result"]


def test_agent_controller_captioning():
    ctrl = AgentController()
    payload = [{
        "tensor": torch.randn(3, 512, 512),
        "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}
    }]
    res = ctrl.process_query("Generate caption for this scene", payload)
    assert res["success"] is True
    assert res["task"] == "SCENE_CAPTIONING"
    assert "caption" in res["result"]
    assert res["result"]["confidence"] > 0.80


def test_agent_controller_grounding():
    ctrl = AgentController()
    payload = [{
        "tensor": torch.randn(3, 512, 512),
        "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3, "bounds": {"left": 77.20, "bottom": 28.60, "right": 77.25, "top": 28.65}}
    }]
    res = ctrl.process_query("Locate the airport runway", payload)
    assert res["success"] is True
    assert res["task"] == "REGION_GROUNDING"
    assert "geojson" in res["result"] or "bounding_boxes" in res["result"]


def test_agent_controller_change_detection():
    ctrl = AgentController()
    payloads = [
        {"tensor": torch.randn(3, 512, 512), "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}},
        {"tensor": torch.randn(3, 512, 512), "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}}
    ]
    res = ctrl.process_query("Detect change map and delta mask", payloads)
    assert res["success"] is True
    assert res["task"] == "CHANGE_DETECTION"
    assert "change_type" in res["result"] or "metrics" in res["result"]
