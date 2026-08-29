import os
import numpy as np

from app.ai.feature_extractor import extract_features

AUTH_FOLDER = "../../datasets/CASIA2/Authentic"

all_features = []

for filename in os.listdir(AUTH_FOLDER):

    path = os.path.join(AUTH_FOLDER, filename)

    try:
        features = extract_features(path)
        all_features.append(features)

    except Exception:
        continue

all_features = np.array(all_features)

baseline = {
    "mean": np.mean(all_features, axis=0),
    "std": np.std(all_features, axis=0)
}

print("Baseline Created")
print("Images:", len(all_features))