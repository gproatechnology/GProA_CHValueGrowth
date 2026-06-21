param(
    [string]$Action = ""
)

$ErrorActionPreference = "Stop"

chcp 65001 > $null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$U = [char]0x00FA
$A = [char]0x00E1
$O = [char]0x00F3
$I = [char]0x00ED
$E = [char]0x00E9

$LocalDatabaseUrl = "postgresql+asyncpg://postgres:postgres@localhost:5432/neumatiq"

$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$FrontendPath = Join-Path $Root "frontend"
$Python = Join-Path $Root ".venv\Scripts\python.exe"
$ComposeFile = Join-Path $Root "infrastructure\docker\docker-compose.yml"
$EnvFile = Join-Path $Root ".env"
$StartedProcesses = @()
$EnvInitialized = $false

function Test-CommandAvailable {
    param([string]$Name)

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "No se encontr${O} el comando requerido: $Name"
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

    $runId = [guid]::NewGuid().ToString("N")
    $stdoutFile = Join-Path $env:TEMP "neumatiq-compose-$runId-stdout.txt"
    $stderrFile = Join-Path $env:TEMP "neumatiq-compose-$runId-stderr.txt"
    $escapedArguments = foreach ($argument in ,("compose") + $Arguments) {
        '"' + ($argument -replace '"', '\"') + '"'
    }
    $argumentList = $escapedArguments -join " "

    try {
        $process = Start-Process -FilePath "docker" -ArgumentList $argumentList -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile -Wait -PassThru
        $script:LastDockerComposeExitCode = $process.ExitCode

        $stdoutLines = @()
        $stderrLines = @()

        if (Test-Path $stdoutFile) {
            $stdoutLines = Get-Content -LiteralPath $stdoutFile -Raw
        }

        if (Test-Path $stderrFile) {
            $stderrLines = Get-Content -LiteralPath $stderrFile -Raw
        }

        foreach ($line in @($stdoutLines + $stderrLines)) {
            $text = $line.ToString()

            if ($text -match 'the attribute `version` is obsolete') {
                continue
            }

            if ($text.Trim().Length -gt 0) {
                Write-Output $text
            }
        }

        $global:LASTEXITCODE = $script:LastDockerComposeExitCode
    }
    finally {
        Remove-Item -LiteralPath $stdoutFile,$stderrFile -Force -ErrorAction SilentlyContinue
    }
}

function Initialize-Environment {
    if ($EnvInitialized) {
        return
    }

    Test-CommandAvailable python
    Test-CommandAvailable docker

    if (-not (docker compose version 2>&1 | Out-Null)) {
        if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
            throw "No se encontr${O} 'docker compose' ni 'docker-compose'. Verific${A} tu instalaci${O}n de Docker."
        }
    }

    Test-CommandAvailable npm

    $env:DATABASE_URL = $LocalDatabaseUrl
    $env:ENVIRONMENT = "development"
    $env:DEBUG = "true"

    if (-not (Test-Path $Python)) {
        python -m venv .venv
    }

    if (-not (Test-Path $EnvFile)) {
        $envLines = @(
            "DATABASE_URL=$LocalDatabaseUrl",
            "ENVIRONMENT=development",
            "DEBUG=true"
        )

        [System.IO.File]::WriteAllLines($EnvFile, $envLines, [System.Text.UTF8Encoding]::new($false))
    }

    $script:EnvInitialized = $true
}

function Invoke-Step {
    param(
        [string]$Title,
        [scriptblock]$Command
    )

    Write-Host "`n== $Title ==" -ForegroundColor Cyan
    & $Command

    if ($LASTEXITCODE -ne 0) {
        throw "$Title fall${O} con c${O}digo $LASTEXITCODE"
    }

    $global:LASTEXITCODE = 0
}

function Wait-DockerPostgres {
    Write-Host "`n== Esperando PostgreSQL ==" -ForegroundColor Cyan

    for ($i = 0; $i -lt 30; $i++) {
        Invoke-DockerCompose @("-f", $ComposeFile, "exec", "-T", "postgres", "pg_isready", "-U", "postgres") > $null
        if ($LASTEXITCODE -eq 0) {
            return
        }

        Start-Sleep -Seconds 2
    }

    throw "PostgreSQL no qued${O} listo a tiempo."
}

function Install-BackendDeps {
    Initialize-Environment

    Invoke-Step "Actualizar pip" {
        & $Python -m pip install --upgrade pip
    }

    Invoke-Step "Instalar dependencias del backend" {
        & $Python -m pip install -e ".[dev]"
    }
}

