"""Seed suppliers data."""
import uuid

from neumatiq_next.infrastructure.persistence.sqlalchemy import Supplier

SUPPLIERS_DATA = [
    {"country_code": "MX", "name": "MercadoLibre MX", "website": "https://www.mercadolibre.com.mx"},
    {"country_code": "AR", "name": "MercadoLibre AR", "website": "https://www.mercadolibre.com.ar"},
    {"country_code": "CL", "name": "MercadoLibre CL", "website": "https://www.mercadolibre.com.cl"},
    {"country_code": "CO", "name": "MercadoLibre CO", "website": "https://www.mercadolibre.com.co"},
]


async def seed_suppliers(uow) -> list[Supplier]:
    """Seed initial suppliers if not exist."""
    results = []
    for data in SUPPLIERS_DATA:
        country = await uow.countries.get_by_code(data["country_code"])
        if not country:
            continue
        existing = await uow.suppliers.get_by_name(data["name"])
        if existing:
            continue
        supplier = Supplier(
            id=uuid.uuid4(),
            name=data["name"],
            normalized_name=data["name"].lower().replace(" ", "_"),
            country_id=country.id,
            website=data["website"],
            active=True,
        )
        await uow.suppliers.add(supplier)
        results.append(supplier)
    if results:
        await uow.commit()
    return results