<#
.SYNOPSIS
    Stop all Isaac Seeds background services (PocketBase + frontend).
#>

$LogDir = Join-Path $PSScriptRoot 'logs'

function Stop-Service([string]$name) {
    $pidFile = Join-Path $LogDir "$name.pid"
    if (-not (Test-Path $pidFile)) {
        Write-Host "  $name — no pid file found (already stopped?)" -ForegroundColor DarkGray
        return
    }

    $id = [int](Get-Content $pidFile -Raw)

    if (Get-Process -Id $id -ErrorAction SilentlyContinue) {
        # taskkill /T kills the whole process tree (important for cmd.exe → node → vite chains)
        $result = & taskkill /F /T /PID $id 2>&1
        Write-Host "  [OK] $name stopped (PID $id)" -ForegroundColor Green
    } else {
        Write-Host "  $name (PID $id) was already gone" -ForegroundColor DarkGray
    }

    Remove-Item $pidFile -ErrorAction SilentlyContinue
}

Write-Host ''
Write-Host 'Stopping Isaac Seeds...' -ForegroundColor Cyan
Stop-Service 'frontend'
Stop-Service 'pocketbase'
Write-Host ''
Write-Host 'Done.' -ForegroundColor Green
Write-Host ''
