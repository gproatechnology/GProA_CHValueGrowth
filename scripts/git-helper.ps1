param(
    [string]$Quick = "",
    [switch]$Push
)

$ErrorActionPreference = "Stop"

chcp 65001 > $null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$U = [char]0x00FA
$A = [char]0x00E1
$O = [char]0x00F3
$I = [char]0x00ED
$E = [char]0x00E9

$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

function Get-BranchName {
    $branch = git branch --show-current 2>$null
    if (-not $branch) {
        $branch = git rev-parse --abbrev-ref HEAD 2>$null
    }
    return $branch
}

function Get-StagedCount {
    $output = git diff --staged --stat 2>$null
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($output)) {
        return 0
    }
    return ($output | Measure-Object -Line).Lines
}

function Get-UnstagedCount {
    $output = git status --porcelain 2>$null
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($output)) {
        return 0
    }
    $unstaged = $output | Where-Object { $_ -match '^.[MD]?' }
    return ($unstaged | Measure-Object).Count
}

function Show-Status {
    Write-Host "`n== Git Status ==" -ForegroundColor Cyan
    git status
    Write-Host ""
    $branch = Get-BranchName
    $staged = Get-StagedCount
    $unstaged = Get-UnstagedCount
    Write-Host "Branch: $branch | Staged: $staged | Unstaged: $unstaged" -ForegroundColor White
}

function Show-Diff {
    Write-Host "`n== Git Diff ==" -ForegroundColor Cyan
    git diff
}

function Show-DiffStaged {
    Write-Host "`n== Git Diff --staged ==" -ForegroundColor Cyan
    git diff --staged
}

function Add-Files {
    Write-Host "`n== Agregar archivos ==" -ForegroundColor Cyan
    Write-Host "1. Agregar todo (.)" -ForegroundColor White
    Write-Host "2. Agregar archivos espec${I}ficos" -ForegroundColor White
    $choice = Read-Host "Seleccion${A} una opci${O}n"

    switch ($choice) {
        "1" {
            git add .
            Write-Host "`nTodos los archivos agregados al stage." -ForegroundColor Green
        }
        "2" {
            $files = Read-Host "Ingres${A} archivos separados por espacio (ej: file1.py file2.md)"
            git add $files
            Write-Host "`nArchivos agregados al stage." -ForegroundColor Green
        }
        default {
            Write-Host "`nOpci${O}n no v${A}lida." -ForegroundColor Red
        }
    }
    Show-Status
}

