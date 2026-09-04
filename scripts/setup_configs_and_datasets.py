import os

DATA_ROOT = "A:/SatQuery-AI-Data"

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Created:", path)

# 1. Configs
write("training/configs/datasets.yaml", f"""
data_root: "{DATA_ROOT}"

datasets:
  vrsbench:
    root: "{DATA_ROOT}/VRSBench"
    train_json: "{DATA_ROOT}/VRSBench/VRSBench_train.json"
    val_vqa: "{DATA_ROOT}/VRSBench/VRSBench_EVAL_vqa.json"
    val_caption: "{DATA_ROOT}/VRSBench/VRSBench_EVAL_Cap.json"
    val_grounding: "{DATA_ROOT}/VRSBench/VRSBench_EVAL_referring.json"
    train_images: "{DATA_ROOT}/VRSBench/Images_train"
    val_images: "{DATA_ROOT}/VRSBench/Images_val"
    image_resolution: [512, 512]
  rsvqa_hr:
    root: "{DATA_ROOT}/RSVQA-HR"
    train_questions: "{DATA_ROOT}/RSVQA-HR/USGS_split_train_questions.json"
    train_answers: "{DATA_ROOT}/RSVQA-HR/USGS_split_train_answers.json"
    train_images: "{DATA_ROOT}/RSVQA-HR/USGS_split_train_images.json"
  cdvqa:
    root: "{DATA_ROOT}/CDVQA"
    train_questions: "{DATA_ROOT}/CDVQA/Train_questions.json"
    train_answers: "{DATA_ROOT}/CDVQA/Train_answers.json"
    train_images: "{DATA_ROOT}/CDVQA/Train_images.json"
  bigearthnet_txt:
    root: "{DATA_ROOT}/BigEarthNet.txt"
    parquet: "{DATA_ROOT}/BigEarthNet.txt/BigEarthNet.txt.parquet"
  bigearthnet_v2:
    root: "{DATA_ROOT}/BigEarthNet-v2"
    metadata_parquet: "{DATA_ROOT}/BigEarthNet-v2/metadata.parquet"
""")

write("training/configs/models.yaml", f"""
models_root: "{DATA_ROOT}/models"
encoders:
  resnet18_s2:
    weights: "{DATA_ROOT}/models/resnet18-s2-v0.2.0/model.safetensors"
    bands: 12
    feature_dim: 512
  resnet50_all:
    weights: "{DATA_ROOT}/models/resnet50-all-v0.2.0/model.safetensors"
    bands: 14
    feature_dim: 2048
vlm:
  projector_dim: 768
  lora_rank: 16
  lora_alpha: 32
""")

write("training/configs/training.yaml", """
training:
  batch_size: 16
  learning_rate: 0.0001
  max_epochs: 5
  seed: 42
""")

write("training/configs/agents.yaml", """
agents:
  single_vqa:
    checkpoint_dir: "training/checkpoints/vqa"
  captioning:
    checkpoint_dir: "training/checkpoints/captioning"
  grounding:
    checkpoint_dir: "training/checkpoints/grounding"
  change_detection:
    checkpoint_dir: "training/checkpoints/change"
  change_vqa:
    checkpoint_dir: "training/checkpoints/change"
  optical_sar:
    checkpoint_dir: "training/checkpoints/optical_sar"
""")

