# Hardcoded UUID Audit Report

## Findings

### Hardcoded UUIDs Found: 1

| File | Line | Type | Value | Status |
|------|------|------|-------|--------|
| neumatiq_next/infrastructure/scraping/run.py | 41 | runtime | d6876d88-2901-4ca9-afec-a7934e88cab8 | FIXED |

### Fixed Implementation

**Before:**
```python
await ingestion.ingest(result, uuid.UUID("d6876d88-2901-4ca9-afec-a7934e88cab8"))
```

**After:**
```python
async with SQLAlchemyUnitOfWork() as uow:
    supplier = await uow.suppliers.get_by_normalized_name("mercadolibre_mx")
    supplier_id = supplier.id if supplier else None

await ingestion.ingest(result, supplier_id)
```

### Test Fixtures UUIDs

| File | Line | Type | Purpose |
|------|------|------|---------|
| tests/unit/application/test_list_suppliers.py | 16 | test fixture | Mock country_id for test |

These are acceptable - test fixtures are expected to use deterministic values.

### Seed Data UUIDs

Seed scripts generate UUIDs dynamically via `uuid.uuid4()` - no hardcoded values found.

## Summary

- **Runtime hardcoded UUIDs:** 1 → 0 (FIXED)
- **Test fixture UUIDs:** 1 (acceptable)
- **Seed data UUIDs:** 0 (acceptable)

All runtime UUIDs now resolved via database lookups or dynamic generation.