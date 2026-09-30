from datetime import datetime, timezone
from time import perf_counter

from models.titanic_xgboost.inference import TitanicXGBoostInference
from models.titanic_xgboost.random_forest import TitanicRandomForestInference


def get_model_metadata() -> list[dict[str, object]]:
    return [
        {
            "id": "titanic-xgboost",
            "name": "Titanic Survival XGBoost",
            "description": "XGBoost model for Titanic survival prediction.",
            "category": "Machine Learning",
            "input_type": "tabular",
            "output_type": "binary classification",
            "metrics": {
                "accuracy": 0.8379888268156425,
                "f1_score": 0.7786259541984732,
                "precision": 0.8225806451612904,
                "recall": 0.7391304347826086,
            },
        },
        {
            "id": "titanic-random-forest",
            "name": "Titanic Survival Random Forest",
            "description": "Random Forest model for Titanic survival prediction.",
            "category": "Machine Learning",
            "input_type": "tabular",
            "output_type": "binary classification",
            "metrics": {
                "accuracy": 0.80,
                "f1_score": 0.70,
                "precision": 0.81,
                "recall": 0.62,
            },
        },
    ]


_models: dict[str, TitanicXGBoostInference | TitanicRandomForestInference] = {}
_loaded_at: dict[str, str] = {}
_load_times_ms: dict[str, float] = {}


def get_model(model_id: str) -> TitanicXGBoostInference | TitanicRandomForestInference:
    if model_id != "titanic-xgboost":
        if model_id != "titanic-random-forest":
            raise KeyError(model_id)
    if model_id not in _models:
        load_started = perf_counter()
        _models[model_id] = (
            TitanicXGBoostInference()
            if model_id == "titanic-xgboost"
            else TitanicRandomForestInference()
        )
        _loaded_at[model_id] = datetime.now(timezone.utc).isoformat()
        _load_times_ms[model_id] = (perf_counter() - load_started) * 1000
    return _models[model_id]


def list_loaded_models() -> list[dict[str, object]]:
    return [
        {
            "model_id": model_id,
            "loaded_at": _loaded_at[model_id],
            "load_time_ms": round(_load_times_ms[model_id], 2),
            "device": "cpu",
        }
        for model_id in _models
    ]


def unload_model(model_id: str) -> bool:
    if model_id not in _models:
        return False
    del _models[model_id]
    _loaded_at.pop(model_id, None)
    _load_times_ms.pop(model_id, None)
    return True
