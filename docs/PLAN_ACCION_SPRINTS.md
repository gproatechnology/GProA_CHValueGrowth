# 🎯 PLAN DE ACCIÓN DETALLADO - NeumatiQ
**Proyecto:** CHValueGrowth - Sistema de Inteligencia de Mercado  
**Creado:** 26/04/2026  
**Estado actual:** Integración frontend-backend NO lograda  
**Objetivo:** Producción listo en 2-3 semanas  
**Metodología:** Sprints 2-week (ajustables a 1-week si urgencia)

---

## 📊 RESUMEN EJECUTIVO

### Problemas Críticos Identificados:

| # | Problema | Impacto | Prioridad | Estimación |
|---|----------|---------|-----------|------------|
| 1 | **Frontend NO consume API** (datos MOCK) | 🔴 Bloquea producción | P0 | 2-3 días |
| 2 | **Usuarios en MOCK_USERS** (no BD) | 🔴 Auth no funciona real | P0 | 2-3 días |
| 3 | **Scraping MercadoLibre sin API oficial** | 🟡 Riesgo legal | P1 | 1-7 días |
| 4 | **Sin tests unitarios** (0% cobertura) | 🟡 Calidad | P2 | 3-5 días |
| 5 | **Sin migraciones (Alembic)** | 🟡 DB changes imposibles | P2 | 1 día |
| 6 | **Sin índices en BD** | 🟢 Performance | P3 | 2 horas |

### 🎯 Objetivo del Sprint 0:
**Integración completa frontend ↔ backend + usuarios reales en BD**

---

## 📅 SPRINT 0: INTEGRACIÓN CRÍTICA (5-7 días hábiles)

### Día 1-2: Frontend consume API real

**Tarea P0-1: Products.jsx - Reemplazar MOCK data por API**
- **Archivo:** `frontend/src/pages/Products.jsx`
- **Líneas afectadas:** 320-350 (useEffect)
- **Cambio:**
  ```javascript
  // ANTES (líneas 333-339):
  useEffect(() => {
      const data = generateProductsData();  // ❌ MOCK
      setProductsData(data);
      setFilteredProducts(data);
  }, []);

  // DESPUÉS:
  useEffect(() => {
      const fetchProducts = async () => {
          try {
              const response = await getProducts({ limit: 100 });
              setProductsData(response.data);
              setFilteredProducts(response.data);
              setLastUpdate(new Date());
          } catch (error) {
              console.error('Error loading products:', error);
              toast.error('Error cargando productos');
          }
      };
      fetchProducts();
  }, []);
  ```
- **Validación:** Products page muestra datos reales de BD
- **Testing manual:** `npm run dev` → Products → ver tabla con datos

**Tarea P0-2: Dashboard.jsx - Usar endpoints reales**
- **Archivo:** `frontend/src/pages/Dashboard.jsx`
- **Cambios:**
  1. Eliminar `const BRANDS = [...]` (líneas 42-46)
  2. Eliminar `const TIRE_SIZES_BY_RIM = {...}` (líneas 50-56)
  3. Agregar estado para stats:
  ```javascript
  const [stats, setStats] = useState({ brands: [], sizes: [], total: 0 });
  ```
  4. useEffect para cargar:
  ```javascript
  useEffect(() => {
      const loadStats = async () => {
          const statsData = await getProductStats();
          const grouped = await getGroupedProducts({ group_by: 'brand' });
          setStats({
              brands: grouped.data,
              sizes: [], // TODO: getGroupedProducts('size')
              total: statsData.total_products
          });
      };
      loadStats();
  }, []);
  ```
  5. Reemplazar hardcoded numbers en KPI cards con `stats.total`, etc.

**Tarea P0-3: App.jsx Login - Flujo real**
- **Archivo:** `frontend/src/App.jsx`
- **Líneas:** 196-266 (Login component)
- **Cambio completo:**
  ```javascript
  // Importar api
  import { login } from './services/api';

  // Reemplazar handleSubmit:
  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      try {
          const response = await login(username, password);
          // Guardar token en localStorage (o sessionStorage)
          localStorage.setItem('chvalue_token', response.token);
          localStorage.setItem('chvalue_user', JSON.stringify(response.user));
          // Redirigir
          window.location.href = '/';
      } catch (error) {
          setError(error.message || 'Usuario o contraseña incorrectos');
      } finally {
          setLoading(false);
      }
  };
  ```
