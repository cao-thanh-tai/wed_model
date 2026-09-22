from app.schemas.model import ModelMetadata


class ModelRegistry:
    def __init__(self) -> None:
        self._models: dict[str, ModelMetadata] = {}

    def register(self, metadata: ModelMetadata) -> None:
        self._models[metadata.id] = metadata

    def list_metadata(self) -> list[ModelMetadata]:
        return list(self._models.values())

    def has_model(self, model_id: str) -> bool:
        return model_id in self._models


model_registry = ModelRegistry()
model_registry.register(
    ModelMetadata(
        id="pascal-voc-multilabel-vit",
        name="Pascal VOC Multi-label ViT",
        description="Vision Transformer for multi-label Pascal VOC image classification.",
        category="Computer Vision",
        input_type="image",
        output_type="multi-label classification",
        metrics={
            "f1_macro": 0.7924,
            "f1_micro": 0.8426,
            "precision": 0.9131,
            "recall": 0.7143,
        },
    )
)
