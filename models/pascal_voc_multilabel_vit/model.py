from pathlib import Path

import torch
from transformers import AutoModelForImageClassification


def load_model(model_dir: Path) -> AutoModelForImageClassification:
    model = AutoModelForImageClassification.from_pretrained(model_dir)
    model.eval()
    return model


def select_device() -> torch.device:
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")
