"""Products routes."""
import uuid
from fastapi import APIRouter, Depends

from neumatiq_next.interfaces.schemas.requests import ProductsSearchRequest, ProductsGetOrCreateRequest
from neumatiq_next.interfaces.schemas.responses import (
    ProductResponse,
    ProductCreatedResponse,
)
from neumatiq_next.interfaces.http.security import require_auth
from neumatiq_next.application.use_cases.search_products import SearchProductsUseCase
from neumatiq_next.application.use_cases.get_or_create_product import GetOrCreateProductUseCase
from neumatiq_next.application.dto.requests import SearchProductsRequest as SearchProductsRequestUC, GetOrCreateProductRequest
from neumatiq_next.interfaces.http.dependencies import get_uow_factory

router = APIRouter()


@router.get("/", response_model=list[ProductResponse])
async def search_products(
    brand: str | None = None,
    width: int | None = None,
    aspect_ratio: int | None = None,
    rim_diameter: int | None = None,
    page: int = 1,
    page_size: int = 50,
    uow_factory=Depends(get_uow_factory)
):
    """Search products with optional filters."""
    request = SearchProductsRequestUC(
        brand=brand,
        width=width,
        aspect_ratio=aspect_ratio,
        rim_diameter=rim_diameter,
        limit=page_size,
        offset=(page - 1) * page_size,
    )
    use_case = SearchProductsUseCase(uow_factory)
    products = await use_case.execute(request)

    result = []
    for p in products:
        brand_name = None
        width_val = None
        aspect_ratio_val = None
        rim_diameter_val = None

        async with uow_factory() as uow:
            if p.brand_id:
                brand = await uow.brands.get(p.brand_id)
                if brand:
                    brand_name = brand.name

            if p.tire_specification_id:
                spec = await uow.tire_specifications.get(p.tire_specification_id)
                if spec:
                    width_val = spec.width
                    aspect_ratio_val = spec.aspect_ratio
                    rim_diameter_val = spec.rim_diameter

        result.append({
            "id": p.id,
            "fingerprint": p.fingerprint,
            "sku": p.sku,
            "name": p.name,
            "normalized_name": p.normalized_name,
            "brand": brand_name,
            "width": width_val,
            "aspect_ratio": aspect_ratio_val,
            "rim_diameter": rim_diameter_val,
            "status": p.status,
        })

    return result


@router.post("/get-or-create", response_model=ProductCreatedResponse, dependencies=[Depends(require_auth)])
async def get_or_create_product(
    request: ProductsGetOrCreateRequest,
    uow_factory=Depends(get_uow_factory)
):
    """Get existing product or create new one."""
    uc_request = GetOrCreateProductRequest(
        brand_name=request.brand,
        tire_width=request.width,
        tire_aspect_ratio=request.aspect_ratio,
        tire_rim_diameter=request.rim_diameter,
        normalized_name=request.normalized_name,
        sku=None,
    )
    use_case = GetOrCreateProductUseCase(uow_factory)
    result = await use_case.execute(uc_request)

    return ProductCreatedResponse(
        id=result.id,
        created=True,
    )
