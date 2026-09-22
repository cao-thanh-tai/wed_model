# AI Hub - Development Decisions

This document turns the high-level architecture into concrete V1 decisions.

## 1. Chosen Stack

### Python Environment

- Python version: `3.11`
- `cv` owns the CV backend and CV model dependencies
- `ml` owns the traditional machine-learning backend and model dependencies
- `nlp` will own the NLP backend and NLP model dependencies when added
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
- Shared backend dependencies live in `backend/requirements.txt`
- Model-specific dependencies live beside the model, for example
    `models/pascal_voc_multilabel_vit/requirements.txt`

The backend owns validation, model selection, inference orchestration, and
public API responses.

### Models

- Python model modules under `models/`
- A consistent inference interface for every registered model
- Model-specific preprocessing and postprocessing stay with the model
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
    ├── base.py
    ├── pascal_voc_multilabel_vit/
    │   ├── requirements.txt
    │   └── weights/
    └── README.md
```

Folders such as `hooks/`, `features/`, `utils/`, and individual model
directories will be added when a real use case needs them. Empty folders do
not provide value by themselves.

## 5. First Implementation Order

1. Create the minimal backend and frontend projects.
2. Add a model metadata contract and a registry.
3. Implement `GET /api/v1/models`.
4. Add one real or deliberately small working model.
5. Implement `POST /api/v1/inference/{model_id}`.
6. Build the generic model list, detail, and tester screens.
7. Connect the frontend to the backend.
8. Test the complete upload-to-result flow.

## 6. V1 Boundaries

V1 uses synchronous inference for models that finish within a normal HTTP
request. The API contract should leave room for asynchronous jobs later, but
there is no queue, worker service, database, authentication, or cloud storage
in the first version.

The frontend talks only to the backend API. The backend talks to models only
through the model registry/interface. New models should be added by creating
their model module and registering metadata, not by adding model-specific UI
pages or large route conditionals.

For local development, run one backend process per task environment. The CV
backend uses port `8001`, the ML backend uses port `8002`, a future NLP backend
can use port `8003`, and the frontend uses port `5173`. Multiple terminals are
expected when multiple task backends are active.
