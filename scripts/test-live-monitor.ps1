# Script para ejecutar el test del live monitor
# Abre automáticamente el monitor en el navegador

param(
    [switch]$NoOpen
)

Write-Host ""
Write-Host "🧪 TEST DEL LIVE MONITOR" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    exit 1
}

# Abrir live monitor si no se especificó -NoOpen
if (-not $NoOpen) {
    Write-Host "📊 Abriendo live monitor en el navegador..." -ForegroundColor Yellow
    
    $monitorPath = Join-Path $PSScriptRoot "..\logs\live-monitor.html"
    
    if (Test-Path $monitorPath) {
        Start-Process $monitorPath
        Write-Host "✓ Live monitor abierto" -ForegroundColor Green
        Write-Host ""
        Write-Host "💡 Mantén la ventana del monitor visible para ver las actualizaciones" -ForegroundColor Cyan
        Write-Host "   El monitor se actualiza automáticamente cada 3 segundos" -ForegroundColor Gray
        Write-Host ""
        
        # Esperar 3 segundos para que el usuario vea el monitor
        Write-Host "⏳ Esperando 3 segundos antes de iniciar el test..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    } else {
        Write-Host "⚠ live-monitor.html no encontrado, creándolo..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🚀 Ejecutando test..." -ForegroundColor Green
Write-Host ""

# Ejecutar el test
$testPath = Join-Path $PSScriptRoot "test-live-monitor.js"
node $testPath

$exitCode = $LASTEXITCODE

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "✅ Test completado exitosamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Comandos útiles:" -ForegroundColor Cyan
    Write-Host "   Ver dashboard:  .\scripts\view_metrics.ps1" -ForegroundColor Gray
    Write-Host "   Ver sesiones:   .\scripts\list_metrics_sessions.ps1" -ForegroundColor Gray
    Write-Host "   Abrir monitor:  .\scripts\open_live_monitor.ps1" -ForegroundColor Gray
} else {
    Write-Host "❌ Test falló con código de salida: $exitCode" -ForegroundColor Red
}

Write-Host ""

exit $exitCode
