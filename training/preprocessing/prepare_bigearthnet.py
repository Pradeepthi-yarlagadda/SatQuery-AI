from typing import List, Dict, Any

BIGEARTHNET_19_CLASSES = [
    "Urban fabric", "Industrial or commercial units", "Arable land",
    "Permanent crops", "Pastures", "Complex cultivation patterns",
    "Land principally occupied by agriculture", "Broad-leaved forest",
    "Coniferous forest", "Mixed forest", "Natural grassland and sparse vegetation",
    "Moors and heathlands", "Sclerophyllous vegetation", "Transitional woodland, shrub",
    "Beaches, dunes, sands", "Inland wetlands", "Coastal wetlands",
    "Inland waters", "Marine waters"
]

def map_bigearthnet_labels(labels: List[str]) -> Dict[str, Any]:
    """Maps multi-label strings to 19-class binary representation."""
    vec = [1 if c.lower() in [l.lower() for l in labels] else 0 for c in BIGEARTHNET_19_CLASSES]
    return {
        "multi_hot": vec,
        "class_names": [c for c, present in zip(BIGEARTHNET_19_CLASSES, vec) if present]
    }