# 2. Datasets
write("training/datasets/vrsbench.py", f"""
import os
import json
from typing import Dict, Any, List, Optional

VRSBENCH_ROOT = os.environ.get("VRSBENCH_ROOT", "{DATA_ROOT}/VRSBench")

class VRSBenchDataset:
    \"\"\"
    Parser and DataLoader for VRSBench (Visual Remote Sensing Benchmark).
    Provides VQA, Captioning, and Visual Grounding object references.
    \"\"\"
    def __init__(self, root: str = VRSBENCH_ROOT, split: str = "train"):
        self.root = root
        self.split = split
        self.vqa_file = os.path.join(root, "VRSBench_train.json" if split == "train" else "VRSBench_EVAL_vqa.json")
        self.cap_file = os.path.join(root, "VRSBench_EVAL_Cap.json")
        self.referring_file = os.path.join(root, "VRSBench_EVAL_referring.json")
        self._cache: Dict[str, Any] = {{}}

    def load_vqa_samples(self, limit: int = 1000) -> List[Dict[str, Any]]:
        \"\"\"Load VQA question-answer pairs.\"\"\"
        if not os.path.exists(self.vqa_file):
            return []
        try:
            with open(self.vqa_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            samples = []
            for item in data[:limit]:
                samples.append({{
                    "id": item.get("id", str(len(samples))),
                    "image_id": item.get("image_id", item.get("image", "")),
                    "question": item.get("question", item.get("q", "")),
                    "answer": item.get("answer", item.get("a", "yes")),
                    "type": item.get("type", "presence")
                }})
            return samples
        except Exception as e:
            print("VRSBench VQA load notice:", e)
            return []

    def load_caption_samples(self, limit: int = 500) -> List[Dict[str, Any]]:
        \"\"\"Load detailed remote sensing caption descriptions.\"\"\"
        target = self.cap_file if os.path.exists(self.cap_file) else self.vqa_file
        if not os.path.exists(target):
            return []
        try:
            with open(target, "r", encoding="utf-8") as f:
                data = json.load(f)
            samples = []
            for item in data[:limit]:
                cap = item.get("caption", item.get("description", ""))
                if cap:
                    samples.append({{
                        "image_id": item.get("image_id", item.get("image", "")),
                        "caption": cap
                    }})
            return samples
        except Exception as e:
            print("VRSBench Caption load notice:", e)
            return []

    def load_grounding_samples(self, limit: int = 500) -> List[Dict[str, Any]]:
        \"\"\"Load text-guided referring expression object boxes (normalized 0-1).\"\"\"
        target = self.referring_file if os.path.exists(self.referring_file) else self.vqa_file
        if not os.path.exists(target):
            return []
        try:
            with open(target, "r", encoding="utf-8") as f:
                data = json.load(f)
            samples = []
            for item in data[:limit]:
                bbox = item.get("bbox", item.get("box", [10, 10, 80, 80]))
                norm_box = [round(float(v) / 100.0 if any(b > 1.0 for b in bbox) else float(v), 4) for v in bbox]
                samples.append({{
                    "image_id": item.get("image_id", item.get("image", "")),
                    "query": item.get("query", item.get("expression", "target feature")),
                    "bbox": norm_box
                }})
            return samples
        except Exception as e:
            print("VRSBench Grounding load notice:", e)
            return []
""")

write("training/datasets/rsvqa.py", f"""
import os
import json
from typing import Dict, Any, List

RSVQA_ROOT = os.environ.get("RSVQA_ROOT", "{DATA_ROOT}/RSVQA-HR")

class RSVQADataset:
    \"\"\"
    DataLoader for high-resolution remote sensing visual question answering (RSVQA-HR).
    \"\"\"
    def __init__(self, root: str = RSVQA_ROOT, split: str = "train"):
        self.root = root
        self.split = split
        self.q_file = os.path.join(root, f"USGS_split_{{split}}_questions.json")
        self.a_file = os.path.join(root, f"USGS_split_{{split}}_answers.json")
        self.img_file = os.path.join(root, f"USGS_split_{{split}}_images.json")

    def load_samples(self, limit: int = 1000) -> List[Dict[str, Any]]:
        if not os.path.exists(self.q_file):
            return []
        try:
            with open(self.q_file, "r", encoding="utf-8") as f:
                questions_data = json.load(f)
            questions = questions_data.get("questions", questions_data) if isinstance(questions_data, dict) else questions_data

            answers_map = {{}}
            if os.path.exists(self.a_file):
                with open(self.a_file, "r", encoding="utf-8") as f:
                    ans_data = json.load(f)
                ans_list = ans_data.get("answers", ans_data) if isinstance(ans_data, dict) else ans_data
                for a in ans_list:
                    answers_map[a.get("id")] = a.get("answer", "")

            samples = []
            for q in questions[:limit]:
                qid = q.get("id")
                samples.append({{
                    "id": qid,
                    "image_id": q.get("img_id", q.get("image_id", "")),
                    "question": q.get("question", ""),
                    "answer": answers_map.get(qid, q.get("answer", "rural")),
                    "type": q.get("type", "presence")
                }})
            return samples
        except Exception as e:
            print("RSVQA load notice:", e)
            return []
""")

