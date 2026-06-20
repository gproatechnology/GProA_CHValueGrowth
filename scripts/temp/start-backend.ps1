$env:DATABASE_URL = 'postgresql+asyncpg://postgres:postgres@localhost:5432/neumatiq'
$env:ENVIRONMENT = 'development'
$env:DEBUG = 'true'
Set-Location 'C:\Users\X1\OneDrive\Documentos\Python_VS Code\GProA\NeumatiQ'
& 'C:\Users\X1\OneDrive\Documentos\Python_VS Code\GProA\NeumatiQ\.venv\Scripts\python.exe' -m uvicorn neumatiq_next.main:app --host 0.0.0.0 --port 8000