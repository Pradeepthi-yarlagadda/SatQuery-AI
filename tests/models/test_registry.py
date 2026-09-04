from backend.app.models.registry import ModelRegistry

def test_registry():
    registry = ModelRegistry()
    for task in ['vqa', 'captioning', 'grounding', 'change_detection', 'change_vqa', 'optical_sar']:
        assert registry.get(task)
