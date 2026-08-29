from app.metadata.metadata_extractor import extract_metadata
from app.analyzers.image_analyzer import analyze_image
from app.ai.feature_extractor import extract_features
from app.decision.decision_engine import calculate_authenticity

image = "uploads/5 times prayer.png"

metadata = extract_metadata(image)

analysis = analyze_image(image)

features = extract_features(image)

result = calculate_authenticity(
    metadata,
    analysis,
    features
)

print(result)


