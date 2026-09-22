from typing import Any

import pandas as pd


def get_title(name: str) -> str:
    for title in ("Mr.", "Mrs.", "Miss.", "Master."):
        if title in name:
            return title[:-1]
    return "Rare"


def prepare_raw_input(input_data: dict[str, Any]) -> dict[str, Any]:
    prepared = dict(input_data)

    if "Sex" in prepared and isinstance(prepared["Sex"], str):
        sex = prepared["Sex"].strip().lower()
        if sex not in {"male", "female"}:
            raise ValueError("Sex must be 'male' or 'female'.")
        prepared["Sex"] = 0 if sex == "male" else 1

    if "FamilySize" not in prepared:
        if "SibSp" not in prepared or "Parch" not in prepared:
            raise ValueError("Provide FamilySize or both SibSp and Parch.")
        prepared["FamilySize"] = int(prepared["SibSp"]) + int(prepared["Parch"]) + 1

    if "Age" not in prepared or prepared["Age"] is None:
        raise ValueError("Age is required because training-time age medians are not stored yet.")

    return prepared


def prepare_input(input_data: dict[str, Any], feature_order: list[str]) -> pd.DataFrame:
    missing_features = [feature for feature in feature_order if feature not in input_data]
    if missing_features:
        raise ValueError(f"Missing features: {', '.join(missing_features)}")

    return pd.DataFrame([[input_data[feature] for feature in feature_order]], columns=feature_order)