- **Eliminar:** `setTimeout` fake (líneas 203-207)
- **Validación:** Login real con credenciales `admin/admin123`

**Tarea P0-4: Proteger rutas con auth real**
- **Archivo:** `frontend/src/App.jsx`
- **Línea 121-123**:
  ```javascript
  // ANTES:
  if (!isAuthenticated) { return <Navigate to="/login" replace />; }
  
  // DESPUÉS:
  useEffect(() => {
      const token = localStorage.getItem('chvalue_token');
      const user = localStorage.getItem('chvalue_user');
      if (!token) {
          setIsAuthenticated(false);
          window.location.href = '/login';
      } else {
          setIsAuthenticated(true);
          // TODO: Verificar token con /auth/me
      }
  }, []);
  ```

---

### Día 3-4: Backend soporte para usuarios en BD

**Tarea P0-5: Crear modelo User en BD**
- **Archivo:** `database/models.py`
- **Agregar:**
  ```python
  from passlib.hash import bcrypt  # Ya instalado
  
  class User(Base):
      __tablename__ = 'users'
      
      id = Column(Integer, primary_key=True, autoincrement=True)
      username = Column(String(50), unique=True, nullable=False)
      email = Column(String(100), unique=True, nullable=True)
      password_hash = Column(String(200), nullable=False)
      full_name = Column(String(100), nullable=True)
      role = Column(String(20), nullable=False, default='user')  # admin, user, manager
      is_active = Column(Boolean, default=True, nullable=False)
      is_verified = Column(Boolean, default=False, nullable=False)
      created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
      updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
      last_login = Column(DateTime, nullable=True)
      
      __table_args__ = (
          CheckConstraint("role IN ('admin', 'user', 'manager')", name='ck_user_role'),
      )
      
      def set_password(self, password: str):
          self.password_hash = bcrypt.hash(password.encode()).decode()
      
      def verify_password(self, password: str) -> bool:
          return bcrypt.verify(password.encode(), self.password_hash.encode())
  
      def to_dict(self):
          return {
              'id': self.id,
              'username': self.username,
              'email': self.email,
              'full_name': self.full_name,
              'role': self.role,
              'is_active': self.is_active,
              'created_at': self.created_at.isoformat() + 'Z' if self.created_at else None,
              'last_login': self.last_login.isoformat() + 'Z' if self.last_login else None,
          }
  ```
- **Actualizar `init_db()`** para crear users table

**Tarea P0-6: Crear UserRepository**
- **Archivo:** `database/repository.py` (agregar al final)
- **Implementar:**
  ```python
  class UserRepository:
      def __init__(self):
          self.session = None
      
      def _get_session(self):
          if self.session is None:
              self.session = get_session()
          return self.session
      
      def get_by_username(self, username: str) -> Optional[User]:
          return self._get_session().query(User).filter(User.username == username).first()
      
      def get_by_email(self, email: str) -> Optional[User]:
          return self._get_session().query(User).filter(User.email == email).first()
      
      def get_all(self) -> List[User]:
          return self._get_session().query(User).all()
      
      def create_user(self, username: str, password: str, email: str = None, role: str = 'user') -> User:
          user = User(
              username=username,
              email=email,
              role=role,
              full_name=username.title()
          )
          user.set_password(password)
          self._get_session().add(user)
          self._get_session().commit()
          self._get_session().refresh(user)
          return user
      
      def update_last_login(self, username: str):
          user = self.get_by_username(username)
          if user:
              user.last_login = datetime.utcnow()
              self._get_session().commit()
      
      def close(self):
          if self.session:
              self.session.close()
              self.session = None
  ```

**Tarea P0-7: Migrar auth.py a BD (no MOCK_USERS)**
- **Archivo:** `services/api/routes/auth.py`
- **Cambios:**
  1. Importar `UserRepository`
  2. Reemplazar `MOCK_USERS` dict por consulta BD:
  ```python
  def authenticate_user(username: str, password: str) -> Optional[Dict]:
      repo = UserRepository()
      user = repo.get_by_username(username)
      repo.close()
      
      if not user or not user.is_active:
          return None
      
      if user.verify_password(password):
          repo.update_last_login(username)
          return user.to_dict()
      return None
  ```
  3. En `/me` endpoint (líneas 370-403):
  ```python
  @router.get("/me")
  async def get_current_user_info(username: str = Depends(get_current_user)):
      repo = UserRepository()
      user = repo.get_by_username(username)
      repo.close()
      if not user:
          raise HTTPException(404, "Usuario no encontrado")
      return {"success": True, "user": user.to_dict()}
  ```
  4. En `/users` admin endpoint:
  ```python
  @router.get("/users", dependencies=[Depends(require_role("admin"))])
  async def list_users():
      repo = UserRepository()
      users = repo.get_all()
      repo.close()
      return {"success": True, "users": [u.to_dict() for u in users], "total": len(users)}
  ```
