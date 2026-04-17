# Auditoría Técnica - Deployment en Render
## NeumatiQ - CHValueGrowth

**Fecha de auditoría:** 2026-04-16  
**Auditor:** Sistema  
**Objetivo:** Preparar el sistema para deployment en Render.com

---

## 1. Resumen Ejecutivo

| Aspecto | Estado | Notas |
|---------|--------|-------|
| Stack tecnológico | ✅ Listo | FastAPI + React + SQLite |
| Frontend build | ✅ Listo | Build en `frontend/dist/` (2026-04-16) |
| Frontend static | ✅ Listo | Sirve desde `/static` → `frontend/dist/` |
| API REST | ✅ Listo | Endpoints funcionando |
| Base de datos | ⚠️ SQLite | SQLite, problema en Render (se reinicia) |
| Autenticación | ✅ Listo | JWT + bcrypt |
| Scraping | ⚠️ Mock | Modo mock por defecto |
| Docker | ✅ Listo | Dockerfile presente |
| Deploy auto | ✅ Configurado | render.yaml con SubMain |

---

## 2. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    Render.com                         │
│  ┌───────────────────────────────────────────────┐   │
│  │         NeumatiQ (Python/FastAPI)             │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────┐ │   │
│  │  │  API    │  │Dashboard│  │  Scrapers    │ │   │
│  │  │ Routes  │  │ Static  │  │  (Mock)     │ │   │
│  │  └─────────┘  └─────────┘  └─────────────┘ │   │
│  │              ┌───────────┐                   │   │
│  │              │  SQLite   │                   │   │
│  │              │   (DB)    │                   │   │
│  │              └───────────┘                   │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Dependencias del Proyecto

### 3.1 Backend (Python)

| Paquete | Versión | Propósito | Estado |
|---------|---------|----------|--------|
| fastapi | latest | Framework API | ✅ Required |
| uvicorn | latest | Servidor ASGI | ✅ Required |
| requests | latest | HTTP client | ✅ Required |
| beautifulsoup4 | latest | HTML parsing | ✅ Required |
| pandas | latest | Procesamiento datos | ✅ Required |
| sqlalchemy | >=2.0.37 | ORM | ✅ Required |
| python-dotenv | latest | Config .env | ✅ Required |
| jinja2 | latest | Templates | ✅ Required |
| gunicorn | latest | WSGI server | ⚠️ Opcional |
| passlib[bcrypt] | >=1.7.4 | Hash passwords | ⚠️ bcrypt>=4.0 incompatible |
| redis | >=4.5.0 | Rate limiting | ⚠️ Opcional |
| python-jose | >=3.3.0 | JWT tokens | ✅ Required |

**Requisito Python:** 3.13+ (verificado en pyvenv.cfg)

### 3.2 Frontend (Node.js)

| Paquete | Versión | Propósito |
|---------|---------|----------|
| react | ^18.3.1 | UI Framework |
| react-dom | ^18.3.1 | React DOM |
| vite | ^5.4.21 | Build tool |
| @vitejs/plugin-react | ^4.7.0 | React plugin |
| tailwindcss | ^3.4.19 | CSS Framework |
| axios | ^1.14.0 | HTTP client |
| chart.js | ^4.5.1 | Gráficos |
| react-chartjs-2 | ^5.3.1 | Gráficos React |
| recharts | ^2.15.4 | Gráficos React |
| react-router-dom | ^6.30.3 | Routing |
| lucide-react | ^0.503.0 | Iconos |
| framer-motion | ^12.9.2 | Animaciones |
| react-hot-toast | ^2.6.0 | Notificaciones |
| @tanstack/react-query | ^5.96.2 | Data fetching |

**Requisito Node:** 18+

---

## 4. Estructura de Archivos

