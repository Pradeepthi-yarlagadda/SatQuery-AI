import numpy as np
from backend.app.remote_sensing.band_processing import SpectralIndices
from backend.app.remote_sensing.georeferencing import CoordinateTransformer
from backend.app.remote_sensing.registration import GeoRegistrar
from backend.app.remote_sensing.normalization import RadiometricNormalizer
from backend.app.remote_sensing.preprocessing import PreprocessingPipeline
from backend.app.evidence.change_maps import ChangeMapRenderer
from backend.app.evidence.masks import BinaryMaskGenerator
from backend.app.evidence.bounding_boxes import BoundingBoxGenerator


def test_spectral_indices():
    nir = np.full((64, 64), 0.8, dtype=np.float32)
    red = np.full((64, 64), 0.2, dtype=np.float32)
    green = np.full((64, 64), 0.3, dtype=np.float32)
    swir = np.full((64, 64), 0.1, dtype=np.float32)

    ndvi = SpectralIndices.calculate_ndvi(nir, red)
    assert ndvi.shape == (64, 64)
    assert np.allclose(ndvi, 0.6)

    ndwi = SpectralIndices.calculate_ndwi(green, nir)
    assert ndwi.shape == (64, 64)
    assert np.all(ndwi < 0.0)

    ndbi = SpectralIndices.calculate_ndbi(swir, nir)
    assert ndbi.shape == (64, 64)
    assert np.all(ndbi < 0.0)

    fcc = SpectralIndices.false_color_composite(nir, red, green)
    assert fcc.shape == (64, 64, 3)
    assert fcc.min() >= 0.0 and fcc.max() <= 1.0


def test_georeferencing():
    bounds = {'left': 77.0, 'bottom': 28.0, 'right': 78.0, 'top': 29.0}
    lon, lat = CoordinateTransformer.pixel_to_geo(256, 256, bounds, width=512, height=512)
    assert 77.49 <= lon <= 77.51
    assert 28.49 <= lat <= 28.51

    px, py = CoordinateTransformer.geo_to_pixel(lon, lat, bounds, width=512, height=512)
    assert abs(px - 256) <= 1
    assert abs(py - 256) <= 1

    bbox_geo = CoordinateTransformer.bbox_pixel_to_geo((100, 100, 300, 300), bounds)
    assert 'min_lon' in bbox_geo and 'max_lat' in bbox_geo
    assert bbox_geo['min_lon'] < bbox_geo['max_lon']
    assert bbox_geo['min_lat'] < bbox_geo['max_lat']


def test_registration_and_iou():
    b1 = {'left': 0.0, 'bottom': 0.0, 'right': 10.0, 'top': 10.0}
    b2 = {'left': 5.0, 'bottom': 0.0, 'right': 15.0, 'top': 10.0}
    iou = GeoRegistrar.calculate_bounds_iou(b1, b2)
    assert 0.30 <= iou <= 0.35

    assert GeoRegistrar.verify_alignment({'crs': 'EPSG:4326'}, {'crs': 'EPSG:4326'}) is True
    assert GeoRegistrar.verify_alignment({'crs': 'EPSG:4326'}, {'crs': 'EPSG:32643'}) is False


def test_evidence_change_maps():
    t1 = np.zeros((3, 32, 32), dtype=np.float32)
    t2 = np.ones((3, 32, 32), dtype=np.float32)

    diff = ChangeMapRenderer.render_diff_map(t1, t2)
    assert np.allclose(diff, 1.0)

    cat_map = ChangeMapRenderer.render_categorical_change_map(t1, t2, threshold=0.2)
    assert cat_map.shape == (32, 32)
    assert np.any(cat_map > 0)

    rgb_overlay = ChangeMapRenderer.render_color_overlay(cat_map)
    assert rgb_overlay.shape == (32, 32, 3)


def test_evidence_masks_and_boxes():
    mask = np.zeros((10, 10), dtype=np.uint8)
    mask[2:5, 2:5] = 1
    pct = BinaryMaskGenerator.calculate_coverage_percentage(mask)
    assert pct == 9.0
    comps = BinaryMaskGenerator.connected_components(mask)
    assert comps == 1

    bounds = {'left': 77.20, 'bottom': 28.60, 'right': 77.25, 'top': 28.65}
    feat = BoundingBoxGenerator.from_pixel_bbox([50, 50, 200, 200], bounds, width=512, height=512)
    assert feat['type'] == 'Feature'
    assert len(feat['geometry']['coordinates'][0]) == 5

    fc = BoundingBoxGenerator.generate_feature_collection([feat])
    assert fc['type'] == 'FeatureCollection'
    assert len(fc['features']) == 1
