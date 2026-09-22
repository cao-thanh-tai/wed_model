from typing import Any

from pydantic import BaseModel, Field


class ModelMetadata(BaseModel):
    id: str
    name: str
    description: str
    category: str
    input_type: str
    output_type: str
    metrics: dict[str, float] = Field(default_factory=dict)


class PredictionRequest(BaseModel):
    features: dict[str, Any]


class PredictionResponse(BaseModel):
    model_id: str
    result: dict[str, Any]
