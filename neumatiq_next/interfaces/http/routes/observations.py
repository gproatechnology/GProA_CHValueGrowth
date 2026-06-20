"""Observations routes."""
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends

from neumatiq_next.interfaces.schemas.requests import ObservationsRecordRequest
from neumatiq_next.interfaces.schemas.responses import ObservationResponse
from neumatiq_next.interfaces.http.security import require_auth
from neumatiq_next.application.use_cases.record_price_observation import RecordPriceObservationUseCase
from neumatiq_next.application.dto.requests import RecordPriceObservationRequest
from neumatiq_next.interfaces.http.dependencies import get_uow_factory

router = APIRouter(dependencies=[Depends(require_auth)])


@router.post("", response_model=ObservationResponse)
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
        "id": result.id,
        "status": "created",
    }
