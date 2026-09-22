# AI Hub — Project Architecture & Development Guidelines

## 1. Project Overview

AI Hub is a personal web application that collects AI/ML models developed by the owner and allows users to:

* Browse available AI/ML models
* View model information
* Understand model inputs and outputs
* Upload data for inference
* Run models through the web interface
* View prediction/inference results

The project is intended as a practical AI Engineering project.

The main goal is not only to train models, but to build a complete pipeline:

```text
Model Development
      ↓
Model Inference
      ↓
Backend API
      ↓
Frontend
      ↓
User
```

The project should remain simple and modular. Do NOT introduce microservices, Kubernetes, message queues, or other complex infrastructure unless there is a clear requirement.

---

# 2. High-Level Architecture

```text
                         USER
                           │
                           ▼
                 ┌──────────────────┐
                 │     FRONTEND     │
                 │   React / Next   │
                 │   TypeScript     │
                 └────────┬─────────┘
                          │
                          │ HTTP / REST API
                          ▼
                 ┌──────────────────┐
                 │     BACKEND      │
                 │     FastAPI      │
                 │      Python      │
                 └────────┬─────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
       ┌──────────────┐        ┌──────────────┐
       │    MODELS    │        │   DATABASE   │
       │ PyTorch / ML │        │   Future     │
       └──────────────┘        └──────────────┘
```

The frontend and backend are separate applications.

The frontend communicates with the backend through HTTP APIs.

The backend is responsible for model inference and server-side logic.

The models directory contains model implementations and inference logic.

---

# 3. Repository Structure

```text
ai-hub/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── features/
│   │   ├── services/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── assets/
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── models.py
│   │   │   │   └── inference.py
│   │   │   └── router.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── logging.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── model.py
│   │   │   └── inference.py
│   │   │
│   │   ├── services/
│   │   │   ├── model_registry.py
│   │   │   └── inference_service.py
│   │   │
│   │   └── utils/
│   │
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── models/
│   ├── edge_detection/
│   │   ├── model.py
│   │   ├── inference.py
│   │   ├── preprocessing.py
│   │   ├── postprocessing.py
│   │   ├── config.py
│   │   └── weights/
│   │       └── best_model.pth
│   │
│   ├── titanic/
│   │   ├── model.py
│   │   ├── inference.py
│   │   ├── preprocessing.py
│   │   ├── config.py
│   │   └── weights/
│   │
│   ├── churn/
│   │   └── ...
│   │
│   └── README.md
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── models.md
│
├── .gitignore
├── README.md
├── .env.example
└── docker-compose.yml
```

`docker-compose.yml` may initially be empty/not used. It is reserved for future deployment.

---

# 4. Frontend Responsibilities

The frontend is responsible for the user interface and user interaction.

It should handle:

* Page rendering
* Navigation
* Model listing
* Model detail pages
* File upload UI
* Input validation for user experience
* Loading states
* Error states
* Displaying inference results
* Responsive UI
* Calling backend APIs

The frontend MUST NOT:

* Load PyTorch models
* Execute Python code
* Contain model weights
* Contain database credentials
* Contain private API keys
* Implement server-side business rules
* Directly access the database

Example:

```text
User uploads image
        ↓
Frontend validates file
        ↓
Frontend sends HTTP request
        ↓
Backend processes request
```

---

# 5. Frontend Architecture

The frontend should be organized by responsibility.

```text
frontend/src/

components/
    Reusable UI components

pages/
    Application pages

layouts/
    Shared page layouts

features/
    Feature-specific UI logic

services/
    API communication

types/
    TypeScript types/interfaces

hooks/
    Reusable React hooks

utils/
    Small frontend utilities

assets/
    Static frontend assets
```

Do not place API calls directly inside many unrelated UI components.

Prefer:

```text
Component
    ↓
Service
    ↓
Backend API
```

Example:

```text
ModelTester.tsx
       ↓
modelService.ts
       ↓
POST /api/v1/inference/{model_id}
```

---

# 6. Backend Responsibilities

The backend is responsible for server-side logic.

The backend should handle:

* REST API
* Request validation
* Model selection
* Model inference
* Preprocessing coordination
* Postprocessing coordination
* Error handling
* Logging
* Future authentication
* Future database access
* Future rate limiting

The backend should NOT contain frontend UI code.

---

# 7. Backend Architecture

```text
backend/app/

main.py
    Application entry point

api/
    API routes and routers

core/
    Application configuration and infrastructure

schemas/
    Request/response data models

services/
    Business logic and model orchestration

utils/
    Small reusable backend utilities
```

Dependency direction should generally be:

```text
API Routes
    ↓
Services
    ↓
Models
```

Avoid putting heavy business logic directly inside route functions.

Bad:

```python
@app.post("/predict")
def predict(...):
    # 100+ lines of preprocessing
    # model loading
    # inference
    # postprocessing
    # response formatting
```

