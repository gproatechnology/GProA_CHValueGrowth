"""Product model."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from neumatiq_next.infrastructure.persistence.sqlalchemy.base import Base

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy.brand import Brand
    from neumatiq_next.infrastructure.persistence.sqlalchemy.tire_specification import TireSpecification


class Product(Base):
    """Product entity for canonical tire catalog."""

    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    fingerprint: Mapped[str] = mapped_column(
        String(500),
        unique=True,
        nullable=False,
    )
    sku: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(500), nullable=False)
    normalized_name: Mapped[str] = mapped_column(String(500), nullable=False)
    brand_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("brands.id"),
        nullable=False,
    )
    tire_specification_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tire_specifications.id"),
        nullable=False,
    )
    specifications: Mapped[dict] = mapped_column(JSON, default=dict)
    product_type: Mapped[str] = mapped_column(String(50), default="tire")
    status: Mapped[str] = mapped_column(String(50), default="draft")
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

    brand: Mapped["Brand"] = relationship(back_populates="products")
    tire_specification: Mapped["TireSpecification"] = relationship(back_populates="products")

    def __repr__(self) -> str:
        return f"<Product(name={self.name}, sku={self.sku})>"