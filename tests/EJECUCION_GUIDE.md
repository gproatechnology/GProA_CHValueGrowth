# Guía de Ejecución - CHValueGrowth (Local)

## Requisitos Previos
- Python 3.13+
- Node.js 18+
- npm

---

## 🎬 1. Crear Virtual Environment (una vez)

```powershell
cd "C:\Users\Mao\OneDrive\Documentos\GProA Desarrollos\GProA_CHValueGrowth"

# Crear venv
python -m venv .venv

# Activar venv
.\.venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# Verificar instalación
python --version
pip list
```

**Para activar en futuras sesiones:**
```powershell
cd "C:\Users\Mao\OneDrive\Documentos\GProA Desarrollos\GProA_CHValueGrowth"
.\.venv\Scripts\Activate.ps1
```

---

## 🚀 Modo Completo (Backend + Frontend)

### 1. Backend (Terminal 1) - Con venv

```powershell
cd "C:\Users\Mao\OneDrive\Documentos\GProA Desarrollos\GProA_CHValueGrowth"

# Activar venv (si no está activo)
.\.venv\Scripts\Activate.ps1

# Ejecutar backend
python -m uvicorn services.api.main:app --host 0.0.0.0 --port 8000 --reload
```

**NOTA:** El backend sirver automáticamente el frontend desde `frontend/dist/` cuando `RENDER=true`.

### 2. Frontend Dev (Terminal 2) - Opcional

```powershell
cd "C:\Users\Mao\OneDrive\Documentos\GProA Desarrollos\GProA_CHValueGrowth\frontend"
npm run dev
# http://localhost:5173
```

---

## 🎯 Solo Backend (con frontend integrado)

Si solo quieres probar el backend con el frontend compilado:

```powershell
cd "C:\Users\Mao\OneDrive\Documentos\GProA Desarrollos\GProA_CHValueGrowth"
# Asegúrate que existe frontend/dist/
# Если no existe, haz build:
# cd frontend && npm run build

python -m uvicorn services.api.main:app --host 0.0.0.0 --port 8000 --reload
```

Luego abre: **http://localhost:8000**

---

## 🧪 Testing Local

### Health Check
```
http://localhost:8000/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "service": "api",
  "project": "NeumatiQ",
  "version": "1.0.0",
  "dist_path": "...\\GProA_CHValueGrowth\\frontend\\dist",
  "dist_exists": true,
  "timestamp": "..."
}
```

### Login
```powershell
curl -X POST http://localhost:8000/api/v1/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

### Products (sin auth)
```
http://localhost:8000/api/v1/products
```

### Products (con auth token)
```powershell
curl http://localhost:8000/api/v1/products -H "Authorization: Bearer TU_TOKEN"
```

---

## 📋 Credenciales

| Usuario | Password | Rol |
|---------|----------|-----|
| admin | admin123 | Admin |
| user | user123 | User |

---

## 🔧 Troubleshooting

### Activar venv en PowerShell
```powershell
.\.venv\Scripts\Activate.ps1
# Si da error de ejecución:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

### Error: No module named 'services'
```powershell
$env:PYTHONPATH = "."
# Luego ejecuta el comando de nuevo
```

### Puerto 8000 en uso
```powershell
netstat -ano | findstr ":8000"
taskkill /PID XXXX /F
```

### No aparecen los assets (404)
- Verifica que `frontend/dist/` existe
- Si no: `cd frontend && npm run build`

### Error de CORS
El backend ya tiene CORS configurado para todos los orígenes.

---

## 🏗️ Build Frontend

Solo si necesitas regenerar el frontend:

```powershell
cd "C:\Users\Mao\OneDrive\Documentos\GProA Desarrollos\GProA_CHValueGrowth\frontend"
npm run build
# Output: frontend/dist/
```

---

## 🌐 Deploy a Render

El proyecto ya está configurado para Render con la rama `SubMain`.

**Web Service URL:** https://gproa-chvaluegrowth.onrender.com

**Para redeploy:** Haz push a la rama `SubMain` o usa el dashboard de Render.

---

## Notas

- 1 terminal: `python -m uvicorn services.api.main:app --port 8000 --reload`
- Frontend se sirve automáticamente desde `frontend/dist/`
- Para desarrollo con hot-reload usa las 2 terminals
- Ctrl+C para detener

*Updated: 17/04/2026 by Kilo - NeumatiQ v3.1*