- **Eliminar:** Todo `MOCK_USERS` dictionary (líneas 63-82)

**Tarea P0-8: Script crear admin user inicial**
- **Archivo:** `scripts/create_admin_user.py` (ya existe)
- **Verificar** que funcione con nuevo `User` model:
  ```bash
  python scripts/create_admin_user.py
  # Debe crear usuario admin con password admin123
  ```

---

### Día 5-6: Scraper legalización & Fase 1 testing

**Tarea P1-1: Evaluar legalidad scraping (ETH-01)**
- **Opciones:**
  1. **API oficial MercadoLibre** (recomendado)
     - Registrarse en ML Developer Program
     - Implementar OAuth2 + rate limits oficiales
     - Costo: Gratis hasta X requests/día
  2. **Disclaimer legal** ( temporal)
     - Agregar en README y API responses:
     ```python
     @app.get("/products")
     def get_products(...):
         return {
             "success": True,
             "disclaimer": "Datos de carácter informativo, no constituyen oferta de venta. Verifique con proveedores.",
             "data": [...]
         }
     ```
  3. **Fuentes alternativas**:
     - Scraping de sitios públicos con permiso
     - API de distribuidores (si tienen)

- **Decisión requerida de CH ValueGrowth:**
  - ¿Presupuesto para API oficial ML?
  - ¿Aceptar riesgo legal temporal?

**Tarea P1-2: Tests unitarios básicos**
- **Instalar pytest:**
  ```bash
  venv\Scripts\python.exe -m pip install pytest pytest-cov
  ```
- **Crear `tests/test_products.py`**:
  ```python
  from database.repository import ProductRepository
  from database.models import Product
  
  def test_create_product():
      repo = ProductRepository()
      product = repo.create_product({
          'title': 'Llanta Test 205/55R16',
          'brand': 'Michelin',
          'size': '205/55R16',
          'price': 2500.0,
          'source': 'test',
          'url': 'http://test.com'
      })
      assert product is not None
      assert product.id > 0
      repo.close()
  
  def test_get_products_pagination():
      repo = ProductRepository()
      products = repo.get_all(limit=10)
      assert len(products) <= 10
      repo.close()
  ```
- **Crear `tests/test_auth.py`**:
  ```python
  from services.api.routes.auth import authenticate_user
  
  def test_authenticate_admin():
      user = authenticate_user('admin', 'admin123')
      assert user is not None
      assert user['role'] == 'admin'
  
  def test_authenticate_wrong_password():
      user = authenticate_user('admin', 'wrongpass')
      assert user is None
  ```
- **Ejecutar:**
  ```bash
  pytest tests/ -v --cov=services --cov=database
  ```

**Tarea P1-3: Verificar FASE 1 (Conectividad)**
- **Checklist:**
  - [x] Backend inicia sin errores
  - [x] `/health` responde JSON
  - [x] `/api/v1/products` retorna lista
  - [x] CORS permite todos orígenes (dev)
  - [x] Frontend build ok (`npm run build`)
  - [ ] API responde en < 200ms (medir)
  - [ ] BD SQLite creada en `data/chvaluegrowth.db`

---

### Día 7: Sprint Review & Deployment prep

**Tarea P2-1: Commit y push a GitHub**
```bash
git add .
git commit -m "Sprint 0: Integración frontend-backend funcional

- Products.jsx: consume getProducts() API
- Dashboard.jsx: usa stats y grouped endpoints
- App.jsx: Login real con autenticación JWT
- User model + UserRepository en BD
- auth.py: migrado de MOCK_USERS a base de datos
- Tests unitarios básicos (pytest)
- Actualizado README con nueva arquitectura

Closes #1, #2, #3"
git push origin main
```

