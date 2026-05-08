<#
.SYNOPSIS
    Show the running status of Isaac Seeds services and tail their logs.

.PARAMETER Lines
    Number of log lines to show per service (default 15).
#>
param(
    [int]$Lines = 15
)

$LogDir = Join-Path $PSScriptRoot 'logs'

function Test-PortOpen([int]$port) {
    try {
        $tc = New-Object System.Net.Sockets.TcpClient
        $tc.Connect('127.0.0.1', $port)
        $tc.Close()
        return $true
    } catch {
        return $false
    }
}

function Show-Service([string]$name, [int]$port, [string]$url) {
    $pidFile = Join-Path $LogDir "$name.pid"
    $logFile = Join-Path $LogDir "$name.log"

    Write-Host "── $name " -NoNewline -ForegroundColor DarkGray
    Write-Host ('─' * (50 - $name.Length)) -ForegroundColor DarkGray

    # Process check
    if (Test-Path $pidFile) {
        $id = [int](Get-Content $pidFile -Raw)
        $proc = Get-Process -Id $id -ErrorAction SilentlyContinue
        if ($proc) {
            $mem  = [math]::Round($proc.WorkingSet64 / 1MB, 1)
            $mins = [math]::Round((New-TimeSpan -Start $proc.StartTime).TotalMinutes, 0)
            Write-Host "  Process : " -NoNewline; Write-Host "RUNNING" -ForegroundColor Green -NoNewline
            Write-Host "  PID $id  |  ${mem} MB  |  up ~${mins} min"
        } else {
            Write-Host "  Process : " -NoNewline; Write-Host "STOPPED" -ForegroundColor Red
            Write-Host "  (PID $id in pid file no longer exists)"
        }
    } else {
        Write-Host "  Process : " -NoNewline; Write-Host "NOT STARTED" -ForegroundColor DarkGray
    }

    # HTTP check
    if ($port -gt 0) {
        $open = Test-PortOpen $port
        Write-Host "  Port $port : " -NoNewline
        if ($open) { Write-Host "OPEN   $url" -ForegroundColor Green }
        else        { Write-Host "CLOSED"      -ForegroundColor Red  }
    }

    # Log tail
    if (Test-Path $logFile) {
        $size = [math]::Round((Get-Item $logFile).Length / 1KB, 1)
        Write-Host "  Log     : $logFile  (${size} KB)" -ForegroundColor DarkGray
        Write-Host ''
        Get-Content $logFile -Tail $Lines | ForEach-Object {
            Write-Host "    $_" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "  Log     : (none yet)"
    }
    Write-Host ''
}

Write-Host ''
Write-Host 'Isaac Seeds — Service Status' -ForegroundColor Cyan
Write-Host (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
Write-Host ''

Show-Service 'pocketbase' 8090 'http://localhost:8090/_/'

$fePort = 5173
$feLog  = Join-Path $LogDir 'frontend.log'
if (Test-Path $feLog) {
    # Detect whether the last run was prod (port 3000) or dev (5173)
    $lastLines = Get-Content $feLog -Tail 40 -ErrorAction SilentlyContinue
    if ($lastLines -match ':3000') { $fePort = 3000 }
}
Show-Service 'frontend' $fePort "http://localhost:$fePort"
