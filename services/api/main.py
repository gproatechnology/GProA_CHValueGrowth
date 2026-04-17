import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

from services.api.routes.products import router as products_router
from services.api.routes.auth import router as auth_router
from services.api.routes.orders import router as orders_router

app = FastAPI(title="NeumatiQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
is_render = os.environ.get("RENDER") == "true"
DIST_DIR = Path("/app/frontend/dist") if is_render else BASE_DIR / "frontend" / "dist"


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "api",
        "project": "NeumatiQ",
        "version": "1.0.0",
        "dist_path": str(DIST_DIR),
        "dist_exists": DIST_DIR.exists(),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


@app.get("/assets/{path:path}")
def serve_assets(path: str):
    file_path_full = DIST_DIR / "assets" / path
    if file_path_full.exists() and file_path_full.is_file():
        media_type = "application/javascript" if path.endswith(".js") else "text/css" if path.endswith(".css") else "application/octet-stream"
        return FileResponse(str(file_path_full), media_type=media_type)
    return Response(f"Asset not found: {path} (looking in {file_path_full})", status_code=404)


@app.get("/static/{path:path}")
def serve_static(path: str):
    file_path_full = DIST_DIR / path
    if file_path_full.exists() and file_path_full.is_file():
        media_type = "application/javascript" if path.endswith(".js") else "text/css" if path.endswith(".css") else "image/svg+xml" if path.endswith(".svg") else "application/octet-stream"
        return FileResponse(str(file_path_full), media_type=media_type)
    return Response(status_code=404)


@app.get("/favicon.svg")
def serve_favicon():
    favicon_path = DIST_DIR / "favicon.svg"
    if favicon_path.exists():
        return FileResponse(str(favicon_path), media_type="image/svg+xml")
    return Response(status_code=404)


@app.get("/")
def serve_root():
    index_path = DIST_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"status": "ok", "project": "NeumatiQ"}


@app.get("/{path:path}")
def serve_frontend(path: str):
    index_path = DIST_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"status": "ok", "project": "NeumatiQ"}


app.include_router(products_router)
app.include_router(auth_router)
app.include_router(orders_router)

if DIST_DIR.exists():
    app.mount("/", StaticFiles(directory=str(DIST_DIR), html=True), name="static")