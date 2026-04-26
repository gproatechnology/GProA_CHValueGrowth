# ❓ Preguntas Frecuentes - NeumatiQ

**Sistema de Gestión Integral para el Comercio de Neumáticos**  
Desarrollado por GProA Technology | Comercializado por CH ValueGrowth  
Versión: 1.0.0 | Actualizado: 26/04/2026

---

## 📋 Tabla de Contenidos

1. [General](#1-general)
2. [Instalación y Configuración](#2-instalación-y-configuración)
3. [Ejecución del Proyecto](#3-ejecución-del-proyecto)
4. [API y Endpoints](#4-api-y-endpoints)
5. [Base de Datos](#5-base-de-datos)
6. [Scraping y Recopilación de Datos](#6-scraping-y-recopilación-de-datos)
7. [Autenticación y Seguridad](#7-autenticación-y-seguridad)
8. [Deployment](#8-deployment)
9. [Troubleshooting](#9-troubleshooting)
10. [Desarrollo](#10-desarrollo)
11. [Aspectos Legales y Éticos](#11-aspectos-legales-y-éticos)

---

## 1. General

### ¿Qué es NeumatiQ?

NeumatiQ es un sistema de gestión integral diseñado específicamente para el comercio de neumáticos (llantas). Cubre todos los procesos del negocio: compras a proveedores, inventario, ventas, facturación, control de bodega, gestión de clientes, reportes financieros, análisis de margen, rotación de productos, alertas de stock y CRM.

### ¿Cuál es el objetivo del proyecto?

El objetivo es automatizar y centralizar todos los procesos del negocio de neumáticos, desde la compra a proveedores hasta la facturación y análisis de ventas, proporcionando una plataforma integral que optimice la gestión y aumente la rentabilidad.

### ¿Qué tecnologías se utilizan?

| Capa | Tecnología | Versión |
|------|------------|---------|
| Lenguaje | Python | 3.14+ |
| API | FastAPI | 0.109+ |
| Frontend | React + Vite | Latest |
| Base de Datos | SQLAlchemy + SQLite/PostgreSQL | Latest |
| Scraping | requests + BeautifulSoup4 | Latest |
| Servidor | Uvicorn | Latest |

### ¿Qué hace el módulo de inteligencia de mercado?

El módulo de inteligencia de mercado extrae y analiza precios de neumáticos de fuentes externas (como MercadoLibre) para proporcionar información competitiva, tendencias de precios y alertas, permitiendo tomar decisiones de compra y venta basadas en datos en tiempo real.

### ¿Cuál es la arquitectura del sistema?

El sistema sigue una arquitectura en capas:
- **Fuentes de Datos**: MercadoLibre y otros sitios
- **Pipeline de Datos**: Scrapers → Processor → Base de Datos
- **Capa de API**: FastAPI con endpoints REST
- **Consumidores**: Aplicación Web, Dashboard, API externa

---

## 2. Instalación y Configuración

### Requisitos previos

**Backend:**
- Python 3.14 o superior
- pip (gestor de paquetes de Python)

**Frontend:**
- Node.js 18+ 
- npm o yarn

### Instalación paso a paso (Windows)

```powershell
# 1. Clonar/copiar el proyecto
cd C:\Users\X1\OneDrive\Documentos\Python_VS Code\GProA\Desarrollo_chvaluegrowth

# 2. Crear entorno virtual
python -m venv venv

# 3. Activar entorno virtual
venv\Scripts\activate

# 4. Instalar dependencias del backend
pip install -r requirements.txt

# 5. Configurar variables de entorno
copy .env.example .env
```

```powershell
# 6. Instalar dependencias del frontend
cd frontend
npm install
cd ..
```

### Variables de entorno (.env) principales

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | URL de conexión a la base de datos | `sqlite:///data/chvaluegrowth.db` |
| `API_PORT` | Puerto del servidor API | `8000` |
| `JWT_SECRET` | Secreto para tokens JWT (⚠️ CAMBIAR) | *requerido* |
| `MOCK_MODE` | Modo de pruebas para scrapers | `true` |
| `SCRAPER_DELAY` | Retraso entre requests (segundos) | `2` |
| `ENVIRONMENT` | Ambiente: development/production | `development` |

### ¿Cómo generar un JWT_SECRET seguro?

```bash
# Opción 1: Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Opción 2: OpenSSL
openssl rand -base64 32

# Opción 3: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Importante**: El JWT_SECRET debe:
- Ser único y aleatorio
- Tener al menos 32 caracteres
- Nunca compartirse en commit a Git
- Configurarse en el dashboard de Render en producción

---

## 3. Ejecución del Proyecto

### Iniciar el backend (API)

```powershell
# Desde la raíz del proyecto
python -m uvicorn services.api.main:app --reload --port 8000
```

**URLs disponibles:**
- API: http://127.0.0.1:8000
- Documentación Swagger: http://127.0.0.1:8000/docs
- Health Check: http://127.0.0.1:8000/health

### Iniciar el frontend (Dashboard)

```powershell
# Opción 1: Script batch (recomendado)
cd frontend
npm run dev

# Opción 2: Vite directamente
npx vite --port 5173
```

**URL:** http://localhost:5173

### Iniciar scraper manualmente

```powershell
# Modo desarrollo (MOCK=true para datos de prueba)
python scripts/run_scraper.py --limit 10 --mock

# Modo producción (scraping real)
set MOCK_MODE=false
python scripts/run_scraper.py --limit 50
```

### Iniciar todo en conjunto

Se recomienda abrir 3 terminales:

**Terminal 1 - Backend:**
```powershell
venv\Scripts\activate
python -m uvicorn services.api.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

**Terminal 3 - Scheduler (opcional):**
```powershell
venv\Scripts\activate
python services/scheduler/__init__.py
```

---

## 4. API y Endpoints

### Endpoints principales (v1)

| Endpoint | Método | Descripción | Parámetros |
|----------|--------|-------------|------------|
| `/api/v1/products` | GET | Lista paginada de productos | `brand`, `size`, `page`, `limit` |
| `/api/v1/products/stats` | GET | Estadísticas de precios | `brand`, `size` |
| `/api/v1/products/grouped` | GET | Productos agrupados | `group_by` (brand/size/brand_size) |
| `/api/v1/products/{id}` | GET | Detalle de producto específico | `id` |
| `/api/v1/metrics` | GET | Métricas del pipeline | - |
| `/api/v1/metrics/reset` | POST | Resetear métricas | - |
| `/api/v1/auth/login` | POST | Inicio de sesión | `username`, `password` |

#### Ejemplo: Obtener productos

```bash
# Todos los productos (página 1, 20 resultados)
curl http://localhost:8000/api/v1/products

# Filtrar por marca
curl "http://localhost:8000/api/v1/products?brand=Michelin&page=1&limit=50"

# Con paginación
curl "http://localhost:8000/api/v1/products?page=2&limit=10"
```

**Respuesta:**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  },
  "count": 20,
  "data": [
    {
      "id": 1,
      "source": "mercadolibre",
      "title": "Llanta Michelin Primacy 4 205/55R16",
      "brand": "Michelin",
      "size": "205/55R16",
      "price": 2450.00,
      "currency": "MXN",
      "url": "https://...",
      "scraped_at": "2026-04-26T10:00:00Z"
    }
  ]
}
```

#### Ejemplo: Obtener estadísticas

```bash
# Estadísticas generales
curl http://localhost:8000/api/v1/products/stats

# Estadísticas por marca
curl "http://localhost:8000/api/v1/products/stats?brand=Goodyear"
```

**Respuesta:**
```json
{
  "success": true,
  "filters": {"brand": null, "size": null},
  "total_products": 150,
  "stats": {
    "min_price": 1200.00,
    "max_price": 4500.00,
    "avg_price": 2340.50
  }
}
```

### Esquema de respuesta estándar

Todos los endpoints devuelven un JSON con el siguiente formato:

```json
{
  "success": true,           // Boolean: éxito o error
  "data": {},                // Object/Array: datos principales
  "pagination": {...},       // Object: info de paginación (si aplica)
  "error": null,             // String: mensaje de error (si falla)
  "timestamp": "..."         // String: timestamp ISO
}
```

### Rate limiting

- **Estado**: Actualmente deshabilitado en desarrollo
- **Producción**: Configurable mediante Redis
- **Límite por defecto**: 100 requests/minuto

---

## 5. Base de Datos

### Modelo de datos

```python
Product {
  id: Integer (PK)
  source: String(50)          # Fuente: 'mercadolibre', 'otro'
  title: String(500)          # Título completo del producto
  brand: String(100)          # Marca extraída
  size: String(50)            # Medida: 205/55R16
  price: Float                # Precio en moneda local
  currency: String(10)        # Moneda: MXN, USD, etc.
  url: String(1000)           # URL del producto original
  scraped_at: DateTime        # Cuándo se extrajo
  created_at: DateTime        # Cuándo se creó en BD
  updated_at: DateTime        # Última actualización
}
```

### Migraciones

**⚠️ ACTUALMENTE SIN MIGRACIONES AUTOMÁTICAS**

Los cambios en el modelo requieren:
1. Eliminar la base de datos SQLite (en desarrollo)
2. Recrear las tablas ejecutando `init_db()`

**Recomendación**: Implementar Alembic para migraciones en producción.

### Consultas comunes

```python
from database.repository import ProductRepository

# Obtener todos
repo = ProductRepository()
products = repo.get_all(limit=100)

# Filtrar por marca
products = repo.get_by_brand("Michelin", limit=50)

# Filtrar por tamaño
products = repo.get_by_size("205/55R16", limit=50)

# Obtener por ID
product = repo.get_by_id(1)

# Contar total
count = repo.count()

repo.close()
```

### Backup de base de datos

**SQLite (desarrollo):**
```powershell
# Copiar archivo
copy data\chvaluegrowth.db backup\chvaluegrowth_backup_20260426.db
```

**PostgreSQL (producción):**
```bash
pg_dump -h localhost -U user -d tires > backup.sql
```

**Automático en Render:**
- Backup diario configurado en `render.yaml` (cronjob)
- Almacenado en disco persistente `/data`

---

## 6. Scraping y Recopilación de Datos

### ¿Cómo funciona el scraper?

El scraper de MercadoLibre:
1. Envía requests HTTP con headers realistas
2. Parsea el HTML con BeautifulSoup
3. Extrae título, precio, marca y tamaño
4. Normaliza los datos
5. Los inserta en la base de datos

### Modos de operación

| Modo | Descripción | Uso |
|------|-------------|-----|
| `MOCK_MODE=true` | Datos de prueba simulados | Desarrollo, testing |
| `MOCK_MODE=false` | Scraping real a MercadoLibre | Producción |

**Configuración:**
```powershell
# Desarrollo
set MOCK_MODE=true
python scripts/run_scraper.py

# Producción
set MOCK_MODE=false
python scripts/run_scraper.py --limit 100
```

### Configuración de delays

Evita ser bloqueado por el sitio destino:

```env
SCRAPER_DELAY_MIN=1.0    # Delay mínimo entre requests (segundos)
SCRAPER_DELAY_MAX=3.0    # Delay máximo entre requests
SCRAPER_USER_AGENT_ROTATION=true  # Rotar user agents
```

### Patrones de extracción

**Marcas detectadas:**
- Premium: Michelin, Bridgestone, Continental, Goodyear, Pirelli
- Mid-range: Dunlop, Toyo, Yokohama, Hankook, Kumho
- Budget: Maxxis, Cooper, Axis, Chengshan, Starper, Goodride

**Tamaños soportados:**
- Formato estándar: `205/55R16`, `175/65R14`
- Con carga/velocidad: `205/55R16 91V`

### Ejecución programada

**Cron en Render (producción):**
```yaml
# Cada 6 horas
schedule: "0 */6 * * *"
command: python scripts/run_scraper.py --limit 100
```

**Local con Windows Task Scheduler:**
```powershell
# Crear tarea programada
schtasks /create /tn "NeumatiQ Scraper" /tr "python C:\ruta\run_scraper.py" /sc hourly /mo 6
```

### Problemas comunes de scraping

| Problema | Solución |
|----------|----------|
| Bloqueo IP (429/403) | Aumentar delays, usar proxies |
| CAPTCHA | Implementar servicio anti-CAPTCHA |
| Cambios en HTML | Actualizar selectores CSS |
| Rate limit | Respetar `robots.txt`, reducir frecuencia |

---

## 7. Autenticación y Seguridad

### Sistema de autenticación actual

**Estado**: JWT implementado pero con usuarios mock

```python
# En desarrollo: usuarios hardcoded
MOCK_USERS = {
    "admin": {
        "username": "admin",
        "password": "$2b$12$...",  # bcrypt hash
        "role": "admin"
    }
}
```

**Próximamente**: Migración a base de datos con tabla `users`.

### Obtener token JWT

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "tu_password"
}
```

**Respuesta:**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 86400  # 24 horas
}
```

### Usar token en requests

```bash
# Con curl
curl -H "Authorization: Bearer TU_TOKEN" http://localhost:8000/api/v1/products

# Con JavaScript
fetch('/api/v1/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Configuración JWT

```env
JWT_SECRET=tu_secreto_muy_largo_y_seguro_aqui
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
JWT_REFRESH_EXPIRATION_DAYS=7
```

**⚠️ IMPORTANTE**:
- `JWT_SECRET` debe cambiarse en producción
- Nunca commitearlo a Git
- Usar al menos 32 caracteres aleatorios

### Middleware de seguridad

**CORS**:
- Desarrollo: `allow_origins=["*"]` (todos)
- Producción: Orígenes específicos configurados en Render

**Rate Limiting**:
- Opcional, habilitado con Redis
- Límite configurable por IP

**Headers de seguridad** (Render):
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## 8. Deployment

### Render.com (configurado)

**Servicios desplegados:**

| Servicio | Tipo | URL | Puerto |
|----------|------|-----|--------|
| API | Web | https://chvaluegrowth-api.onrender.com | 8000 |
| Frontend | Static | https://chvaluegrowth-api.onrender.com/dashboard | 80 |
| Scraper | Worker | Background | - |
| DB (opcional) | PostgreSQL | postgres://... | 5432 |

**Accesos:**
- API: https://chvaluegrowth-api.onrender.com
- Docs: https://chvaluegrowth-api.onrender.com/docs
- Health: https://chvaluegrowth-api.onrender.com/health

### Variables de entorno en Render

**Críticas (configurar manualmente):**
- `JWT_SECRET` → Generar y pegar en dashboard
- `DATABASE_URL` → Si usas PostgreSQL propio

**Opcionales:**
- `SENTRY_DSN` → Error tracking
- `SMTP_*` → Recuperación de contraseña

### Docker

**Backend:**
```dockerfile
# Multi-stage build
FROM python:3.14-slim as builder
# Instalar dependencias
FROM python:3.14-slim as runtime
CMD ["uvicorn", "services.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend:**
```dockerfile
# Build estático
FROM node:18-alpine as builder
RUN npm ci && npm run build
# Servir con nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

**Scraper (worker):**
```dockerfile
FROM python:3.14-slim
CMD ["python", "scripts/run_scraper_scheduler.py"]
```

### Local con Docker Compose

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./data:/data
    environment:
      - DATABASE_URL=sqlite:///data/chvaluegrowth.db
  
  frontend:
    build: ./frontend
    ports:
      - "5173:80"
  
  scraper:
    build: .
    command: python scripts/run_scraper.py --schedule
    volumes:
      - ./data:/data
```

### Escalabilidad

**Auto-scaling** (solo planes de pago Render):
```yaml
scaling:
  minInstances: 1
  maxInstances: 3
  targetMemoryPercent: 70
  targetCPUPercent: 70
```

**Load balancer**: Proporcionado por Render.

---

## 9. Troubleshooting

### Error: "Failed to fetch" en frontend

**Causa**: Frontend no alcanza el backend API.

**Solución:**
1. Verificar que el backend esté corriendo:
```powershell
curl http://localhost:8000/health
```

2. Verificar proxy de Vite (frontend/vite.config.js):
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true
  }
}
```

3. En producción, configurar `VITE_API_URL`:
```env
VITE_API_URL=https://chvaluegrowth-api.onrender.com/api/v1
```

### Error: Pantalla negra/blank en navegador

**Posibles causas:**
1. Vite no está ejecutándose
2. Puerto 5173 ocupado
3. Errores de compilación

**Solución:**
```powershell
# 1. Verificar proceso
netstat -ano | findstr :5173

# 2. Limpiar caché de Vite
cd frontend
rmdir /s /q .vite
npm run dev

# 3. Reinstalar node_modules
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

### Error: "Cannot find module '@babel/types'"

```powershell
# Solución 1: Instalar dependencia faltante
cd frontend
npm install --save-dev @babel/types

# Solución 2: Reinstalación completa (recomendado)
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
npm run dev
```

### Error: Base de datos vacía o sin datos

**Verificar:**
```powershell
# 1. Verificar que el scraper se ejecutó
python scripts/run_scraper.py --limit 10

# 2. Verificar base de datos
python -c "from database.repository import ProductRepository; r=ProductRepository(); print(r.count()); r.close()"

# 3. Ver logs del scraper
# Los logs muestran cuántos productos se insertaron
```

### Error: SQLite database is locked

**Causa**: Múltiples procesos acceden a la DB simultáneamente.

**Solución:**
1. Cerrar todos los processes que usen la DB
2. Usar conexiones con `check_same_thread=False` (ya implementado)
3. Considerar migrar a PostgreSQL en producción

### Error: JWT secret must be 32 characters

**Solución**: Generar un secreto más largo:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
# Ejemplo: "3q2w7e9r5t6y8u0iO-pL9kN8Bj7Hk6M5n4Q2w3e4r5t6y7u8i9o0p"
```

### Error: Render Free hiberna después de 15 min

**Causa**: Render Free tier hiberna servicios inactivos.

**Solución:**
1. Actualizar a plan de pago ($7/mes)
2. Usar cron jobs para mantener activo (ping cada 10 min)
3. Aceptar la hibernación (normal para tier gratuito)

### Error: OneDrive sincroniza node_modules

**Causa**: OneDrive intenta sincronizar miles de archivos.

**Solución:**
1. Pausar OneDrive durante desarrollo
2. Mover proyecto fuera de carpetas sincronizadas:
```powershell
# Mover a C:\Proyectos\GProA_CHValueGrowth
```

### Error: CORS en navegador

**Síntoma**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solución**:
1. Desarrollo: `allow_origins=["*"]` ya está configurado
2. Producción: Agregar dominio a `CORS_ORIGINS` en render.yaml

### Problemas de memoria en Render

**Síntoma**: Worker scraper se reinicia (OOM)

**Solución**:
1. Reducir `MAX_PRODUCTS_PER_SCRAPE`
2. Procesar en batches más pequeños
3. Upgrade a plan con más RAM

---

## 10. Desarrollo

### Estructura del proyecto

```
GProA_CHValueGrowth/
├── configs/                    # Configuraciones globales
├── database/                   # Capa de datos
│   ├── models.py              # Modelos SQLAlchemy
│   ├── repository.py          # Patrón Repository
│   └── config.py              # Config DB
├── services/
│   ├── api/                   # API FastAPI
│   │   ├── main.py           # App principal
│   │   └── routes/           # Endpoints
│   │       ├── products.py   # Productos
│   │       └── auth.py       # Auth
│   ├── processor/            # Procesamiento de datos
│   │   ├── normalizer/       # Normalización
│   │   ├── matcher/          # Matching
│   │   └── metrics.py        # Métricas pipeline
│   ├── scrapers/             # Scrapers
│   │   ├── common/           # Utilidades
│   │   └── mercadolibre/     # MercadoLibre
│   └── scheduler/            # Tareas programadas
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/       # Componentes UI
│   │   ├── pages/           # Vistas
│   │   ├── App.jsx          # App principal
│   │   └── api.js           # Cliente API
│   ├── package.json
│   └── vite.config.js
├── scripts/                  # Scripts utilitarios
│   ├── run_scraper.py
│   ├── create_admin_user.py
│   └── backup_database.py
├── tests/                    # Tests (pendientes)
├── static/                  # Frontend build (auto-generado)
├── .env                     # Variables entorno (NO commit)
├── .env.example             # Ejemplo de variables
├── requirements.txt         # Dependencias Python
├── render.yaml              # Configuración deployment
├── Dockerfile               # Imagen API
├── Dockerfile.worker        # Imagen scraper
└── README.md
```

### Guía de estilo de código

**Python:**
- Seguir PEP 8
- Type hints obligatorios
- Docstrings en formato Google Style
- Máximo 88 caracteres por línea

**JavaScript/React:**
- 2 espacios de indentación
- Componentes funcionales + hooks
- Nombre de archivos: `PascalCase` para componentes, `camelCase` para hooks

### Comandos útiles

```bash
# Lint (cuando esté configurado)
pip install black flake8 isort
black services/
flake8 services/
isort services/

# Tests
pytest tests/ -v --tb=short

# Compilar frontend
cd frontend && npm run build

# Limpiar cachés
rmdir /s /q frontend\.vite
rmdir /s /q frontend\node_modules\.cache
```

### Agregar nuevo endpoint

1. Crear archivo en `services/api/routes/nuevo_endpoint.py`
2. Definir router con prefijo `/api/v1`
3. Importar en `services/api/main.py`
4. Documentar en README

Ejemplo:
```python
from fastapi import APIRouter, Query
router = APIRouter(prefix="/api/v1", tags=["nuevo"])

@router.get("/nuevo")
def get_nuevo(param: str = Query(...)):
    return {"param": param}
```

### Agregar nuevo scraper

1. Crear carpeta `services/scrapers/nuevo_sitio/`
2. Implementar clase `NuevoSitioScraper`
3. Agregar a `SCRAPERS` en `__init__.py`
4. Configurar endpoint de trigger (opcional)

### Testing

**Unit tests** (pendientes de implementar):

```python
# tests/test_products.py
def test_get_products():
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    assert "data" in response.json()

def test_get_product_by_id():
    response = client.get("/api/v1/products/1")
    assert response.status_code == 200
```

Ejecutar:
```bash
pytest tests/ -v
```

### Debugging

**Backend:**
```python
# Agregar logs
import logging
logger = logging.getLogger(__name__)
logger.debug("Mensaje debug: %s", variable)
logger.info("Operación completada")
logger.error("Error: %s", exc_info=True)
```

**Frontend:**
```javascript
console.log("Debug:", variable);
console.error("Error:", error);
```

**React DevTools:** Instalar extensión Chrome

---

## 11. Aspectos Legales y Éticos

### ⚠️ Consideraciones sobre scraping

**Estado actual**: Scraper de MercadoLibre en producción (modo MOCK por defecto)

**Riesgo**: El scraping puede violar los Términos de Servicio de MercadoLibre.

**Recomendaciones:**
1. **Usar APIs oficiales** cuando estén disponibles
2. **Respetar robots.txt** del sitio destino
3. **Limitar frecuencia** de requests (ya implementado)
4. **Agregar disclaimer** legal en el producto final
5. **Consultar abogado** especializado antes de producción

### Mejores prácticas éticas

1. **Transparencia**: Identificarse como bot en User-Agent (no ocultar)
2. **No sobrecargar**: Respetar rate limits
3. **Datos públicos**: Solo acceder información pública
4. **No revender**: Usar datos solo para análisis interno
5. **Atribución**: Citarr fuentes cuando se compartan datos

### Disclaimer recomendado

```
Este sistema recopila datos de fuentes públicas con fines de 
análisis de mercado. Los datos no constituyen oferta de venta. 
Verifique la información directly con los proveedores antes de 
tomar decisiones de compra.
```

### GDPR / Protección de datos

- **No se recopilan datos personales** (solo información de productos públicos)
- **No se almacenan cookies** de usuarios
- **IPs no se loguean** (implementar si es necesario)
- **Derechos ARCO**: Implementar si se recopilan datos de clientes

---

## 📞 Contacto y Soporte

**Equipo de Desarrollo:** GProA Technology  
**Cliente:** CH ValueGrowth  
**Repositorio:** [Enlace interno]  
**Documentación API:** http://localhost:8000/docs (local)  

---

## 📊 Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| Líneas de código (Backend) | ~950 |
| Líneas de código (Frontend) | ~630 |
| Endpoints API | 9+ |
| Modelos de BD | 1 (products) |
| Cobertura de tests | 0% (pendiente) |
| Bundle size (frontend) | ~1.5 MB |

---

## 🎯 Estado Actual del Proyecto

**Fase**: Desarrollo Activo - Conectividad resuelta  
**Próxima acción**: Completar integración frontend → backend  
**Tiempo estimado para producción**: 2-3 semanas  

**Problemas pendientes:**
1. ⚠️ Revisar aspectos éticos del scraping (ETH-01)
2. 🔶 Migrar usuarios de MOCK a BD (AUTH-01)
3. 📝 Implementar tests unitarios

---

*Documento generado automáticamente el 26/04/2026*  
*Basado en AUDITORÍA COMPLETA v1.0*
