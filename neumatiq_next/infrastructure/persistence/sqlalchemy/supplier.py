"""Supplier model."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Boolean, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from neumatiq_next.infrastructure.persistence.sqlalchemy.base import Base

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy.country import Country


class Supplier(Base):
    """Supplier entity for tire vendors."""

    __tablename__ = "suppliers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    name: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=False,
    )
    normalized_name: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=False,
    )
    country_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("countries.id"),
        nullable=False,
    )
    website: Mapped[str | None] = mapped_column(String(500))
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    extra_data: Mapped[dict] = mapped_column("metadata", JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    country: Mapped["Country"] = relationship(back_populates="suppliers")

    def __repr__(self) -> str:
        return f"<Supplier(name={self.name})>"