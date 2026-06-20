"""HTTP routes package."""
from neumatiq_next.interfaces.http.routes.health import router as health_router
from neumatiq_next.interfaces.http.routes.version import router as version_router

__all__ = ["health_router", "version_router"]