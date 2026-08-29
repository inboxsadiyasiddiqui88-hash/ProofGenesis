from app.ai.feature_extractor import extract_features

features = extract_features("uploads/5 times prayer.png")

print("Number of Features:", len(features))

print(features[:10])