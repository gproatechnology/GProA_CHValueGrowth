import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

from fastapi.exceptions import HTTPException as FastAPIHTTPException
from starlette.exceptions import HTTPException as StarletteHTTPException

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
    assets_dir = STATIC_DIR / "assets"
    if assets_dir.exists():
        app.mount("/app/assets", StaticFiles(directory=str(assets_dir)), name="frontend_assets")

    @app.get("/app")
    @app.get("/app/")
    @app.get("/app/{full_path:path}")
    async def serve_spa(full_path: str = ""):
        if ".." in full_path:
            return FileResponse(str(STATIC_DIR / "index.html"))
            
        target = STATIC_DIR / full_path
        if target.is_file():
            return FileResponse(str(target))
            
        index_file = STATIC_DIR / "index.html"
        if index_file.is_file():
            return FileResponse(str(index_file))
            
        return HTMLResponse("Frontend not built.", status_code=404)

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
