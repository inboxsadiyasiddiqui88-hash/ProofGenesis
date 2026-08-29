import torch
from PIL import Image
from torchvision import transforms

from app.ai.model_loader import model


transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])


def extract_features(image_path: str):

    image = Image.open(image_path).convert("RGB")

    image = transform(image)

    image = image.unsqueeze(0)

    with torch.no_grad():
        features = model(image)

    features = features.flatten().tolist()

    return features