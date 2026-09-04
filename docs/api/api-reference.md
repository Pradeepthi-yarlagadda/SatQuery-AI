# 📡 API Reference

### Health Check
- `GET /health` or `GET /api/health`
- Response:
  ```json
  {
    "status": "online",
    "system": "Orbit-IQ / SatQuery AI",
    "version": "1.0.0",
    "crs_engine": "GDAL/Rasterio Active",
    "active_tools": ["SINGLE_VQA", "REGION_GROUNDING", "CHANGE_VQA", "CROSS_MODAL_FUSION"]
  }
  ```

### Upload Raster
- `POST /api/upload`
- Multipart form field: `file` (GeoTIFF, TIFF, or PNG)
- Returns: `image_id`, `crs`, `bounds`, `dimensions`

### Query Analysis
- `POST /api/analysis`
- Request:
  ```json
  {
    "query": "Is there water in this area?",
    "image_ids": ["img-uuid-1"],
    "has_sar": false
  }
  ```

### Bi-Temporal Analysis
- `POST /api/temporal`
- Request:
  ```json
  {
    "query": "What changed between these dates?",
    "image_id_t1": "img-uuid-1",
    "image_id_t2": "img-uuid-2"
  }
  ```

### Optical + SAR Fusion
- `POST /api/multimodal`
- Request:
  ```json
  {
    "query": "Fuse optical and SAR",
    "optical_image_id": "opt-uuid-1",
    "sar_image_id": "sar-uuid-2"
  }
  ```
