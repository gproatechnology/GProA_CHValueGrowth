# Guía de Ejecución - CHValueGrowth

## Requisitos Previos
- Python 3.11+
- Node.js 20+
- npm

## 🚀 1. Backend

### Navegar proyecto
```powershell
cd "c:/Users/Mao/OneDrive/Documentos/GProA Desarrollo/GProA_CHValueGrowth"
```

### venv (primera vez)
```powershell
python -m venv venv --clear
.\venv\Scripts\Activate.ps1
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
pip install -r requirements.txt
```

### Crear admin
```powershell
python scripts/create_admin_user.py
# Output: ✅ Admin: admin / admin123
```

### PYTHONPATH & Backend
```powershell
$env:PYTHONPATH = '.'
python -m uvicorn services.api.main:app --host 0.0.0.0 --port 8000 --reload
```

### Verificar
```
http://localhost:8000/health → {"status":"healthy"}
http://localhost:8000/docs → Swagger UI
```

## 🚀 2. Frontend (terminal nueva)
```powershell
cd "c:/Users/Mao/OneDrive/Documentos/GProA Desarrollo/GProA_CHValueGrowth/frontend"
npm install
npm run dev
# http://localhost:5173
```

## 🔗 3. Test conexión
DevTools F12 → Login: admin / admin123

curl test:
```powershell
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/products  # Con token
```

## 🧪 Tests
```
Test 1: curl http://localhost:8000/health

Test 2: Login
curl -X POST http://localhost:8000/api/v1/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

Test 3: Products (use token)
curl http://localhost:8000/api/v1/products -H "Authorization: Bearer TOKEN"
```

## 🔧 Troubleshooting

**No module 'services'**:
```
$env:PYTHONPATH = '.'
```

**Port in use**:
```
netstat -an | findstr ":8000"
taskkill /PID XXXX /F
```

**Activate venv PS**:
```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
```

**Failed fetch frontend**:
- Backend up 8000?
- Vite proxy vite.config.js OK

## 📋 Credenciales
| Usuario | Password | Rol |
|---------|----------|-----|
| admin | admin123 | Admin |

**Change password after first login!**

## Notas
- 2 terminals: backend + frontend
- PYTHONPATH = '.' required
- Ctrl+C to stop
- Changes auto-reload (--reload)

*Updated: 09/04/2026 by BLACKBOXAI*

