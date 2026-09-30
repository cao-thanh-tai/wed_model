from pydantic import BaseModel


class Prediction(BaseModel):
    label: str
    score: float


class InferenceResponse(BaseModel):
    model_id: str
    predictions: list[Prediction]
    model_load_time_ms: float | None = None
    inference_time_ms: float
    model_was_loaded: bool
