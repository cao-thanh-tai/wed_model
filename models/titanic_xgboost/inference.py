from typing import Any

from models.base import ModelInterface
from models.titanic_xgboost.config import (
    FEATURES,
    INPUT_TYPE,
    MODEL_CATEGORY,
    MODEL_DESCRIPTION,
    MODEL_ID,
    MODEL_NAME,
    MODEL_PATH,
    OUTPUT_TYPE,
)
from models.titanic_xgboost.model import load_model
from models.titanic_xgboost.preprocessing import prepare_input, prepare_raw_input


class TitanicXGBoostInference(ModelInterface):
    def __init__(self) -> None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Model weights not found: {MODEL_PATH}")
        if not FEATURES:
            raise ValueError("Set FEATURES to the exact training feature order.")
        self.model = load_model(MODEL_PATH)

    def metadata(self) -> dict[str, Any]:
        return {
            "id": MODEL_ID,
            "name": MODEL_NAME,
            "description": MODEL_DESCRIPTION,
            "category": MODEL_CATEGORY,
            "input_type": INPUT_TYPE,
            "output_type": OUTPUT_TYPE,
        }

    def predict(self, input_data: dict[str, Any]) -> dict[str, Any]:
        prepared_input = prepare_raw_input(input_data)
        features = prepare_input(prepared_input, FEATURES)
        prediction = self.model.predict(features)[0]
        result = {"prediction": int(prediction)}
        if hasattr(self.model, "predict_proba"):
            result["probabilities"] = [float(value) for value in self.model.predict_proba(features)[0]]
        return result