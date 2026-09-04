import re

code_vrsbench = '''import os
import json
import re
from typing import Dict, Any, List

VRSBENCH_ROOT = os.environ.get("VRSBENCH_ROOT", "A:/SatQuery-AI-Data/VRSBench")

class VRSBenchDataset:
    def __init__(self, root: str = VRSBENCH_ROOT, split: str = "eval"):
        self.root = root
        self.split = split
        self.vqa_file = os.path.join(root, "VRSBench_EVAL_vqa.json")
        self.cap_file = os.path.join(root, "VRSBench_EVAL_Cap.json")
        self.ref_file = os.path.join(root, "VRSBench_EVAL_referring.json")
        self.train_file = os.path.join(root, "VRSBench_train.json")

    def load_vqa_samples(self, limit: int = 1000) -> List[Dict[str, Any]]:
        target = self.vqa_file if os.path.exists(self.vqa_file) else self.train_file
        if not os.path.exists(target):
            return []
        with open(target, "r", encoding="utf-8") as f:
            data = json.load(f)
        samples = []
        for item in data[:limit]:
            if "question" in item and "ground_truth" in item:
                samples.append({
                    "id": str(item.get("question_id", len(samples))),
                    "image_id": item.get("image_id", ""),
                    "question": item.get("question", ""),
                    "answer": item.get("ground_truth", ""),
                    "type": item.get("type", "vqa")
                })
            elif "conversations" in item:
                convs = item["conversations"]
                q = convs[0]["value"].replace("<image>\\n", "").strip() if len(convs) > 0 else ""
                a = convs[1]["value"].strip() if len(convs) > 1 else ""
                samples.append({
                    "id": str(item.get("id", len(samples))),
                    "image_id": item.get("image", ""),
                    "question": q,
                    "answer": a,
                    "type": "conversation"
                })
        return samples

    def load_caption_samples(self, limit: int = 1000) -> List[Dict[str, Any]]:
        if not os.path.exists(self.cap_file):
            return []
        with open(self.cap_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        samples = []
        for item in data[:limit]:
            cap = item.get("ground_truth") or item.get("caption") or ""
            if cap:
                samples.append({
                    "image_id": item.get("image_id", ""),
                    "caption": cap
                })
        return samples

    def load_grounding_samples(self, limit: int = 1000) -> List[Dict[str, Any]]:
        if not os.path.exists(self.ref_file):
            return []
        with open(self.ref_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        samples = []
        for item in data[:limit]:
            gt_str = item.get("ground_truth", "")
            # parse {<ymin><xmin><ymax><xmax>}
            nums = re.findall(r"\d+", gt_str)
            if len(nums) >= 4:
                # VRSBench order is ymin, xmin, ymax, xmax normalized to 100
                ymin, xmin, ymax, xmax = [float(n) / 100.0 for n in nums[:4]]
                box = [round(xmin, 4), round(ymin, 4), round(xmax, 4), round(ymax, 4)]
            else:
                box = [0.1, 0.1, 0.5, 0.5]
            samples.append({
                "image_id": item.get("image_id", ""),
                "query": item.get("question", "target object"),
                "bbox": box
            })
        return samples
'''

code_cdvqa = '''import os
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
'''

with open("training/datasets/vrsbench.py", "w", encoding="utf-8") as f:
    f.write(code_vrsbench)
with open("training/datasets/cdvqa.py", "w", encoding="utf-8") as f:
    f.write(code_cdvqa)

print("Updated training/datasets/vrsbench.py and cdvqa.py with exact schemas.")
