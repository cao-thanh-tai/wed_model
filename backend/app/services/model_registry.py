from collections.abc import Callable
from typing import Any

from app.schemas.model import ModelMetadata
from models.fruit_classification.inference import FruitClassificationInference


ModelFactory = Callable[[], Any]


class ModelRegistry:
    def __init__(self) -> None:
        self._models: dict[str, ModelMetadata] = {}
        self._factories: dict[str, ModelFactory] = {}

    def register(self, metadata: ModelMetadata, factory: ModelFactory) -> None:
        self._models[metadata.id] = metadata
        self._factories[metadata.id] = factory

    def list_metadata(self) -> list[ModelMetadata]:
        return list(self._models.values())

    def has_model(self, model_id: str) -> bool:
        return model_id in self._models

    def create_predictor(self, model_id: str) -> Any:
        try:
            return self._factories[model_id]()
        except KeyError as error:
            raise KeyError(model_id) from error


model_registry = ModelRegistry()
model_registry.register(
    ModelMetadata(
        id="fruit-classification",
        name="Fruit Classification",
        description="ResNet18 image classifier for ten fruit categories.",
        category="Computer Vision",
        input_type="image",
        output_type="single-label classification",
    ),
    FruitClassificationInference,
)
