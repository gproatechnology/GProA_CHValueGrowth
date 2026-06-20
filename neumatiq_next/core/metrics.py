"""Metrics service for observability."""
import threading
from typing import Any
from collections import defaultdict

from neumatiq_next.core.logging import get_logger

logger = get_logger(__name__)

# Thread-safe metrics storage
_metrics_lock = threading.Lock()
_metrics: dict[str, int] = defaultdict(int)


class MetricsService:
    """Service to track application metrics."""
    
    @staticmethod
    def increment(name: str, value: int = 1) -> None:
        """Increment a metric."""
        with _metrics_lock:
            _metrics[name] += value
        logger.debug(f"metric_{name}", value=value)
    
    @staticmethod
    def get(name: str) -> int:
        """Get metric value."""
        with _metrics_lock:
            return _metrics.get(name, 0)
    
    @staticmethod
    def get_all() -> dict[str, int]:
        """Get all metrics."""
        with _metrics_lock:
            return dict(_metrics)
    
    @staticmethod
    def reset() -> None:
        """Reset all metrics."""
        with _metrics_lock:
            _metrics.clear()


# Convenience functions
def products_created() -> None:
    MetricsService.increment("products_created")


def products_reused() -> None:
    MetricsService.increment("products_reused")


def observations_created() -> None:
    MetricsService.increment("observations_created")


def scraping_errors() -> None:
    MetricsService.increment("scraping_errors")


def matching_hits() -> None:
    MetricsService.increment("matching_hits")


def matching_misses() -> None:
    MetricsService.increment("matching_misses")