function New-Commit {
    param([string]$Message = "")

    $staged = Get-StagedCount

    if ($staged -eq 0) {
        Write-Host "`nNo hay archivos en stage. ${A}stos necesitan ser agregados primero." -ForegroundColor Red
        $add = Read-Host "${A}Quer${E}s agregar todos los archivos ahora? (s/n)"
        if ($add -eq "s" -or $add -eq "S") {
            git add .
            $staged = Get-StagedCount
            if ($staged -eq 0) {
                Write-Host "No hay cambios para commitear." -ForegroundColor Red
                return $false
            }
        }
        else {
            Write-Host "Commit cancelado." -ForegroundColor Red
            return $false
        }
    }

    if ([string]::IsNullOrWhiteSpace($Message)) {
        Show-Status
        Write-Host "`n== Nuevo Commit ==" -ForegroundColor Cyan
        $Message = Read-Host "Mensaje de commit"
        if ([string]::IsNullOrWhiteSpace($Message)) {
            Write-Host "Mensaje vac${I}o. Commit cancelado." -ForegroundColor Red
            return $false
        }
    }

    try {
        git commit -m $Message
        Write-Host "`nCommit realizado exitosamente." -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "`nError al hacer commit: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Push-Remote {
    $branch = Get-BranchName

    if ($branch -ne "NeumatiQ") {
        Write-Host "`nBranch actual: $branch" -ForegroundColor Red
        Write-Host "El push est${A} configurado solo para 'NeumatiQ'. Cambi${A} tu branch o aborta." -ForegroundColor Red
        return $false
    }

    $staged = Get-StagedCount
    $unstaged = Get-UnstagedCount

    if ($staged -gt 0) {
        Write-Host "`nTienes $staged archivos en stage sin committed." -ForegroundColor Yellow
        $commit = Read-Host "Quer${E}s commitear antes del push? (s/n)"
        if ($commit -eq "s" -or $commit -eq "S") {
            $result = New-Commit
            if (-not $result) {
                Write-Host "Push cancelado por error en commit." -ForegroundColor Red
                return $false
            }
        }
        else {
            Write-Host "Push cancelado." -ForegroundColor Red
            return $false
        }
    }

    if ($unstaged -gt 0) {
        Write-Host "`nTienes $unstaged archivos modificados sin stageo." -ForegroundColor Yellow
        $continue = Read-Host "Quer${E}s continuar con el push de todas formas? (s/n)"
        if ($continue -ne "s" -and $continue -ne "S") {
            Write-Host "Push cancelado." -ForegroundColor Red
            return $false
        }
    }

    Write-Host "`n== Push a origin/NeumatiQ ==" -ForegroundColor Cyan
    try {
        git push origin NeumatiQ
        Write-Host "`nPush exitoso." -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "`nError al hacer push: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Show-LastCommits {
    Write-Host "`n== ${U}ltimos 10 commits ==" -ForegroundColor Cyan
    git log --oneline -10
}

function Quick-Commit {
    param([string]$Message)

    if ([string]::IsNullOrWhiteSpace($Message)) {
        Write-Host "`nError: Debes proporcionar un mensaje de commit." -ForegroundColor Red
        Write-Host "Uso: .\scripts\git-helper.ps1 -Quick `"feat: mi mensaje`"" -ForegroundColor Yellow
        return
    }

    $branch = Get-BranchName
    if ($branch -ne "NeumatiQ") {
        Write-Host "`nBranch actual: $branch" -ForegroundColor Red
        Write-Host "El push est${A} configurado solo para 'NeumatiQ'." -ForegroundColor Red
        return
    }

    Write-Host "`n== Quick Commit -> Add -> Commit -> Push ==" -ForegroundColor Cyan
    Write-Host "Branch: $branch" -ForegroundColor White
    Write-Host "Mensaje: $Message" -ForegroundColor White
    Write-Host ""

    git add .
    Write-Host "`nArchivos agregados al stage." -ForegroundColor Green

    $commitResult = New-Commit -Message $Message
    if (-not $commitResult) {
        return
    }

    $unstaged = Get-UnstagedCount
    if ($unstaged -gt 0) {
        Write-Host "`nAdvertencia: $unstaged archivos sin stage (no se includen en el commit)." -ForegroundColor Yellow
        $continue = Read-Host "Quer${E}s continuar con el push de todas formas? (s/n)"
        if ($continue -ne "s" -and $continue -ne "S") {
            Write-Host "Push cancelado." -ForegroundColor Red
            return
        }
    }

    Write-Host "`n== Push a origin/NeumatiQ ==" -ForegroundColor Cyan
    try {
        git push origin NeumatiQ
        Write-Host "`nPush exitoso." -ForegroundColor Green
    }
    catch {
        Write-Host "`nError al hacer push: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ==================== MODO CLI HEADLESS ====================

if ($Quick) {
    Quick-Commit -Message $Quick
    exit $global:LASTEXITCODE
}

if ($Push) {
    Push-Remote
    exit $global:LASTEXITCODE
}

# ==================== MODO INTERACTIVO ====================

function Show-Menu {
    Clear-Host
    $branch = Get-BranchName
    $staged = Get-StagedCount
    $unstaged = Get-UnstagedCount
    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host "    Git Helper - NeumatiQ           " -ForegroundColor Magenta
    Write-Host "====================================" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Branch: $branch | Staged: $staged | Unstaged: $unstaged" -ForegroundColor White
    Write-Host ""
    Write-Host "1. Git status"
    Write-Host "2. Git diff (todos los cambios)"
    Write-Host "3. Git diff --staged (cambios en stage)"
    Write-Host "4. Agregar archivos al stage"
    Write-Host "5. Hacer commit"
    Write-Host "6. Push a origin/NeumatiQ"
    Write-Host "7. Ver ${U}ltimos 10 commits"
    Write-Host "8. Salir"
    Write-Host ""
}

$Choice = ""

while ($Choice -ne "8") {
    Show-Menu
    $Choice = Read-Host "Seleccion${A} una opci${O}n"

    switch ($Choice) {
        "1" { Show-Status; Read-Host "`nPresion${A} Enter para continuar" }
        "2" { Show-Diff; Read-Host "`nPresion${A} Enter para continuar" }
        "3" { Show-DiffStaged; Read-Host "`nPresion${A} Enter para continuar" }
        "4" { Add-Files }
        "5" { New-Commit }
        "6" { Push-Remote; Read-Host "`nPresion${A} Enter para continuar" }
        "7" { Show-LastCommits; Read-Host "`nPresion${A} Enter para continuar" }
        "8" { Write-Host "`nSaliendo." -ForegroundColor Yellow }
        default { Write-Host "`nOpci${O}n no v${A}lida." -ForegroundColor Red }
    }
}
