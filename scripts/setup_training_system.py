# Setup script to build datasets, models, training and evaluation modules
import os

os.makedirs('training/configs', exist_ok=True)
os.makedirs('training/datasets', exist_ok=True)
os.makedirs('training/preprocessing', exist_ok=True)
os.makedirs('training/models', exist_ok=True)
os.makedirs('training/evaluation', exist_ok=True)
os.makedirs('training/checkpoints/vqa', exist_ok=True)
os.makedirs('training/checkpoints/captioning', exist_ok=True)
os.makedirs('training/checkpoints/grounding', exist_ok=True)
os.makedirs('training/checkpoints/change', exist_ok=True)
os.makedirs('training/checkpoints/optical_sar', exist_ok=True)
os.makedirs('backend/app/models/specialists', exist_ok=True)
print('Directories initialized.')
