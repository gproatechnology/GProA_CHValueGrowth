import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

# Sentry error tracking (optional)
sentry_sdk = None
if os.getenv("SENTRY_DSN"):
    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        
        sentry_sdk.init(
            dsn=os.getenv("SENTRY_DSN"),
            integrations=[FastApiIntegration()],
            traces_sample_rate=0.1 if IS_PRODUCTION else 1.0,
            environment=ENVIRONMENT,
            send_default_pii=False,
        )
    except ImportError:
        pass

from services.api.routes.products import router as products_router
from services.api.routes.auth import router as auth_router

# Environment detection
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
IS_PRODUCTION = ENVIRONMENT == "production"

app = FastAPI(title="NeumatiQ API")

# Strict CORS configuration
if IS_PRODUCTION:
    # Production: only specific origins from env var
    cors_origins = os.getenv("CORS_ORIGINS", "https://chvaluegrowth.com,https://www.chvaluegrowth.com").split(",")
    cors_origins = [origin.strip() for origin in cors_origins]
else:
    # Development: allow localhost origins
    cors_origins = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=os.getenv("CORS_METHODS", "GET,POST,PUT,DELETE,OPTIONS").split(",") if IS_PRODUCTION else ["*"],
    allow_headers=os.getenv("CORS_HEADERS", "Content-Type,Authorization").split(",") if IS_PRODUCTION else ["*"],
)

# Trusted hosts middleware (production only)
if IS_PRODUCTION:
    allowed_hosts = os.getenv("ALLOWED_HOSTS", "api.chvaluegrowth.com,chvaluegrowth-api.onrender.com").split(",")
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=allowed_hosts,
    )

# HTTPS enforcement middleware (production only)
@app.middleware("http")
async def enforce_https(request: Request, call_next):
    if IS_PRODUCTION:
        # Check X-Forwarded-Proto header (set by Render's load balancer)
        forwarded_proto = request.headers.get("x-forwarded-proto")
        if forwarded_proto and forwarded_proto != "https":
            https_url = request.url.replace(scheme="https", netloc=request.headers.get("host", request.url.netloc))
            return RedirectResponse(url=str(https_url), status_code=301)
    response = await call_next(request)
    return response

# Legal disclaimer headers middleware
@app.middleware("http")
async def add_disclaimer_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Legal-Disclaimer"] = "Datos con fines informativos. Verifica con proveedores."
    response.headers["X-Data-Source"] = "MercadoLibre y fuentes externas"
    return response

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


@app.get("/assets/{path:path}")
def serve_assets(path: str):
    file_path_full = STATIC_DIR / "assets" / path
    if file_path_full.exists() and file_path_full.is_file():
        return FileResponse(str(file_path_full), media_type="application/javascript")
    return Response(status_code=404)


@app.get("/static/{path:path}")
def serve_static(path: str):
    file_path_full = STATIC_DIR / path
    if file_path_full.exists() and file_path_full.is_file():
        return FileResponse(str(file_path_full))
    return Response(status_code=404)


@app.get("/")
def serve_root():
    index_path = STATIC_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"status": "ok", "project": "NeumatiQ"}


@app.get("/{path:path}")
def serve_frontend(path: str):
    index_path = STATIC_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"status": "ok", "project": "NeumatiQ"}


app.include_router(products_router)
app.include_router(auth_router)