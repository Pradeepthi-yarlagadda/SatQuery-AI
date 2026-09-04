from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.api.routes.upload import UPLOADED_IMAGES
try:
    import torch
    _ = torch.zeros(1)
except (ImportError, OSError):
    from satquery.torch_compat import torch

client = TestClient(app)


def test_health_endpoints():
    r1 = client.get("/health")
    assert r1.status_code == 200
    assert r1.json()["status"] == "online"
    assert len(r1.json()["active_tools"]) == 6

    r2 = client.get("/api/health")
    assert r2.status_code == 200
    assert "active_tools" in r2.json()

    root_r = client.get("/")
    assert root_r.status_code == 200
    assert "supported_tasks" in root_r.json()


def test_projects_crud():
    # 1. Create project
    r = client.post("/api/projects", json={"name": "Test Mission", "description": "ISRO Testbed"})
    assert r.status_code == 200
    p_id = r.json()["project_id"]
    assert len(p_id) > 0

    # 2. List projects
    list_r = client.get("/api/projects")
    assert list_r.status_code == 200
    assert any(p["project_id"] == p_id for p in list_r.json())

    # 3. Get project by ID
    get_r = client.get(f"/api/projects/{p_id}")
    assert get_r.status_code == 200
    assert get_r.json()["name"] == "Test Mission"

    # 4. Delete project
    del_r = client.delete(f"/api/projects/{p_id}")
    assert del_r.status_code == 200
    assert del_r.json()["deleted"] is True


def test_report_export_and_download():
    # JSON report
    r_json = client.post("/api/report", json={"analysis_id": "test-123", "format": "json"})
    assert r_json.status_code == 200
    rep_id = r_json.json()["report_id"]
    assert "download_url" in r_json.json()

    # Download JSON
    dl_json = client.get(f"/api/report/{rep_id}/download")
    assert dl_json.status_code == 200
    assert "application/json" in dl_json.headers.get("content-type", "")

    # PDF report
    r_pdf = client.post("/api/report", json={"analysis_id": "test-123", "format": "pdf"})
    assert r_pdf.status_code == 200
    pdf_id = r_pdf.json()["report_id"]

    # Download PDF
    dl_pdf = client.get(f"/api/report/{pdf_id}/download")
    assert dl_pdf.status_code == 200
    assert "application/pdf" in dl_pdf.headers.get("content-type", "")
    assert dl_pdf.content.startswith(b"%PDF-1.4")
    assert dl_pdf.content.rstrip().endswith(b"%%EOF")

    # HTML report
    r_html = client.post("/api/report", json={"analysis_id": "test-123", "format": "html"})
    assert r_html.status_code == 200
    html_id = r_html.json()["report_id"]
    dl_html = client.get(f"/api/report/{html_id}/download")
    assert dl_html.status_code == 200
    assert "text/html" in dl_html.headers.get("content-type", "")


def test_v1_routes_and_specialists():
    # Seed a raster in UPLOADED_IMAGES
    img_id = "test-route-raster"
    UPLOADED_IMAGES[img_id] = {
        "filename": "sentinel2_tile.tif",
        "tensor": torch.randn(3, 512, 512),
        "metadata": {"crs": "EPSG:4326", "driver": "GTiff", "count": 3}
    }

    # Test /v1/orbit-iq/analyze
    r = client.post("/v1/orbit-iq/analyze", json={
        "query": "What land cover is visible?",
        "image_ids": [img_id]
    })
    assert r.status_code == 200
    assert r.json()["success"] is True

    # Test /api/specialists/vqa
    vqa_r = client.post("/api/specialists/vqa", json={
        "query": "Is water present in the image?",
        "image_ids": [img_id]
    })
    assert vqa_r.status_code == 200
    assert vqa_r.json()["task"] == "SINGLE_VQA"

    # Test /v1/validate
    val_r = client.post("/v1/validate", json={
        "image_ids": [img_id],
        "task": "SINGLE_VQA"
    })
    assert val_r.status_code == 200
    assert val_r.json()["valid"] is True

    # Test /v1/history
    hist_r = client.get("/v1/history")
    assert hist_r.status_code == 200
    assert "missions" in hist_r.json()
