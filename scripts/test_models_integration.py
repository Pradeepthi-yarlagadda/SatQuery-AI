import numpy as np
from training.models.rs_encoder import RemoteSensingEncoder
from training.models.vlm import RemoteSensingVLM
from training.models.temporal_model import SiameseTemporalModel
from training.models.fusion_model import OpticalSARFusionModel

# 1. Test ResNet18 S2 encoder
enc18 = RemoteSensingEncoder("resnet18_s2")
dummy_s2 = np.random.randn(10, 512, 512).astype(np.float32)
feat18 = enc18.extract_features(dummy_s2)
print("ResNet18 S2 feature shape:", feat18.shape, "| norm:", np.linalg.norm(feat18))

# 2. Test ResNet50 All encoder
enc50 = RemoteSensingEncoder("resnet50_all")
dummy_all = np.random.randn(12, 512, 512).astype(np.float32)
feat50 = enc50.extract_features(dummy_all)
print("ResNet50 S1+S2 feature shape:", feat50.shape, "| norm:", np.linalg.norm(feat50))

# 3. Test VLM Projector
vlm = RemoteSensingVLM()
v_proj = vlm.project_visual(feat18)
print("VLM projected shape:", v_proj.shape)
ans = vlm.generate_answer(v_proj, "What color are the vehicles?")
print("VLM generated answer:", ans)

# 4. Test Siamese Temporal Model
siamese = SiameseTemporalModel()
feat_t2 = feat18 + np.random.randn(*feat18.shape) * 0.2
temp_diff = siamese.compute_difference(feat18, feat_t2)
print("Temporal difference result:", temp_diff)

# 5. Test Optical-SAR Fusion Model
fusion = OpticalSARFusionModel()
fused = fusion.fuse(feat18, feat50)
print("Fusion result alignment:", fused["cross_attention_alignment"])
