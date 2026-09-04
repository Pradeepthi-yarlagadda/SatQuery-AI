"""
SatQuery AI - Evaluate All Benchmarks
"""

from evaluation.rsvqa.evaluate import evaluate_rsvqa
from evaluation.vrsbench.evaluate import evaluate_vrsbench
from evaluation.cdvqa.evaluate import evaluate_cdvqa
from evaluation.multimodal.evaluate import evaluate_multimodal

def main():
    print("==================================================")
    print("🛰️ SATQUERY AI - FULL BENCHMARK EVALUATION SUITE")
    print("==================================================")
    evaluate_rsvqa()
    print("-" * 50)
    evaluate_vrsbench()
    print("-" * 50)
    evaluate_cdvqa()
    print("-" * 50)
    evaluate_multimodal()
    print("==================================================")
    print("✅ All evaluation suites executed successfully.")
    print("==================================================")

if __name__ == "__main__":
    main()
