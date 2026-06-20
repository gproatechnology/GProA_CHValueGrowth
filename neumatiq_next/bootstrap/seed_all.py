"""Main bootstrap script - seed all reference data."""
import asyncio

from neumatiq_next.infrastructure.persistence.unit_of_work import SQLAlchemyUnitOfWork
from neumatiq_next.bootstrap.seed_countries import seed_countries
from neumatiq_next.bootstrap.seed_currencies import seed_currencies
from neumatiq_next.bootstrap.seed_brands import seed_brands
from neumatiq_next.bootstrap.seed_suppliers import seed_suppliers


async def seed_all() -> None:
    """Seed all reference data in order."""
    async with SQLAlchemyUnitOfWork() as uow:
        # Countries first
        print("Seeding countries...")
        countries = await seed_countries(uow)
        print(f"  Created {len(countries)} countries")
        
        # Currencies (depend on countries)
        print("Seeding currencies...")
        currencies = await seed_currencies(uow)
        print(f"  Created {len(currencies)} currencies")
        
        # Brands
        print("Seeding brands...")
        brands = await seed_brands(uow)
        print(f"  Created {len(brands)} brands")
        
        # Suppliers (depend on countries)
        print("Seeding suppliers...")
        suppliers = await seed_suppliers(uow)
        print(f"  Created {len(suppliers)} suppliers")
        
        print("Seed complete!")


if __name__ == "__main__":
    asyncio.run(seed_all())