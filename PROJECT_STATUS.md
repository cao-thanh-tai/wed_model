# AI Hub - Project Status

Read this file together with `ARCHITECTURE.md` and
`DEVELOPMENT_DECISIONS.md` before continuing work in a new chat.

## Current State

The CV and ML end-to-end flows are working:

```text
Frontend -> FastAPI CV backend -> model registry -> Pascal VOC ViT -> predictions
```

```text
Frontend -> FastAPI ML backend -> ML model registry -> Titanic model -> prediction
```

The model is a Pascal VOC multi-label ViT classifier with 20 labels. It uses
the weights in `models/pascal_voc_multilabel_vit/weights/voc-multilabel-vit/` and has been tested
through the inference API.

The CV backend also serves the CUB-200-2011 ResNet50 classifier. Its runtime
adapter is in `models/cub_200_2011/inference.py`, and its 200 class names are
loaded from `models/cub_200_2011/classes.txt`. The local checkpoint is about
192 MB and is intentionally excluded from normal Git commits.

## Runtime Layout

- `frontend/`: React + TypeScript + Vite. Default API URL is port `8001`.
- `backend/`: FastAPI routes, schemas, registry, and inference orchestration.
- `backend/ml_app/`: separate ML FastAPI backend for the `ml` environment.
- `models/pascal_voc_multilabel_vit/`: model runtime code and weights.
- `models/cub_200_2011/`: CUB-200-2011 runtime adapter, class names, and local checkpoint.
- `models/titanic_xgboost/`: Titanic XGBoost and Random Forest runtime code and weights.
- `backend/requirements.txt`: shared backend dependencies.
- `backend/ml_app/requirements.txt`: ML backend dependencies.
- `models/pascal_voc_multilabel_vit/requirements.txt`: CV model dependencies.
- Conda environment `cv`: current environment for the CV backend and model.
- Conda environment `ml`: reserved for the separate traditional ML backend and models.
- Conda environment `nlp`: reserved for the future separate NLP backend and models.
- Conda environment `web`: obsolete and not part of the current flow.

## Implemented API

```text
GET  /api/v1/health
GET  /api/v1/models
POST /api/v1/inference/pascal-voc-multilabel-vit
POST /api/v1/inference/cub-200-2011
```

The inference endpoint accepts an image as multipart form field `file` and
returns labels with confidence scores.

## How To Run

Backend terminal:

```powershell
conda activate cv
cd D:\vscode\wed\backend
pip install -r requirements.txt
pip install -r ..\models\pascal_voc_multilabel_vit\requirements.txt
uvicorn app.main:app --reload --port 8001
```

ML backend terminal:

```powershell
conda activate ml
cd D:\vscode\wed\backend
pip install -r ml_app\requirements.txt
uvicorn ml_app.main:app --reload --port 8002
```

Frontend terminal:

```powershell
cd D:\vscode\wed\frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Verified Checks

- CV environment loads the model weights.
- `/api/v1/health` returns HTTP 200.
- `/api/v1/models` returns `pascal-voc-multilabel-vit` metadata.
- Multipart image inference returns HTTP 200 and predictions.
- CUB-200-2011 checkpoint loads in the `cv` environment and returns top-5 species predictions.
- CUB class names are mapped from `classes.txt` instead of generic class IDs.
- ML health, model listing, and Titanic inference return HTTP 200 in Conda `ml`.
- Frontend production build passes with `npm run build`.
- Frontend image tester supports drag-and-drop, image validation, and explicit inference loading/error states.
- Frontend model navigation uses client-side routing without full page reloads.
- ML API returns both `titanic-xgboost` and `titanic-random-forest`.
- Titanic form inference works from the ML API and frontend.

## Current Next Step

Continue frontend polish and task-aware UX. The frontend currently reads CV
models from port `8001` and ML models from port `8002`.

Next useful tasks:

1. Verify the frontend manually with both CV and ML backends running.
2. Add more complete model detail content and metric labels.
3. Improve run history persistence when a database becomes necessary.
4. Add the NLP task later using Conda `nlp` and port `8003`.

## Architecture Boundary

The project still follows the original separation of responsibilities. The
only deliberate V1 exception is task-specific runtime isolation: CV, ML, and
NLP each have their own Conda environment and backend process. This is one
backend per task, not one backend service per individual model. Compatible
models within one task still share that task's registry and API.

Do not add databases, queues, microservices, authentication, or deployment
infrastructure unless a new requirement justifies them.