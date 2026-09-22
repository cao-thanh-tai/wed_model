import sys
from pathlib import Path

project_root = Path(__file__).resolve().parents[2]
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from ml_app.model_registry import get_model, get_model_metadata
from ml_app.schemas import ModelMetadata, PredictionRequest, PredictionResponse

app = FastAPI(title="AI Hub ML API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/api/v1/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "task": "ml"}


@app.get("/api/v1/models", response_model=list[ModelMetadata])
def list_models() -> list[dict[str, object]]:
    return get_model_metadata()


@app.post("/api/v1/inference/{model_id}", response_model=PredictionResponse)
def run_inference(model_id: str, request: PredictionRequest) -> PredictionResponse:
    try:
        result = get_model(model_id).predict(request.features)
    except KeyError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found") from error
    except (FileNotFoundError, ValueError) as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error

    return PredictionResponse(model_id=model_id, result=result)
