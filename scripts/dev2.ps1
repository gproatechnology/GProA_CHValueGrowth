<#
.SYNOPSIS
    Script básico e interactivo para levantar el entorno de desarrollo de NeumatiQ.
.DESCRIPTION
    Menú con opciones esenciales: instalar dependencias, levantar DB, migrar, sembrar,
    levantar backend/frontend, ver estado simple, detener servicios y salir.
#>

$ErrorActionPreference = "Stop"
chcp 65001 > $null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$FrontendPath = Join-Path $Root "frontend"
$Python = Join-Path $Root ".venv\Scripts\python.exe"
$ComposeFile = Join-Path $Root "infrastructure\docker\docker-compose.yml"
$LocalDatabaseUrl = "postgresql+asyncpg://postgres:postgres@localhost:5432/neumatiq"

$StartedProcesses = @()

function Get-ProcessByPort {
    param([int]$Port)
    $conn = netstat -ano 2>$null | Select-String ":${Port}\s+.*LISTENING"
    if ($conn) {
        ($conn -split '\s+') | Select-Object -Last 1
    }
}

function Test-CommandAvailable {
    param([string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "No se encontro el comando: $Name"
    }
}

function Test-PortAvailable {
    param([int]$Port)
    $output = netstat -ano 2>$null
    $listening = $output | Select-String "(:${Port}\s+.*LISTENING|\[::1\]:${Port}\s+.*LISTENING)"
    return -not $listening
}

function Invoke-DockerCompose {
    param([object[]]$Arguments)
    $cmd = "docker"
    $argsList = @("compose", "-f", $ComposeFile) + $Arguments
    & $cmd $argsList
    $global:LASTEXITCODE = $LASTEXITCODE
}

function Initialize-Environment {
    if (-not (Test-Path $Python)) {
        python -m venv .venv
    }
    if (-not (Test-Path (Join-Path $Root ".env"))) {
        @("DATABASE_URL=$LocalDatabaseUrl", "ENVIRONMENT=development", "DEBUG=true") | Out-File -FilePath (Join-Path $Root ".env") -Encoding UTF8
    }
    $env:DATABASE_URL = $LocalDatabaseUrl
    $env:ENVIRONMENT = "development"
    $env:DEBUG = "true"
}

function Wait-DockerPostgres {
    Write-Host "Esperando PostgreSQL..." -ForegroundColor Yellow
    for ($i = 0; $i -lt 30; $i++) {
        Invoke-DockerCompose @("exec", "-T", "postgres", "pg_isready", "-U", "postgres") > $null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "PostgreSQL listo." -ForegroundColor Green
            return
        }
        Start-Sleep -Seconds 2
    }
    throw "PostgreSQL no respondio a tiempo."
}

function Install-BackendDeps {
    Initialize-Environment
    Write-Host "`n== Instalando dependencias ==" -ForegroundColor Cyan
    & $Python -m pip install --upgrade pip
    & $Python -m pip install -e ".[dev]"
}

function Start-Postgres {
    Initialize-Environment
    Write-Host "`n== Levantando PostgreSQL ==" -ForegroundColor Cyan
    Invoke-DockerCompose @("up", "-d", "postgres")
    Wait-DockerPostgres
}

function Invoke-DatabaseMigration {
    Initialize-Environment
    Start-Postgres
    Write-Host "`n== Ejecutando migraciones ==" -ForegroundColor Cyan
    Push-Location $Root
    & $Python -m alembic upgrade head
    Pop-Location
}

function Invoke-DatabaseSeed {
    Initialize-Environment
    Start-Postgres
    Write-Host "`n== Cargando datos iniciales ==" -ForegroundColor Cyan
    & $Python -m neumatiq_next.bootstrap.seed_all
}

function Start-Backend {
    Initialize-Environment
    if (-not (Test-PortAvailable -Port 8000)) {
        Write-Host "Puerto 8000 ocupado." -ForegroundColor Red
        return
    }
    Write-Host "`n== Levantando backend ==" -ForegroundColor Cyan
    $backendArgs = @("-m", "uvicorn", "neumatiq_next.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload")
    $process = Start-Process -FilePath $Python -ArgumentList $backendArgs -WorkingDirectory $Root -WindowStyle Normal -PassThru
    $script:StartedProcesses += $process
    Write-Host "Backend iniciado en http://localhost:8000" -ForegroundColor Green
}

