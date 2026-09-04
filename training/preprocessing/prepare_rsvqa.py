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
