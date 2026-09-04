from backend.app.models.vqa.model import VQAModel


class VQAInference:
    def __init__(self):
        self.model = VQAModel()

    def run_inference(self, image_tensor, query: str):
        return self.model.predict(image_tensor, query)
