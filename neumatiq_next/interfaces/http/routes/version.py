from fastapi import APIRouter
from pydantic import BaseModel
from neumatiq_next.core.config import settings


router = APIRouter()


class VersionResponse(BaseModel):
    name: str
    version: str
    api_version: str = "v1"


@router.get("/", response_model=VersionResponse)
async def get_version():
    return VersionResponse(
        name=settings.app_name,
        version=settings.app_version,
    )