from backend.app.models.grounding.model import GroundingModel

class GroundingInference:
    def __init__(self):
        self.model = GroundingModel()
    def run_inference(self, image_tensor, query: str, metadata: dict = None):
        return self.model.ground(image_tensor, query, metadata)
