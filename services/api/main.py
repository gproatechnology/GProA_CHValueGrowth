import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

from services.api.routes.products import router as products_router
from services.api.routes.auth import router as auth_router

app = FastAPI(title="NeumatiQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
STATIC_DIR = BASE_DIR / "static"


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "api",
        "project": "NeumatiQ",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


@app.get("/assets/{file_path:path}")
def serve_assets(file_path: str):
    file_path_full = STATIC_DIR / "assets" / file_path
    if file_path_full.exists() and file_path_full.is_file():
        return FileResponse(str(file_path_full))
    return Response(status_code=404)


@app.get("/static/{file_path:path}")
def serve_static(file_path: str):
    file_path_full = STATIC_DIR / file_path
    if file_path_full.exists() and file_path_full.is_file():
        return FileResponse(str(file_path_full))
    return Response(status_code=404)


@app.get("/{path:path}")
def serve_frontend(path: str):
    index_path = STATIC_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"status": "ok", "project": "NeumatiQ"}


@app.get("/")
def serve_root():
    index_path = STATIC_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"status": "ok", "project": "NeumatiQ"}


app.include_router(products_router)
app.include_router(auth_router)