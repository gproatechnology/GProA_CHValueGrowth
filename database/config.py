"""
Configuración de base de datos - CHValueGrowth
Manejo de conexión y sesión de SQLAlchemy.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Obtener DATABASE_URL de entorno
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///chvaluegrowth.db')

# Crear engine
if DATABASE_URL.startswith('sqlite'):
    # SQLite con opciones especiales para evitar problemas de concurrencia
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=False
    )
else:
    # Otras bases de datos (PostgreSQL, MySQL, etc.)
    engine = create_engine(DATABASE_URL, echo=False)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()


def get_db():
    """Obtiene una sesión de base de datos."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Inicializa la base de datos (crea tablas)."""
    Base.metadata.create_all(bind=engine)
    return engine


def get_session():
    """Obtiene una sesión para uso directo (sin generador)."""
    return SessionLocal()