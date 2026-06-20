"""Seed brands data."""
import uuid

from neumatiq_next.infrastructure.persistence.sqlalchemy import Brand

BRANDS_DATA = [
    {"name": "Michelin"},
    {"name": "Pirelli"},
    {"name": "Bridgestone"},
    {"name": "Goodyear"},
    {"name": "Continental"},
    {"name": "Firestone"},
    {"name": "Yokohama"},
    {"name": "Hankook"},
]


async def seed_brands(uow) -> list[Brand]:
    """Seed initial brands if not exist."""
    results = []
    for data in BRANDS_DATA:
        existing = await uow.brands.get_by_name(data["name"])
        if existing:
            continue
        brand = Brand(
            id=uuid.uuid4(),
            name=data["name"],
            normalized_name=data["name"].lower().replace(" ", "_"),
            active=True,
        )
        await uow.brands.add(brand)
        results.append(brand)
    if results:
        await uow.commit()
    return results