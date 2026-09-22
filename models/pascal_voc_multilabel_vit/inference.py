from typing import Any

from PIL import Image

from models.base import ModelInterface
from models.pascal_voc_multilabel_vit.config import (
    INPUT_TYPE,
    MODEL_CATEGORY,
    MODEL_DESCRIPTION,
    MODEL_DIR,
    MODEL_ID,
    MODEL_NAME,
    OUTPUT_TYPE,
    THRESHOLD,
)
from models.pascal_voc_multilabel_vit.model import load_model, select_device
from models.pascal_voc_multilabel_vit.postprocessing import format_predictions
from models.pascal_voc_multilabel_vit.preprocessing import prepare_image


class PascalVocInference(ModelInterface):
    def __init__(self) -> None:
        self.device = select_device()
        self.model = load_model(MODEL_DIR).to(self.device)
        self.id2label = {
            int(index): label for index, label in self.model.config.id2label.items()
        }

    def metadata(self) -> dict[str, Any]:
        return {
            "id": MODEL_ID,
            "name": MODEL_NAME,
            "description": MODEL_DESCRIPTION,
            "category": MODEL_CATEGORY,
            "input_type": INPUT_TYPE,
            "output_type": OUTPUT_TYPE,
        }

    def predict(self, input_data: Image.Image) -> list[dict[str, Any]]:
        inputs = prepare_image(input_data)
        inputs = {key: value.to(self.device) for key, value in inputs.items()}
        outputs = self.model(**inputs)
        return format_predictions(outputs.logits, self.id2label, THRESHOLD)
