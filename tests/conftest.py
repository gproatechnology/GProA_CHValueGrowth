"""Pytest configuration and fixtures."""
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from database.config import engine, Base, get_session
from database.models import Product, User

@pytest.fixture(scope="session")
def db_engine():
    """Create test database engine (SQLite in-memory)."""
    from sqlalchemy import create_engine
    test_engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=test_engine)
    yield test_engine
    Base.metadata.drop_all(bind=test_engine)

@pytest.fixture(scope="function")
def db_session(db_engine):
    """Create a fresh database session for each test."""
    from sqlalchemy.orm import sessionmaker
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
    session = TestSessionLocal()
    try:
        yield session
        session.commit()
    finally:
        session.close()

@pytest.fixture
def product_repo():
    from database.repository import ProductRepository
    repo = ProductRepository()
    yield repo
    repo.close()

@pytest.fixture
def user_repo():
    from database.repository import UserRepository
    repo = UserRepository()
    yield repo
    repo.close()