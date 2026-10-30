# AI Hub ONNX Backend

## Run locally

```bash
conda activate web
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Health check: `GET /api/v1/health`

## Unified model API

```text
GET    /api/v1/models
GET    /api/v1/models/runtime
DELETE /api/v1/models/{model_id}/runtime
POST   /api/v1/inference/{model_id}
```

The backend uses the Conda `web` environment and Python `onnxruntime`. The Fruit
Classification model is registered from
`models/fruit_classification/web/model/fruit_classifier.onnx`.

Inference responses include model-load time, inference time, and whether the
ONNX Runtime session was loaded for the current request. Runtime endpoints list
cached sessions and release selected sessions from memory.

The frontend does not use `onnxruntime-web`; inference stays in the backend.
