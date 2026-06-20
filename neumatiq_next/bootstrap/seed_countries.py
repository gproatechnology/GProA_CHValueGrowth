"""Seed countries data."""
from neumatiq_next.infrastructure.persistence.sqlalchemy import Country

COUNTRIES_DATA = [
    {"code": "MX", "name": "México", "locale": "es-MX"},
    {"code": "AR", "name": "Argentina", "locale": "es-AR"},
    {"code": "CL", "name": "Chile", "locale": "es-CL"},
    {"code": "CO", "name": "Colombia", "locale": "es-CO"},
    {"code": "PE", "name": "Perú", "locale": "es-PE"},
    {"code": "BR", "name": "Brasil", "locale": "pt-BR"},
]


async def seed_countries(uow) -> list[Country]:
    """Seed initial countries if not exist."""
    results = []
    for data in COUNTRIES_DATA:
        existing = await uow.countries.get_by_code(data["code"])
        if existing:
            continue
        country = Country(
            code=data["code"],
            name=data["name"],
            locale=data["locale"],
            active=True,
        )
        await uow.countries.add(country)
        results.append(country)
    if results:
        await uow.commit()
    return results