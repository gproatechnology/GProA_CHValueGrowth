# Implementation Blueprint - NeumatiQ Next

## 1. Dependency Map

| Dependencia | Versión | Propósito | Tipo |
|-------------|---------|-----------|------|
| Python | 3.11+ | Runtime del proyecto | core |
| FastAPI | latest | Framework web para APIs | core |
| SQLAlchemy 2.x | 2.x | ORM y persistencia de datos | core |
| Alembic | latest | Migraciones de base de datos | core |
| Pydantic v2 | 2.x | Validación y serialización de datos | core |
| PostgreSQL | 15+ | Base de datos relacional | core |
| Playwright | latest | Scraping de sitios dinámicos | core |
| BeautifulSoup4 | latest | Parsing de HTML estático | core |
| Redis | 7+ | Cache y cola de tareas | core |
| httpx | latest | Cliente HTTP async | core |
| tenacity | latest | Retry logic para operaciones | core |
| pytest | latest | Testing framework | dev |
| pytest-asyncio | latest | Testing async support | dev |
| SQLAlchemy-Utils | latest | Utilidades adicionales ORM | core |
| python-dotenv | latest | Gestión de variables de entorno | core |
| structlog | latest | Logging estructurado | core |
| OpenTelemetry | latest | Observabilidad y tracing | core |
| Sentry | latest | Monitoring de errores | core |
| axios | latest | Cliente HTTP para frontend | optional |
| react | 18+ | Biblioteca UI frontend | core |
| typescript | 5+ | Tipado estático frontend | core |
| vite | latest | Build tool frontend | core |
| @tanstack/react-query | latest | State management servidor | core |
| zustand | latest | State management cliente | core |

## 2. Build Order

### Fase 1: Base del proyecto
Estructura de carpetas, pyproject.toml, .env.example, configuración alembic

### Fase 2: Persistencia
Modelos SQLAlchemy, engine de base de datos, gestión de sesiones

### Fase 3: Dominio
Entidades de negocio, value objects, excepciones personalizadas

### Fase 4: API
Repositorios, casos de uso, schemas Pydantic, endpoints FastAPI, health check, version

### Fase 5: Matching Engine
Normalizador de productos, generador de fingerprints, cálculo de confidence score, resoluto de matches, entidad ProductMatch

### Fase 6: Scraping Framework
BaseScraper abstracto, Registry de scrapers, DTOs comunes, normalizador base, providers esqueleto

### Fase 7: MercadoLibre Scraper
Implementación concreta del scraper con reglas de negocio específicas

### Fase 8: Frontend
Aplicación React con TypeScript y Vite, dashboard, gestión de productos y proveedores

### Fase 9: Observabilidad
Logging estructurado, integración Sentry, health checks avanzados, métricas de performance

## 3. MVP Scope Lock

### Entra en MVP
- Scraping básico de MercadoLibre
- Normalización de productos estándar
- Matching por nombre y precio con confidence score
- API REST para consulta de productos
- Dashboard frontend con lista de productos
- Base de datos PostgreSQL con esquema inicial
- Logging estructurado básico
- Health check endpoint

### NO entra en MVP
- Scraping de múltiples fuentes adicionales
- Cache con Redis
- Retry avanzado con tenacity
- OpenTelemetry completo
- Sentry configurado
- Detección de duplicados avanzada
- Matching fuzzy con algoritmos complejos
- Export de datos
- Autenticación de usuarios
- Tests de performance
- CI/CD pipeline
- Deployment en cloud

## 4. Definition of Done

### Fase 1
- [ ] Estructura de carpetas creada según diseño
- [ ] pyproject.toml con todas las dependencias core instalables
- [ ] .env.example con variables definidas
- [ ] Alembic inicializado y detecta base de datos

### Fase 2
- [ ] Tablas creadas con migraciones Alembic
- [ ] Modelos con relaciones correctas definidas
- [ ] Datos de prueba insertables vía seed

