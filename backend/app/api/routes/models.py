from fastapi import APIRouter

from app.schemas.model import ModelMetadata
from app.services.model_registry import model_registry

router = APIRouter(prefix="/models", tags=["models"])


@router.get("", response_model=list[ModelMetadata])
def list_models() -> list[ModelMetadata]:
    return model_registry.list_metadata()
