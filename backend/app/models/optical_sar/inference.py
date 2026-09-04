from backend.app.models.optical_sar.model import OpticalSARModel

class OpticalSARInference:
    def __init__(self):
        self.model = OpticalSARModel(opt_channels=3, sar_channels=2)
        self.model.eval()
    def run_inference(self, opt, sar):
        return self.model(opt, sar)
