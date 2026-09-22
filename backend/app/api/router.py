from fastapi import APIRouter

from app.api.routes.inference import router as inference_router
from app.api.routes.models import router as models_router

api_router = APIRouter()
api_router.include_router(models_router)
api_router.include_router(inference_router)
