import json
from pathlib import Path
from typing import Any

import numpy as np
import onnxruntime as ort
from PIL import Image


MODEL_DIR = Path(__file__).resolve().parent / "web" / "model"
MODEL_PATH = MODEL_DIR / "fruit_classifier.onnx"
METADATA_PATH = MODEL_DIR / "metadata.json"
MODEL_ID = "fruit-classification"


class FruitClassificationInference:
    device = "CPU"

    def __init__(self) -> None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
        if not METADATA_PATH.exists():
            raise FileNotFoundError(f"Metadata file not found: {METADATA_PATH}")

        self.metadata_config = json.loads(METADATA_PATH.read_text(encoding="utf-8"))
        self.session = ort.InferenceSession(
            str(MODEL_PATH),
            providers=["CPUExecutionProvider"],
        )
        self._validate_contract()

    def _validate_contract(self) -> None:
        model_input = self.session.get_inputs()[0]
        model_output = self.session.get_outputs()[0]
        expected_input = self.metadata_config["input"]
        expected_output = self.metadata_config["output"]

        if model_input.name != expected_input["name"]:
            raise ValueError(f"Unexpected model input name: {model_input.name}")
        if model_output.name != expected_output["name"]:
            raise ValueError(f"Unexpected model output name: {model_output.name}")
        if len(self.metadata_config["classes"]) != 10:
            raise ValueError("Fruit model must define exactly 10 classes")

    def predict(self, input_data: Image.Image) -> list[dict[str, Any]]:
        model_input = self.metadata_config["input"]
        image_size = int(model_input["image_size"])
        image = input_data.convert("RGB").resize((image_size, image_size))
        pixels = np.asarray(image, dtype=np.float32) / 255.0
        pixels = (pixels - np.asarray(model_input["normalize_mean"], dtype=np.float32)) / np.asarray(
            model_input["normalize_std"],
            dtype=np.float32,
        )
        tensor = np.transpose(pixels, (2, 0, 1))[None, ...]
        logits = self.session.run(
            [self.metadata_config["output"]["name"]],
            {model_input["name"]: tensor},
        )[0][0]
        probabilities = self._softmax(logits)
        top_index = int(np.argmax(probabilities))
        classes = self.metadata_config["classes"]
        return [{"label": classes[top_index], "score": round(float(probabilities[top_index]), 6)}]

    @staticmethod
    def _softmax(logits: np.ndarray) -> np.ndarray:
        shifted = logits - np.max(logits)
        probabilities = np.exp(shifted)
        return probabilities / np.sum(probabilities)
