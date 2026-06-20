"""FastAPI main application."""

from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apps.api.config import settings
from apps.api.routes import products, suppliers, observations, analytics, exports


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Price Intelligence & Competitive Monitoring for Tire Industry",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(products.router, prefix="/api/v1")
app.include_router(suppliers.router, prefix="/api/v1")
app.include_router(observations.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(exports.router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "status": "ok",
        "project": settings.app_name,
        "version": settings.app_version,
    }