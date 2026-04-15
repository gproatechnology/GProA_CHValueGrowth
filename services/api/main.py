import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
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

@app.get("/")
@app.get("/{path:path}")
async def serveSPA(path: str = None):
    if not path or path.startswith("assets/") or path.startswith("static/"):
        return None
    index_path = STATIC_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return HTMLResponse("<h1>NeumatiQ - Loading...</h1>")

app.mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets"), html=True), name="assets")
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

app.include_router(products_router)
app.include_router(auth_router)


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "api",
        "project": "NeumatiQ",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
