# Script para iniciar el servidor API de Logging
# Uso: .\start-api.ps1 [-Dev] [-NoBrowser]

param(
    [switch]$Dev,
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "║   🚀 Iniciando Servidor API de Logging                        ║" -ForegroundColor Cyan
Write-Host "║                                                                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar que Node.js esté instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    Write-Host "   Descarga Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Cambiar al directorio de la API
$apiDir = Join-Path $PSScriptRoot "api"
if (-not (Test-Path $apiDir)) {
    Write-Host "❌ Error: Directorio 'api' no encontrado" -ForegroundColor Red
    exit 1
}

Set-Location $apiDir

# Verificar que package.json existe
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json no encontrado en $apiDir" -ForegroundColor Red
    exit 1
}

# Instalar dependencias si node_modules no existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install --ignore-scripts
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
}

# Crear archivo .env si no existe
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creando archivo .env desde .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
}

# Inicializar base de datos
Write-Host "🗄️  Inicializando base de datos..." -ForegroundColor Yellow
node database.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Advertencia: Error inicializando base de datos" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Iniciar servidor
if ($Dev) {
    Write-Host "🔧 Iniciando en modo DESARROLLO (con auto-reload)..." -ForegroundColor Magenta
    Write-Host ""
    
    # Abrir dashboard en navegador si no se especificó -NoBrowser
    if (-not $NoBrowser) {
        Start-Sleep -Seconds 2
        Start-Process "http://localhost:3001/reports/live-monitor.html"
    }
    
    npm run dev
}
else {
    Write-Host "🚀 Iniciando en modo PRODUCCIÓN..." -ForegroundColor Green
    Write-Host ""
    
    # Abrir dashboard en navegador si no se especificó -NoBrowser
    if (-not $NoBrowser) {
        Start-Sleep -Seconds 2
        Start-Process "http://localhost:3001/reports/live-monitor.html"
    }
    
    npm start
}