```
GProA_CHValueGrowth/
├── requirements.txt          # Dependencias Python
├── services/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI app (ENTRY POINT)
│   │   └── routes/
│   │       ├── products.py  # Endpoints /api/v1/products
│   │       └── auth.py      # Endpoints /api/v1/auth
│   ├── scrapers/
│   │   ├── mercadolibre/
│   │   └── common/
│   ├── processor/
│   │   ├── normalizer/
│   │   └── matcher/
│   └── scheduler/
├── database/
│   ├── config.py             # Configuración SQLite
│   ├── models.py            # Modelos SQLAlchemy
│   └── repository.py       # Repositorio CRUD
├── frontend/               # <-- TODO el frontend aquí
│   ├── package.json        # Dependencias Node
│   ├── vite.config.js      # Config Vite
│   ├── src/
│   │   ├── App.jsx        # React app
│   │   ├── components/   # Componentes React
│   │   ├── pages/       # Páginas React
│   │   └── services/   # Servicios API
│   ├── public/           # Assets públicos
│   ├── dist/            # Build compilado (npm run build)
│   └── node_modules/    # Deps Node
├── configs/
├── tests/
├── .env.example           # Template de variables
├── README.md
├── AUDITORIA_RENDER.md   # Este documento
└── LICENSE
```

**Archivos presentes:**
- ✅ Dockerfile (usa Python + sirve frontend/dist/)
- ✅ Dockerfile.worker
- ✅ node_modules/ (local solo, no en repo)
- ✅ venv/ (local solo, no en repo)

---

## 5. Endpoints de API

### 5.1 Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|------------|
| GET | `/` | UI Dashboard (static index.html) |
| GET | `/health` | Health check |
| GET | `/static/{path}` | Archivos estáticos |
| GET | `/{path}` | SPA fallback |

### 5.2 Endpoints de Productos

| Método | Endpoint | Descripción |
|--------|----------|------------|
| GET | `/api/v1/products` | Lista paginada |
| GET | `/api/v1/products/stats` | Estadísticas |
| GET | `/api/v1/products/grouped` | Productos agrupados |
| GET | `/api/v1/products/{id}` | Producto por ID |
| GET | `/api/v1/metrics` | Métricas pipeline |

### 5.3 Endpoints de Autenticación

| Método | Endpoint | Descripción |
|--------|----------|------------|
| POST | `/api/v1/auth/login` | Login (JWT) |
| POST | `/api/v1/auth/refresh` | Refresh token |
| POST | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/auth/me` | Info usuario |
| GET | `/api/v1/auth/verify` | Verificar token |

### 5.4 Credenciales por Defecto

| Usuario | Password | Rol |
|---------|----------|-----|
| admin | admin123 | admin |
| user | user123 | user |

---

## 6. Configuración de Base de Datos

### SQLite (Desarrollo local)

```python
# database/config.py
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///chvaluegrowth.db')
```

**Problemas conocidos:**
1. En Render Free: SQLite se reinicia cada deployment
2. En Render Paid: Persiste pero tiene limitaciones
3. No hay respaldos automáticos

### PostgreSQL (Recomendado para producción)

Para Render, usar PostgreSQL con:
```python
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgres://...')
```

**Ventajas PostgreSQL:**
- Persistencia de datos
- Mejor rendimiento
- Soporte completo de SQLAlchemy
- Backups automáticos (Render)

---

## 7. Variables de Entorno Requeridas

### 7.1 Obligatorias

| Variable | Descripción | Ejemplo |
|----------|------------|---------|
| `DATABASE_URL` | Connection string DB | `sqlite:///chvaluegrowth.db` |
| `JWT_SECRET` | Clave签署 JWT | `change_in_production_2026` |

### 7.2 Opcionales

| Variable | Descripción | Default |
|----------|------------|---------|
| `JWT_ALGORITHM` | Algoritmo JWT | `HS256` |
| `JWT_EXPIRATION_HOURS` | Expiración token | `24` |
| `JWT_REFRESH_EXPIRATION_DAYS` | Expiración refresh | `7` |
| `REDIS_URL` | Redis para rate limiting | (none) |
| `MOCK_MODE` | Scraping modo mock | `true` |