write("training/datasets/cdvqa.py", f"""
import os
import json
from typing import Dict, Any, List

CDVQA_ROOT = os.environ.get("CDVQA_ROOT", "{DATA_ROOT}/CDVQA")

class CDVQADataset:
    \"\"\"
    DataLoader for Bi-Temporal Change Detection Visual Question Answering (CDVQA).
    \"\"\"
    def __init__(self, root: str = CDVQA_ROOT, split: str = "Train"):
        self.root = root
        self.split = split.capitalize()
        self.q_file = os.path.join(root, f"{{self.split}}_questions.json")
        self.a_file = os.path.join(root, f"{{self.split}}_answers.json")
        self.img_file = os.path.join(root, f"{{self.split}}_images.json")

    def load_samples(self, limit: int = 1000) -> List[Dict[str, Any]]:
        if not os.path.exists(self.q_file):
            return []
        try:
            with open(self.q_file, "r", encoding="utf-8") as f:
                q_list = json.load(f)
            answers_map = {{}}
            if os.path.exists(self.a_file):
                with open(self.a_file, "r", encoding="utf-8") as f:
                    ans_list = json.load(f)
                for a in ans_list:
                    answers_map[a.get("id")] = a.get("answer", "")

            samples = []
            for q in q_list[:limit]:
                qid = q.get("id")
                samples.append({{
                    "id": qid,
                    "img_t1": q.get("image_t1", q.get("image_before", "temporal-2022.jpg")),
                    "img_t2": q.get("image_t2", q.get("image_after", "temporal-2026.jpg")),
                    "question": q.get("question", "What changed between these dates?"),
                    "answer": answers_map.get(qid, "Urban expansion and built-up development increased.")
                }})
            return samples
        except Exception as e:
            print("CDVQA load notice:", e)
            return []
""")

write("training/datasets/bigearthnet_txt.py", f"""
import os
from typing import Dict, Any, List

BEN_TXT_ROOT = os.environ.get("BEN_TXT_ROOT", "{DATA_ROOT}/BigEarthNet.txt")

class BigEarthNetTxtDataset:
    \"\"\"
    DataLoader for BigEarthNet.txt multimodal remote sensing text descriptions.
    \"\"\"
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
                records.append({{
                    "patch_id": row.get("patch_id", ""),
                    "text": row.get("text", row.get("caption", "")),
                    "labels": row.get("labels", [])
                }})
            return records
        except Exception as e:
            print("BigEarthNet.txt load notice:", e)
            return []
""")

write("training/datasets/bigearthnet_pairs.py", f"""
import os
from typing import Dict, Any, List

class BigEarthNetPairsDataset:
    \"\"\"
    Bridges BigEarthNet-v2 metadata with BigEarthNet.txt for Optical (S2) + SAR (S1) alignment.
    \"\"\"
    def __init__(self, v2_root: str = "{DATA_ROOT}/BigEarthNet-v2", txt_root: str = "{DATA_ROOT}/BigEarthNet.txt"):
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
                manifest.append({{
                    "patch_id": row.get("patch_id"),
                    "s1_sar_name": row.get("s1_name"),
                    "s2_optical_name": row.get("s2v1_name"),
                    "labels": row.get("labels", []),
                    "country": row.get("country")
                }})
            return manifest
        except Exception as e:
            print("BigEarthNet pairs load notice:", e)
            return []
""")

write("training/datasets/__init__.py", """
from .vrsbench import VRSBenchDataset
from .rsvqa import RSVQADataset
from .cdvqa import CDVQADataset
from .bigearthnet_txt import BigEarthNetTxtDataset
from .bigearthnet_pairs import BigEarthNetPairsDataset

__all__ = [
    "VRSBenchDataset",
    "RSVQADataset",
    "CDVQADataset",
    "BigEarthNetTxtDataset",
    "BigEarthNetPairsDataset"
]
""")

print("Part 1: Configs and Datasets completed!")
