from io import BytesIO
from typing import Any

from PIL import Image


class InferenceService:
    def __init__(self) -> None:
        self._predictors: dict[str, Any] = {}

    def _get_predictor(self, model_id: str) -> Any:
        if model_id not in self._predictors:
            if model_id == "pascal-voc-multilabel-vit":
                from models.pascal_voc_multilabel_vit.inference import PascalVocInference

                predictor = PascalVocInference()
            elif model_id == "cub-200-2011":
                from models.cub_200_2011.inference import Cub200Inference

                predictor = Cub200Inference()
            else:
                raise KeyError(model_id)
            self._predictors[model_id] = predictor
        return self._predictors[model_id]

    def predict_image(self, model_id: str, content: bytes) -> list[dict[str, Any]]:
        image = Image.open(BytesIO(content))
        return self._get_predictor(model_id).predict(image)


inference_service = InferenceService()
