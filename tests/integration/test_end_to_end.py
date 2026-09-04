from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.api.routes.upload import UPLOADED_IMAGES
try:
    import torch
    _ = torch.zeros(1)
except (ImportError, OSError):
    from satquery.torch_compat import torch

client = TestClient(app)


def test_full_analysis_flow():
    # Mock an uploaded image in state
    img_id = "test-raster-e2e"
    UPLOADED_IMAGES[img_id] = {
        "filename": "delhi_test.tif",
        "tensor": torch.randn(3, 512, 512),
        "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}
    }

    # Query the analysis endpoint
    resp = client.post("/api/analysis", json={
        "query": "Is there water in this sector?",
        "image_ids": [img_id],
        "has_sar": False
    })
    assert resp.status_code == 200
    body = resp.json()
    assert body["success"] is True
    assert body["task"] == "SINGLE_VQA"
    assert "answer" in body["result"]
    assert len(body["execution_trace"]) > 0
