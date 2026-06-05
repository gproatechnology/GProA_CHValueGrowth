# Plan: Deployment a GitHub + Render

## Objetivo
Preparar el proyecto CHValueGrowth para deployment en Render.com usando contenedores Docker desde GitHub.

---

## Análisis: Requisitos para GitHub + Render

### 1. Estructura actual del proyecto
- Framework: FastAPI + Uvicorn
- Base de datos: SQLite (chvaluegrowth.db)
- Dependencias: fastapi, uvicorn, requests, beautifulsoup4, pandas, sqlalchemy, python-dotenv, jinja2

### 2. Requisitos para Render
- **Render** requiere que la aplicación exponga un puerto (variable PORT)
- Usa Python 3.x, compatible con FastAPI
- Soporta deployments desde GitHub automáticamente
- Puede usar Docker containers o "Blueprint" (render.yaml)

### 3. Opciones de deployment en Render

| Opción | Pros | Contras |
|--------|------|----------|
| **Web Service** | Más fácil, detección automática | Requiere适配 |
| **Docker** | Control total | Requiere Dockerfile |
| **Blueprint** | Configuración como código | Menos flexible |

**Recomendación**: Usar **Docker** ya que es más robusto y portable.

---

## Plan de Implementación

### Paso 1: Actualizar requirements.txt
Agregar dependencias necesarias para producción:
- `gunicorn` - Servidor de producción
- Verificar jinja2

### Paso 2: Crear Dockerfile
```dockerfile
FROM python:3.14-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "services.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Paso 3: Configurar environment para Render
- PORT (asignado por Render)
- DATABASE_URL
- MOCK_MODE

### Paso 4: Crear render.yaml
Blueprint para deployment automático desde GitHub.

### Paso 5: Actualizar .gitignore
Excluir archivos no necesarios.

### Paso 6: Actualizar README
Documentar el proceso de deployment.

---

## Archivos a crear/modificar

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `requirements.txt` | Actualizar | Agregar gunicorn, verificar dependencias |
| `Dockerfile` | Crear | Imagen Docker para producción |
| `render.yaml` | Crear | Configuración de Render Blueprint |
| `.gitignore` | Actualizar | Excluir archivos de desarrollo |
| `README.md` | Actualizar | Agregar sección de deployment |

---

## Pasos para usuario

1. Crear repositorio en GitHub (creado:https://github.com/gproatechnology/GProA_CHValueGrowth.git)
2. Subir proyecto a GitHub Pendiente
3. Conectar repositorio en Render.com Pendiente
4. Render detectará Dockerfile automáticamente Pendiente
5. La app estará disponible en la URL de Render Pendiente

---

## Tiempo estimado
- Preparación de archivos: 15-20 minutos
- Configuración en Render: 5-10 minutos
- Deployment: 2-5 minutos (automático)

---

*Plan creado: 27/03/2026*
*Modo: Architect*
*Proyecto: CHValueGrowth - GitHub + Render Deployment*