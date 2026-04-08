import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from services.api.routes.products import router as products_router
from services.api.routes.auth import router as auth_router

app = FastAPI(title="CHValueGrowth API")

# Configurar CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # URLs del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Obtener la ruta absoluta al directorio del proyecto
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Montar archivos estáticos
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
# Incluir routers

app.include_router(products_router)

app.include_router(auth_router)


@app.get("/")
def root():
    return {"status": "ok", "project": "CHValueGrowth"}


@app.get("/dashboard")
def dashboard(request: Request):
    """Renderiza el dashboard HTML"""
    dashboard_path = BASE_DIR / "services" / "dashboard" / "templates" / "index.html"
    return FileResponse(str(dashboard_path))


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "api",
        "project": "CHValueGrowth",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
