"""Currency repository for bootstrap."""
import uuid
from typing import TYPE_CHECKING, Sequence

from sqlalchemy import select

if TYPE_CHECKING:
    from neumatiq_next.infrastructure.persistence.sqlalchemy import Currency


class ICurrencyRepository:
    """Currency repository interface for bootstrap."""
    
    async def get_by_code(self, code: str) -> "Currency | None":
        """Get currency by code."""
        ...


# Simple inline repository for bootstrap
class CurrencySeedRepository:
    """Temporary currency repository for seeding."""
    
    def __init__(self, session):
        self._session = session


async def seed_currencies(uow) -> list:
    """Seed initial currencies."""
    import uuid as uuid_module
    from neumatiq_next.infrastructure.persistence.sqlalchemy import Currency
    
    CURRENCIES_DATA = [
        {"country_code": "MX", "code": "MXN", "name": "Peso Mexicano"},
        {"country_code": "AR", "code": "ARS", "name": "Peso Argentino"},
        {"country_code": "CL", "code": "CLP", "name": "Peso Chileno"},
        {"country_code": "CO", "code": "COP", "name": "Peso Colombiano"},
        {"country_code": "PE", "code": "PEN", "name": "Sol Peruano"},
        {"country_code": "BR", "code": "BRL", "name": "Real Brasileño"},
    ]
    
    results = []
    for data in CURRENCIES_DATA:
        country = await uow.countries.get_by_code(data["country_code"])
        if not country:
            continue
        
        existing = await uow._session.execute(
            select(Currency).where(Currency.code == data["code"])
        )
        if existing.scalar_one_or_none():
            continue
        
        currency = Currency(
            id=uuid_module.uuid4(),
            country_id=country.id,
            code=data["code"],
            name=data["name"],
            active=True,
        )
        uow._session.add(currency)
        results.append(currency)
    
    if results:
        await uow.commit()
    return results