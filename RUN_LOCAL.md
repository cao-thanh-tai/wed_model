# Run AI Hub Locally

The local setup uses one FastAPI backend using ONNX Runtime. The existing
model-specific Conda environments and model services are no longer part of the
workflow.

The backend and frontend are separate processes. They can run in two terminals,
or the backend can be started in a second PowerShell window from the first.

```powershell
cd D:\vscode\wed
```

Install dependencies once before starting the services.

## One-time setup

Use the existing `web` Conda environment, then install the unified backend
dependencies once:

```powershell
conda activate web
cd D:\vscode\wed\backend
pip install -r requirements.txt
```

### Frontend

```powershell
cd D:\vscode\wed\frontend
npm install
```

## Backend

```powershell
cd D:\vscode\wed\backend
conda activate web
uvicorn app.main:app --reload --port 8000
```

API: http://127.0.0.1:8000

API docs: http://127.0.0.1:8000/docs

## Frontend

```powershell
cd D:\vscode\wed\frontend
npm run dev
```

Frontend: http://localhost:5173

## Quick checks

Backend health:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/v1/health
```

Registered models:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/v1/models
```

Loaded runtime models:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/v1/models/runtime
```

The frontend should use the unified backend URL. Runtime release behavior can
be retained, but it must operate on ONNX Runtime sessions in the single
backend.

The backend runs `onnxruntime` in Python. Do not install `onnxruntime-web`;
the browser uploads images to the backend instead of executing the model.

Stop a running server with `Ctrl+C` in its terminal.
