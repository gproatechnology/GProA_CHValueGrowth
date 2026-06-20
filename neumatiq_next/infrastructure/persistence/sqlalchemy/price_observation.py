"""Price Observation model."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, DateTime, JSON, DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from neumatiq_next.infrastructure.persistence.sqlalchemy.base import Base

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy.product import Product
    from neumatiq_next.infrastructure.persistence.sqlalchemy.supplier import Supplier
    from neumatiq_next.infrastructure.persistence.sqlalchemy.country import Country
    from neumatiq_next.infrastructure.persistence.sqlalchemy.currency import Currency
    from neumatiq_next.infrastructure.persistence.sqlalchemy.scraping_source import ScrapingSource


class PriceObservation(Base):
    """Price observation entity for scraping history."""

    __tablename__ = "price_observations"

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
    supplier_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("suppliers.id"),
        nullable=False,
    )
    country_code: Mapped[str] = mapped_column(String(2), nullable=False)
    currency_code: Mapped[str] = mapped_column(String(3), nullable=False)
    price_total: Mapped[float] = mapped_column(DECIMAL(12, 4), nullable=False)
    observed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
    )
    source_url: Mapped[str | None] = mapped_column(String)
    raw_data: Mapped[dict] = mapped_column(JSON, default=dict)
    scraping_run_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )

    if TYPE_CHECKING:
        product: Product
        supplier: Supplier

    def __repr__(self) -> str:
        return f"<PriceObservation(product_id={self.product_id}, price={self.price_total})>"