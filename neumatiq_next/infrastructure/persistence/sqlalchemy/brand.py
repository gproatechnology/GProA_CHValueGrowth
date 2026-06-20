"""Brand model."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, Boolean, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from neumatiq_next.infrastructure.persistence.sqlalchemy.base import Base

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy.product import Product


class Brand(Base):
    """Brand entity for tire manufacturers."""

    __tablename__ = "brands"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )
    normalized_name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )
    country_of_origin: Mapped[str | None] = mapped_column(String(2))
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

    products: Mapped[list["Product"]] = relationship(back_populates="brand")

    def __repr__(self) -> str:
        return f"<Brand(name={self.name})>"