### 7.3 Template `.env.example`

```
DATABASE_URL=sqlite:///chvaluegrowth.db
JWT_SECRET=chvalue2026_secret_key_change_in_production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
JWT_REFRESH_EXPIRATION_DAYS=7
MOCK_MODE=true
# REDIS_URL=redis://...
```

---

## 8. Construcción del Frontend

### 8.1 Build Actual

El frontend ya está compilado en `static/`:

```
static/
├── index.html
└── assets/
    ├── index-*.js
    ├── index-*.css
    ├── Dashboard-*.js
    ├── Products-*.js
    └── (más archivos)
```

### 8.2 Reconstruir Frontend

```bash
cd frontend
npm install
npm run build
# Output va a dist/
# Copiar dist/* a ../static/
```

### 8.3 Servir en Render

FastAPI sirve archivos estáticos desde `static/`:

```python
# services/api/main.py
BASE_DIR = Path(__file__).resolve().parent.parent.parent
STATIC_DIR = BASE_DIR / "static"

@app.get("/")
def serve_root():
    return FileResponse(STATIC_DIR / "index.html")
```

---

## 9. Scraper Mode

### 9.1 Estado Actual

El scraper está en **MODO MOCK** por defecto:

```
# .env
MOCK_MODE=true  # No realiza scrape real
```

### 9.2 Habilitar Scraping Real

Cambiar en `.env`:
```
MOCK_MODE=false
```

### 9.3 Configurar Scraper

El scraper está en `services/scrapers/mercadolibre/`:

- Extrae datos de MercadoLibre
- Normaliza precios, marcas, tallas
- Guarda en SQLite

**Limitación en Render:**
- Scraping cada vez que inicia el servicio
- O usar scheduler externo (cron)

---

## 10. Problemas y Limitaciones Conocidas

| # | Problema | Severidad | Solución |
|---|----------|-----------|----------|
| 1 | SQLite se resetea en cada deploy (Free) | Alta | Usar PostgreSQL |
| 2 | Idle timeout 15 min (Free) | Alta | Upgrade a paid o Keep-alive |
| 3 | Scraper modo mock | Media | Implementar scheduler real |
| 4 | Sin backups automáticos | Media | PostgreSQL con Render |
| 5 | Rate limiting requiere Redis | Baja | Instalar Redis add-on |

---

## 11. Recomendaciones para Render

### 11.1 Render Plan

| Plan | Costo | Apropiado para |
|------|------|--------------|
| Free | $0 | Testing |
| Starter | $5/production | API simple |
| Pro | $25/production | Production real |

### 11.2 Configuración Sugerida

1. **Web Service:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python -m uvicorn services.api.main:app --host 0.0.0.0 --port 10000`

2. **Environment Variables:**
   - `PYTHON_VERSION`: 3.13
   - `DATABASE_URL`: (PostgreSQL connection string)

3. **PostgreSQL (opcional):**
   - Add-on de Render: `$5/mes`

---

## 12. Próximos Pasos

| # | Tarea | Prioridad | Estado |
|---|------|----------|--------|
| 1 | Crear render.yaml | Alta | ✅ Hecho |
| 2 | Frontend build | Alta | ✅ Hecho |
| 3 | Deploy a Render | Alta | ⏳ Pendiente |
| 4 |测试 Deployment | Alta | ⏳ Pendiente |
| 5 | Configurar PostgreSQL | Media | ⏳ Pendiente |
| 6 | Implementar scheduler real | Baja | ⏳ Pendiente |

---

## 13. Checklist de Deployment

- [ ] Python 3.13+ verificado
- [ ] Dependencias en requirements.txt
- [ ] Frontend compilado en /static
- [ ] FastAPI sirve static files
- [ ] Variables de entorno configuradas
- [ ] SQLite funciona o PostgreSQL configurado
- [ ] Credenciales actualizadas
- [ ] Health check responde
- [ ] Endpoints probados

---

## 14. URLs Esperadas en Render

| Servicio | URL |
|----------|-----|
| API | `https://chvaluegrowth.onrender.com` |
| Health | `https://chvaluegrowth.onrender.com/health` |
| Dashboard | `https://chvaluegrowth.onrender.com/` |
| Swagger | `https://chvaluegrowth.onrender.com/docs` |

