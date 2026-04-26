$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
# Cambiar a la raíz del proyecto (padre de tools/)
Set-Location (Join-Path $scriptDir "..")
$env:PYTHONPATH = "."
& "$scriptDir\venv\Scripts\python.exe" -m uvicorn services.api.main:app --host 0.0.0.0 --port 8000 --reload
Write-Host "Backend running at http://localhost:8000 - Press Ctrl+C to stop"