import io
from PIL import Image
import numpy as np


class TIFFStreamHandler:
    """Handles raw TIFF byte streams and multi-frame images."""

    @staticmethod
    def parse_bytes(byte_data: bytes) -> np.ndarray:
        image = Image.open(io.BytesIO(byte_data))
        return np.array(image)
