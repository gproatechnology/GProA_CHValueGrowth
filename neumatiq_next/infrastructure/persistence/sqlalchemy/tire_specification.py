"""Tire Specification model."""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, DateTime, SmallInteger, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from neumatiq_next.infrastructure.persistence.sqlalchemy.base import Base

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy.product import Product


class TireSpecification(Base):
    """Tire specification entity for technical specs."""
    
    __tablename__ = "tire_specifications"
    
    __table_args__ = (
        CheckConstraint("width > 0"),
        CheckConstraint("aspect_ratio > 0"),
        CheckConstraint("rim_diameter > 0"),
        CheckConstraint("load_index IS NULL OR load_index > 0"),
    )
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    fingerprint: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )
    width: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    aspect_ratio: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    rim_diameter: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    load_index: Mapped[int | None] = mapped_column(SmallInteger)
    speed_index: Mapped[str | None] = mapped_column(String(10))
    construction: Mapped[str] = mapped_column(String(1), default="R")
    run_flat: Mapped[bool] = mapped_column(default=False)
    season: Mapped[str | None] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )
    
    products: Mapped[list["Product"]] = relationship(back_populates="tire_specification")
    
    def __repr__(self) -> str:
        return f"<TireSpecification({self.width}/{self.aspect_ratio}R{self.rim_diameter})>"