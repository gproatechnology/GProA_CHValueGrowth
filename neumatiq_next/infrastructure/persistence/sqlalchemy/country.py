"""Country model."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from neumatiq_next.infrastructure.persistence.sqlalchemy.base import Base

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy.currency import Currency
    from neumatiq_next.infrastructure.persistence.sqlalchemy.supplier import Supplier


class Country(Base):
    """Country entity for regional support."""

    __tablename__ = "countries"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    code: Mapped[str] = mapped_column(
        String(2),
        unique=True,
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    locale: Mapped[str] = mapped_column(String(10), default="es-MX")
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )

    currencies: Mapped[list["Currency"]] = relationship(back_populates="country")
    suppliers: Mapped[list["Supplier"]] = relationship(back_populates="country")

    def __repr__(self) -> str:
        return f"<Country(code={self.code}, name={self.name})>"