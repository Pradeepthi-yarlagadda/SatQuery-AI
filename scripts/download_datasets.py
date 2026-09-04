"""
SatQuery AI - Dataset Downloader Utility
"""

import argparse
import os

DATASET_URLS = {
    "bigearthnet_txt": "http://bigearth.net/",
    "vrsbench": "https://github.com/NJU-GDIP/VRSBench",
    "rsvqa_hr": "https://rsvqa.sylvainlobry.com/",
    "cdvqa": "https://github.com/ZhenghangYuan/CDVQA"
}

def main():
    parser = argparse.ArgumentParser(description="Download benchmarks for SatQuery AI")
    parser.add_argument("--dataset", choices=["all", "bigearthnet_txt", "vrsbench", "rsvqa_hr", "cdvqa"], default="all")
    args = parser.parse_args()

    targets = list(DATASET_URLS.keys()) if args.dataset == "all" else [args.dataset]

    print("🛰️ SatQuery AI Dataset Provisioning:")
    for t in targets:
        dest = os.path.join("data", t, "original")
        os.makedirs(dest, exist_ok=True)
        print(f"  - [{t}]: Destination '{dest}' verified.")
        print(f"    Source URL: {DATASET_URLS[t]}")

    print("\n✅ Dataset directories initialized and ready for ingest.")

if __name__ == "__main__":
    main()
