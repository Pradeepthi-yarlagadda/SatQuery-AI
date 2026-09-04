import os
from typing import Dict, Any, List

class BigEarthNetPairsDataset:
    """
    Bridges BigEarthNet-v2 metadata with BigEarthNet.txt for Optical (S2) + SAR (S1) alignment.
    """
    def __init__(self, v2_root: str = "A:/SatQuery-AI-Data/BigEarthNet-v2", txt_root: str = "A:/SatQuery-AI-Data/BigEarthNet.txt"):
        self.v2_meta = os.path.join(v2_root, "metadata.parquet")
        self.txt_file = os.path.join(txt_root, "BigEarthNet.txt.parquet")

    def get_multimodal_manifest(self, limit: int = 500) -> List[Dict[str, Any]]:
        if not os.path.exists(self.v2_meta):
            return []
        try:
            import pandas as pd
            df_meta = pd.read_parquet(self.v2_meta).head(limit)
            manifest = []
            for _, row in df_meta.iterrows():
                manifest.append({
                    "patch_id": row.get("patch_id"),
                    "s1_sar_name": row.get("s1_name"),
                    "s2_optical_name": row.get("s2v1_name"),
                    "labels": row.get("labels", []),
                    "country": row.get("country")
                })
            return manifest
        except Exception as e:
            print("BigEarthNet pairs load notice:", e)
            return []
