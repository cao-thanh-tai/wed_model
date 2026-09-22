# AI Hub — Copilot Instructions

## 1. Project

This is a personal AI Hub web application.

The purpose of the project is to collect AI/ML models and allow users to test them directly through a web interface.

Main architecture:

```text
User
  ↓
Frontend
  ↓ HTTP API
Backend
  ↓
Models
```

---

## 2. Project Structure

```text
ai-hub/
├── frontend/
├── backend/
├── models/
├── docs/
└── .github/
```

### frontend/

Responsible for:

* User interface
* Pages
* Components
* User interaction
* Calling backend APIs
* Displaying model results

Do not put Python, PyTorch, model weights, or backend logic here.

### backend/

Responsible for:

* REST API
* Request validation
* Model inference orchestration
* Server-side logic
* Error handling

Technology:

* Python
* FastAPI

### models/

Contains the actual AI/ML models.

Each model should have its own directory.

Example:

```text
models/
└── edge_detection/
    ├── model.py
    ├── inference.py
    ├── preprocessing.py
    ├── postprocessing.py
    └── weights/
```

Do not put frontend code here.

Do not put unrelated training experiments here.

---

## 3. Architecture Rules

Keep these responsibilities separated:

```text
Frontend → UI and user interaction

Backend → API and server-side logic

Models → AI/ML implementation and inference
```

The frontend communicates with the backend through HTTP APIs.

The frontend should NOT directly run Python or PyTorch.

The backend should NOT contain frontend/UI code.

The backend should use the model inference code instead of duplicating model logic.

---

## 4. Model Integration

When adding a new model:

```text
Train model
    ↓
Save trained weights
    ↓
Create inference code
    ↓
Add model to models/
    ↓
Register model in backend
    ↓
Expose API
    ↓
Connect frontend
```

Prefer a consistent interface between the backend and models.

Do not create a completely different architecture for every model unless necessary.

---

## 5. API

Use REST APIs.

API routes should use versioning:

```text
/api/v1/...
```

Example:

```text
GET  /api/v1/models
GET  /api/v1/models/{model_id}
POST /api/v1/inference/{model_id}
```

Do not hard-code large `if/elif` chains for model selection.

Prefer a model registry or another clean model-dispatch mechanism.

---

## 6. Frontend Rules

Use reusable components.

Prefer:

```text
ModelDetail
ModelTester
ModelInput
ModelResult
```

instead of creating a completely separate implementation for every model.

The frontend should be driven by model metadata where possible.

Avoid unnecessary duplication.

---

## 7. Backend Rules

Keep API routes thin.

Prefer:

```text
API Route
    ↓
Service
    ↓
Model
```

Do not put large amounts of inference or business logic directly inside route functions.

Keep model-specific preprocessing and postprocessing inside the corresponding model directory when appropriate.

---

## 8. Coding Principles

* Keep the code simple.
* Prefer readable code over clever code.
* Reuse existing code before creating new abstractions.
* Do not create unnecessary files.
* Do not introduce unnecessary dependencies.
* Do not modify unrelated parts of the project.
* Follow the existing project structure.
* Preserve existing functionality when adding features.
* Explain important architectural changes before making large changes.

---

## 9. Do Not Over-Engineer V1

This is a V1 project.

Do NOT introduce the following unless there is a real requirement:

* Microservices
* Kubernetes
* Redis
* Kafka
* Celery
* Multiple backend services
* Complex database architecture
* Complex MLOps infrastructure

Start with:

```text
Frontend
+
FastAPI Backend
+
AI Models
```

The architecture can be expanded later when the project actually requires it.

---

## 10. Development Priority

Prioritize functionality in this order:

```text
1. Model inference works
2. Backend API works
3. Frontend can call the API
4. End-to-end system works
5. Error handling
6. UI improvements
7. Performance improvements
8. Deployment
9. MLOps
```

Do not prioritize visual polish over a working end-to-end system.

---

## 11. Before Making Changes

Before implementing a significant feature:

1. Inspect the existing project structure.
2. Check whether the required functionality already exists.
3. Reuse existing components/services when possible.
4. Identify which layer the change belongs to.
5. Avoid changing architecture unless necessary.

When requirements are ambiguous, ask for clarification rather than inventing a complex solution.

---

## 12. Current Goal

The immediate goal is to build a simple working AI Hub.

The first working flow should be:

```text
User
 ↓
Frontend
 ↓
Upload input
 ↓
Backend API
 ↓
AI Model
 ↓
Inference
 ↓
Backend response
 ↓
Frontend result
```

Start with one real model and make the complete flow work before adding more models.