**Tarea P2-2: Actualizar documentación**
- Actualizar `README.md`:
  - Sección "Arquitectura" agregar diagrama actualizado
  - "Instalación" incluir `python scripts/create_admin_user.py`
  - "API Endpoints" con ejemplos JSON reales
- Actualizar `FAQ.md`:
  - Sección 7 (Autenticación): explicar BD users
  - Sección 4 (API): agregar ejemplos responses

**Tarea P2-3: Deployment a Render (staging)**
1. Verificar `render.yaml` tenga:
   ```yaml
   envVars:
     - key: MOCK_MODE
       value: "false"  # Producción con datos reales
   ```
2. Trigger deploy en Render (auto on push)
3. Verificar logs:
   - API inicia correctamente
   - DB connection OK
   - No hay errores de importación

**Tarea P2-4: Validación producción**
- [ ] `https://chvaluegrowth-api.onrender.com/health` → healthy
- [ ] `https://chvaluegrowth-api.onrender.com/api/v1/products` → JSON
- [ ] Frontend en Render carga y muestra productos reales
- [ ] Login con admin/admin123 funciona
- [ ] Token JWT se guarda y envía en headers

---

## 📋 SPRINT 1: PRODUCTION HARDENING (2 semanas)

### Objetivo: Sistema listo para producción real

**Tarea P1-1: Alembic migraciones**
- Instalar: `pip install alembic`
- Inicializar: `alembic init alembic`
- Configurar `alembic.ini` con DATABASE_URL
- Generar migración inicial:
  ```bash
  alembic revision --autogenerate -m "Initial tables: products, users"
  ```
- Aplicar: `alembic upgrade head`
- **Commit:** migrations/ folder

**Tarea P1-2: Índices de base de datos**
- **Archivo:** Crear migración Alembic separada
- **SQL:**
  ```sql
  CREATE INDEX idx_product_brand ON products(brand);
  CREATE INDEX idx_product_size ON products(size);
  CREATE INDEX idx_product_scraped_at ON products(scraped_at DESC);
  CREATE INDEX idx_user_username ON users(username);
  CREATE INDEX idx_user_email ON users(email);
  ```
- **Validación:** `EXPLAIN ANALYZE` queries lentas (< 100ms)

**Tarea P1-3: Redis para rate limiting**
- **Render:** Agregar servicio Redis ($7/mes)
- **Actualizar `render.yaml`:**
  ```yaml
  - type: redis
    name: chvaluegrowth-cache
    plan: free
  ```
- **Código:** `services/api/routes/auth.py` ya tiene soporte
  - Solo requiere `REDIS_URL` en env vars
- **Probar:** Intentar 6 logins consecutivos → 429 response

**Tarea P1-4: Monitoreo (Sentry)**
- Crear cuenta Sentry (gratis tier)
- Agregar SDK:
  ```python
  # services/api/main.py
  import sentry_sdk
  sentry_sdk.init(
      dsn=os.environ.get("SENTRY_DSN"),
      traces_sample_rate=1.0
  )
  ```
- Configurar alertas:
  - Errors > 5/min
  - Response time > 2s

**Tarea P1-5: Logging estructurado**
- Implementar `structlog` o `python-json-logger`
- Cambiar de `print()`/`logging` a JSON logs:
  ```python
  import structlog
  logger = structlog.get_logger()
  logger.info("login_attempt", username=user, ip=request.client.host)
  ```
- Enviar logs a servicio (Loggly/Datadog/Sentry)

**Tarea P1-6: HTTPS & CORS estricto**
- **Producción `main.py`:**
  ```python
  # Development
  if ENVIRONMENT == 'development':
      allow_origins = ["*"]
  else:
      allow_origins = [
          "https://chvaluegrowth.com",
          "https://www.chvaluegrowth.com",
          "https://app.chvaluegrowth.com"
      ]
  ```
- **Redirect HTTP → HTTPS** (middleware)

**Tarea P1-7: Tests de integración**
- `tests/test_integration.py`:
  ```python
  from fastapi.testclient import TestClient
  from services.api.main import app
  
  client = TestClient(app)
  
  def test_login_and_access_protected():
      # 1. Login
      response = client.post("/api/v1/auth/login", json={
          "username": "admin",
          "password": "admin123"
      })
      assert response.status_code == 200
      token = response.json()["token"]
      
      # 2. Access protected endpoint
      response = client.get(
          "/api/v1/products",
          headers={"Authorization": f"Bearer {token}"}
      )
      assert response.status_code == 200
      assert "data" in response.json()
  ```

