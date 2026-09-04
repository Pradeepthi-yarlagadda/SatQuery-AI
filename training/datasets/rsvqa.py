import os
import json
from typing import Dict, Any, List

RSVQA_ROOT = os.environ.get("RSVQA_ROOT", "A:/SatQuery-AI-Data/RSVQA-HR")

class RSVQADataset:
    """
    DataLoader for high-resolution remote sensing visual question answering (RSVQA-HR).
    """
    def __init__(self, root: str = RSVQA_ROOT, split: str = "train"):
        self.root = root
        self.split = split
        self.q_file = os.path.join(root, f"USGS_split_{split}_questions.json")
        self.a_file = os.path.join(root, f"USGS_split_{split}_answers.json")
        self.img_file = os.path.join(root, f"USGS_split_{split}_images.json")

    def load_samples(self, limit: int = 1000) -> List[Dict[str, Any]]:
        if not os.path.exists(self.q_file):
            return []
        try:
            with open(self.q_file, "r", encoding="utf-8") as f:
                questions_data = json.load(f)
            questions = questions_data.get("questions", questions_data) if isinstance(questions_data, dict) else questions_data

            answers_map = {}
            if os.path.exists(self.a_file):
                with open(self.a_file, "r", encoding="utf-8") as f:
                    ans_data = json.load(f)
                ans_list = ans_data.get("answers", ans_data) if isinstance(ans_data, dict) else ans_data
                for a in ans_list:
                    answers_map[a.get("id")] = a.get("answer", "")

            samples = []
            for q in questions[:limit]:
                qid = q.get("id")
                samples.append({
                    "id": qid,
                    "image_id": q.get("img_id", q.get("image_id", "")),
                    "question": q.get("question", ""),
                    "answer": answers_map.get(qid, q.get("answer", "rural")),
                    "type": q.get("type", "presence")
                })
            return samples
        except Exception as e:
            print("RSVQA load notice:", e)
            return []
