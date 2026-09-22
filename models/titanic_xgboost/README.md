# Titanic XGBoost

The runtime class is `TitanicXGBoostInference` and the actual model ID is
`titanic-xgboost`.

The uploaded artifact is an XGBoost classifier:

```text
weights/model_1_1.pkl
```

Before integration, record the exact feature order used during training in
`config.py`:

The current notebook shows that the XGBoost model was trained with:

```text
Pclass, Sex, Age, FamilySize
```

`FamilySize` is calculated as `SibSp + Parch + 1`. `Sex` accepts `male` or
`female` as raw input and is converted to `0` or `1`.

If training used an encoder, scaler, or a preprocessing pipeline, send that
artifact too. A `.pkl` file is enough only when it already contains the full
pipeline and accepts the raw input fields directly.