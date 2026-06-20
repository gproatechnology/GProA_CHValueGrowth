"""Correlation ID middleware for request tracing."""
import uuid
from contextlib import contextmanager
from typing import Any, Generator

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from neumatiq_next.core.logging import get_logger

logger = get_logger(__name__)

# Thread-local storage for correlation ID
_correlation_id: str = ""


@contextmanager
def get_correlation_id() -> Generator[str, None, None]:
    """Get current correlation ID for logging."""
    yield _correlation_id


def set_correlation_id(cid: str) -> None:
    """Set correlation ID."""
    global _correlation_id
    _correlation_id = cid


class CorrelationIdMiddleware(BaseHTTPMiddleware):
    """Middleware to add correlation ID to each request."""

    async def dispatch(self, request: Request, call_next: Any) -> Response:
        """Handle request with correlation ID."""
        # Get or create correlation ID
        cid = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        set_correlation_id(cid)
        
        # Add to response headers
        response = await call_next(request)
        response.headers["X-Correlation-ID"] = cid
        
        # Log request completion
        logger.info(
            "request_completed",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            correlation_id=cid,
        )
        
        return response