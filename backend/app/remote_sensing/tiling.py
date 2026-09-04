from typing import List, Tuple
import numpy as np


class SwathTiler:
    @staticmethod
    def extract_chips(raster: np.ndarray, chip_size: int = 512, stride: int = 400) -> List[Tuple[np.ndarray, int, int]]:
        c, h, w = raster.shape
        chips = []
        for y in range(0, max(1, h - chip_size + 1), stride):
            for x in range(0, max(1, w - chip_size + 1), stride):
                chip = raster[:, y:y+chip_size, x:x+chip_size]
                chips.append((chip, x, y))
        return chips
