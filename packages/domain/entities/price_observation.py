"""PriceObservation entity - Core domain entity."""

import uuid
from datetime import date, datetime
from enum import Enum

from sqlalchemy import Date, DateTime, Numeric, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from packages.infrastructure.database.connection import Base


class Availability(str, Enum):
    """Availability status."""

    AVAILABLE = "available"
    UNAVAILABLE = "unavailable"
    LIMITED = "limited"


class DataQuality(str, Enum):
    """Data quality level."""

    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class PriceObservation(Base):
    """PriceObservation - Core entity for price intelligence.

    Each observation represents a price captured from a supplier
    for a specific product on a specific date.
    """

    __tablename__ = "price_observations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
    )
    supplier_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
    )
    country_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
    )
    price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    original_price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
    )
    availability: Mapped[str] = mapped_column(
        String(20),
        default=Availability.AVAILABLE.value,
    )
    url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    observation_date: Mapped[date] = mapped_column(Date, nullable=False)
    data_quality: Mapped[str] = mapped_column(
        String(10),
        default=DataQuality.MEDIUM.value,
    )
    raw_data: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )

    def __repr__(self) -> str:
        return (
            f"<PriceObservation(product_id={self.product_id}, "
            f"supplier_id={self.supplier_id}, price={self.price})>"
        )