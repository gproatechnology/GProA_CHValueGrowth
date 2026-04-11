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
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

if STATIC_DIR.exists():
    app.mount("/app", StaticFiles(directory=str(STATIC_DIR), html=True), name="frontend_app")

app.include_router(products_router)
app.include_router(auth_router)


@app.get("/")
def root():
    from fastapi.responses import RedirectResponse
    if (STATIC_DIR / "index.html").exists():
        return RedirectResponse(url="/app/")
    return {"status": "ok", "project": "NeumatiQ"}


@app.get("/dashboard")
def dashboard(request: Request):
    dashboard_path = BASE_DIR / "services" / "dashboard" / "templates" / "index.html"
    return FileResponse(str(dashboard_path))


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "api",
        "project": "NeumatiQ",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
