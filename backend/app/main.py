import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

project_root = Path(__file__).resolve().parents[2]
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from app.api.router import api_router

app = FastAPI(title="AI Hub API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/api/v1/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
