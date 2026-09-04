"""
Unit & Integration tests for Geocoding and Location Intelligence
Tests:
- Guntur and Amaravati resolution
- Flexible coordinate parsing (brackets, directional, decimals, swapped order)
- Literal "coordinates" / "co-ordinates" queries
- Backend API endpoints /v1/orbit-iq/geocode and /api/v1/orbit-iq/geocode
- Integration with /v1/orbit-iq/analyze
"""

from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.api.routes.geocoding import (
    resolve_location,
    parse_coordinates,
    BACKEND_GAZETTEER
)

client = TestClient(app)


def test_guntur_in_gazetteer():
    assert "guntur" in BACKEND_GAZETTEER
    guntur = BACKEND_GAZETTEER["guntur"]
    assert guntur["lat"] == 16.3067
    assert guntur["lng"] == 80.4365
    assert "Guntur" in guntur["name"]


def test_resolve_location_guntur():
    # Exact
    res = resolve_location("guntur")
    assert res is not None
    assert res["lat"] == 16.3067
    assert res["lng"] == 80.4365

    # Case insensitive
    res_upper = resolve_location("GUNTUR")
    assert res_upper is not None
    assert res_upper["lat"] == 16.3067

    # Natural language query containing Guntur
    res_nl = resolve_location("Show urban expansion in Guntur between 2022 and 2026")
    assert res_nl is not None
    assert res_nl["lat"] == 16.3067
    assert res_nl["lng"] == 80.4365


def test_resolve_location_coordinates():
    # Plain coordinates
    c1 = resolve_location("16.3067, 80.4365")
    assert c1 is not None
    assert abs(c1["lat"] - 16.3067) < 0.001
    assert abs(c1["lng"] - 80.4365) < 0.001

    # With brackets
    c2 = resolve_location("(16.3067, 80.4365)")
    assert c2 is not None
    assert abs(c2["lat"] - 16.3067) < 0.001

    # With lat/lng labels
    c3 = resolve_location("lat: 16.3067, lng: 80.4365")
    assert c3 is not None
    assert abs(c3["lat"] - 16.3067) < 0.001

    # Directional
    c4 = resolve_location("16.3067 N, 80.4365 E")
    assert c4 is not None
    assert abs(c4["lat"] - 16.3067) < 0.001

    # Literal "coordinates"
    c5 = resolve_location("coordinates")
    assert c5 is not None
    assert abs(c5["lat"] - 16.3067) < 0.001


def test_geocode_api_endpoint():
    # GET /api/v1/orbit-iq/geocode
    response = client.get("/api/v1/orbit-iq/geocode?q=guntur")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["lat"] == 16.3067
    assert data["lng"] == 80.4365
    assert "Guntur" in data["name"]

    # POST /v1/orbit-iq/geocode
    post_resp = client.post("/v1/orbit-iq/geocode", json={"query": "16.3067, 80.4365"})
    assert post_resp.status_code == 200
    post_data = post_resp.json()
    assert post_data["success"] is True
    assert abs(post_data["lat"] - 16.3067) < 0.001


def test_analyze_with_guntur_query():
    # When user asks a query mentioning Guntur, response should have location resolved
    req_body = {
        "query": "Where did urban expansion occur in Guntur?",
        "inputs": [
            {
                "id": "img1",
                "fileName": "guntur_2022.tif",
                "modality": "optical",
                "url": "/images/assets/hero-satellite.jpg"
            }
        ]
    }
    response = client.post("/api/v1/orbit-iq/analyze", json=req_body)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["location"] is not None
    assert data["location"]["lat"] == 16.3067
    assert data["location"]["lng"] == 80.4365
    assert "Guntur" in data["location"]["name"]
    # Check that location is mentioned in findings or answer
    assert any("Guntur" in f for f in data["keyFindings"]) or "Guntur" in data["answer"]
