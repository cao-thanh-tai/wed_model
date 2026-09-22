from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.schemas.inference import InferenceResponse
from app.services.inference_service import inference_service
from app.services.model_registry import model_registry

router = APIRouter(prefix="/inference", tags=["inference"])


@router.post("/{model_id}", response_model=InferenceResponse)
async def run_inference(model_id: str, file: UploadFile = File(...)) -> InferenceResponse:
    if not model_registry.has_model(model_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found")

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Only image files are supported")

    try:
        predictions = inference_service.predict_image(model_id, await file.read())
    except Exception as error:
        if isinstance(error, (OSError, ValueError)):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid image file") from error
        raise

    return InferenceResponse(model_id=model_id, predictions=predictions)