### Fase 3
- [ ] Entidades del dominio implementadas
- [ ] Value objects con validación
- [ ] Excepciones personalizadas definidas
- [ ] Tests unitarios de entidades pasando

### Fase 4
- [ ] Repositorios implementados con CRUD
- [ ] Casos de uso con lógica de negocio
- [ ] Schemas Pydantic con validación
- [ ] Endpoints FastAPI funcionales y documentados
- [ ] Health check endpoint responde 200 OK

### Fase 5
- [ ] Normalizador limpia nombres de productos
- [ ] Fingerprint generator crea hashes únicos
- [ ] Confidence score calcula similitud
- [ ] Match resolver identifica productos duplicados
- [ ] ProductMatch entity persiste matches detectados

### Fase 6
- [ ] BaseScraper con interfaz abstracta
- [ ] Registry registra scrapers disponibles
- [ ] DTOs para datos scrapeados definidos
- [ ] Normalizador base transforma datos crudos
- [ ] Providers esqueleto listos para implementación

### Fase 7
- [ ] Scraper MercadoLibre extrae productos
- [ ] Reglas de negocio implementadas
- [ ] Manejo de errores básico
- [ ] Integración con normalizador funcionando
- [ ] Tests de scraping pasando

### Fase 8
- [ ] Dashboard muestra lista de productos
- [ ] Componentes de productos funcionales
- [ ] Componentes de proveedores implementados
- [ ] React Query integrado con API
- [ ] Zustand gestionando estado cliente

### Fase 9
- [ ] Structlog configurado y funcionando
- [ ] Sentry capturando errores en dev
- [ ] Health checks con métricas básicas
- [ ] Logging estructurado en todos los módulos

## 5. Testing Strategy

### Unit Tests
- Entidades del dominio
- Value objects
- Casos de uso
- Normalizadores
- Generadores de fingerprint

### Integration Tests
- Modelos SQLAlchemy con base de datos real
- Repositorios con persistencia
- Endpoints FastAPI con TestClient

### API Tests
- Endpoints con httpx TestClient
- Validación de schemas
- Códigos de respuesta correctos

### Scraper Tests
- Mocking de respuestas HTML
- Validación de DTOs scrapeados
- Manejo de errores

### Repository Tests
- Operaciones CRUD
- Consultas personalizadas
- Relaciones entre entidades

**Cobertura mínima objetivo: 80%**

### Herramientas
- pytest: framework principal
- pytest-asyncio: soporte async
- httpx/testclient: testing de APIs
- fixtures: datos de prueba reutilizables

## 6. Deployment Strategy

### Local Development
`ash
docker-compose up -d
`

### Docker individual
`ash
docker build -t neumatiq-backend .
docker run -p 8000:8000 neumatiq-backend
`

### Render (Backend)
- Servicio web FastAPI
- Base de datos PostgreSQL gestionada
- Variable de entorno DATABASE_URL

### Frontend estático
- Build con Vite
- Deploy en Vercel/Netlify/GitHub Pages
- Variables de entorno API_URL

### Variables de entorno por ambiente

**Development (.env.development)**
`
DATABASE_URL=postgresql://user:pass@localhost/neumatiq_dev
REDIS_URL=redis://localhost:6379
LOG_LEVEL=DEBUG
SENTRY_DSN=
`

**Production (.env.production)**
`
DATABASE_URL=
REDIS_URL=
LOG_LEVEL=INFO
SENTRY_DSN=
`

**docker-compose.yml**
`yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: neumatiq
      POSTGRES_USER: neumatiq
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://neumatiq:password@postgres/neumatiq
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://localhost:8000

volumes:
  postgres_data:
`

