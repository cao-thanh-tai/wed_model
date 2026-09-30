# src/models/model.py
import torch.nn as nn
import torchvision.models as models

from src.config import NUM_CLASSES, PRETRAINED, BACKBONE


def create_model(num_classes: int = NUM_CLASSES, pretrained: bool = PRETRAINED, backbone: str = BACKBONE):
    """
    Tạo model classification.
    Hiện tại hỗ trợ resnet50. Sau này dễ mở rộng.
    """
    if backbone == "resnet50":
        weights = models.ResNet50_Weights.IMAGENET1K_V2 if pretrained else None
        model = models.resnet50(weights=weights)
        in_features = model.fc.in_features
        model.fc = nn.Linear(in_features, num_classes)

    elif backbone == "resnet101":
        weights = models.ResNet101_Weights.IMAGENET1K_V2 if pretrained else None
        model = models.resnet101(weights=weights)
        in_features = model.fc.in_features
        model.fc = nn.Linear(in_features, num_classes)

    else:
        raise ValueError(f"Backbone {backbone} chưa được hỗ trợ")

    return model