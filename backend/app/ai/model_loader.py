import torch
from torchvision import models

# Load pretrained ResNet50
model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)

# Remove the final classification layer
model = torch.nn.Sequential(*list(model.children())[:-1])

# Set evaluation mode
model.eval()