from pydantic import BaseModel, Field


class ModelMetadata(BaseModel):
    id: str
    name: str
    description: str
    category: str
    input_type: str
    output_type: str
    metrics: dict[str, float] = Field(default_factory=dict)
