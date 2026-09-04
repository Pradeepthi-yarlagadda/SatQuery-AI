import numpy as np


class PreprocessingPipeline:
    @staticmethod
    def clip_and_format(data: np.ndarray) -> np.ndarray:
        return np.nan_to_num(data, nan=0.0, posinf=1.0, neginf=0.0)
