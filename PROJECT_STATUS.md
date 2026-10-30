# AI Hub - Project Status

Read this file together with `ARCHITECTURE.md` and
`DEVELOPMENT_DECISIONS.md` before continuing work in a new chat.

## Current State

The project has been reset to one FastAPI backend using ONNX Runtime. The
previous CV/ML runtime implementations are no longer active. Fruit
Classification is the first registered ONNX model and is available through the
unified image inference endpoint.

The frontend has per-model cover assets under `frontend/public/models/`, with
the shared asset map in `frontend/src/services/modelAssets.ts`. These assets
and the generic frontend screens are retained while the backend is rebuilt.

## Runtime Layout

- `frontend/`: React + TypeScript + Vite, retained as the UI foundation.
- `backend/`: the single FastAPI application and ONNX Runtime service.
- `models/fruit_classification/`: Fruit ONNX file, metadata, and adapter.
- `models/`: ONNX files, metadata, and small model adapters added incrementally.
- Conda environment `web`: backend dependencies plus `onnxruntime`.
- The old `backend/ml_app/` and model-specific Python runtimes are migration
  leftovers to be removed or replaced during backend restructuring.

## Target API

```text
GET  /api/v1/health
GET  /api/v1/models
POST /api/v1/inference/{model_id}
GET  /api/v1/models/runtime
DELETE /api/v1/models/{model_id}/runtime
```

The endpoint contract preserves generic metadata, structured errors,
model-load timing, and inference timing without exposing model-specific
implementation details.

## How To Run

Use the single-backend instructions in `RUN_LOCAL.md` with the Conda `web`
environment and port `8000`. The frontend continues to run with Node.js/npm on
port `5173`.

Frontend terminal:

```powershell
cd D:\vscode\wed\frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Verified Checks

- The existing frontend production build passes and remains the foundation for
  the migration.
- The previous CV/ML flows were verified before this reset, but those checks
  are historical and do not certify the future ONNX backend.
- Backend restructuring and ONNX Runtime installation are complete for the
  first model.
- Fruit Classification ONNX graph and API inference have been validated.
- Frontend production build passes with `npm run build`.
- Frontend image tester supports drag-and-drop, image validation, and explicit inference loading/error states.
- Frontend image tester shows model-load and inference timings, supports copy/JSON export, and releases models manually.
- Frontend model navigation uses client-side routing without full page reloads.
- Topbar runtime manager lists loaded ONNX models and releases them on demand.
- Workspace cards and model detail pages use per-model cover images.
- Breadcrumb navigation provides clickable route history under `Model lab`.
- ML API returns both `titanic-xgboost` and `titanic-random-forest`.
- Titanic form inference worked from the previous ML API and is not currently
  part of the target backend.

## Current Next Step

1. Add additional ONNX models one at a time using the same package structure.
2. Improve model-specific metadata and frontend assets when required.
3. Add persistent run history only when a database becomes necessary.

## Architecture Boundary

The target architecture uses one backend, the Conda `web` environment, and one
ONNX Runtime execution layer. Frontend, backend, and model responsibilities
remain separate. New models must provide the documented web package before
being registered.

Do not add databases, queues, microservices, authentication, or deployment
infrastructure unless a new requirement justifies them.