function Start-Postgres {
    Initialize-Environment

    Invoke-Step "Levantar PostgreSQL con Docker" {
        Invoke-DockerCompose @("-f", $ComposeFile, "up", "-d", "postgres")
    }

    Wait-DockerPostgres
}

function Invoke-DatabaseMigration {
    Initialize-Environment
    Start-Postgres

    Invoke-Step "Ejecutar migraciones" {
        & $Python -m alembic upgrade head
    }
}

function Invoke-DatabaseSeed {
    Initialize-Environment
    Start-Postgres

    Invoke-Step "Cargar datos iniciales" {
        & $Python -m neumatiq_next.bootstrap.seed_all
    }
}

function Start-Backend {
    Initialize-Environment

    if (-not (Test-PortAvailable -Port 8000)) {
        throw "El puerto 8000 ya est${A} en uso. Deten${E} el servicio que lo ocupa o us${A} la opci${O}n 9."
    }

    $process = Start-Process cmd.exe -ArgumentList "/C", "start", "`"Backend - NeumatiQ`"", "`"$Python`"", "-m", "uvicorn", "neumatiq_next.main:app", "--host", "0.0.0.0", "--port", "8000" -WorkingDirectory $Root -PassThru
    $script:StartedProcesses += $process

    Write-Host "Esperando que el backend inicie..." -ForegroundColor Yellow
    $maxWait = 15
    $waited = 0
    while ($waited -lt $maxWait) {
        Start-Sleep -Seconds 2
        $waited += 2
        if (-not (Test-PortAvailable -Port 8000)) {
            Write-Host "`nBackend inici${O} en http://localhost:8000 (${waited}s)" -ForegroundColor Green
            return
        }
        Write-Host "  Esperando... (${waited}s)" -ForegroundColor DarkGray
    }

    Write-Host "ERROR: El backend no se levant${O} en el puerto 8000 despu${E}s de ${maxWait}s." -ForegroundColor Red
    Write-Host "Verific${A} la terminal del backend para ver el error." -ForegroundColor Gray
}

function Start-Frontend {
    Initialize-Environment

    if (-not (Test-PortAvailable -Port 5173)) {
        throw "El puerto 5173 ya est${A} en uso. Deten${E} el servicio que lo ocupa o us${A} la opci${O}n 9."
    }

    $process = Start-Process cmd.exe -ArgumentList "/C", "start", "`"Frontend - NeumatiQ`"", "cmd", "/K", "set VITE_API_URL=http://localhost:8000 && cd /d `"$FrontendPath`" && npm run dev" -PassThru
    $script:StartedProcesses += $process

    Write-Host "Esperando que el frontend inicie..." -ForegroundColor Yellow
    $maxWait = 25
    $waited = 0
    while ($waited -lt $maxWait) {
        Start-Sleep -Seconds 2
        $waited += 2
        if (-not (Test-PortAvailable -Port 5173)) {
            Write-Host "`nFrontend inici${O} en http://localhost:5173 (${waited}s)" -ForegroundColor Green
            return
        }
        Write-Host "  Esperando... (${waited}s)" -ForegroundColor DarkGray
    }

    Write-Host "ERROR: El frontend no se levant${O} en el puerto 5173 despu${E}s de ${maxWait}s." -ForegroundColor Red
    Write-Host "Verific${A} la terminal del frontend para ver el error." -ForegroundColor Gray
}

function Start-All {
    Start-Postgres
    Invoke-DatabaseMigration
    Start-Backend
    Start-Frontend
}

function Stop-Postgres {
    Initialize-Environment

    Invoke-Step "Detener PostgreSQL con Docker" {
        Invoke-DockerCompose @("-f", $ComposeFile, "down")
    }
}

