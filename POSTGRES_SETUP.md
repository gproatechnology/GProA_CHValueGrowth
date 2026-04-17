# Guía para configurar PostgreSQL en Render

## Variables de entorno requeridas

En el dashboard de Render, configura estas variables:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
POSTGRES_ENABLED=true
```

## Cambios en el código

### 1. database/config.py

```python
import os

# Cambiar de SQLite a PostgreSQL
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///neumatiq.db')

if DATABASE_URL.startswith('postgresql'):
    # Configuración para PostgreSQL (Render)
    engine = create_engine(DATABASE_URL)
else:
    # SQLite local
    engine = create_engine('sqlite:///neumatiq.db')
```

### 2. render.yaml (actualizar)

```yaml
services:
  - type: web
    name: neumatiq
    env: python
    buildCommand: pip install -r requirements.txt && cd frontend && npm install && npm run build
    startCommand: gunicorn services.api.main:app --workers 4
    envVars:
      - key: DATABASE_URL
        fromService: neumatiq-db
      - key: POSTGRES_ENABLED
        value: "true"
```

## Crear base de datos en Render

1. Ir a Dashboard → New PostgreSQL
2. Nombre: `neumatiq-db`
3. Región: (elegir más cercana)
4. Obtener URL de conexión
5. Configurar en el servicio web

## Migrar datos (si es necesario)

```bash
# Exportar de SQLite
sqlite3 neumatiq.db ".dump" > dump.sql

# Importar a PostgreSQL
psql $DATABASE_URL < dump.sql
```