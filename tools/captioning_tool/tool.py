"""
SatQuery AI - Captioning Tool Interface
"""

from typing import Dict, Any, List
from satquery.core.geo_processor import GeoImage
from models.captioning.inference import CaptioningInferencePipeline

class CaptioningTool:
    """Agent tool for dense scene description and BigEarthNet LULC taxonomy extraction."""

    name = "captioning_tool"
    description = "Generates comprehensive multi-scale scene descriptions and land-use classifications."

    def __init__(self):
        self.pipeline = CaptioningInferencePipeline()

    def run(self, images: List[GeoImage], query: str = "", **kwargs) -> Dict[str, Any]:
        if not images:
            raise ValueError("CaptioningTool requires at least 1 image.")
        return self.pipeline.predict(images[0])

    def execute(self, image_tensor: Any, query: str = "", metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Unified execution interface accepting PyTorch tensor, numpy array, or GeoImage."""
        import numpy as np

        if isinstance(image_tensor, GeoImage):
            geo_img = image_tensor
        elif hasattr(image_tensor, "cpu") and hasattr(image_tensor, "numpy"):
            arr = image_tensor.cpu().numpy()
            if arr.ndim == 3 and arr.shape[0] in [1, 3, 4, 8, 12]:
                arr = np.transpose(arr[:3], (1, 2, 0))
            geo_img = GeoImage.from_source(arr, metadata=metadata)
        elif hasattr(image_tensor, "numpy"):
            arr = image_tensor.numpy()
            if arr.ndim == 3 and arr.shape[0] in [1, 3, 4, 8, 12]:
                arr = np.transpose(arr[:3], (1, 2, 0))
            geo_img = GeoImage.from_source(arr, metadata=metadata)
        elif isinstance(image_tensor, np.ndarray):
            arr = image_tensor
            if arr.ndim == 3 and arr.shape[0] in [1, 3, 4, 8, 12]:
                arr = np.transpose(arr[:3], (1, 2, 0))
            geo_img = GeoImage.from_source(arr, metadata=metadata)
        else:
            arr = np.array(image_tensor)
            if arr.ndim == 3 and arr.shape[0] in [1, 3, 4, 8, 12]:
                arr = np.transpose(arr[:3], (1, 2, 0))
            geo_img = GeoImage.from_source(arr, metadata=metadata)

        res = self.pipeline.predict(geo_img)
        caption = res.get("caption", "Scene description completed.")
        return {
            "answer": caption,
            "caption": caption,
            "confidence": res.get("confidence", 0.91),
            "lulc_distribution": res.get("lulc_distribution", {}),
            "metrics": res.get("lulc_distribution", {}),
            "tool": self.name
        }
