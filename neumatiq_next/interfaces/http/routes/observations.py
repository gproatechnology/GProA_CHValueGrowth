"""Observations routes."""
print("DEBUG: observations.py module loading")
import uuid
from datetime import datetime, timezone
from typing import Sequence

from fastapi import APIRouter, Depends, Query

from neumatiq_next.interfaces.schemas.requests import ObservationsRecordRequest
from neumatiq_next.interfaces.schemas.responses import ObservationResponse
from neumatiq_next.interfaces.http.security import require_auth
from neumatiq_next.application.use_cases.record_price_observation import RecordPriceObservationUseCase
from neumatiq_next.application.dto.requests import RecordPriceObservationRequest
from neumatiq_next.interfaces.http.dependencies import get_uow_factory

router = APIRouter()


@router.get("", response_model=list[ObservationResponse])
async def list_observations(
    product_id: uuid.UUID | None = None,
    supplier_id: uuid.UUID | None = None,
    limit: int = Query(100, le=500),
    offset: int = Query(0, ge=0),
    uow_factory=Depends(get_uow_factory)
):
    """List price observations with optional filters."""
    print("DEBUG: list_observations called")
    async with uow_factory() as uow:
        if product_id and supplier_id:
            items = await uow.price_observations.get_by_product_and_supplier(
                product_id=product_id,
                supplier_id=supplier_id,
                limit=limit,
            )
        elif product_id:
            items = await uow.price_observations.get_recent_by_product(
                product_id=product_id,
                limit=limit,
            )
        elif supplier_id:
            items = await uow.price_observations.get_by_supplier(
                supplier_id=supplier_id,
                limit=limit,
            )
        else:
            items = await uow.price_observations.list(limit=limit, offset=offset)

        result = []
        for obs in items:
            product = await uow.products.get(obs.product_id)
            supplier = await uow.suppliers.get(obs.supplier_id)
            result.append({
                "id": str(obs.id),
                "product_id": str(obs.product_id),
                "supplier_id": str(obs.supplier_id),
                "country_code": obs.country_code,
                "currency_code": obs.currency_code,
                "price_total": float(obs.price_total),
                "observed_at": obs.observed_at.isoformat() if obs.observed_at else None,
                "source_url": obs.source_url,
                "raw_data": obs.raw_data,
                "product_name": product.name if product else None,
                "supplier_name": supplier.name if supplier else None,
            })
        return result


@router.post("", response_model=dict)
async def record_observation(
    request: ObservationsRecordRequest,
    uow_factory=Depends(get_uow_factory)
):
    """Record a price observation."""
    uc_request = RecordPriceObservationRequest(
        supplier_id=request.supplier_id,
        product_id=request.product_id,
        price_total=request.price_total,
        currency_code=request.currency_code,
        source_url=request.source_url,
        observed_at=datetime.now(timezone.utc).isoformat(),
    )
    use_case = RecordPriceObservationUseCase(uow_factory)
    result = await use_case.execute(uc_request)

    return {
        "id": str(result.id),
        "status": "created",
    }
