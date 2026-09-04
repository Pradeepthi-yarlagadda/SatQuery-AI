from typing import List, Dict, Any


class AgentInputValidator:
    @staticmethod
    def validate(images: List[Dict[str, Any]], expected_task: str) -> Dict[str, Any]:
        logs = []
        errors = []
        warnings = []

        if not images:
            err = "No input rasters provided."
            return {"valid": False, "status": "FAILED", "error": err, "errors": [err], "warnings": warnings, "logs": logs}

        for idx, img in enumerate(images):
            meta = img.get("metadata", {})
            crs = meta.get("crs")
            driver = meta.get("driver", "GTiff")
            count = meta.get("count", 3)
            dim = f"{meta.get('width', 512)}x{meta.get('height', 512)}"
            logs.append(f"Raster #{idx+1}: Format={driver}, CRS={crs}, Bands={count}, Dims={dim}")
            
            if not crs:
                err = f"Raster #{idx+1} is missing CRS georeferencing."
                errors.append(err)
                return {"valid": False, "status": "FAILED", "error": err, "errors": errors, "warnings": warnings, "logs": logs}

        task_upper = str(expected_task).upper()
        if task_upper in ["CHANGE_VQA", "CHANGE_DETECTION", "CROSS_MODAL_FUSION", "OPTICAL_SAR"]:
            if len(images) < 2:
                err = f"Task '{expected_task}' requires 2 co-registered rasters."
                errors.append(err)
                return {"valid": False, "status": "FAILED", "error": err, "errors": errors, "warnings": warnings, "logs": logs}
            
            crs1 = str(images[0].get("metadata", {}).get("crs", "")).upper()
            crs2 = str(images[1].get("metadata", {}).get("crs", "")).upper()
            if crs1 != crs2:
                err = f"CRS Mismatch: {crs1} vs {crs2}"
                errors.append(err)
                return {"valid": False, "status": "FAILED", "error": err, "errors": errors, "warnings": warnings, "logs": logs}
            logs.append("Spatial alignment and CRS match confirmed.")

        return {
            "valid": True,
            "status": "PASSED" if not warnings else "PASSED_WITH_WARNINGS",
            "error": None,
            "errors": errors,
            "warnings": warnings,
            "logs": logs
        }
