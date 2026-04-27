"""
Configuración de base de datos - CHValueGrowth
Manejo de conexión y sesión de SQLAlchemy.
"""

import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Obtener DATABASE_URL de entorno
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///data/chvaluegrowth.db')

# Asegurar que el directorio de la BD existe (SQLite)
if DATABASE_URL.startswith('sqlite'):
    db_path = DATABASE_URL.replace('sqlite:///', '')
    # Eliminar barra inicial si existe
    db_path = db_path.lstrip('/')
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)
        print(f"[DB] Directorio creado: {db_dir}")

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
    # Importar modelos para asegurar que estén registrados en Base.metadata
    import database.models  # noqa: F401
    Base.metadata.create_all(bind=engine)
    return engine


def get_session():
    """Obtiene una sesión para uso directo (sin generador)."""
    return SessionLocal()