Prefer:

```python
@app.post("/predict")
def predict(...):
    return inference_service.predict(...)
```

---

# 8. API Design

Use versioned REST APIs.

Base path:

```text
/api/v1
```

Examples:

```text
GET  /api/v1/models
GET  /api/v1/models/{model_id}

POST /api/v1/inference/{model_id}
```

Example:

```text
POST /api/v1/inference/edge-detection
```

The frontend should not need to know how the model is implemented internally.

The frontend only knows:

```text
model_id
input requirements
API endpoint
response format
```

---

# 9. Model Registry

Do NOT create a huge `if/elif` chain.

Avoid:

```python
if model_name == "titanic":
    ...
elif model_name == "churn":
    ...
elif model_name == "edge_detection":
    ...
```

Instead, use a model registry.

Conceptually:

```text
Model Registry
│
├── edge-detection → EdgeDetectionModel
├── titanic        → TitanicModel
└── churn          → ChurnModel
```

The registry should provide a consistent interface for models.

For example:

```python
class ModelInterface:
    def load(self):
        ...

    def predict(self, input_data):
        ...

    def metadata(self):
        ...
```

Each model can implement its own internal logic while exposing a common interface.

---

# 10. Models Directory

The `models/` directory contains the actual AI/ML implementations.

Each model should be isolated.

Example:

```text
models/
└── edge_detection/
    ├── model.py
    ├── inference.py
    ├── preprocessing.py
    ├── postprocessing.py
    ├── config.py
    └── weights/
        └── best_model.pth
```

Responsibilities:

### model.py

Defines the model architecture.

Example:

```python
class EdgeDetectionCNN(nn.Module):
    ...
```

### inference.py

Defines how the trained model is loaded and used for prediction.

Example:

```python
model = EdgeDetectionCNN()
model.load_state_dict(...)
model.eval()
```

### preprocessing.py

Transforms raw user input into the format expected by the model.

Examples:

```text
resize
normalize
tensor conversion
channel conversion
```

### postprocessing.py

Transforms model output into a format suitable for the API/frontend.

Examples:

```text
tensor → image
tensor → class label
tensor → JSON
```

### config.py

Contains model-specific configuration.

Examples:

```text
input size
threshold
normalization parameters
model version
```

### weights/

Contains trained model weights.

Do not put training datasets inside the deployed model directory.

Do not put Jupyter notebooks inside the model directory.

Do not put unrelated experiments inside the model directory.

---

# 11. Model Lifecycle

Every model should follow approximately this lifecycle:

```text
TRAIN
  ↓
EVALUATE
  ↓
SAVE WEIGHTS
  ↓
CREATE INFERENCE PIPELINE
  ↓
ADD MODEL TO models/
  ↓
REGISTER MODEL
  ↓
EXPOSE API
  ↓
CONNECT FRONTEND
  ↓
TEST END-TO-END
```

Example:

```text
Edge Detection CNN
        ↓
best_model.pth
        ↓
models/edge_detection/
        ↓
Model Registry
        ↓
POST /api/v1/inference/edge-detection
        ↓
Frontend Model Tester
```

---

# 12. Model Metadata

The frontend should not hard-code every model's UI.

Models should expose metadata.

Example:

```json
{
  "id": "edge-detection",
  "name": "Edge Detection CNN",
  "description": "CNN model for edge detection.",
  "category": "Computer Vision",
  "input_type": "image",
  "output_type": "image"
}
```

The frontend can use this information to render a generic model page.

This allows new models to be added without creating a completely new frontend page for every model.

---

# 13. Generic Model Tester

The frontend should eventually have a reusable model testing interface.

Conceptually:

```text
Model Detail Page
│
├── Model Information
├── Architecture
├── Input Requirements
├── Output Description
│
└── Model Tester
      │
      ├── Input
      ├── Run Inference
      ├── Loading
      ├── Error
      └── Result
```

Different models can provide different input/output types.

Examples:

```text
Image → Image
Image → Classification
CSV → Classification
Text → Classification
Audio → Classification
```

The frontend should reuse components whenever possible.

---

# 14. Data Flow

## Example: Edge Detection

```text
USER
 │
 │ upload image
 ▼
FRONTEND
 │
 │ POST multipart/form-data
 ▼
BACKEND
 │
 │ validate request
 ▼
INFERENCE SERVICE
 │
 ▼
MODEL REGISTRY
 │
 ▼
EDGE DETECTION MODEL
 │
 ├── preprocessing
 │
 ├── model inference
 │
 └── postprocessing
 │
 ▼
BACKEND
 │
 │ JSON / image response
 ▼
FRONTEND
 │
 ▼
USER
```

---

# 15. Error Handling

Backend should return structured errors.

Example:

```json
{
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only PNG and JPEG images are supported."
  }
}
```