function Stop-StartedTerminals {
    $trackedIds = @($script:StartedProcesses | Where-Object { $_ -and -not $_.HasExited } | ForEach-Object { $_.Id })
    $script:StartedProcesses = @()

    if ($trackedIds.Count -gt 0) {
        foreach ($trackedPid in $trackedIds) {
            try {
                Stop-Process -Id $trackedPid -Force -ErrorAction SilentlyContinue
            }
            catch {}
        }

        Start-Sleep -Seconds 2
    }

    $backendStillUp = -not (Test-PortAvailable -Port 8000)
    $frontendStillUp = -not (Test-PortAvailable -Port 5173)

    if (-not $backendStillUp -and -not $frontendStillUp) {
        return
    }

    if ($trackedIds.Count -eq 0 -and -not $backendStillUp -and -not $frontendStillUp) {
        return
    }

    $scriptPid = $PID

    if ($backendStillUp) {
        $procs = netstat -ano 2>$null | Select-String ":8000.*LISTENING" | ForEach-Object {
            ($_ -split '\s+') | Select-Object -Last 1
        } | Sort-Object -Unique | ForEach-Object {
            Get-Process -Id $_ -ErrorAction SilentlyContinue | Where-Object { $_.Id -ne $scriptPid }
        }

        foreach ($proc in $procs) {
            try {
                taskkill /F /T /PID $proc.Id 2>$null
            }
            catch {}
        }
    }

    if ($frontendStillUp) {
        $procs = netstat -ano 2>$null | Select-String ":5173.*LISTENING" | ForEach-Object {
            ($_ -split '\s+') | Select-Object -Last 1
        } | Sort-Object -Unique | ForEach-Object {
            Get-Process -Id $_ -ErrorAction SilentlyContinue | Where-Object { $_.Id -ne $scriptPid }
        }

        foreach ($proc in $procs) {
            try {
                taskkill /F /T /PID $proc.Id 2>$null
            }
            catch {}
        }
    }
}

function Show-StopReport {
    param([string]$Phase)

    Write-Host "`n====================================" -ForegroundColor Magenta
    Write-Host "        Reporte $Phase detener        " -ForegroundColor Magenta
    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Docker daemon:       $(Get-DockerDaemonStatus)" -ForegroundColor White
    Write-Host "PostgreSQL container: $(Get-ContainerState)" -ForegroundColor White
    Write-Host "PostgreSQL SQL:      $(Get-PostgresStatus)" -ForegroundColor White
    Write-Host "Backend port 8000:   $(Get-PortStatus -Port 8000)" -ForegroundColor White
    Write-Host "Frontend port 5173:  $(Get-PortStatus -Port 5173)" -ForegroundColor White
    Write-Host ""
    Write-Host "Docker Compose services:" -ForegroundColor Cyan
    Get-ComposeServices
}

