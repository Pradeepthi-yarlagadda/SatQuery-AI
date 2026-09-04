from typing import Tuple, Dict, Any
from preprocessing.multimodal.optical_sar_alignment import OpticalSARAligner
from models.optical_sar.fusion import OpticalSARCrossAttentionFusion


class OpticalSARFusionService:
    def __init__(self):
        self.model = OpticalSARCrossAttentionFusion(opt_channels=3, sar_channels=2)
        self.model.eval()

    def fuse_and_analyze(self, opt_tensor: Any, opt_meta: Dict[str, Any], sar_tensor: Any, sar_meta: Dict[str, Any]) -> Dict[str, Any]:
        opt_aligned, sar_filtered, crs_match = OpticalSARAligner.verify_and_align(
            opt_tensor, opt_meta, sar_tensor, sar_meta
        )

        opt_in = opt_aligned if getattr(opt_aligned, "ndim", 3) == 4 else opt_aligned.unsqueeze(0)
        sar_in = sar_filtered if getattr(sar_filtered, "ndim", 3) == 4 else sar_filtered.unsqueeze(0)

        opt_in = opt_in[:, :3, :, :]
        if sar_in.shape[1] < 2:
            try:
                import torch
                _ = torch.zeros(1)
                sar_in = torch.cat([sar_in, sar_in], dim=1)
            except (ImportError, OSError):
                from satquery.torch_compat import torch
                sar_in = torch.cat([sar_in, sar_in], dim=1)
        else:
            sar_in = sar_in[:, :2, :, :]

        preds, fused = self.model(opt_in, sar_in)
        built_up = round(float(preds[0, 0].item()), 3)
        water = round(float(preds[0, 1].item()), 3)

        return {
            "crs_match": crs_match,
            "built_up_affinity": built_up,
            "water_affinity": water,
            "cloud_penetration_status": "HIGH_CONFIDENCE_MICROWAVE",
            "summary": f"Cross-modal fusion completed with built-up index {built_up} and water index {water}."
        }
