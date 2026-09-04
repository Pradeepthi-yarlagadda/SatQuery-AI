import os
from typing import Dict, Any, List

BEN_TXT_ROOT = os.environ.get("BEN_TXT_ROOT", "A:/SatQuery-AI-Data/BigEarthNet.txt")

class BigEarthNetTxtDataset:
    """
    DataLoader for BigEarthNet.txt multimodal remote sensing text descriptions.
    """
    def __init__(self, root: str = BEN_TXT_ROOT):
        self.root = root
        self.parquet_path = os.path.join(root, "BigEarthNet.txt.parquet")

    def load_records(self, limit: int = 1000) -> List[Dict[str, Any]]:
        if not os.path.exists(self.parquet_path):
            return []
        try:
            import pandas as pd
            df = pd.read_parquet(self.parquet_path)
            records = []
            for _, row in df.head(limit).iterrows():
                records.append({
                    "patch_id": row.get("patch_id", ""),
                    "text": row.get("text", row.get("caption", "")),
                    "labels": row.get("labels", [])
                })
            return records
        except Exception as e:
            print("BigEarthNet.txt load notice:", e)
            return []
