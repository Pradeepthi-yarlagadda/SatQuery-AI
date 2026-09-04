"""
SatQuery AI - Geospatial Image Processor
Handles remote sensing imagery loading, dynamic range stretching, band decomposition,
and spatial alignment validation.
"""

from typing import Tuple, Optional, Dict, Any, Union
import numpy as np
from PIL import Image
import io

from satquery.config import SensorType, DEFAULT_IMAGE_SIZE


class GeoImage:
    """
    Unified container for a remote-sensing scene (Optical or SAR).
    Encapsulates raw data, normalized display arrays, metadata, and spatial attributes.
    """

    def __init__(
        self,
        data: np.ndarray,
        sensor_type: Optional[SensorType] = None,
        metadata: Optional[Dict[str, Any]] = None,
        filename: Optional[str] = None,
    ):
        self.raw_data = data.astype(np.float32)
        self.filename = filename or "unnamed_scene.tif"
        self.metadata = metadata or {}
        
        # Ensure dimensions: (H, W) or (H, W, C)
        if self.raw_data.ndim == 2:
            self.height, self.width = self.raw_data.shape
            self.channels = 1
        elif self.raw_data.ndim == 3:
            self.height, self.width, self.channels = self.raw_data.shape
        else:
            raise ValueError(f"Unsupported image array dimensions: {self.raw_data.ndim}")

        # Infer or set sensor type
        self.sensor_type = sensor_type or self._infer_sensor_type()
        self.normalized_rgb = self._create_normalized_rgb()

    @classmethod
    def from_source(
        cls,
        source: Union[str, bytes, io.BytesIO, Image.Image, np.ndarray],
        sensor_hint: Optional[SensorType] = None,
        filename: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> "GeoImage":
        """Factory method to load from file path, bytes, PIL Image, or ndarray."""
        if isinstance(source, np.ndarray):
            arr = source
        elif isinstance(source, Image.Image):
            arr = np.array(source)
        elif isinstance(source, (bytes, io.BytesIO)):
            bio = io.BytesIO(source) if isinstance(source, bytes) else source
            pil_img = Image.open(bio)
            arr = np.array(pil_img)
        elif isinstance(source, str):
            pil_img = Image.open(source)
            arr = np.array(pil_img)
            if filename is None:
                filename = source
        else:
            raise TypeError(f"Cannot load GeoImage from type {type(source)}")

        return cls(arr, sensor_type=sensor_hint, filename=filename, metadata=metadata)

    def _infer_sensor_type(self) -> SensorType:
        """Heuristic sensor inference based on channel count, color dispersion, and speckle."""
        if self.channels == 1:
            # Grayscale / Single polarization radar
            # SAR typically has a Rayleigh / Gamma distribution with high speckle variance
            mean_val = np.mean(self.raw_data)
            std_val = np.std(self.raw_data)
            cv = (std_val / (mean_val + 1e-6))
            if cv > 0.45:
                return SensorType.SAR_SINGLE_POL
            return SensorType.OPTICAL_RGB

        if self.channels == 2:
            return SensorType.SAR_DUAL_POL

        if self.channels >= 3:
            # Check if all channels are identical (grayscale encoded as RGB)
            r, g, b = self.raw_data[:, :, 0], self.raw_data[:, :, 1], self.raw_data[:, :, 2]
            if np.allclose(r, g) and np.allclose(g, b):
                return SensorType.SAR_SINGLE_POL
            if self.channels > 3:
                return SensorType.OPTICAL_MULTISPECTRAL
            return SensorType.OPTICAL_RGB

        return SensorType.UNKNOWN

    def _create_normalized_rgb(self) -> np.ndarray:
        """Applies 2-98% percentile linear stretch and creates an 8-bit RGB representation."""
        if self.channels == 1:
            stretched = self._stretch_band(self.raw_data)
            return np.stack([stretched, stretched, stretched], axis=-1)
        elif self.channels == 2:
            # Dual-pol SAR (e.g. VV, VH) -> RGB composite with ratio
            ch1 = self._stretch_band(self.raw_data[:, :, 0])
            ch2 = self._stretch_band(self.raw_data[:, :, 1])
            ratio = self._stretch_band(ch1 / (ch2 + 1e-5))
            return np.stack([ch1, ch2, ratio], axis=-1)
        else:
            # Multi-channel / Optical RGB
            r = self._stretch_band(self.raw_data[:, :, 0])
            g = self._stretch_band(self.raw_data[:, :, 1])
            b = self._stretch_band(self.raw_data[:, :, 2])
            return np.stack([r, g, b], axis=-1)

    @staticmethod
    def _stretch_band(band: np.ndarray, p_low: float = 2.0, p_high: float = 98.0) -> np.ndarray:
        """Percentile linear radiometric stretch commonly used in remote sensing."""
        b = band.astype(np.float32)
        valid = b[~np.isnan(b) & ~np.isinf(b)]
        if valid.size == 0:
            return np.zeros_like(band, dtype=np.uint8)
        
        vmin = np.percentile(valid, p_low)
        vmax = np.percentile(valid, p_high)
        if vmax <= vmin:
            vmax = vmin + 1e-5
            
        clipped = np.clip(b, vmin, vmax)
        normalized = ((clipped - vmin) / (vmax - vmin)) * 255.0
        return normalized.astype(np.uint8)

    def to_pil(self) -> Image.Image:
        """Returns the normalized visual representation as a PIL Image."""
        return Image.fromarray(self.normalized_rgb)

    def resize(self, size: Tuple[int, int] = DEFAULT_IMAGE_SIZE) -> "GeoImage":
        """Resizes the scene to standard spatial dimensions while preserving sensor type."""
        pil = self.to_pil().resize(size, Image.Resampling.BILINEAR)
        arr = np.array(pil)
        return GeoImage(arr, sensor_type=self.sensor_type, metadata=self.metadata, filename=self.filename)

    def get_rgb_channels(self) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """Extracts individual normalized R, G, B channel matrices in [0, 1]."""
        norm = self.normalized_rgb.astype(np.float32) / 255.0
        return norm[:, :, 0], norm[:, :, 1], norm[:, :, 2]


def validate_spatial_alignment(img1: GeoImage, img2: GeoImage) -> Dict[str, Any]:
    """
    Validates geometric compatibility and co-registration between two satellite scenes.
    Checks dimensions, aspect ratio, and structural overlap.
    """
    dim_match = (img1.height == img2.height) and (img1.width == img2.width)
    aspect1 = img1.width / img1.height
    aspect2 = img2.width / img2.height
    aspect_compatible = abs(aspect1 - aspect2) < 0.05

    # Check resolution / grid size
    grid_error = abs(img1.height - img2.height) + abs(img1.width - img2.width)

    status = "COMPATIBLE" if (dim_match or aspect_compatible) else "MISMATCHED"
    requires_resampling = not dim_match and aspect_compatible

    return {
        "status": status,
        "dimension_match": dim_match,
        "aspect_compatible": aspect_compatible,
        "requires_resampling": requires_resampling,
        "img1_dims": (img1.width, img1.height),
        "img2_dims": (img2.width, img2.height),
        "grid_delta_pixels": grid_error
    }
