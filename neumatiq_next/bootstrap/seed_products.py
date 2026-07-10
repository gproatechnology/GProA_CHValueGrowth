"""Seed products data."""
import uuid

from neumatiq_next.infrastructure.persistence.sqlalchemy import TireSpecification, Product


PRODUCTS_DATA = [
    {
        "brand": "Michelin",
        "width": 205,
        "aspect_ratio": 55,
        "rim_diameter": 16,
        "name": "Michelin Primacy 4 205/55 R16",
        "sku": "MIC-P4-20555R16",
        "specifications": {"load_index": 91, "speed_index": "H", "season": "Summer"},
    },
    {
        "brand": "Michelin",
        "width": 225,
        "aspect_ratio": 45,
        "rim_diameter": 17,
        "name": "Michelin Pilot Sport 4 225/45 R17",
        "sku": "MIC-PS4-22545R17",
        "specifications": {"load_index": 91, "speed_index": "W", "season": "Summer"},
    },
    {
        "brand": "Pirelli",
        "width": 235,
        "aspect_ratio": 40,
        "rim_diameter": 18,
        "name": "Pirelli P Zero 235/40 R18",
        "sku": "PIR-PZERO-23540R18",
        "specifications": {"load_index": 95, "speed_index": "Y", "season": "Summer"},
    },
    {
        "brand": "Pirelli",
        "width": 265,
        "aspect_ratio": 60,
        "rim_diameter": 18,
        "name": "Pirelli Scorpion 265/60 R18",
        "sku": "PIR-SCORP-26560R18",
        "specifications": {"load_index": 114, "speed_index": "H", "season": "AllTerrain"},
    },
    {
        "brand": "Bridgestone",
        "width": 205,
        "aspect_ratio": 55,
        "rim_diameter": 16,
        "name": "Bridgestone Turanza T005 205/55 R16",
        "sku": "BRI-T005-20555R16",
        "specifications": {"load_index": 91, "speed_index": "V", "season": "Summer"},
    },
    {
        "brand": "Bridgestone",
        "width": 265,
        "aspect_ratio": 70,
        "rim_diameter": 16,
        "name": "Bridgestone Dueler A/T 265/70 R16",
        "sku": "BRI-DUELER-26570R16",
        "specifications": {"load_index": 112, "speed_index": "S", "season": "AllTerrain"},
    },
    {
        "brand": "Goodyear",
        "width": 195,
        "aspect_ratio": 65,
        "rim_diameter": 15,
        "name": "Goodyear EfficientGrip 195/65 R15",
        "sku": "GOO-EG-19565R15",
        "specifications": {"load_index": 91, "speed_index": "H", "season": "Summer"},
    },
    {
        "brand": "Goodyear",
        "width": 31,
        "aspect_ratio": 10.5,
        "rim_diameter": 15,
        "name": "Goodyear Wrangler 31x10.5 R15",
        "sku": "GOO-WRAN-31x10.5R15",
        "specifications": {"load_index": 109, "speed_index": "Q", "season": "AllTerrain"},
    },
    {
        "brand": "Continental",
        "width": 225,
        "aspect_ratio": 50,
        "rim_diameter": 17,
        "name": "Continental PremiumContact 6 225/50 R17",
        "sku": "CON-PC6-22550R17",
        "specifications": {"load_index": 98, "speed_index": "W", "season": "Summer"},
    },
    {
        "brand": "Firestone",
        "width": 215,
        "aspect_ratio": 55,
        "rim_diameter": 17,
        "name": "Firestone Firehawk 215/55 R17",
        "sku": "FIR-FH-21555R17",
        "specifications": {"load_index": 94, "speed_index": "V", "season": "Summer"},
    },
    {
        "brand": "Yokohama",
        "width": 205,
        "aspect_ratio": 60,
        "rim_diameter": 16,
        "name": "Yokohama BluEarth 205/60 R16",
        "sku": "YOK-BE-20560R16",
        "specifications": {"load_index": 92, "speed_index": "H", "season": "Summer"},
    },
    {
        "brand": "Hankook",
        "width": 235,
        "aspect_ratio": 35,
        "rim_diameter": 19,
        "name": "Hankook Ventus V12 235/35 R19",
        "sku": "HAN-V12-23535R19",
        "specifications": {"load_index": 91, "speed_index": "Y", "season": "Summer"},
    },
]


async def seed_products(uow) -> list[Product]:
    """Seed initial products if not exist."""
    results = []
    for data in PRODUCTS_DATA:
        brand = await uow.brands.get_by_name(data["brand"])
        if not brand:
            continue

        spec = await uow.tire_specifications.get_or_create(
            width=data["width"],
            aspect_ratio=data["aspect_ratio"],
            rim_diameter=data["rim_diameter"],
        )

        fingerprint = f"{data['brand']}|{data['width']}|{data['aspect_ratio']}|{data['rim_diameter']}"
        existing = await uow.products.get_by_fingerprint(fingerprint)
        if existing:
            continue

        product = Product(
            id=uuid.uuid4(),
            fingerprint=fingerprint,
            sku=data["sku"],
            name=data["name"],
            normalized_name=data["name"].lower().replace(" ", "_"),
            brand_id=brand.id,
            tire_specification_id=spec.id,
            specifications=data.get("specifications", {}),
            product_type="tire",
            status="active",
            extra_data={},
        )
        await uow.products.add(product)
        results.append(product)

    if results:
        await uow.commit()
    return results
