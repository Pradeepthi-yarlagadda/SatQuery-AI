import json
for name in ["VRSBench_EVAL_vqa.json", "VRSBench_EVAL_referring.json", "VRSBench_train.json"]:
    p = f"A:/SatQuery-AI-Data/VRSBench/{name}"
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"=== {name} ({type(data).__name__}) ===")
    if isinstance(data, list):
        print("Len:", len(data), "| Item 0:", str(data[0])[:180])
    elif isinstance(data, dict):
        print("Keys:", list(data.keys())[:5])
        k0 = list(data.keys())[0]
        print(f"data['{k0}']:", str(data[k0])[:180])
