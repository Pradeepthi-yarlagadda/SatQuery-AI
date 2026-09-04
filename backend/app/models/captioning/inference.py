from backend.app.models.captioning.model import CaptioningModel

class CaptioningInference:
    def __init__(self):
        self.model = CaptioningModel()
    def run_inference(self, image_tensor):
        return self.model.describe(image_tensor)
