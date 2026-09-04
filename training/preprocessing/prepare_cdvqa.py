from typing import List, Dict, Any

def prepare_cdvqa_transitions(samples: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Formats bi-temporal samples into Siamese differencing supervision."""
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
