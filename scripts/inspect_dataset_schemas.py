import json

def inspect_json(path, name):
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, dict):
            print(f"=== {name} (dict, {len(data)} keys) ===")
            keys = list(data.keys())[:10]
            print("Keys:", keys)
            first_k = keys[0]
            print(f"data['{first_k}']:", str(data[first_k])[:200])
        elif isinstance(data, list):
            print(f"=== {name} (list, {len(data)} items) ===")
            print("Item 0:", str(data[0])[:200])
    except Exception as e:
        print(f"Error reading {name}:", e)

inspect_json("A:/SatQuery-AI-Data/VRSBench/VRSBench_EVAL_Cap.json", "VRSBench_EVAL_Cap")
inspect_json("A:/SatQuery-AI-Data/CDVQA/Train_questions.json", "CDVQA Train_questions")
inspect_json("A:/SatQuery-AI-Data/RSVQA-HR/USGS_split_train_questions.json", "RSVQA USGS_split_train_questions")
inspect_json("A:/SatQuery-AI-Data/RSVQA-HR/USGS_split_train_answers.json", "RSVQA USGS_split_train_answers")
