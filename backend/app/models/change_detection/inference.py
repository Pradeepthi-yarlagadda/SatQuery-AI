from backend.app.models.change_detection.model import ChangeDetectionModel

class ChangeDetectionInference:
    def __init__(self):
        self.model = ChangeDetectionModel()
        self.model.eval()
    def run_inference(self, t1, t2):
        return self.model(t1, t2)
