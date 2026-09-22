from pathlib import Path

MODEL_ID = "titanic-xgboost"
MODEL_NAME = "Titanic Survival XGBoost"
MODEL_DESCRIPTION = "XGBoost model for Titanic survival prediction."
MODEL_CATEGORY = "Machine Learning"
INPUT_TYPE = "tabular"
OUTPUT_TYPE = "binary classification"

MODEL_DIR = Path(__file__).resolve().parent / "weights"
MODEL_PATH = MODEL_DIR / "model_1_1.pkl"

FEATURES = ["Pclass", "Sex", "Age", "FamilySize"]