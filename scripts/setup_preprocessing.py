import os

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Created:", path)

write("training/preprocessing/prepare_vrsbench.py", """
import json
import re
from typing import List, Dict, Any

def prepare_vrsbench_vqa(raw_samples: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    \"\"\"Preprocesses raw VRSBench question-answers into clean training tokens.\"\"\"
    processed = []
    for s in raw_samples:
        q = s.get("question", "").strip()
        a = str(s.get("answer", "")).strip()
        if q and a:
            processed.append({
                "id": s.get("id"),
                "image_id": s.get("image_id"),
                "prompt": f"Question: {q} Answer:",
                "target": a,
                "type": s.get("type", "vqa")
            })
    return processed

def prepare_vrsbench_grounding(raw_samples: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    \"\"\"Normalizes box coordinates to [xmin, ymin, xmax, ymax] in range 0.0-1.0.\"\"\"
    processed = []
    for s in raw_samples:
        b = s.get("bbox", [0.0, 0.0, 1.0, 1.0])
        # ensure [xmin, ymin, xmax, ymax] order and clamp [0, 1]
        xmin = max(0.0, min(1.0, float(b[0])))
        ymin = max(0.0, min(1.0, float(b[1])))
        xmax = max(xmin, min(1.0, float(b[2])))
        ymax = max(ymin, min(1.0, float(b[3])))
        processed.append({
            "image_id": s.get("image_id"),
            "query": s.get("query"),
            "target_box": [round(xmin, 4), round(ymin, 4), round(xmax, 4), round(ymax, 4)],
            "area": round((xmax - xmin) * (ymax - ymin), 4)
        })
    return processed
""")

write("training/preprocessing/prepare_rsvqa.py", """
from typing import List, Dict, Any

def categorize_rsvqa_question(question: str) -> str:
    q = question.lower()
    if any(w in q for w in ["how many", "count", "number"]):
        return "count"
    elif any(w in q for w in ["more than", "less than", "compare"]):
        return "comparison"
    elif any(w in q for w in ["presence", "is there", "are there", "exist"]):
        return "presence"
    elif any(w in q for w in ["what type", "land cover", "what is"]):
        return "land_cover"
    return "general"

def prepare_rsvqa_batch(samples: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    prepared = []
    for s in samples:
        q = s.get("question", "").strip()
        a = s.get("answer", "").strip()
        if q:
            cat = categorize_rsvqa_question(q)
            prepared.append({
                "id": s.get("id"),
                "image_id": s.get("image_id"),
                "category": cat,
                "input_text": f"[RSVQA] {q}",
                "target_text": a
            })
    return prepared
""")

write("training/preprocessing/prepare_cdvqa.py", """
from typing import List, Dict, Any

def prepare_cdvqa_transitions(samples: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    \"\"\"Formats bi-temporal samples into Siamese differencing supervision.\"\"\"
    prepared = []
    for s in samples:
        q = s.get("question", "")
        a = s.get("answer", "")
        prepared.append({
            "id": s.get("id"),
            "img_id": s.get("img_id"),
            "prompt": f"[CDVQA] Compare T1 and T2: {q}",
            "target": a,
            "is_changed": str(a).lower() in ["yes", "true", "increased", "appeared", "changed"]
        })
    return prepared
""")

write("training/preprocessing/prepare_bigearthnet.py", """
from typing import List, Dict, Any

BIGEARTHNET_19_CLASSES = [
    "Urban fabric", "Industrial or commercial units", "Arable land",
    "Permanent crops", "Pastures", "Complex cultivation patterns",
    "Land principally occupied by agriculture", "Broad-leaved forest",
    "Coniferous forest", "Mixed forest", "Natural grassland and sparse vegetation",
    "Moors and heathlands", "Sclerophyllous vegetation", "Transitional woodland, shrub",
    "Beaches, dunes, sands", "Inland wetlands", "Coastal wetlands",
    "Inland waters", "Marine waters"
]

def map_bigearthnet_labels(labels: List[str]) -> Dict[str, Any]:
    \"\"\"Maps multi-label strings to 19-class binary representation.\"\"\"
    vec = [1 if c.lower() in [l.lower() for l in labels] else 0 for c in BIGEARTHNET_19_CLASSES]
    return {
        "multi_hot": vec,
        "class_names": [c for c, present in zip(BIGEARTHNET_19_CLASSES, vec) if present]
    }
""")

write("training/preprocessing/__init__.py", """
from .prepare_vrsbench import prepare_vrsbench_vqa, prepare_vrsbench_grounding
from .prepare_rsvqa import prepare_rsvqa_batch, categorize_rsvqa_question
from .prepare_cdvqa import prepare_cdvqa_transitions
from .prepare_bigearthnet import map_bigearthnet_labels, BIGEARTHNET_19_CLASSES

__all__ = [
    "prepare_vrsbench_vqa",
    "prepare_vrsbench_grounding",
    "prepare_rsvqa_batch",
    "categorize_rsvqa_question",
    "prepare_cdvqa_transitions",
    "map_bigearthnet_labels",
    "BIGEARTHNET_19_CLASSES"
]
""")

print("Part 2: Preprocessing modules completed!")
