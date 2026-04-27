#!/usr/bin/env python3
"""
Ejecutar migración SQL inicial.
Para desarrollo rápido con SQLite.
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from database.config import engine, Base
from database.models import Product, User
import sqlite3

def main():
    # Leer archivo SQL
    sql_file = Path(__file__).parent / "migrations" / "001_initial_schema.sql"
    if not sql_file.exists():
        print(f"[ERROR] Archivo no encontrado: {sql_file}")
        return
    
    # Leer con encoding explícito UTF-8 para evitar errores en Windows
    sql = sql_file.read_text(encoding='utf-8')
    
    # Conectar a DB
    db_path = Path("data/chvaluegrowth.db")
    if not db_path.exists():
        print(f"[ERROR] Base de datos no existe: {db_path}")
        print("   Ejecuta primero: python -c \"from database.config import init_db; init_db()\"")
        return
    
    conn = sqlite3.connect(str(db_path))
    try:
        cursor = conn.cursor()
        cursor.executescript(sql)
        conn.commit()
        print("[OK] Migracion aplicada exitosamente")
        print("   - Tablas creadas: products, users")
        print("   - Indices agregados")
    except Exception as e:
        print(f"[ERROR] Error aplicando migracion: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    main()