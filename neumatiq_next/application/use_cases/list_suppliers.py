"""List suppliers use case."""
from neumatiq_next.application.unit_of_work import IUnitOfWork
from neumatiq_next.application.dto.responses import SupplierResponse


class ListSuppliersUseCase:
    """Use case to list all active suppliers."""
    
    def __init__(self, uow_factory) -> None:
        self._uow_factory = uow_factory
    
    async def execute(self) -> list[SupplierResponse]:
        """List all active suppliers."""
        async with self._uow_factory() as uow:
            suppliers = await uow.suppliers.list(limit=1000)
            
        return [
            SupplierResponse(
                id=s.id,
                name=s.name,
                normalized_name=s.normalized_name,
                country_id=s.country_id,
                website=s.website,
                active=s.active,
            )
            for s in suppliers
            if s.active
        ]