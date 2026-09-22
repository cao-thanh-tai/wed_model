# AI Hub ML Backend

This backend runs ML models independently from the CV backend.

## Run

```powershell
conda activate ml
cd D:\vscode\wed\backend
pip install -r ml_app\requirements.txt
uvicorn ml_app.main:app --reload --port 8002
```

## API

```text
GET  /api/v1/health
GET  /api/v1/models
POST /api/v1/inference/titanic-xgboost
```

Inference body:

```json
{
  "features": {
    "Pclass": 1,
    "Sex": "female",
    "Age": 30,
    "SibSp": 0,
    "Parch": 0
  }
}
```
