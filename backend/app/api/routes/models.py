from fastapi import APIRouter, HTTPException, status

from app.schemas.model import ModelMetadata
from app.services.model_registry import model_registry
from app.services.inference_service import inference_service

router = APIRouter(prefix="/models", tags=["models"])


@router.get("", response_model=list[ModelMetadata])
def list_models() -> list[ModelMetadata]:
    return model_registry.list_metadata()


@router.get("/runtime")
def list_loaded_models() -> list[dict[str, object]]:
    return inference_service.list_loaded_models()


@router.delete("/{model_id}/runtime")
def unload_model(model_id: str) -> dict[str, object]:
    if not model_registry.has_model(model_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found")

    return {"model_id": model_id, "unloaded": inference_service.unload_model(model_id)}
