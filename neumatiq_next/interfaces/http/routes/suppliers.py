"""Suppliers routes."""
from fastapi import APIRouter, Depends

from neumatiq_next.interfaces.schemas.responses import SupplierResponse
from neumatiq_next.application.use_cases.list_suppliers import ListSuppliersUseCase
from neumatiq_next.interfaces.http.dependencies import get_uow_factory

router = APIRouter()


@router.get("/", response_model=list[SupplierResponse])
async def list_suppliers(uow_factory=Depends(get_uow_factory)):
    """List all active suppliers."""
    use_case = ListSuppliersUseCase(uow_factory)
    suppliers = await use_case.execute()

    result = []
    for s in suppliers:
        country_code = ""
        async with uow_factory() as uow:
            country = await uow.countries.get(s.country_id)
            if country:
                country_code = country.code

        result.append({
            "id": s.id,
            "name": s.name,
            "country_code": country_code,
        })

    return result
