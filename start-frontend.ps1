$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptDir\frontend"
npm run dev
Write-Host "Frontend running at http://localhost:5173 - Press Ctrl+C to stop"
