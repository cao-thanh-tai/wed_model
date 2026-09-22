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


def get_model(model_id: str) -> TitanicXGBoostInference:
    if model_id != "titanic-xgboost":
        if model_id != "titanic-random-forest":
            raise KeyError(model_id)
    if model_id not in _models:
        _models[model_id] = (
            TitanicXGBoostInference()
            if model_id == "titanic-xgboost"
            else TitanicRandomForestInference()
        )
    return _models[model_id]
