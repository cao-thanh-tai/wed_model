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
            from app.services.model_registry import model_registry

            predictor = model_registry.create_predictor(model_id)
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

        session = getattr(predictor, "session", None)
        if session is not None:
            del session
        del predictor
        gc.collect()
        return True

    def list_loaded_models(self) -> list[dict[str, Any]]:
        return [
            {
                "model_id": model_id,
                "loaded_at": self._loaded_at[model_id],
                "load_time_ms": round(self._load_times_ms[model_id], 2),
                "device": str(getattr(predictor, "device", "CPU")),
            }
            for model_id, predictor in self._predictors.items()
        ]

inference_service = InferenceService()
