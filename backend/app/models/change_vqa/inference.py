from backend.app.models.change_vqa.model import ChangeVQAModel

class ChangeVQAInference:
    def __init__(self):
        self.model = ChangeVQAModel()
    def run_inference(self, t1, t2, query: str = ""):
        return self.model.execute(t1, t2, query)
