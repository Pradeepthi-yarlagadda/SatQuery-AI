"""
SatQuery AI - Remote Sensing Benchmark Sample Generator
Produces realistic benchmark satellite imagery pairs:
1. Bi-temporal Urban Growth (2020 vs 2026) for CDVQA testing.
2. Cartosat-2S Optical + RISAT SAR Co-registered Pair for All-Weather / Cloud penetration testing.
3. Single High-Resolution Infrastructure & Port Scene for RSVQA & VRSBench Grounding testing.
"""

from typing import Tuple, Dict
import numpy as np
from PIL import Image, ImageDraw
import os

from satquery.config import SensorType, DEFAULT_IMAGE_SIZE
from satquery.core.geo_processor import GeoImage


def generate_bitemporal_pair(size: Tuple[int, int] = DEFAULT_IMAGE_SIZE) -> Tuple[GeoImage, GeoImage]:
    """
    Generates a bi-temporal pair (2020 vs 2026) demonstrating urban expansion
    and vegetation loss over an agricultural river basin.
    """
    w, h = size
    np.random.seed(42)

    # Base River (Curving through the image)
    y_coords = np.linspace(0, h - 1, h)
    x_river = (w * 0.3) + 30.0 * np.sin(y_coords / 40.0)

    # --- Scene T1 (2020: Rural / Agriculture) ---
    img_t1 = np.zeros((h, w, 3), dtype=np.uint8)
    # Background: Green vegetation & agricultural fields (rich green [45, 135, 50])
    img_t1[:, :] = [45, 135, 50]

    # Add crop texture / field boundaries
    for i in range(0, h, 64):
        for j in range(0, w, 64):
            variation = int(np.random.randint(-15, 25))
            r = np.clip(45 + variation // 2, 20, 90)
            g = np.clip(135 + variation, 90, 180)
            b = np.clip(50 + variation // 3, 20, 80)
            img_t1[i:i+60, j:j+60] = [r, g, b]

    # Draw River (Deep blue [25, 65, 160])
    for y in range(h):
        xr = int(x_river[y])
        img_t1[y, max(0, xr - 14): min(w, xr + 14)] = [25, 65, 160]

    # Small rural cluster in 2020
    img_t1[h//2: h//2 + 40, int(w*0.65): int(w*0.65) + 40] = [170, 160, 155]

    # --- Scene T2 (2026: Significant Urban Expansion) ---
    img_t2 = img_t1.copy()

    # The entire eastern half has been converted to urban grid, concrete, and commercial units
    for i in range(40, h - 40, 32):
        for j in range(int(w * 0.52), w - 30, 32):
            # Built-up structures (Grey/Asphalt/Concrete [190, 185, 180])
            b_val = np.random.randint(160, 220)
            img_t2[i:i+26, j:j+26] = [b_val, b_val - 5, b_val - 10]

    # Modern asphalt road connecting across the river
    img_t2[h//2 - 6: h//2 + 6, :] = [60, 60, 65]

    geo_t1 = GeoImage(img_t1, sensor_type=SensorType.OPTICAL_RGB, filename="scene_2020_rural.tif")
    geo_t2 = GeoImage(img_t2, sensor_type=SensorType.OPTICAL_RGB, filename="scene_2026_urbanized.tif")
    return geo_t1, geo_t2


def generate_optical_sar_pair(size: Tuple[int, int] = DEFAULT_IMAGE_SIZE) -> Tuple[GeoImage, GeoImage]:
    """
    Generates a co-registered Cartosat-like Optical scene and RISAT-like SAR scene.
    Optical has white cloud obscuring a flooded reservoir;
    SAR penetrates the clouds with dark specular water reflection and bright urban double-bounce.
    """
    w, h = size
    np.random.seed(101)

    # --- Scene 1: Cartosat-like Optical with Cloud Obscuration ---
    opt_arr = np.zeros((h, w, 3), dtype=np.uint8)
    opt_arr[:, :] = [55, 120, 60] # Surrounding terrain

    # Water reservoir (bottom-center)
    for y in range(h // 2, h - 30):
        for x in range(w // 4, 3 * w // 4):
            if (x - w//2)**2 / (w//3)**2 + (y - 3*h//4)**2 / (h//4)**2 < 0.6:
                opt_arr[y, x] = [30, 85, 180]

    # Urban area (top-right)
    opt_arr[30: 160, int(w*0.6): w-30] = [185, 180, 175]

    # Opaque white clouds across the center covering the northern boundary of water
    cloud_mask = np.zeros((h, w), dtype=np.float32)
    for y in range(h):
        for x in range(w):
            dist = np.sqrt((x - w*0.4)**2 + (y - h*0.5)**2)
            if dist < 90:
                cloud_mask[y, x] = np.clip(1.0 - (dist / 90.0), 0.0, 1.0)

    # Blend clouds onto optical scene
    for c in range(3):
        opt_arr[:, :, c] = (opt_arr[:, :, c] * (1.0 - cloud_mask) + 245 * cloud_mask).astype(np.uint8)

    # --- Scene 2: RISAT-like C-Band SAR Scene ---
    # SAR exhibits Rayleigh/Gamma speckle noise across natural terrain
    sar_base = np.random.gamma(shape=2.5, scale=20.0, size=(h, w)).astype(np.float32)
    sar_base = np.clip(sar_base, 10, 140)

    # Specular water reflection (Dark in SAR: < 25 DN)
    # The water actually extends under the cloud!
    for y in range(h // 2, h - 30):
        for x in range(w // 4, 3 * w // 4):
            if (x - w//2)**2 / (w//3)**2 + (y - 3*h//4)**2 / (h//4)**2 < 0.6:
                sar_base[y, x] = np.random.uniform(5, 20)

    # Strong Double-Bounce Urban Structures (Bright in SAR: > 210 DN)
    for i in range(40, 150, 20):
        for j in range(int(w*0.62), w-40, 20):
            sar_base[i:i+12, j:j+12] = np.random.uniform(220, 255)

    sar_img_uint8 = np.clip(sar_base, 0, 255).astype(np.uint8)

    geo_opt = GeoImage(opt_arr, sensor_type=SensorType.OPTICAL_RGB, filename="cartosat_optical_hazy.tif")
    geo_sar = GeoImage(sar_img_uint8, sensor_type=SensorType.SAR_SINGLE_POL, filename="risat_sar_penetrating.tif")
    return geo_opt, geo_sar


def generate_single_scene(size: Tuple[int, int] = DEFAULT_IMAGE_SIZE) -> GeoImage:
    """
    Generates a single high-resolution coastal/infrastructure scene with circular storage tanks,
    runway/road network, and water harbor for RSVQA and VRSBench testing.
    """
    w, h = size
    img = np.zeros((h, w, 3), dtype=np.uint8)
    img[:, :] = [140, 135, 120] # Coastal soil

    # Water harbor in southern third
    img[int(h * 0.65):, :] = [20, 70, 160]

    # Asphalt runway / transport artery
    img[int(h * 0.3): int(h * 0.3) + 24, :] = [50, 50, 55]

    # Circular Industrial Storage Tanks
    pil_img = Image.fromarray(img)
    draw = ImageDraw.Draw(pil_img)

    tanks = [
        (80, 80, 130, 130),
        (160, 80, 210, 130),
        (80, 150, 130, 200),
        (160, 150, 210, 200),
        (240, 150, 290, 200)
    ]
    for bbox in tanks:
        draw.ellipse(bbox, fill=(220, 220, 230), outline=(70, 70, 80), width=2)

    # Vegetation park / green buffer
    draw.rectangle([int(w * 0.65), 50, w - 40, int(h * 0.55)], fill=(40, 140, 50))

    arr = np.array(pil_img)
    return GeoImage(arr, sensor_type=SensorType.OPTICAL_RGB, filename="coastal_infrastructure_scene.tif")
