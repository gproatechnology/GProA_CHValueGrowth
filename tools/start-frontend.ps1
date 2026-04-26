$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
# Cambiar a la raíz del proyecto (padre de tools/)
Set-Location (Join-Path $scriptDir "..")
# Ejecutar frontend desde su carpeta
Set-Location "frontend"
npm run dev
Write-Host "Frontend running at http://localhost:5173 - Press Ctrl+C to stop"