**Tarea P1-8: Backup automático DB**
- Script `scripts/backup_database.py` ya existe? Verificar.
- Si no, crear:
  ```python
  import shutil
  from datetime import datetime
  shutil.copy('data/chvaluegrowth.db', f'backups/db_{datetime.now().strftime("%Y%m%d_%H%M%S")}.db')
  ```
- Agregar a cronjob Render (ya está en `render.yaml` línea 252-254)

---

## 📅 SPRINT 2: ESCALABILIDAD & FEATURES (2 semanas)

**Tarea P2-1: Scraper mejorado**
- Implementar API oficial MercadoLibre (si se consigue)
- OImplementar proxy rotation (si scraping continúa)
- Agregar `User-Agent` pool más grande
- Implementar `Exponential Backoff` en fallos
- Dashboard de scraper status (endpoint `/metrics` ya existe)

**Tarea P2-2: Caché de consultas frecuentes**
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_cached_stats(brand: str = None):
    # Cache de stats por 5 min
    pass
```

**Tarea P2-3: Export de datos**
- CSV export: `/api/v1/export/products?format=csv`
- Excel: `pandas.DataFrame.to_excel()`
- PDF report: `reportlab` library

**Tarea P2-4: Filtros avanzados en frontend**
- Rango de precios (slider)
- Múltiples marcas (checkboxes)
- Fecha de scraping (date picker)
- Ordenamiento por columnas

**Tarea P2-5: PWA (Progressive Web App)**
- `frontend/public/manifest.json` (ya existe)
- Service Worker para offline
- Install en homescreen
- Notificaciones push (opcional)

---

## 🚀 SPRINT 3: PRODUCTION LAUNCH (1 semana)

**Tarea P3-1: Load testing**
```bash
# Instalar locust
pip install locust

# Crear tests/load_test.py
from locust import HttpUser, task, between

class NeumatiQUser(HttpUser):
    wait_time = between(1, 3)
    
    @task(3)
    def get_products(self):
        self.client.get("/api/v1/products?limit=20")
    
    @task(1)
    def get_stats(self):
        self.client.get("/api/v1/products/stats")
```
- Ejecutar: `locust -f tests/load_test.py --host http://localhost:8000`
- Objetivo: 100 concurrent users, < 1s response time

**Tarea P3-2: Security audit básico**
- Herramientas:
  - OWASP ZAP (gratis) - scan spider
  - `bandit` para Python security:
    ```bash
    pip install bandit
    bandit -r services/ -f json -o security_report.json
    ```
- Fixes comunes:
  - [ ] No hardcoded secrets (JWT_SECRET)
  - [ ] SQL injection? (SQLAlchemy OK)
  - [ ] XSS? Frontend sanitiza inputs?

**Tarea P3-3: Performance optimizations**
- Frontend:
  - [ ] Code splitting (ya tiene lazy loading)
  - [ ] Image optimization (WebP, lazy load)
  - [ ] Bundle analyzer: `vite-bundle-visualizer`
- Backend:
  - [ ] Response compression (Gzip middleware)
  - [ ] DB connection pooling (ya tiene pool)
  - [ ] Cache headers en static files

**Tarea P3-4: Comienza monitoreo 24/7**
- [ ] UptimeRobot (gratis) - ping cada 5 min
- [ ] Sentry errores en tiempo real
- [ ] Google Analytics (opcional)

**Tarea P3-5: Go-live**
- [ ] Migrar datos de staging a producción
- [ ] DNS: api.chvaluegrowth.com → Render
- [ ] HTTPS SSL certificate (Render auto-provisiona)
- [ ] Anunciar a usuarios beta
- [ ] Documentación final para CH ValueGrowth

---

## 📊 MÉTRICAS DE ÉXITO (KPIs)

### Métricas Técnicas:

| Métrica | Target | Actual | Deadline |
|---------|--------|--------|----------|
| Frontend consume API | 100% páginas | 0% | Sprint 0 |
| Usuarios en BD (no MOCK) | 100% | 0% | Sprint 0 |
| Test coverage | > 60% | 0% | Sprint 1 |
| Response time API (p50) | < 200ms | N/A | Sprint 1 |
| Uptime | > 99.5% | N/A | Sprint 3 |
| Error rate | < 0.1% | N/A | Sprint 3 |

