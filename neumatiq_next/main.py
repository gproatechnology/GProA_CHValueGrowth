from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from neumatiq_next.core.config import settings
from neumatiq_next.core.logging import get_logger, configure_logging
from neumatiq_next.core.middleware import CorrelationIdMiddleware
from neumatiq_next.interfaces.http.routes import health_router, version_router
from neumatiq_next.interfaces.http.routes.health import database_router
from neumatiq_next.interfaces.http.routes.suppliers import router as suppliers_router
from neumatiq_next.interfaces.http.routes.products import router as products_router
from neumatiq_next.interfaces.http.routes.observations import router as observations_router
from neumatiq_next.interfaces.http.routes.metrics import router as metrics_router


configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("starting_application", app_name=settings.app_name, environment=settings.environment)
    yield
    logger.info("shutting_down_application")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(CorrelationIdMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/health", tags=["health"])
app.include_router(database_router, prefix="/health", tags=["health"])
app.include_router(version_router, prefix="/version", tags=["version"])
app.include_router(suppliers_router, prefix="/suppliers", tags=["suppliers"])
app.include_router(products_router, prefix="/products", tags=["products"])
app.include_router(observations_router, prefix="/observations", tags=["observations"])
app.include_router(metrics_router, prefix="", tags=["metrics"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)