"""Currency model."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Boolean, DateTime, SmallInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from neumatiq_next.infrastructure.persistence.sqlalchemy.base import Base

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy.country import Country


class Currency(Base):
    """Currency entity for regional pricing."""

    __tablename__ = "currencies"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    country_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("countries.id"),
        nullable=False,
    )
    code: Mapped[str] = mapped_column(
        String(3),
        unique=True,
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    symbol: Mapped[str | None] = mapped_column(String(10))
    decimals: Mapped[int] = mapped_column(SmallInteger, default=2)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )

    country: Mapped["Country"] = relationship(back_populates="currencies")

    def __repr__(self) -> str:
        return f"<Currency(code={self.code}, name={self.name})>"