### Métricas de Negocio:

| Métrica | Target | Medición |
|---------|--------|----------|
| Productos en BD | > 1000 | Scraper daily |
| Usuarios activos | > 10 | Auth logs |
| API calls/day | > 1000 | Render metrics |
| Página carga | < 2s | Lighthouse |

---

## 🎯 CHECKLIST PRE-PRODUCTION (URGENTE)

### 🔴 Antes de Sprint 0 completion:
- [ ] Products.jsx usa `getProducts()` ✅
- [ ] Dashboard usa endpoints reales ✅
- [ ] Login con credenciales reales ✅
- [ ] Token guardado en localStorage/sessionStorage ✅
- [ ] Rutas protegidas por auth ✅

### 🟡 Antes de Sprint 1:
- [ ] Modelo `User` creado en BD
- [ ] `auth.py` sin MOCK_USERS
- [ ] Script `create_admin_user.py` funciona
- [ ] Tests basicos (pytest) pasan
- [ ] Alembic migraciones funcionan
- [ ] Índices SQL agregados
- [ ] Redis configurado en Render
- [ ] HTTPS enforced en producción
- [ ] CORS restringido a dominios propios

### 🟢 Antes de Sprint 3 (Go-live):
- [ ] Load testing OK (100 concurrent)
- [ ] Security audit sin críticos
- [ ] Sentry monitoreo activo
- [ ] Backup automático diario
- [ ] Documentación completa (README + FAQ)
- [ ] Equipo CH ValueGrowth capacitado
- [ ] SLA agreement firmado
- [ ] Pago Render ($21/mes) activado

---

## 💰 RECURSOS NECESARIOS

### Tiempo:
- **Sprint 0 (Integración):** 5-7 días hábiles
- **Sprint 1 (Hardening):** 10 días hábiles
- **Sprint 2 (Features):** 10 días hábiles
- **Sprint 3 (Launch):** 5 días hábiles
- **Total:** 30-35 días (4-5 semanas)

### Costo mensual (producción):
| Servicio | Costo | Nota |
|----------|-------|------|
| Render Web (API) | $7 | Starter plan (impide hibernación) |
| Render PostgreSQL | $7 | 1GB, backup automático |
| Render Redis | $7 | Rate limiting + cache |
| Sentry | $0-29 | Free tier suficiente para empezar |
| **Total** | **$21-26/mes** | Mínimo viable |

### Recursos humanos:
- 1 Backend developer (Python/FastAPI) - 100% tiempo
- 1 Frontend developer (React/Vite) - 50% tiempo
- 1 DevOps (Render deployment) - 20% tiempo

---

## 🚨 RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Frontend no se integra** | Media | Alto | Pair programming, code review diario |
| **Usuarios BD migration falla** | Baja | Alto | Backup BD, rollback plan |
| **Scraper bloqueado por ML** | Alta | Medio | API oficial + proxies + retardos |
| **Render free hiberna** | Alta | Medio | Upgrade a paid plan |
| **JWT_SEC filtrado** | Baja | Crítico | Rotate secret, invalidar tokens |
| **Data loss en migration** | Baja | Alto | Backup antes de迁移, Alembic |
| **Performance DB lenta** | Media | Medio | Índices + PostgreSQL + query optimization |

---

## 📞 CONTACTOS DE EMERGENCIA

**Si algo falla en producción:**
1. Revisar logs Render: `render.com > logs`
2. Rollback a versión anterior: `git revert <commit>`
3. Disable scraper: `MOCK_MODE=true` en env vars
4. Contactar soporte Render (24/7 para planes pagos)

---

## ✅ SEGUIMIENTO

**Daily Standup (15 min):**
- ¿Qué hiciste ayer?
- ¿Qué harás hoy?
- ¿Bloqueos?

**Sprint Review (1 hr cada viernes):**
- Demo funcional a CH ValueGrowth
- Feedback inmediato

**Retrospective (último día sprint):**
- ¿Qué salió bien?
- ¿Qué mejorar?
- Acciones next sprint

---

*Plan creado el 26/04/2026*  
*Basado en auditoría técnica detallada*  
*Próxima revisión: 03/05/2026*
