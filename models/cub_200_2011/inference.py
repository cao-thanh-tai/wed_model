from pathlib import Path
from typing import Any

import torch
from PIL import Image
from torchvision import models, transforms

from models.base import ModelInterface


MODEL_ID = "cub-200-2011"
MODEL_DIR = Path(__file__).resolve().parent
CHECKPOINT_PATH = MODEL_DIR / "models" / "checkpoint_resnet50_cub.pth"
CLASSES_PATH = MODEL_DIR / "classes.txt"
IMAGE_SIZE = 224
NUM_CLASSES = 200
TOP_K = 5


class Cub200Inference(ModelInterface):
    def __init__(self) -> None:
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self._load_model().to(self.device)
        self.class_names = self._load_class_names()
        self.transform = transforms.Compose(
            [
                transforms.Resize(256),
                transforms.CenterCrop(IMAGE_SIZE),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225],
                ),
            ]
        )

    def _load_model(self) -> torch.nn.Module:
        model = models.resnet50(weights=None)
        model.fc = torch.nn.Linear(model.fc.in_features, NUM_CLASSES)

        checkpoint = torch.load(
            CHECKPOINT_PATH,
            map_location=self.device,
            weights_only=True,
        )
        state_dict = checkpoint.get("model_state_dict", checkpoint)
        model.load_state_dict(state_dict)
        model.eval()
        return model

    def _load_class_names(self) -> list[str]:
        class_names = []
        for line in CLASSES_PATH.read_text(encoding="utf-8").splitlines():
            _, name = line.split(".", maxsplit=1)
            class_names.append(name.replace("_", " "))

        if len(class_names) != NUM_CLASSES:
            raise ValueError(f"Expected {NUM_CLASSES} class names, found {len(class_names)}")
        return class_names

    def metadata(self) -> dict[str, Any]:
        return {
            "id": MODEL_ID,
            "name": "CUB-200-2011 Bird Classification",
            "description": "ResNet50 classifier trained to recognize 200 bird species from the CUB-200-2011 dataset.",
            "category": "Computer Vision",
            "input_type": "image",
            "output_type": "top-k classification",
        }

    @torch.inference_mode()
    def predict(self, input_data: Image.Image) -> list[dict[str, Any]]:
        image = self.transform(input_data.convert("RGB")).unsqueeze(0).to(self.device)
        probabilities = torch.softmax(self.model(image), dim=1).squeeze(0)
        scores, indices = torch.topk(probabilities, k=TOP_K)

        return [
            {
                "label": self.class_names[int(index)],
                "score": round(float(score), 6),
            }
            for score, index in zip(scores.cpu(), indices.cpu())
        ]