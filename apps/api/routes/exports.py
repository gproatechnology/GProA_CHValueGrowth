"""Exports API routes."""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

router = APIRouter(tags=["exports"])


@router.get("/exports/excel")
async def export_excel():
    """Export data to Excel."""
    return {"message": "Export not configured"}


@router.get("/exports/templates")
async def list_templates():
    """List export templates."""
    return {"items": []}