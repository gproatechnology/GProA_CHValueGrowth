"""Product Match model."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, DateTime, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from neumatiq_next.infrastructure.persistence.sqlalchemy.base import Base

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy.product import Product


class ProductMatch(Base):
    """Product match entity for duplicate detection."""

    __tablename__ = "product_matches"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id"),
        nullable=False,
    )
    matched_product_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id"),
    )
    raw_title: Mapped[str] = mapped_column(String, nullable=False)
    fingerprint: Mapped[str] = mapped_column(String(500), nullable=False)
    confidence_score: Mapped[int] = mapped_column(Integer, nullable=False)
    match_type: Mapped[str] = mapped_column(String(50), nullable=False)
    match_status: Mapped[str] = mapped_column(String(50), nullable=False)
    diff_log: Mapped[list] = mapped_column(JSON, default=list)
    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )

    product: Mapped["Product"] = relationship(
        foreign_keys=[product_id],
    )
    matched_product: Mapped["Product"] = relationship(
        "Product",
        foreign_keys=[matched_product_id],
    )

    def __repr__(self) -> str:
        return f"<ProductMatch(product_id={self.product_id}, confidence={self.confidence_score})>"