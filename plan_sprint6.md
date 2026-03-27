# Plan Sprint 6 - Dashboard UI

## Objetivo
Desarrollar un dashboard funcional que permita visualizar productos, estadísticas y métricas en tiempo real.

## Endpoints disponibles para consumir

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/products` | GET | Listado de productos (soporta filtros brand, size, page, limit) |
| `/api/v1/products/stats` | GET | Estadísticas de precios (min, max, avg) |
| `/api/v1/metrics` | GET | Métricas del pipeline (scraped, normalized, saved, duplicates, quality_score) |
| `/api/v1/products/grouped` | GET | Productos agrupados por brand/size |

## Arquitectura del Dashboard

```
Desarrollo_chvaluegrowth/
├── services/
│   ├── api/
│   │   ├── main.py              # FastAPI app (modificar para agregar templates)
│   │   └── routes/
│   │       └── products.py      # Endpoints existentes (NO MODIFICAR)
│   └── dashboard/               # NUEVO: Componentes del dashboard
│       ├── __init__.py
│       ├── routes.py           # Rutas del dashboard
│       └── templates/           # Plantillas HTML
│           ├── base.html       # Layout base
│           ├── index.html      # Dashboard principal
│           └── components/     # Componentes reutilizables
└── static/                     # Archivos estáticos
    ├── css/
    │   └── dashboard.css       # Estilos del dashboard
    └── js/
        └── dashboard.js        # Scripts y gráficos
```

## Plan de implementación

### Fase 1: Configuración básica
1. Agregar FastAPI-Static o configurar Jinja2 en main.py
2. Crear estructura de directorios (templates, static)
3. Configurar serve de archivos estáticos

### Fase 2: Layout base
1. Crear base.html con navbar, sidebar, contenido
2. Agregar CSS responsivo (mobile-first)
3. Incluir Chart.js desde CDN (no requiere pip)

### Fase 3: Dashboard principal (index.html)
1. Header con título del proyecto
2. Tarjetas de resumen (stats principales)
3. Sección de gráficos (bar chart, pie chart)
4. Tabla de productos recientes
5. Filtros visuales (brand, size, precio)

### Fase 4: Integración con API
1. dashboard.js: Función para consumir endpoints
2. Poblar datos en tiempo real
3. Actualizar gráficos con datos reales

### Fase 5: Validación y pruebas
1. Verificar que endpoints sigan funcionando
2. Probar en desktop y móvil
3. Verificar que los filtros funcionen

## Dependencias requeridas (actuales)

No se necesitan nuevas dependencias. Usaremos:
- `fastapi` ya instalado → para Jinja2 templates
- `jinja2` → viene con FastAPI
- `chart.js` → CDN (no requiere pip)

## Tiempo estimado de implementación

- Configuración: 10%
- Layout/CSS: 30%
- Gráficos: 25%
- Integración API: 25%
- Pruebas: 10%

## Archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| services/api/main.py | Modificar: agregar Jinja2 y static files |
| services/dashboard/__init__.py | Crear |
| services/dashboard/routes.py | Crear |
| services/dashboard/templates/base.html | Crear |
| services/dashboard/templates/index.html | Crear |
| static/css/dashboard.css | Crear |
| static/js/dashboard.js | Crear |