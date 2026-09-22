from pydantic import BaseModel


class Prediction(BaseModel):
    label: str
    score: float


class InferenceResponse(BaseModel):
    model_id: str
    predictions: list[Prediction]