## 7. Risk Register

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Bloqueo por CAPTCHA | Media | Alto | Implementar rotación de user agents, delays aleatorios, detección de CAPTCHA |
| Cambios en HTML de fuentes | Alta | Alto | Tests de integración con snapshots, monitoring de scraping |
| Volatilidad de precios | Alta | Medio | Timestamp en productos, histórico de precios |
| Duplicados no detectados | Media | Medio | Algoritmo de matching configurable, revisión manual |
| Lentitud en queries sin índices | Media | Alto | Índices en columnas críticas, EXPLAIN ANALYZE en queries lentas |
| Dependencias externas caídas | Baja | Medio | Retry con backoff, cola de reintentos |
| Rate limiting en APIs | Media | Medio | Implementar rate limiting cliente, backoff exponencial |
| Cambios en estructura de datos | Baja | Alto | Versionado de schemas, migraciones controladas |

## 8. Execution Plan

| Task ID | Descripción | Dependencias | Tiempo estimado | Resultado esperado |
|---------|-------------|--------------|-----------------|-------------------|
| TASK-001 | Crear estructura de carpetas base | Ninguna | 2h | Árbol de directorios creado según diseño |
| TASK-002 | Inicializar pyproject.toml con dependencias core | TASK-001 | 1h | pip install -e . funciona correctamente |
| TASK-003 | Crear .env.example con todas las variables | TASK-001 | 0.5h | Archivo .env.example con variables definidas |
| TASK-004 | Configurar alembic con PostgreSQL | TASK-002, TASK-003 | 1h | Alembic init funciona, detecta base de datos |
| TASK-005 | Definir modelos de productos base | TASK-002 | 2h | Modelo Product con campos básicos |
| TASK-006 | Definir modelos de proveedores | TASK-002 | 1.5h | Modelo Provider con relación a productos |
| TASK-007 | Crear migración inicial de productos | TASK-004, TASK-005 | 1h | Tabla products creada en base de datos |
| TASK-008 | Crear migración inicial de proveedores | TASK-004, TASK-006 | 1h | Tabla providers creada en base de datos |
| TASK-009 | Configurar SQLAlchemy engine y sesiones | TASK-002 | 1h | get_db() funciona correctamente |
| TASK-00A | Crear value object Money para precios | TASK-001 | 1h | Clase Money con validación de moneda |
| TASK-00B | Crear value object ProductName | TASK-001 | 1h | Clase ProductName con normalización |
| TASK-00C | Definir excepciones de dominio | TASK-001 | 1h | Excepciones base definidas |
| TASK-00D | Implementar entidad Product del dominio | TASK-005, TASK-00A, TASK-00B | 1.5h | Product entity con lógica de negocio |
| TASK-00E | Implementar repositorio de productos | TASK-005, TASK-009 | 2h | ProductRepository con operaciones CRUD |
| TASK-00F | Implementar repositorio de proveedores | TASK-006, TASK-009 | 1.5h | ProviderRepository con operaciones CRUD |
| TASK-010 | Crear schema Pydantic para Product | TASK-005 | 1h | ProductSchema con validación |
| TASK-011 | Crear schema Pydantic para Provider | TASK-006 | 1h | ProviderSchema con validación |
| TASK-012 | Implementar caso de uso: Crear producto | TASK-00E, TASK-010 | 2h | use case persiste producto correctamente |
| TASK-013 | Implementar caso de uso: Listar productos | TASK-00E, TASK-010 | 1.5h | use case retorna lista paginada |
| TASK-014 | Implementar health check endpoint | TASK-007 | 0.5h | GET /health retorna status OK |
| TASK-015 | Implementar endpoint de productos | TASK-010, TASK-012, TASK-013 | 2h | CRUD de productos funcional |
| TASK-016 | Implementar endpoint de proveedores | TASK-011 | 1.5h | CRUD de proveedores funcional |
| TASK-017 | Crear normalizador base de productos | TASK-001 | 2h | Normalizador limpia texto de productos |
| TASK-018 | Implementar fingerprint generator | TASK-017 | 1.5h | Genera hash único por producto |
| TASK-019 | Implementar confidence score calculator | TASK-017, TASK-018 | 2h | Calcula similitud entre productos |
| TASK-01A | Implementar match resolver | TASK-019 | 2h | Resuelve productos duplicados |
| TASK-01B | Crear entidad ProductMatch | TASK-001 | 1h | ProductMatch persiste matches detectados |
| TASK-01C | Implementar caso de uso: Detectar matches | TASK-01A, TASK-01B | 1.5h | Detecta y persiste matches automáticamente |
| TASK-01D | Crear interfaz BaseScraper abstracta | TASK-001 | 2h | Clase abstracta con métodos scraper |
| TASK-01E | Implementar Registry de scrapers | TASK-01D | 1.5h | Registry registra y recupera scrapers |
| TASK-01F | Definir DTOs para scraping | TASK-001 | 1h | DTOs con datos crudos de scraping |
| TASK-020 | Crear normalizador base para scrapers | TASK-01D, TASK-01F | 1.5h | Normaliza datos scrapeados a dominio |
| TASK-021 | Implementar proveedor base vacío | TASK-01D | 0.5h | Provider base registrado en Registry |
| TASK-022 | Implementar scraper MercadoLibre | TASK-01D, TASK-01F | 4h | Scraper MercadoLibre funcional |
| TASK-023 | Añadir reglas de negocio MercadoLibre | TASK-022 | 2h | Parsing de precios, nombres, imágenes |
| TASK-024 | Manejar errores en scraper MercadoLibre | TASK-022 | 1.5h | Captura y log de errores de scraping |
| TASK-025 | Integrar scraper con matching engine | TASK-022, TASK-01C | 2h | Scraping dispara detección de matches |
| TASK-026 | Configurar proyecto frontend con Vite | TASK-001 | 1h | Proyecto React+TS funcionando |
| TASK-027 | Instalar dependencias frontend | TASK-026 | 0.5h | @tanstack/react-query y zustand instalados |
| TASK-028 | Crear layout principal de la app | TASK-026 | 1.5h | Layout responsive con navegación |
| TASK-029 | Implementar endpoint de versión API | TASK-007 | 0.5h | GET /version retorna versión |
| TASK-02A | Implementar store de productos con Zustand | TASK-027 | 1h | Store gestiona estado productos |
| TASK-02B | Crear componente ProductCard | TASK-028 | 1h | Muestra producto individual |
| TASK-02C | Implementar lista de productos en frontend | TASK-02A, TASK-02B | 2h | Página productos funcional |
| TASK-02D | Integrar React Query con API backend | TASK-02C, TASK-013 | 1.5h | Consultas API funcionales |
| TASK-02E | Crear componente filtro de productos | TASK-02C | 1.5h | Filtros por nombre/precio |
| TASK-02F | Implementar store de proveedores | TASK-027 | 1h | Store gestiona estado proveedores |
| TASK-030 | Crear página de proveedores | TASK-02F, TASK-028 | 1.5h | Lista de proveedores funcional |
| TASK-031 | Configurar structlog en backend | TASK-002 | 1h | Logging estructurado funcional |
| TASK-032 | Añadir middleware de logging FastAPI | TASK-031, TASK-014 | 1h | Logs de requests HTTP |
| TASK-033 | Configurar Sentry en backend | TASK-002 | 1.5h | Sentry captura errores en dev |
| TASK-034 | Añadir health checks avanzados | TASK-014 | 1h | Health check verifica DB y servicios |
| TASK-035 | Crear script de seeding de datos | TASK-007, TASK-008 | 1h | Seed crea datos de prueba |
| TASK-036 | Escribir tests unitarios de dominio | TASK-00C, TASK-00D | 2h | Tests entidades pasando |
| TASK-037 | Escribir tests de repositorios | TASK-00E, TASK-00F | 2h | Tests CRUD pasando |
| TASK-038 | Escribir tests de APIs | TASK-013, TASK-014 | 2h | Tests endpoints pasando |
| TASK-039 | Escribir tests de scrapers | TASK-022 | 2h | Tests scraping pasando |
| TASK-03A | Configurar coverage mínimo 80% | TASK-036, TASK-037, TASK-038, TASK-039 | 1h | pytest-cov configurado |

**Total estimado: ~55 horas de desarrollo**
