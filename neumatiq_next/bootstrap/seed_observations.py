"""Seed price observations data."""
import random
import uuid
from datetime import datetime, timedelta
from typing import Sequence

from neumatiq_next.infrastructure.persistence.sqlalchemy import PriceObservation


def _estimate_base_price(product) -> float:
    """Estimate a realistic base price based on tire size."""
    try:
        width = int(product.tire_specification.width)
        rim = int(product.tire_specification.rim_diameter)
    except Exception:
        return 1500.0

    if width < 200 and rim <= 15:
        return random.uniform(900, 1800)
    elif width < 200 and rim <= 17:
        return random.uniform(1100, 2200)
    elif 200 <= width <= 250 and rim <= 16:
        return random.uniform(1300, 2500)
    elif 200 <= width <= 250 and rim <= 18:
        return random.uniform(1600, 3200)
    elif width > 250 or rim >= 19:
        return random.uniform(2200, 5000)
    return random.uniform(1400, 2800)


def _build_source_url(supplier, product) -> str:
    """Build a plausible source URL for the observation."""
    try:
        width = product.tire_specification.width
        aspect = product.tire_specification.aspect_ratio
        rim = product.tire_specification.rim_diameter
    except Exception:
        return supplier.website or ""

    if "mercadolibre" in (supplier.website or ""):
        return f"{supplier.website}/search?q={width}%2F{aspect}R{rim}"
    elif "radial" in (supplier.website or ""):
        return f"{supplier.website}/search?q={width}%2F{aspect}R{rim}"
    elif "serna" in (supplier.website or ""):
        return f"{supplier.website}/busquedaAvanzada?width={width}&height={aspect}&rim={rim}"
    elif "futurama" in (supplier.website or ""):
        return f"{supplier.website}/search?q={width}%2F{aspect}R{rim}"
    elif "aguila" in (supplier.website or ""):
        return f"{supplier.website}/tienda/resultados?ancho={width}&serie={aspect}&diametro=R{rim}&per_page=50"
    elif "conti" in (supplier.website or ""):
        return f"{supplier.website}/llantas/medida/auto-camioneta/{width}/{aspect}R{rim}"
    return supplier.website or ""


async def seed_observations(uow, days: int = 30, observations_per_pair: int = 5) -> list[PriceObservation]:
    """Seed price observations for existing products and suppliers."""
    products: Sequence = await uow.products.list(limit=500)
    suppliers: Sequence = await uow.suppliers.list(limit=100)

    if not products or not suppliers:
        return []

    countries = await uow.countries.list(limit=200)
    country_code = "MX"
    if countries:
        for c in countries:
            if c.code == "MX":
                country_code = c.code
                break

    created: list[PriceObservation] = []
    now = datetime.utcnow()

    for product in products:
        for supplier in suppliers:
            if not supplier.active:
                continue

            base_price = _estimate_base_price(product)
            source_url = _build_source_url(supplier, product)

            for i in range(observations_per_pair):
                days_ago = random.randint(0, days)
                hours_ago = random.randint(0, 23)
                minutes_ago = random.randint(0, 59)
                observed_at = now - timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)

                variation = random.uniform(-0.08, 0.08)
                price = round(base_price * (1 + variation), 2)

                observation = PriceObservation(
                    id=uuid.uuid4(),
                    product_id=product.id,
                    supplier_id=supplier.id,
                    country_code=country_code,
                    currency_code="MXN",
                    price_total=price,
                    observed_at=observed_at,
                    source_url=source_url,
                    raw_data={
                        "seed": True,
                        "product_name": product.name,
                        "supplier_name": supplier.name,
                        "base_price_est": round(base_price, 2),
                        "variation": round(variation, 4),
                    },
                )
                await uow.price_observations.add(observation)
                created.append(observation)

    if created:
        await uow.commit()

    return created
