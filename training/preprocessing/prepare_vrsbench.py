import json
import re
from typing import List, Dict, Any

def prepare_vrsbench_vqa(raw_samples: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Preprocesses raw VRSBench question-answers into clean training tokens."""
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
    """Normalizes box coordinates to [xmin, ymin, xmax, ymax] in range 0.0-1.0."""
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
