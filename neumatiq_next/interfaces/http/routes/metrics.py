"""Metrics endpoint for Prometheus."""
from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

from neumatiq_next.core.metrics import MetricsService

router = APIRouter()


@router.get("/metrics", response_class=PlainTextResponse)
async def metrics():
    """Expose metrics in Prometheus format."""
    all_metrics = MetricsService.get_all()
    
    lines = ["# HELP neumatiq Application metrics"]
    lines.append("# TYPE neumatiq counter")
    
    for name, value in all_metrics.items():
        lines.append(f'neumatiq_{name} {value}')
    
    return "\n".join(lines)