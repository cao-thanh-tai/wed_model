from typing import Any


def format_prediction(model: Any, prediction: Any, input_data: dict[str, Any]) -> dict[str, Any]:
    result: dict[str, Any] = {
        "prediction": int(prediction),
        "label": "survived" if int(prediction) == 1 else "did_not_survive",
    }

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba([list(input_data.values())])[0]
        result["probabilities"] = [float(value) for value in probabilities]

    return result