Frontend should display a user-friendly message.

Do not expose:

* Stack traces
* Internal file paths
* Secret values
* Database credentials
* Internal implementation details

to the user.

---

# 16. Environment Variables

Secrets and environment-specific configuration must not be hard-coded.

Use:

```text
.env
```

and provide:

```text
.env.example
```

Example:

```env
API_BASE_URL=http://localhost:8000
```

Never commit real secrets to Git.

---

# 17. Development Environment

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Typical local development:

```text
Frontend
http://localhost:3000

Backend
http://localhost:8000

API Documentation
http://localhost:8000/docs
```

The frontend and backend are separate processes.

They communicate through HTTP.

---

# 18. Development Order

Development should follow this order:

## Phase 1 — Project Skeleton

Create:

```text
frontend/
backend/
models/
docs/
```

Make both frontend and backend run independently.

---

## Phase 2 — Backend Foundation

Implement:

```text
FastAPI
    ↓
/api/v1/models
    ↓
model registry
```

Initially use mock model metadata if necessary.

---

## Phase 3 — First Real Model

Start with one real model.

Recommended example:

```text
edge_detection
```

Implement:

```text
model.py
inference.py
preprocessing.py
postprocessing.py
weights/
```

Then connect it to FastAPI.

---

## Phase 4 — Frontend

Build:

```text
Home
Models
Model Detail
Model Tester
```

Use mock data initially if backend is not ready.

---

## Phase 5 — Integration

Connect:

```text
Frontend
    ↓
FastAPI
    ↓
Edge Detection Model
```

Test the complete pipeline.

---

## Phase 6 — Add More Models

Add models one at a time.

For example:

```text
edge_detection
titanic
churn
music_genre
```

Each model should follow the same interface.

---

## Phase 7 — Polish

Only after the system works:

```text
UI improvements
Responsive design
Animations
Error states
Loading states
Accessibility
Performance
```

---

# 19. Important Engineering Rules

## Rule 1 — Keep responsibilities separated

Do not mix:

```text
Frontend UI
Backend API
Model implementation
```

---

## Rule 2 — Do not over-engineer V1

Do NOT introduce:

```text
Kubernetes
Microservices
Redis
Kafka
Celery
Multiple databases
Complex cloud infrastructure
```

unless the project actually requires them.

Start with:

```text
React/Next.js
+
FastAPI
+
PyTorch
```

---

## Rule 3 — One backend is enough for V1

Do not create:

```text
edge-api
titanic-api
churn-api
...
```

as separate services initially.

Use:

```text
One FastAPI backend
       ↓
Model Registry
       ↓
Multiple Models
```

Split services only when there is a real reason such as:

* Dependency conflicts
* Different scaling requirements
* GPU isolation
* Large model size
* Independent deployment requirements

### Current V1 exception

The current CV model runs in the `cv` Conda environment and its FastAPI
process uses port `8001`. Traditional ML models run in the separate `ml`
environment and backend process on port `8002`. Future NLP models may use the
`nlp` environment and port `8003`. This is one backend per task, not one API
service per model: each task backend may host multiple compatible models. The
frontend remains the only client-facing application.

---

## Rule 4 — Models should be replaceable

The backend should not depend heavily on the internal implementation of a model.

Prefer:

```text
Backend
   ↓
Model Interface
   ↓
Specific Model
```

instead of:

```text
Backend
   ↓
hard-coded PyTorch implementation
```

---

## Rule 5 — Frontend should be generic

Avoid creating:

```text
TitanicPage.tsx
ChurnPage.tsx
EdgeDetectionPage.tsx
MusicGenrePage.tsx
...
```

unless a model genuinely requires a unique UI.

Prefer:

```text
ModelDetailPage
ModelTester
ModelInput
ModelResult
```

driven by model metadata.

---

# 20. Current V1 Scope

The first version only needs:

```text
Frontend
    ↓
Model listing
    ↓
Model detail
    ↓
Model tester

Backend
    ↓
FastAPI
    ↓
Model registry
    ↓
Inference API

Models
    ↓
At least one working AI model
```

Authentication, database, user accounts, prediction history, cloud GPU, Docker orchestration, and advanced MLOps can be added later.

The priority is:

```text
WORKING SYSTEM
      ↓
CLEAN ARCHITECTURE
      ↓
MORE MODELS
      ↓
BETTER UI
      ↓
DEPLOYMENT
      ↓
MLOps
```

---

# 21. Core Principle

The project should demonstrate the complete AI Engineering workflow:

```text
                 AI MODEL
                    │
                    ▼
              INFERENCE CODE
                    │
                    ▼
                FASTAPI
                    │
                    ▼
                 REST API
                    │
                    ▼
              FRONTEND APP
                    │
                    ▼
                  USER
```

The project is not simply an AI model collection.

It is a system for turning trained AI models into usable web applications.
