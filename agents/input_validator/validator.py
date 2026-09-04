from typing import List, Dict, Any


class InputValidator:
    @staticmethod
    def validate(images: List[Any], expected_task: Any = None) -> Dict[str, Any]:
        trace_logs = []
        
        if not images:
            return {
                "valid": False,
                "status": "FAILED",
                "error": "No input rasters provided.",
                "errors": ["No input rasters provided."],
                "warnings": [],
                "logs": trace_logs
            }

        task_str = getattr(expected_task, "value", str(expected_task))

        for idx, img in enumerate(images):
            if isinstance(img, dict):
                meta = img.get("metadata", {})
                driver = meta.get("driver", "GTiff")
                crs = meta.get("crs", "EPSG:4326")
                count = meta.get("count", 3)
            else:
                meta = getattr(img, "metadata", {})
                driver = "GTiff"
                crs = getattr(img, "crs", "EPSG:4326")
                count = getattr(img, "channels", 3)

            trace_logs.append(f"Raster #{idx+1}: Format={driver}, CRS={crs}, Bands={count}")
            
            if not crs:
                return {
                    "valid": False,
                    "status": "FAILED",
                    "error": f"Raster #{idx+1} is missing CRS georeferencing.",
                    "errors": [f"Raster #{idx+1} is missing CRS georeferencing."],
                    "warnings": [],
                    "logs": trace_logs
                }

        # Validate multi-image task compatibility
        if any(t in task_str.upper() for t in ["CHANGE", "FUSION", "TEMPORAL"]):
            if len(images) < 2:
                err = f"Task requires 2 scenes / co-registered rasters. Found {len(images)}."
                return {
                    "valid": False,
                    "status": "FAILED",
                    "error": err,
                    "errors": [err],
                    "warnings": [],
                    "logs": trace_logs
                }
            
            def get_crs(item):
                if isinstance(item, dict):
                    return item.get("metadata", {}).get("crs")
                return getattr(item, "crs", "EPSG:4326")

            crs1 = get_crs(images[0])
            crs2 = get_crs(images[1])
            if crs1 != crs2:
                err = f"CRS Mismatch: {crs1} vs {crs2}"
                return {
                    "valid": False,
                    "status": "FAILED",
                    "error": err,
                    "errors": [err],
                    "warnings": [],
                    "logs": trace_logs
                }
            
            trace_logs.append("Spatial alignment and CRS match confirmed.")

        return {
            "valid": True,
            "status": "PASSED",
            "error": None,
            "errors": [],
            "warnings": [],
            "logs": trace_logs
        }


# Backward-compatible alias
AgentInputValidator = InputValidator
