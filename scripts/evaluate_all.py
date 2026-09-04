"""
SatQuery AI - Full Authentic Benchmark Evaluation Suite
Evaluates all specialist models on real PyTorch checkpoints and real satellite imagery.
"""
import os
import sys
sys.path.insert(0, os.path.abspath("."))
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
import json
from evaluation.evaluate_vqa import evaluate_vqa
from evaluation.evaluate_captioning import evaluate_captioning
from evaluation.evaluate_grounding import evaluate_grounding
from evaluation.evaluate_change import evaluate_change
from evaluation.evaluate_optical_sar import evaluate_optical_sar

def main():
    print("=================================================================")
    print("[SATQUERY AI] AUTHENTIC BENCHMARK EVALUATION SUITE")
    print("=================================================================")
    
    summary = {}
    
    print("\n--- 1. RS-VQA Benchmark (VRSBench / RSVQA-HR) ---")
    summary["vqa"] = evaluate_vqa()
    
    print("\n--- 2. Scene Captioning Benchmark (VRSBench / BigEarthNet.txt) ---")
    summary["captioning"] = evaluate_captioning()
    
    print("\n--- 3. Visual Grounding Benchmark (VRSBench referring) ---")
    summary["grounding"] = evaluate_grounding()
    
    print("\n--- 4. Bi-Temporal Change Detection Benchmark (CDVQA) ---")
    summary["change_detection"] = evaluate_change()
    
    print("\n--- 5. Optical + SAR Cross-Modal Fusion Benchmark (BigEarthNet-MM) ---")
    summary["optical_sar_fusion"] = evaluate_optical_sar()
    
    out_path = "evaluation/benchmark_summary.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
        
    print("\n=================================================================")
    print(f"✅ All 5 benchmark evaluation suites executed successfully!")
    print(f"📄 Summary saved to: {out_path}")
    print("=================================================================")
    return summary

if __name__ == "__main__":
    main()

