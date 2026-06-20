"""HTTP dependencies for dependency injection."""
from neumatiq_next.infrastructure.persistence.unit_of_work import SQLAlchemyUnitOfWork


def get_uow_factory():
    """Factory that returns SQLAlchemyUnitOfWork class."""
    return SQLAlchemyUnitOfWork
