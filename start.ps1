<#
.SYNOPSIS
    Start Isaac Seeds in the background (PocketBase + SvelteKit frontend).

.PARAMETER Prod
    Build the frontend and run the production Node server instead of the Vite dev server.

.PARAMETER Setup
    Run setup_pocketbase.py after PocketBase starts (first-time only).
    You will be prompted for your PocketBase admin credentials unless
    PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD environment variables are set.

.EXAMPLE
    .\start.ps1               # dev mode (hot-reload, localhost:5173)
    .\start.ps1 -Prod         # production mode (localhost:3000)
    .\start.ps1 -Setup        # dev + run collection setup
    .\start.ps1 -Prod -Setup  # production + setup
#>
param(
    [switch]$Prod,
    [switch]$Setup
)

$ErrorActionPreference = 'Stop'

$Root        = $PSScriptRoot
$BackendDir  = Join-Path $Root  'backend'
$FrontendDir = Join-Path $Root  'frontend'
$LogDir      = Join-Path $Root  'logs'

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

# ── Helpers ───────────────────────────────────────────────────────────────────
function Write-Step([string]$msg) { Write-Host "  $msg"       -ForegroundColor Cyan    }
function Write-OK  ([string]$msg) { Write-Host "  [OK] $msg"  -ForegroundColor Green   }
function Write-Warn([string]$msg) { Write-Host "  [!]  $msg"  -ForegroundColor Yellow  }

function Save-PidFile([string]$name, [int]$id) {
    $id | Out-File (Join-Path $LogDir "$name.pid") -Encoding ascii
}

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

function Wait-ForPort([int]$port, [int]$seconds = 10) {
    $deadline = (Get-Date).AddSeconds($seconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-PortOpen $port) { return $true }
        Start-Sleep -Milliseconds 300
    }
    return $false
}

# ── Bootstrap .env ────────────────────────────────────────────────────────────
$envFile    = Join-Path $FrontendDir '.env'
$envExample = Join-Path $FrontendDir '.env.example'
if (-not (Test-Path $envFile) -and (Test-Path $envExample)) {
    Copy-Item $envExample $envFile
    Write-Warn "Created frontend\.env from .env.example — edit it to add Turnstile keys"
}

# ── PocketBase ────────────────────────────────────────────────────────────────
Write-Host ''
Write-Host '── PocketBase ──────────────────────────────────────────' -ForegroundColor DarkGray

$pbPidFile = Join-Path $LogDir 'pocketbase.pid'
$pbRunning = $false

if (Test-Path $pbPidFile) {
    $storedPid = [int](Get-Content $pbPidFile -Raw)
    if (Get-Process -Id $storedPid -ErrorAction SilentlyContinue) {
        $pbRunning = $true
        Write-OK "PocketBase already running (PID $storedPid)"
    }
}

if (-not $pbRunning) {
    $pbExe    = Join-Path $BackendDir 'pocketbase.exe'
    $pbLog    = Join-Path $LogDir     'pocketbase.log'
    $pbErrLog = Join-Path $LogDir     'pocketbase-error.log'

    $pbProc = Start-Process `
        -FilePath        $pbExe `
        -ArgumentList    'serve --http=127.0.0.1:8090' `
        -WorkingDirectory $BackendDir `
        -RedirectStandardOutput $pbLog `
        -RedirectStandardError  $pbErrLog `
        -PassThru `
        -WindowStyle Hidden

    Save-PidFile 'pocketbase' $pbProc.Id
    Write-Step "PocketBase started  (PID $($pbProc.Id))"
    Write-Step "Admin UI  →  http://localhost:8090/_/"

    Write-Step 'Waiting for PocketBase...'
    if (Wait-ForPort 8090 10) {
        Write-OK 'PocketBase is up  →  http://localhost:8090'
    } else {
        Write-Warn 'PocketBase did not respond in 10 s — check logs\pocketbase-error.log'
    }
}

# ── Collection setup ──────────────────────────────────────────────────────────
if ($Setup) {
    Write-Host ''
    Write-Host '── Collection setup ────────────────────────────────────' -ForegroundColor DarkGray
    Write-Step 'Running setup_pocketbase.py...'
    Write-Step '(Set PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD env vars for non-interactive mode)'
    python (Join-Path $Root 'setup_pocketbase.py')
    Write-OK 'Setup done'
}

# ── Frontend ──────────────────────────────────────────────────────────────────
Write-Host ''

$fePidFile = Join-Path $LogDir 'frontend.pid'
$feRunning = $false

if (Test-Path $fePidFile) {
    $storedPid = [int](Get-Content $fePidFile -Raw)
    if (Get-Process -Id $storedPid -ErrorAction SilentlyContinue) {
        $feRunning = $true
        $fePort = if ($Prod) { 3000 } else { 5173 }
        Write-OK "Frontend already running (PID $storedPid)  →  http://localhost:$fePort"
    }
}

if (-not $feRunning) {
    $feLog = Join-Path $LogDir 'frontend.log'

    if ($Prod) {
        Write-Host '── Frontend (production) ───────────────────────────────' -ForegroundColor DarkGray
        Write-Step 'Building...'
        & cmd.exe /c "cd /d `"$FrontendDir`" && npm run build >> `"$feLog`" 2>&1"
        if ($LASTEXITCODE -ne 0) { Write-Warn "Build exited with code $LASTEXITCODE — check logs\frontend.log" }
        Write-OK 'Build complete'

        $feProc = Start-Process `
            -FilePath        'node' `
            -ArgumentList    'build' `
            -WorkingDirectory $FrontendDir `
            -RedirectStandardOutput $feLog `
            -RedirectStandardError  (Join-Path $LogDir 'frontend-error.log') `
            -PassThru `
            -WindowStyle Hidden

        Save-PidFile 'frontend' $feProc.Id
        Write-Step "Production server started  (PID $($feProc.Id))"

        if (Wait-ForPort 3000 10) {
            Write-OK 'Frontend is up  →  http://localhost:3000'
        } else {
            Write-Warn 'Frontend not responding — check logs\frontend.log'
        }

    } else {
        Write-Host '── Frontend (dev) ──────────────────────────────────────' -ForegroundColor DarkGray

        # Start Vite dev server via cmd so npm.cmd is found on all setups
        $feProc = Start-Process `
            -FilePath        'cmd.exe' `
            -ArgumentList    "/c npm run dev >> `"$feLog`" 2>&1" `
            -WorkingDirectory $FrontendDir `
            -PassThru `
            -WindowStyle Hidden

        Save-PidFile 'frontend' $feProc.Id
        Write-Step "Vite dev server started  (PID $($feProc.Id))"

        if (Wait-ForPort 5173 15) {
            Write-OK 'Frontend is up  →  http://localhost:5173'
        } else {
            Write-Warn 'Vite still starting — check logs\frontend.log in a moment'
        }
    }
}

# ── Summary ───────────────────────────────────────────────────────────────────
Write-Host ''
Write-Host '────────────────────────────────────────────────────────' -ForegroundColor DarkGray
Write-Host '  Isaac Seeds is running' -ForegroundColor Green
Write-Host ''
$appUrl = if ($Prod) { 'http://localhost:3000' } else { 'http://localhost:5173' }
Write-Host "  App       $appUrl"
Write-Host "  PocketBase http://localhost:8090/_/"
Write-Host ''
Write-Host '  .\stop.ps1    — stop all services'
Write-Host '  .\status.ps1  — check status + tail logs'
Write-Host "  logs\          $LogDir"
Write-Host ''
