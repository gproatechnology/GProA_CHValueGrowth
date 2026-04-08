$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir
& "$scriptDir\venv\Scripts\python.exe" -m uvicorn services.api.main:app --host 0.0.0.0 --port 8000
Write-Host "Backend running at http://localhost:8000 - Press Ctrl+C to stop"