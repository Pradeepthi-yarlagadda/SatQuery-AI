import os
import json
from typing import Dict, Any, List

CDVQA_ROOT = os.environ.get("CDVQA_ROOT", "A:/SatQuery-AI-Data/CDVQA")

class CDVQADataset:
    def __init__(self, root: str = CDVQA_ROOT, split: str = "Train"):
        self.root = root
        self.split = split.capitalize()
        self.q_file = os.path.join(root, f"{self.split}_questions.json")
        self.a_file = os.path.join(root, f"{self.split}_answers.json")

    def load_samples(self, limit: int = 1000) -> List[Dict[str, Any]]:
        if not os.path.exists(self.q_file):
            return []
        with open(self.q_file, "r", encoding="utf-8") as f:
            q_data = json.load(f)
        questions = q_data.get("questions", q_data) if isinstance(q_data, dict) else q_data

        ans_map = {}
        if os.path.exists(self.a_file):
            with open(self.a_file, "r", encoding="utf-8") as f:
                a_data = json.load(f)
            answers = a_data.get("answers", a_data) if isinstance(a_data, dict) else a_data
            for a in answers:
                ans_map[a.get("id")] = a.get("answer", "")

        samples = []
        for q in questions[:limit]:
            if not q.get("active", True):
                continue
            qid = q.get("id")
            ans = ans_map.get(qid) or (ans_map.get(q.get("answers_ids", [None])[0]) if q.get("answers_ids") else "yes")
            samples.append({
                "id": qid,
                "img_id": q.get("img_id", 0),
                "question": q.get("question", ""),
                "answer": str(ans),
                "type": q.get("type", "change")
            })
        return samples
