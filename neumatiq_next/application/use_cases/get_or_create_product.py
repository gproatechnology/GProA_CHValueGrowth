"""Get or create product use case."""
import uuid

from neumatiq_next.application.unit_of_work import IUnitOfWork
from neumatiq_next.application.dto.requests import GetOrCreateProductRequest
from neumatiq_next.application.dto.responses import ProductResponse
from neumatiq_next.infrastructure.persistence.sqlalchemy import (
    Product,
    Brand,
    TireSpecification,
)


class GetOrCreateProductUseCase:
    """Use case to get existing product or create new one."""
    
    def __init__(self, uow_factory) -> None:
        self._uow_factory = uow_factory
    
    async def execute(self, request: GetOrCreateProductRequest) -> ProductResponse:
        """Get existing product by fingerprint or create new one."""
        fingerprint = f"{request.brand_name}|{request.tire_width}|{request.tire_aspect_ratio}|{request.tire_rim_diameter}"
        async with self._uow_factory() as uow:
            products = await uow.products.get_by_fingerprint(fingerprint)
            if products:
                return self._to_response(products)
            
            # Create brand if needed
            brand = await uow.brands.create_from_name(request.brand_name)
            
            # Create tire specification (get or create)
            tire_spec = await uow.tire_specifications.get_or_create(
                width=request.tire_width,
                aspect_ratio=request.tire_aspect_ratio,
                rim_diameter=request.tire_rim_diameter,
            )
            
            # Create product
            product = Product(
                id=uuid.uuid4(),
                fingerprint=fingerprint,
                sku=request.sku or f"AUTO-{uuid.uuid4().hex[:8]}",
                name=f"{request.brand_name} {request.tire_width}/{request.tire_aspect_ratio} R{request.tire_rim_diameter}",
                normalized_name=request.normalized_name,
                brand_id=brand.id,
                tire_specification_id=tire_spec.id,
                product_type="tire",
                status="active",
            )
            await uow.products.add(product)
            await uow.commit()
            
            return self._to_response(product)
    
    def _to_response(self, product: Product) -> ProductResponse:
        """Convert product model to response DTO."""
        return ProductResponse(
            id=product.id,
            fingerprint=product.fingerprint,
            sku=product.sku,
            name=product.name,
            normalized_name=product.normalized_name,
            brand_id=product.brand_id,
            tire_specification_id=product.tire_specification_id,
            product_type=product.product_type,
            status=product.status,
        )