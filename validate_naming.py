from neumatiq_next.infrastructure.persistence.sqlalchemy import Country
from neumatiq_next.infrastructure.persistence.repositories import SQLAlchemyCountryRepository
from neumatiq_next.application.unit_of_work import IUnitOfWork

# Check naming consistency between model and repository
print("=== COLUMN NAMES VERIFICATION ===")
model_cols = set(c.name for c in Country.__table__.columns)
print(f"Country columns: {sorted(model_cols)}")

# Check special methods
special_methods = ['get_by_code', 'get_by_name', 'get_by_normalized_name', 'list_active']
for m in special_methods:
    if hasattr(SQLAlchemyCountryRepository, m):
        print(f"SQLAlchemyCountryRepository.{m}: EXISTS")
    else:
        print(f"SQLAlchemyCountryRepository.{m}: MISSING")