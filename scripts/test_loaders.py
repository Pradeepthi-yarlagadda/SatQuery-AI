from training.datasets.vrsbench import VRSBenchDataset
from training.datasets.cdvqa import CDVQADataset

vrs = VRSBenchDataset()
vqa = vrs.load_vqa_samples(limit=3)
cap = vrs.load_caption_samples(limit=3)
ref = vrs.load_grounding_samples(limit=3)

print("VQA sample 0:", vqa[0])
print("Caption sample 0:", cap[0])
print("Grounding sample 0:", ref[0])

cd = CDVQADataset()
cd_samples = cd.load_samples(limit=3)
print("CDVQA sample 0:", cd_samples[0])
