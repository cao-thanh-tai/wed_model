import gc
from datetime import datetime, timezone
from time import perf_counter
from io import BytesIO
from typing import Any

from PIL import Image


class InferenceService:
    def __init__(self) -> None:
        self._predictors: dict[str, Any] = {}
        self._loaded_at: dict[str, str] = {}
        self._load_times_ms: dict[str, float] = {}

    def _get_predictor(self, model_id: str) -> tuple[Any, float | None, bool]:
        if model_id not in self._predictors:
            load_started = perf_counter()
            if model_id == "pascal-voc-multilabel-vit":
                from models.pascal_voc_multilabel_vit.inference import PascalVocInference

                predictor = PascalVocInference()
            elif model_id == "cub-200-2011":
                from models.cub_200_2011.inference import Cub200Inference

                predictor = Cub200Inference()
            else:
                raise KeyError(model_id)
            self._predictors[model_id] = predictor
            load_time_ms = (perf_counter() - load_started) * 1000
            self._loaded_at[model_id] = datetime.now(timezone.utc).isoformat()
            self._load_times_ms[model_id] = load_time_ms
            return predictor, load_time_ms, True
        return self._predictors[model_id], None, False

    def predict_image(self, model_id: str, content: bytes) -> tuple[list[dict[str, Any]], float | None, float, bool]:
        image = Image.open(BytesIO(content))
        predictor, load_time_ms, model_was_loaded = self._get_predictor(model_id)
        inference_started = perf_counter()
        predictions = predictor.predict(image)
        inference_time_ms = (perf_counter() - inference_started) * 1000
        return predictions, load_time_ms, inference_time_ms, model_was_loaded

    def unload_model(self, model_id: str) -> bool:
        predictor = self._predictors.pop(model_id, None)
        if predictor is None:
            return False

        self._loaded_at.pop(model_id, None)
        self._load_times_ms.pop(model_id, None)

        model = getattr(predictor, "model", None)
        if model is not None:
            try:
                model.to("cpu")
            except (AttributeError, RuntimeError):
                pass
        del predictor
        gc.collect()
        self._clear_cuda_cache()
        return True

    def list_loaded_models(self) -> list[dict[str, Any]]:
        return [
            {
                "model_id": model_id,
                "loaded_at": self._loaded_at[model_id],
                "load_time_ms": round(self._load_times_ms[model_id], 2),
                "device": str(getattr(predictor, "device", "unknown")),
            }
            for model_id, predictor in self._predictors.items()
        ]

    @staticmethod
    def _clear_cuda_cache() -> None:
        try:
            import torch

            if torch.cuda.is_available():
                torch.cuda.empty_cache()
        except ImportError:
            pass


inference_service = InferenceService()