function Stop-AllServices {
    try {
        Show-StopReport "antes de"
    }
    catch {
        Write-Host "Error al mostrar reporte inicial: $($_.Exception.Message)" -ForegroundColor Red
    }

    try {
        Stop-StartedTerminals
    }
    catch {
        Write-Host "Error al detener terminales: $($_.Exception.Message)" -ForegroundColor Red
    }

    if (Get-Command docker -ErrorAction SilentlyContinue) {
        try {
            Set-Location $Root

            Invoke-Step "Detener servicios Docker" {
                Invoke-DockerCompose @("-f", $ComposeFile, "down")
            }
        }
        catch {
            Write-Host "Error al detener Docker: $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    Show-StopReport "después de"
}

function Get-PortStatus {
    param([int]$Port)

    try {
        $output = netstat -ano 2>$null
        $listening = $output | Select-String ":${Port}\s+.*LISTENING"
        $connection = $listening | Select-Object -First 1

        if ($connection) {
            $parts = ($connection -split '\s+') | Where-Object { $_ -match '^\d+$' }
            $processId = $parts | Select-Object -Last 1

            if ($processId) {
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue

                if ($process) {
                    return "ACTIVO - PID $processId ($($process.ProcessName))"
                }

                return "ACTIVO - PID $processId"
            }

            return "ACTIVO"
        }

        return "INACTIVO"
    }
    catch {
        return "INACTIVO"
    }
}

function Get-HttpStatusCode {
    param([string]$Url)

    try {
        $code = curl.exe --connect-timeout 5 --max-time 10 -s -o NUL -w "%{http_code}" $Url

        if ($code -match "^\d{3}$") {
            return $code
        }

        return "ERROR"
    }
    catch {
        return "ERROR: $($_.Exception.Message)"
    }
}

function Get-HttpBody {
    param([string]$Url)

    try {
        return curl.exe --connect-timeout 5 --max-time 10 -s $Url
    }
    catch {
        return "ERROR: $($_.Exception.Message)"
    }
}

function Get-DockerDaemonStatus {
    try {
        docker info > $null 2>&1
        return "ACTIVO"
    }
    catch {
        return "INACTIVO"
    }
}

function Get-ContainerState {
    try {
        $state = Invoke-DockerCompose @("inspect", "neumatiq-db", "--format", "{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{end}}")

        if ($LASTEXITCODE -eq 0) {
            return ($state | Out-String).Trim()
        }

        return "INACTIVO"
    }
    catch {
        return "INACTIVO"
    }
}

function Get-PostgresStatus {
    try {
        $output = Invoke-DockerCompose @("-f", $ComposeFile, "exec", "-T", "postgres", "pg_isready", "-U", "postgres")
        $outputText = ($output | Out-String).Trim()

        if ($LASTEXITCODE -eq 0) {
            return "ACTIVO - $outputText"
        }

        return "INACTIVO - $outputText"
    }
    catch {
        return "INACTIVO"
    }
}

function Get-ComposeServices {
    try {
        $output = Invoke-DockerCompose @("-f", $ComposeFile, "ps")

        if ($LASTEXITCODE -eq 0) {
            return $output
        }

        return "ERROR"
    }
    catch {
        return "ERROR: $($_.Exception.Message)"
    }
}

function Get-DatabaseUrlDisplay {
    if (-not $env:DATABASE_URL) {
        return "NO DEFINIDA"
    }

    return $env:DATABASE_URL -replace "postgresql\+asyncpg://([^:]+):([^@]+)@", "postgresql+asyncpg://`${1}:***@"
}

function Show-Status {
    Initialize-Environment

    Write-Host "`n====================================" -ForegroundColor Magenta
    Write-Host "        Reporte de servicios        " -ForegroundColor Magenta
    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Docker daemon:       $(Get-DockerDaemonStatus)" -ForegroundColor White
    Write-Host "PostgreSQL container: $(Get-ContainerState)" -ForegroundColor White
    Write-Host "PostgreSQL SQL:      $(Get-PostgresStatus)" -ForegroundColor White
    Write-Host "Backend port 8000:   $(Get-PortStatus -Port 8000)" -ForegroundColor White
    Write-Host "Frontend port 5173:  $(Get-PortStatus -Port 5173)" -ForegroundColor White
    Write-Host "DATABASE_URL:        $(Get-DatabaseUrlDisplay)" -ForegroundColor White
    Write-Host ""
    Write-Host "Endpoints HTTP:" -ForegroundColor Cyan
    Write-Host "Backend health:       $(Get-HttpStatusCode -Url 'http://localhost:8000/health/')" -ForegroundColor White
    Write-Host "Backend DB health:    $(Get-HttpStatusCode -Url 'http://localhost:8000/health/database')" -ForegroundColor White
    Write-Host "Backend version:      $(Get-HttpStatusCode -Url 'http://localhost:8000/version')" -ForegroundColor White
    Write-Host "Frontend root:        $(Get-HttpStatusCode -Url 'http://localhost:5173/')" -ForegroundColor White
    Write-Host ""
    Write-Host "Respuestas HTTP:" -ForegroundColor Cyan
    Write-Host "Backend health:" -ForegroundColor White
    Write-Host (Get-HttpBody -Url 'http://localhost:8000/health/') -ForegroundColor White
    Write-Host "Backend DB health:" -ForegroundColor White
    Write-Host (Get-HttpBody -Url 'http://localhost:8000/health/database') -ForegroundColor White
    Write-Host "Backend version:" -ForegroundColor White
    Write-Host (Get-HttpBody -Url 'http://localhost:8000/version') -ForegroundColor White
    Write-Host ""
    Write-Host "Docker Compose services:" -ForegroundColor Cyan
    Get-ComposeServices
    Write-Host ""
    Write-Host "V${I}nculos locales:" -ForegroundColor Cyan
    Write-Host "Backend Swagger:   http://localhost:8000/docs" -ForegroundColor White
    Write-Host "Backend Health:    http://localhost:8000/health/" -ForegroundColor White
    Write-Host "Backend DB Health: http://localhost:8000/health/database" -ForegroundColor White
    Write-Host "Backend Version:   http://localhost:8000/version" -ForegroundColor White
    Write-Host "Frontend:          http://localhost:5173" -ForegroundColor White
}

function Show-Help {
    Clear-Host

    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host "        NeumatiQ - Ayuda            " -ForegroundColor Magenta
    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Este script centraliza las tareas locales de NeumatiQ." -ForegroundColor White
    Write-Host "Crea el entorno Python si no existe, opcionalmente instala" -ForegroundColor White
    Write-Host "dependencias, levanta PostgreSQL con Docker, ejecuta" -ForegroundColor White
    Write-Host "migraciones y abre el backend y frontend en terminales" -ForegroundColor White
    Write-Host "independientes. Al salir con 0, detiene los servicios" -ForegroundColor White
    Write-Host "iniciados por este script y baja Docker Compose." -ForegroundColor White
    Write-Host ""
    Write-Host "Flujo recomendado:" -ForegroundColor Cyan
    Write-Host "1. Si es la primera vez, eleg${I} '1. Instalar dependencias'." -ForegroundColor White
    Write-Host "2. Si ya ten${E}s el .venv listo, eleg${I} directamente '7. Levantar todo'." -ForegroundColor White
    Write-Host "3. Prob${A} el backend en http://localhost:8000/docs" -ForegroundColor White
    Write-Host "4. Prob${A} el frontend en http://localhost:5173" -ForegroundColor White
    Write-Host "5. Para apagar todo sin salir, us${A} '9. Detener servicios'." -ForegroundColor White
    Write-Host "6. Para salir del script, us${A} '0. Salir'." -ForegroundColor White
    Write-Host ""
    Write-Host "Qu${E} hace cada opci${O}n:" -ForegroundColor Cyan
    Write-Host "1. Instala pip y las dependencias Python del backend." -ForegroundColor White
    Write-Host "2. Levanta solo PostgreSQL con Docker Compose." -ForegroundColor White
    Write-Host "3. Ejecuta 'alembic upgrade head' sobre la DB local." -ForegroundColor White
    Write-Host "4. Ejecuta el seed de datos iniciales." -ForegroundColor White
    Write-Host "5. Abre una terminal nueva con el backend FastAPI." -ForegroundColor White
    Write-Host "6. Abre una terminal nueva con Vite/frontend." -ForegroundColor White
    Write-Host "7. Levanta DB, migraciones, backend y frontend sin reinstalar dependencias." -ForegroundColor White
    Write-Host "8. Muestra el estado actual de los contenedores Docker." -ForegroundColor White
    Write-Host "9. Detiene backend, frontend y PostgreSQL sin salir del men${U}." -ForegroundColor White
    Write-Host "10. Vuelve a mostrar esta ayuda." -ForegroundColor White
    Write-Host "0. Detiene servicios iniciados por el script y sale." -ForegroundColor White
    Write-Host ""
}

function Show-Menu {
    Clear-Host

    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host "        NeumatiQ - Men${U} local       " -ForegroundColor Magenta
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
    Write-Host "10. Ver ayuda"
    Write-Host "0. Salir y detener servicios"
    Write-Host ""
}

if ($Action) {
    switch ($Action.ToLower()) {
        "up" { Start-All }
        "down" { Stop-AllServices }
        "start-postgres" { Start-Postgres }
        "migrate" { Invoke-DatabaseMigration }
        "seed" { Invoke-DatabaseSeed }
        "backend" { Start-Backend }
        "frontend" { Start-Frontend }
        "status" { Show-Status }
        "health" {
            Initialize-Environment
            Write-Host "`n====================================" -ForegroundColor Magenta
            Write-Host "        Health Check                " -ForegroundColor Magenta
            Write-Host "====================================" -ForegroundColor Magenta
            Write-Host ""
            Write-Host "Docker daemon:       $(Get-DockerDaemonStatus)" -ForegroundColor White
            Write-Host "PostgreSQL container: $(Get-ContainerState)" -ForegroundColor White
            Write-Host "PostgreSQL SQL:      $(Get-PostgresStatus)" -ForegroundColor White
            Write-Host "Backend health:      $(Get-HttpStatusCode -Url 'http://localhost:8000/health/')" -ForegroundColor White
            Write-Host "Backend DB health:   $(Get-HttpStatusCode -Url 'http://localhost:8000/health/database')" -ForegroundColor White
            Write-Host "Backend version:     $(Get-HttpStatusCode -Url 'http://localhost:8000/version')" -ForegroundColor White
            Write-Host "Frontend:            $(Get-HttpStatusCode -Url 'http://localhost:5173/')" -ForegroundColor White
            Write-Host ""
        }
        "help" { Show-Help }
        default {
            Write-Host "`nAcci${O}n no v${A}lida: $Action" -ForegroundColor Red
            Write-Host "Acciones disponibles: up, down, start-postgres, migrate, seed, backend, frontend, status, health, help" -ForegroundColor Yellow
            exit 1
        }
    }
    exit $global:LASTEXITCODE
}

$Choice = ""

while ($Choice -ne "0") {
    Show-Menu
    $Choice = Read-Host "Seleccion${A} una opci${O}n"

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
            "9" { Stop-AllServices }
            "10" { Show-Help }
            "0" {
                Stop-AllServices
                Write-Host "`nSalida del men${U}. Servicios detenidos." -ForegroundColor Yellow
            }
            default { Write-Host "`nOpci${O}n no v${A}lida." -ForegroundColor Red }
        }
    }
    catch {
        Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
    }

    if ($Choice -ne "0") {
        Read-Host "`nPresion${A} Enter para continuar"
    }
}
