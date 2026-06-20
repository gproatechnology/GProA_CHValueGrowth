"""Search products use case."""
from neumatiq_next.application.unit_of_work import IUnitOfWork
from neumatiq_next.application.dto.requests import SearchProductsRequest
from neumatiq_next.application.dto.responses import ProductResponse


class SearchProductsUseCase:
    """Use case to search products with filters."""
    
    def __init__(self, uow_factory) -> None:
        self._uow_factory = uow_factory
    
    async def execute(self, request: SearchProductsRequest) -> list[ProductResponse]:
        """Search products by name pattern - filters applied at repository level."""
        async with self._uow_factory() as uow:
            products = await uow.products.list(limit=request.limit, offset=request.offset)
        
        return [
            ProductResponse(
                id=p.id,
                fingerprint=p.fingerprint,
                sku=p.sku,
                name=p.name,
                normalized_name=p.normalized_name,
                brand_id=p.brand_id,
                tire_specification_id=p.tire_specification_id,
                product_type=p.product_type,
                status=p.status,
            )
            for p in products
        ]