import asyncio
import inspect
from neumatiq_next.application.unit_of_work import IUnitOfWork
from neumatiq_next.infrastructure.persistence.unit_of_work import SQLAlchemyUnitOfWork
from neumatiq_next.infrastructure.persistence.repositories import (
    SQLAlchemyCountryRepository,
    SQLAlchemyBrandRepository,
    SQLAlchemySupplierRepository,
    SQLAlchemyProductRepository,
    SQLAlchemyPriceObservationRepository,
)

print("=== ASYNC CORRECTNESS ===")
for name, cls in [
    ("SQLAlchemyCountryRepository", SQLAlchemyCountryRepository),
    ("SQLAlchemyBrandRepository", SQLAlchemyBrandRepository),
    ("SQLAlchemySupplierRepository", SQLAlchemySupplierRepository),
    ("SQLAlchemyProductRepository", SQLAlchemyProductRepository),
    ("SQLAlchemyPriceObservationRepository", SQLAlchemyPriceObservationRepository),
]:
    async_methods = ['get', 'list', 'add', 'remove']
    for m in async_methods:
        method = getattr(cls, m, None)
        if method and inspect.iscoroutinefunction(method):
            print(f"  {name}.{m}: async OK")
        else:
            print(f"  {name}.{m}: NOT ASYNC")

print("\n=== UOW ASYNC METHODS ===")
uow_methods = ['__aenter__', '__aexit__', 'commit', 'rollback']
for m in uow_methods:
    method = getattr(SQLAlchemyUnitOfWork, m, None)
    if method and inspect.iscoroutinefunction(method):
        print(f"  SQLAlchemyUnitOfWork.{m}: async OK")
    else:
        print(f"  SQLAlchemyUnitOfWork.{m}: NOT ASYNC")