---

## 15. Recent Changes

### 2026-04-16 - Cleanup for Render

**Cambios realizados en rama `SubMain`:**

1. ✅ Eliminada carpeta `/static/` raíz (ya no se usa)
2. ✅ API actualizada para servir desde `frontend/dist/`
3. ✅ Agregada auditoría técnica

**Nueva estructura de archivos:**
- FastAPI sirve desde `frontend/dist/` (no `/static/`)
- Antes: `static/index.html`
- Ahora: `frontend/dist/index.html`

**Para hacer build:**
```bash
cd frontend
npm run build   # Output: frontend/dist/
```

### 2026-04-16 - Frontend Build Actualizado

**Cambios realizados:**
1. ✅ Frontend build completado (`npm run build`)
2. ✅ `frontend/dist/` generado con todos los assets
3. ✅ Pantalla blanca resuelto - ahora muestra la UI completa

**Estado actual del dist/:**
```
frontend/dist/
├── index.html
├── assets/
│   ├── index-*.css          (74.90 kB)
│   ├── index-*.js          (324.54 kB)
│   ├── Dashboard-*.js       (51.62 kB)
│   ├── Products-*.js       (28.88 kB)
│   ├── Analytics-*.js     (441.30 kB)
│   └── [más archivos]
├── manifest.json
└── favicon.svg
```

**Archivos importantes en raíz:**
- ✅ `Dockerfile` EXISTE (sirve para build en Docker)
- ✅ `render.yaml` 配置 config Render
- ✅ `requirements.txt` dependencias Python

---

## 16. Estado Actual del Proyecto

| Componente | Estado | Notas |
|------------|--------|-------|
| Frontend build | ✅ Listo | `frontend/dist/` existe y completo |
| backend API | ✅ Listo | FastAPI con auth JWT |
| Base de datos | ⚠️ SQLite | Se resetea en Free tier |
| Scraper | ⚠️ Modo mock | Por defecto |
| Docker | ✅ Listo | Dockerfile配置 completa |
| Deploy auto | ✅ Configurado | render.yaml con SubMain branch |

### Checklist de Deployment (Actualizado 2026-04-16)

- [x] Python 3.13+ verificado
- [x] Dependencias en requirements.txt
- [x] Frontend compilado en `frontend/dist/`
- [x] FastAPI sirve static files desde `frontend/dist/`
- [x] Docker compose/configurado
- [x] Health check responde
- [ ] Variables de entorno configuradas en Render
- [ ] PostgreSQL configurado (opcional)

### Deployment Workflow

```
1. Desarrollo local:
   cd frontend && npm run build
   
2. Commit + Push:
   git add .
   git commit -m "frontend build updated"
   git push origin SubMain

3. Render (auto-deploy):
   - Detecta push a SubMain
   - Ejecuta buildCommand
   - Reinicia servicio
```

---

## 17. Conclusión

El proyecto está **listo para deployment**:

1. **Frontend**: ✅ Compilado (justo hoy) y sirve desde `frontend/dist/`
2. **Backend**: ✅ API funcional con autenticación JWT
3. **Base de datos**: ⚠️ SQLite se resetea en Free tier de Render
4. **Scraper**: ⚠️ Modo mock por defecto
5. **Docker**: ✅ Configuración presente

**Nota importante**: El build del frontend debe hacerse localmente antes de cada push, o agregar el build al Dockerfile de Render.