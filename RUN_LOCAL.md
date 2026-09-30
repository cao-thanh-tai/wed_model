# Run AI Hub Locally

Open three PowerShell terminals from the repository root:

```powershell
cd D:\vscode\wed
```

Install dependencies once before starting the services.

## One-time setup

### CV environment

```powershell
conda activate cv
cd D:\vscode\wed\backend
pip install -r requirements.txt
pip install -r ..\models\pascal_voc_multilabel_vit\requirements.txt
pip install -r ..\models\cub_200_2011\requirements.txt
```

### ML environment

```powershell
conda activate ml
cd D:\vscode\wed\backend
pip install -r ml_app\requirements.txt
```

### Frontend

```powershell
cd D:\vscode\wed\frontend
npm install
```

## Terminal 1 - CV backend

```powershell
conda activate cv
cd D:\vscode\wed\backend
uvicorn app.main:app --reload --port 8001
```

CV API: http://127.0.0.1:8001

API docs: http://127.0.0.1:8001/docs

Models currently served here:

- Pascal VOC Multi-label ViT
- CUB-200-2011 Bird Classification

## Terminal 2 - ML backend

```powershell
conda activate ml
cd D:\vscode\wed\backend
uvicorn ml_app.main:app --reload --port 8002
```

ML API: http://127.0.0.1:8002

API docs: http://127.0.0.1:8002/docs

## Terminal 3 - Frontend

```powershell
cd D:\vscode\wed\frontend
npm run dev
```

Frontend: http://localhost:5173

## Quick checks

CV health:

```powershell
Invoke-RestMethod http://127.0.0.1:8001/api/v1/health
```

CV models:

```powershell
Invoke-RestMethod http://127.0.0.1:8001/api/v1/models
```

Loaded CV models:

```powershell
Invoke-RestMethod http://127.0.0.1:8001/api/v1/models/runtime
```

ML health:

```powershell
Invoke-RestMethod http://127.0.0.1:8002/api/v1/health
```

Loaded ML models:

```powershell
Invoke-RestMethod http://127.0.0.1:8002/api/v1/models/runtime
```

The frontend runtime menu in the topbar lists loaded models from both
backends. Use its `Release` action to remove a model from memory without
deleting its checkpoint or weights.

Stop a running server with `Ctrl+C` in its terminal.
