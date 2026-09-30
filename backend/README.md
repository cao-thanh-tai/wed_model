# AI Hub Backend

## Run locally

```bash
uvicorn app.main:app --reload
```

Health check: `GET /api/v1/health`

## CV model API

```text
GET    /api/v1/models
GET    /api/v1/models/runtime
DELETE /api/v1/models/{model_id}/runtime
POST   /api/v1/inference/{model_id}
```

Inference responses include model-load time, inference time, and whether the
model was loaded for the current request. Runtime endpoints list cached models
and release selected models from memory.
