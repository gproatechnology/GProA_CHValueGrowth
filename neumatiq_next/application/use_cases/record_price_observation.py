"""Record price observation use case."""
import uuid
from datetime import datetime, timezone

from neumatiq_next.application.unit_of_work import IUnitOfWork
from neumatiq_next.application.dto.requests import RecordPriceObservationRequest
from neumatiq_next.application.dto.responses import PriceObservationResponse
from neumatiq_next.infrastructure.persistence.sqlalchemy import PriceObservation


class RecordPriceObservationUseCase:
    """Use case to record a price observation."""
    
    def __init__(self, uow_factory) -> None:
        self._uow_factory = uow_factory
    
    async def execute(self, request: RecordPriceObservationRequest) -> PriceObservationResponse:
        """Record a price observation after validating existence."""
        async with self._uow_factory() as uow:
            product = await uow.products.get(request.product_id)
            if not product:
                raise ValueError(f"Product {request.product_id} not found")
            
            supplier = await uow.suppliers.get(request.supplier_id)
            if not supplier:
                raise ValueError(f"Supplier {request.supplier_id} not found")
            
            country = await uow.countries.get(supplier.country_id)
            
            observation = PriceObservation(
                id=uuid.uuid4(),
                product_id=request.product_id,
                supplier_id=request.supplier_id,
                country_code=country.code if country else "MX",
                currency_code=request.currency_code,
                price_total=request.price_total,
                observed_at=datetime.fromisoformat(request.observed_at).replace(tzinfo=timezone.utc) if request.observed_at else datetime.now(timezone.utc),
                source_url=request.source_url,
            )
            
            await uow.price_observations.add(observation)
            await uow.commit()
            
            return PriceObservationResponse(
                id=observation.id,
                product_id=observation.product_id,
                supplier_id=observation.supplier_id,
                country_code=observation.country_code,
                currency_code=observation.currency_code,
                price_total=float(observation.price_total),
                observed_at=observation.observed_at.isoformat() if observation.observed_at else "",
                source_url=observation.source_url,
            )