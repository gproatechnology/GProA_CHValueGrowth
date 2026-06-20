"""Seed countries use case."""
import uuid

from neumatiq_next.application.unit_of_work import IUnitOfWork
from neumatiq_next.application.dto.requests import SeedCountriesRequest
from neumatiq_next.application.dto.responses import CountryResponse
from neumatiq_next.infrastructure.persistence.sqlalchemy import Country


class SeedCountriesUseCase:
    """Use case to seed initial country data."""
    
    def __init__(self, uow_factory) -> None:
        self._uow_factory = uow_factory
    
    async def execute(self, request: SeedCountriesRequest) -> list[CountryResponse]:
        """Seed countries avoiding duplicates."""
        results: list[CountryResponse] = []
        
        async with self._uow_factory() as uow:
            for country_data in request.countries:
                code = str(country_data.get("code", "")).upper()
                
                existing = await uow.countries.get_by_code(code)
                if existing:
                    continue
                
                country = Country(
                    id=uuid.uuid4(),
                    code=code,
                    name=str(country_data.get("name", "")),
                    locale=str(country_data.get("locale", "es-MX")),
                    active=bool(country_data.get("active", True)),
                )
                await uow.countries.add(country)
                await uow.commit()
                
                results.append(CountryResponse(
                    id=country.id,
                    code=country.code,
                    name=country.name,
                    locale=country.locale,
                    active=country.active,
                ))
        
        return results