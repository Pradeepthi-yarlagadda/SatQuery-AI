"""
SatQuery AI - Train All Specialist Models
"""

from training.adaptation.train_bigearthnet import train_bigearthnet_adaptation
from training.vqa.train_vqa import train_vqa
from training.captioning.train_captioning import train_captioning
from training.grounding.train_grounding import train_grounding
from training.change.train_change import train_change
from training.optical_sar.train_fusion import train_fusion

def main():
    print("==================================================")
    print("🛰️ SATQUERY AI - MULTI-SPECIALIST TRAINING SUITE")
    print("==================================================")
    train_bigearthnet_adaptation()
    train_vqa()
    train_captioning()
    train_grounding()
    train_change()
    train_fusion()
    print("==================================================")
    print("✅ All specialist models converged successfully.")
    print("==================================================")

if __name__ == "__main__":
    main()
