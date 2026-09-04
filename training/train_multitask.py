import sys
from training.train_vqa import train_vqa
from training.train_captioning import train_captioning
from training.train_grounding import train_grounding
from training.train_change import train_change
from training.train_change_vqa import train_change_vqa
from training.train_optical_sar import train_optical_sar

def train_all_specialists():
    print("=================================================================")
    print("🛰️ Orbit-IQ SatQuery AI - Full Multi-Task Specialist Training")
    print("=================================================================")
    train_vqa()
    print("-" * 50)
    train_captioning()
    print("-" * 50)
    train_grounding()
    print("-" * 50)
    train_change()
    print("-" * 50)
    train_change_vqa()
    print("-" * 50)
    train_optical_sar()
    print("=================================================================")
    print("🎉 All 6 Remote Sensing Specialist Models Trained Successfully!")
    print("=================================================================")

if __name__ == "__main__":
    train_all_specialists()
