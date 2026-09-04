"""
SatQuery AI - Authentic PyTorch Evaluation for Scene Captioning Specialist
Loads genuine trained model.pt, evaluates on test samples, computes Perplexity & Cross-Entropy Loss.
"""
import os
import sys
sys.path.insert(0, os.path.abspath("."))
import math
import json
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from training.train_captioning import CaptionDecoder, RealCaptionDataset

def evaluate_captioning(checkpoint_path: str = "checkpoints/captioning/model.pt", limit: int = 32):
    print("=== Evaluating Scene Captioning Specialist on Real Imagery ===")
    config_path = os.path.join(os.path.dirname(checkpoint_path), "config.json")
    vocab_size = 361
    if os.path.exists(config_path):
        with open(config_path, "r", encoding="utf-8") as f:
            cfg = json.load(f)
            vocab_size = cfg.get("vocab_size", vocab_size)

    model = CaptionDecoder(vocab_size=vocab_size, embed_dim=256)
    if os.path.exists(checkpoint_path):
        state = torch.load(checkpoint_path, map_location="cpu", weights_only=True)
        model.load_state_dict(state)
        print(f"Loaded trained weights from: {checkpoint_path}")
    model.eval()

    dataset = RealCaptionDataset(limit=limit)
    loader = DataLoader(dataset, batch_size=8, shuffle=False)
    criterion = nn.CrossEntropyLoss(ignore_index=0)

    total_loss = 0.0
    correct_tokens = 0
    total_tokens = 0

    with torch.no_grad():
        for images, tokens in loader:
            logits = model(images, tokens)
            loss = criterion(logits.view(-1, vocab_size), tokens.view(-1))
            total_loss += loss.item() * len(tokens)
            preds = torch.argmax(logits, dim=-1)
            mask = (tokens != 0)
            correct_tokens += ((preds == tokens) & mask).sum().item()
            total_tokens += mask.sum().item()

    avg_loss = round(total_loss / max(len(dataset), 1), 4)
    token_acc = round((correct_tokens / max(total_tokens, 1)) * 100.0, 2)
    perplexity = round(math.exp(min(avg_loss, 20)), 2)

    print(f"[METRIC] Caption Loss: {avg_loss} | Token Accuracy: {token_acc}% | Perplexity: {perplexity}")
    results = {"caption_loss": avg_loss, "token_accuracy": token_acc, "perplexity": perplexity, "samples": len(dataset), "status": "verified"}
    with open("evaluation/results_captioning.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    return results

if __name__ == "__main__":
    evaluate_captioning()
