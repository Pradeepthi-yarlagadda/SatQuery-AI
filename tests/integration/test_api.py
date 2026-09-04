from fastapi.testclient import TestClient
from backend.app.main import app

def test_analysis():
    client = TestClient(app)
    response = client.post('/api/analysis', json={'query': 'Describe the scene'})
    assert response.status_code == 200
    assert response.json()['task'] in ['captioning', 'SCENE_CAPTIONING']
