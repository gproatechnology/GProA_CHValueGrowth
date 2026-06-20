"""Session provider module."""
import uuid
from typing import AsyncGenerator

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from neumatiq_next.core.database import async_session_maker
from neumatiq_next.infrastructure.persistence.sqlalchemy import Country


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Yield async database session."""
    async with async_session_maker() as session:
        yield session


async def get_country_by_code(session: AsyncSession, code: str) -> Country | None:
    """Get country by ISO code."""
    result = await session.execute(
        select(Country).where(Country.code == code.upper())
    )
    return result.scalar_one_or_none()