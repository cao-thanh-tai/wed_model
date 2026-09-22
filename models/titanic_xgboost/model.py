from pathlib import Path
from typing import Any

import joblib


def load_model(model_path: Path) -> Any:
    return joblib.load(model_path)