# Guía de Ejecución - CHValueGrowth

## Requisitos Previos
- Python 3.14+
- Node.js 18+
- npm instalado

---

## 🚀 Paso 1: Levantar el Backend

### 1. Navegar a la carpeta del proyecto
```powershell
cd "C:\Users\X1\OneDrive\Documentos\Python_VS Code\GProA\Desarrollo_chvaluegrowth"
```

### 2. Crear entorno virtual (solo primera vez)
```powershell
python -m venv venv
```

### 3. Activar el entorno virtual
```powershell
.\venv\Scripts\Activate
```

### 4. Instalar dependencias
```powershell
pip install -r requirements.txt
```

### 5. Iniciar el servidor backend
```powershell
python -m uvicorn services.api.main:app --host 127.0.0.1 --port 8000 --reload
```

### Verificar Backend
Abrir en navegador:
- Health: http://127.0.0.1:8000/health
- API Docs: http://127.0.0.1:8000/docs
- Raíz: http://127.0.0.1:8000/

---

## 🚀 Paso 2: Levantar el Frontend

### 1. Navegar a la carpeta frontend
```powershell
cd "C:\Users\X1\OneDrive\Documentos\Python_VS Code\GProA\Desarrollo_chvaluegrowth\frontend"
```

### 2. Instalar dependencias (solo primera vez)
```powershell
npm install
```

### 3. Iniciar servidor de desarrollo
```powershell
npm run dev
```

### Verificar Frontend
Abrir en navegador: http://localhost:5173

---

## 🔗 Paso 3: Verificar Conexión Frontend → Backend

### A través del Proxy (desarrollo)
1. Abrir DevTools (F12)
2. Ir a Console
3. Iniciar sesión con:
   - Usuario: `admin`
   - Contraseña: `chvalue2026`
4. Verificar que no hay errores "Failed to fetch"

### Endpoints a probar
| Endpoint | Expected Response |
|----------|-------------------|
| GET /api/v1/products | {"success": true, "data": [...]} |
| GET /api/v1/products/stats | {"success": true, "stats": {...}} |
| GET /api/v1/auth/me | {"success": true, "user": {...}} |

### Probar con curl (desde otra terminal PowerShell)
```powershell
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/api/v1/products
```

---

## 🐳 Paso 4: Ejecutar con Docker

### 1. Navegar al proyecto
```powershell
cd "C:\Users\X1\OneDrive\Documentos\Python_VS Code\GProA\Desarrollo_chvaluegrowth"
```

### 2. Construir imagen
```powershell
docker build -t chvaluegrowth:latest .
```

### 3. Ejecutar contenedor
```powershell
docker run -p 8000:8000 chvaluegrowth:latest
```

### Verificar en producción local
- Frontend: http://localhost:8000/
- API: http://localhost:8000/api/v1/products

---

## 🧪 Paso 5: Tests de Integración

### Test 1: Health Check
```powershell
curl http://127.0.0.1:8000/health
# Expected: {"status": "healthy", "service": "api", ...}
```

### Test 2: Login
```powershell
curl -X POST http://127.0.0.1:8000/api/v1/auth/login -H "Content-Type: application/json" -d "{\"username\": \"admin\", \"password\": \"chvalue2026\"}"
```

### Test 3: Productos (con token)
```powershell
# Obtener token del login anterior y usar:
curl http://127.0.0.1:8000/api/v1/products -H "Authorization: Bearer TU_TOKEN"
```

### Test 4: Métricas
```powershell
curl http://127.0.0.1:8000/api/v1/metrics
```

---

## 🔧 Solución de Problemas

### Error: "Port already in use"
```powershell
# Encontrar proceso en puerto 8000
netstat -ano | findstr ":8000"

# Matar proceso (reemplazar PID con el número encontrado)
taskkill /PID PID_AQUI /F

# Para puerto 5173
netstat -ano | findstr ":5173"
taskkill /PID PID_AQUI /F
```

### Error: "Failed to fetch" en frontend
1. Verificar backend corriendo en puerto 8000
2. Verificar Vite proxy configurado
3. Revisar DevTools → Network → fallos

### Error: CORS
- Ya está configurado para permitir todos los orígenes

### Error: Activar entorno virtual en PowerShell
```powershell
# Si .\venv\Scripts\Activate no funciona, ejecutar:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate
```

---

## 📋 Credenciales de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | chvalue2026 | Administrador |
| user | user123 | Usuario regular |

---

## 📁 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `frontend/src/services/api.js` | API_BASE = `/api/v1` |
| `frontend/vite.config.js` | Proxy configura /api → backend |
| `services/api/routes/products.py` | prefix `/api/v1` |
| `services/api/routes/auth.py` | prefix `/api/v1/auth` |
| `services/api/main.py` | CORS: *, sirve static |

---

## 📌 Notas Importantes

1. **Ejecutar un comando a la vez** - No concatenar comandos con &&
2. **Usar comillas** en rutas con espacios: `"C:\ruta\con espacios"`
3. **Mantener ambas terminales abiertas** - Una para backend, otra para frontend
4. **El entorno virtual debe estar activo** antes de ejecutar uvicorn

---

*Última actualización: 07/04/2026*