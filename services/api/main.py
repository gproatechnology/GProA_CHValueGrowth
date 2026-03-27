from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from datetime import datetime

from services.api.routes.products import router as products_router

app = FastAPI(title="CHValueGrowth API")

# Configurar templates Jinja2
templates = Jinja2Templates(directory="services/dashboard/templates")

# Montar archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Incluir routers
app.include_router(products_router)


@app.get("/")
def root():
    return {"status": "ok", "project": "CHValueGrowth"}


@app.get("/dashboard")
def dashboard(request: Request):
    """Renderiza el dashboard HTML"""
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "api",
        "project": "CHValueGrowth",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
