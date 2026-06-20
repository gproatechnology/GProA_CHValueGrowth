"""API dependencies provider."""
from neumatiq_next.infrastructure.persistence import SQLAlchemyUnitOfWork


def get_uow_factory():
    """Get UnitOfWork factory for dependency injection."""
    return SQLAlchemyUnitOfWork