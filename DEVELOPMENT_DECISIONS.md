# AI Hub - Development Decisions

This document turns the high-level architecture into concrete V1 decisions.

## 1. Chosen Stack

### Python Environment

- Python version: `3.11`
- Use the Conda `web` environment for the backend and ONNX Runtime.
- ONNX Runtime is the model execution runtime for the next implementation phase.
- Do not create separate `cv`, `ml`, or `nlp` Conda environments for model
  execution.
- The frontend uses Node.js/npm, not Conda

### Frontend

- React
- TypeScript
- Vite
- React Router
- Plain CSS first; add a UI library only when there is a real need
- `fetch` through a small API service layer

React + Vite is the default for V1 because this application is an interactive
model dashboard, not a public content website. It keeps the frontend simple,
fast to start, and separate from the FastAPI backend.

### Backend

- Python
- FastAPI
- Pydantic schemas
- Uvicorn for local development
- Pytest for tests
- Shared backend and ONNX Runtime dependencies live in
  `backend/requirements.txt`.
- Model-specific conversion tools may be kept separately, but the running
  backend must depend on exported ONNX models rather than PyTorch,
  Transformers, XGBoost, or scikit-learn runtimes.

The backend owns validation, model selection, inference orchestration, and
public API responses.

### Models

- Exported ONNX files and model metadata under `models/`
- A consistent ONNX inference interface for every registered model
- Model-specific preprocessing and postprocessing stay with the model adapter
- Model weights never go into the frontend

## 2. How To Use Copilot And Agents

Use the main Copilot coding agent (me) for implementation work that requires
shared context across the repository:

- deciding and applying architecture changes
- creating folders and files
- implementing frontend, backend, and model code
- running tests and fixing the resulting errors
- keeping the API contract consistent across layers

Use a subagent for bounded supporting work:

- read-only codebase exploration
- reviewing a proposed design
- checking for usages or related files
- suggesting tests or identifying risks

The subagent should not independently redesign the architecture or make broad
edits while the main implementation is in progress. One agent should own the
final code path so changes remain consistent.

## 3. Can The Coding Agent Create Everything?

Yes. The coding agent can create the required folders and files, edit code,
run commands, and validate the result in this workspace. The work will be
done incrementally so each layer can be tested before the next layer is added.

The agent will not create deployment infrastructure, databases, queues, or
other V2 systems unless the application actually requires them.

## 4. Initial Folder Structure

Only create folders needed for the first working flow. The target structure is:

```text
ai-hub/
├── ARCHITECTURE.md
├── DEVELOPMENT_DECISIONS.md
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── router.py
│   │   │   └── routes/
│   │   │       ├── models.py
│   │   │       └── inference.py
│   │   ├── schemas/
│   │   ├── services/
│   │   └── core/
│   ├── tests/
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── layouts/
│   ├── public/
│   ├── package.json
│   └── README.md
└── models/
    ├── __init__.py
    ├── <model-id>/
    │   ├── model.onnx
    │   ├── metadata.json
    │   └── preprocessing/postprocessing code
    └── README.md
```

Folders such as `hooks/`, `features/`, `utils/`, and individual model
directories will be added when a real use case needs them. Empty folders do
not provide value by themselves.

## 5. First Implementation Order

1. Keep the existing frontend as the UI foundation.
2. Simplify the backend to one FastAPI application and one Python environment.
3. Define the ONNX model metadata and inference contract.
4. Implement a registry and `GET /api/v1/models` without model-specific
   route conditionals.
5. Add ONNX Runtime inference for one model supplied later.
6. Connect the existing generic frontend tester to the unified backend.
7. Validate preprocessing, predictions, error handling, and response parity.
8. Add the remaining models one at a time.

## 6. V1 Boundaries

V1 uses synchronous inference for models that finish within a normal HTTP
request. The API contract should leave room for asynchronous jobs later, but
there is no queue, worker service, database, authentication, or cloud storage
in the first version.

The frontend talks only to the backend API. The backend talks to models only
through the model registry/interface. New models should be added by creating
their model module and registering metadata, not by adding model-specific UI
pages or large route conditionals.

For local development, run one backend process on port `8000` and the
frontend on port `5173`. Model files are added to the shared registry one at a
time. The old task-specific backend code is migration history and should not
be treated as the target architecture.