function Start-Frontend {
    Initialize-Environment
    if (-not (Test-PortAvailable -Port 5173)) {
        Write-Host "Puerto 5173 ocupado." -ForegroundColor Red
        return
    }
    Write-Host "`n== Levantando frontend ==" -ForegroundColor Cyan
    $env:VITE_API_URL = "http://localhost:8000"
    $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/K", "npm.cmd", "run", "dev" -WorkingDirectory $FrontendPath -WindowStyle Normal -PassThru
    $script:StartedProcesses += $process
    Write-Host "Frontend iniciado en http://localhost:5173" -ForegroundColor Green
    Write-Host " (podria tardar 10-15s en compilar)" -ForegroundColor DarkGray
}

function Start-All {
    Write-Host "`n== Levantando TODO ==" -ForegroundColor Cyan
    Start-Postgres
    try {
        Invoke-DatabaseMigration
    }
    catch {
        Write-Host "Advertencia en migraciones: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    try {
        Invoke-DatabaseSeed
    }
    catch {
        Write-Host "Advertencia en seed: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    Start-Backend
    Start-Frontend
    Write-Host "`nTodo levantado." -ForegroundColor Green
    Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
}

function Stop-Services {
    Write-Host "`n== Deteniendo servicios ==" -ForegroundColor Cyan
    foreach ($proc in $script:StartedProcesses) {
        if ($proc -and -not $proc.HasExited) {
            try { taskkill /F /T /PID $proc.Id 2>$null } catch {}
        }
    }
    $script:StartedProcesses = @()
    $port8000 = Test-PortAvailable -Port 8000
    $port5173 = Test-PortAvailable -Port 5173
    if ($port8000) {
        $processId = Get-ProcessByPort -Port 8000
        if ($processId) {
            try { taskkill /F /T /PID $processId 2>$null } catch {}
        }
    }
    if ($port5173) {
        $processId = Get-ProcessByPort -Port 5173
        if ($processId) {
            try { taskkill /F /T /PID $processId 2>$null } catch {}
        }
    }
    Write-Host "Servicios detenidos." -ForegroundColor Green
}

function Stop-All {
    Stop-Services
    Write-Host "`n== Deteniendo Docker ==" -ForegroundColor Cyan
    Invoke-DockerCompose @("down")
    Write-Host "Docker detenido." -ForegroundColor Green
}

function Restart-Backend {
    Write-Host "`n== Reiniciando backend ==" -ForegroundColor Cyan
    $processId = Get-ProcessByPort -Port 8000
    if ($processId) {
        try { taskkill /F /T /PID $processId 2>$null } catch {}
        Start-Sleep -Seconds 2
    }
    Start-Backend
}

function Reset-Backend {
    Write-Host "`n== Reset backend ==" -ForegroundColor Cyan
    $processId = Get-ProcessByPort -Port 8000
    if ($processId) {
        try { taskkill /F /T /PID $processId 2>$null } catch {}
        Start-Sleep -Seconds 2
    }
    Get-ChildItem -Recurse -Filter "__pycache__" -Path (Join-Path $Root "neumatiq_next") -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse
    Initialize-Environment
    Write-Host "Reinstalando paquete..." -ForegroundColor Yellow
    & $Python -m pip install -e ".[dev]" --force-reinstall --no-deps
    Start-Backend
}

function Show-Status {
    Write-Host "`n== Estado de servicios ==" -ForegroundColor Cyan
    try { docker info > $null 2>&1; Write-Host "Docker: ACTIVO" -ForegroundColor Green } catch { Write-Host "Docker: INACTIVO" -ForegroundColor Red }
    $port8000 = Test-PortAvailable -Port 8000
    $port5173 = Test-PortAvailable -Port 5173
    Write-Host "Backend (8000): $(if (-not $port8000) { 'ACTIVO' } else { 'INACTIVO' })" -ForegroundColor $(if (-not $port8000) { "Green" } else { "Red" })
    Write-Host "Frontend (5173): $(if (-not $port5173) { 'ACTIVO' } else { 'INACTIVO' })" -ForegroundColor $(if (-not $port5173) { "Green" } else { "Red" })
    try {
        $state = docker inspect "neumatiq-db" --format '{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{end}}' 2>&1 | Out-String
        $state = $state.Trim()
        if ($state) { Write-Host "PostgreSQL: $state" -ForegroundColor Green } else { Write-Host "PostgreSQL: INACTIVO (contenedor no existe)" -ForegroundColor Red }
    }
    catch { Write-Host "PostgreSQL: INACTIVO (contenedor no existe)" -ForegroundColor Red }
    $trackedCount = ($script:StartedProcesses | Where-Object { $_ -and -not $_.HasExited }).Count
    Write-Host "Procesos rastreados: $trackedCount" -ForegroundColor $(if ($trackedCount -gt 0) { "Green" } else { "Gray" })
}

function Show-Help {
    Clear-Host
    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host "        NeumatiQ - Ayuda            " -ForegroundColor Magenta
    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Opciones disponibles:" -ForegroundColor Cyan
    Write-Host "1. Instalar dependencias del backend" -ForegroundColor White
    Write-Host "2. Levantar PostgreSQL" -ForegroundColor White
    Write-Host "3. Ejecutar migraciones" -ForegroundColor White
    Write-Host "4. Cargar datos iniciales" -ForegroundColor White
    Write-Host "5. Levantar backend" -ForegroundColor White
    Write-Host "6. Levantar frontend" -ForegroundColor White
    Write-Host "7. Levantar todo" -ForegroundColor White
    Write-Host "8. Ver estado de servicios" -ForegroundColor White
    Write-Host "9. Detener servicios" -ForegroundColor White
    Write-Host "10. Reiniciar backend" -ForegroundColor White
    Write-Host "11. Reset backend (limpiar cache + reinstalar)" -ForegroundColor White
    Write-Host "12. Ver esta ayuda" -ForegroundColor White
    Write-Host "0. Salir" -ForegroundColor White
    Read-Host "`nPresiona Enter para volver al menu"
}

function Show-Menu {
    Clear-Host
    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host "        NeumatiQ - Menu Basico      " -ForegroundColor Magenta
    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "1. Instalar dependencias del backend"
    Write-Host "2. Levantar PostgreSQL"
    Write-Host "3. Ejecutar migraciones"
    Write-Host "4. Cargar datos iniciales"
    Write-Host "5. Levantar backend"
    Write-Host "6. Levantar frontend"
    Write-Host "7. Levantar todo"
    Write-Host "8. Ver estado de servicios"
    Write-Host "9. Detener servicios"
    Write-Host "10. Reiniciar backend"
    Write-Host "11. Reset backend (limpiar cache + reinstalar)"
    Write-Host "12. Ver esta ayuda"
    Write-Host "0. Salir"
    Write-Host ""
}

$Choice = ""
while ($Choice -ne "0") {
    Show-Menu
    $Choice = Read-Host "Selecciona una opcion"

    try {
        switch ($Choice) {
            "1" { Install-BackendDeps }
            "2" { Start-Postgres }
            "3" { Invoke-DatabaseMigration }
            "4" { Invoke-DatabaseSeed }
            "5" { Start-Backend }
            "6" { Start-Frontend }
            "7" { Start-All }
            "8" { Show-Status }
            "9" { Stop-Services }
            "10" { Restart-Backend }
            "11" { Reset-Backend }
            "12" { Show-Help }
            "0" {
                Stop-All
                Write-Host "`nSaliendo..." -ForegroundColor Yellow
            }
            default { Write-Host "`nOpcion no valida." -ForegroundColor Red }
        }
    }
    catch {
        Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
    }

    if ($Choice -ne "0" -and $Choice -ne "12") {
        Read-Host "`nPresiona Enter para continuar"
    }
}
