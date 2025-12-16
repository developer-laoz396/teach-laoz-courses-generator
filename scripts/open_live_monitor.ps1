# Script para abrir el monitor en vivo
# Uso: .\open_live_monitor.ps1

Write-Host "`n🔴 Monitor en Vivo - Sistema Multi-Agente" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════`n" -ForegroundColor Cyan

# Verificar que existe el archivo de monitor
$monitorFile = "logs\live-monitor.html"

if (-not (Test-Path $monitorFile)) {
    Write-Host "❌ Error: No se encontró el archivo live-monitor.html" -ForegroundColor Red
    Write-Host "Generando monitor en vivo..." -ForegroundColor Yellow
    
    # Aquí se puede agregar lógica para generar el monitor si no existe
    Write-Host "Por favor ejecuta primero el sistema para generar los archivos necesarios." -ForegroundColor Yellow
    exit 1
}

# Verificar que existen los archivos de datos
$metricsFile = "logs\metrics-current.json"
$logsFile = "logs\logs-current.json"

if (-not (Test-Path $metricsFile) -or -not (Test-Path $logsFile)) {
    Write-Host "⚠️  Advertencia: No se encontraron archivos de métricas actuales" -ForegroundColor Yellow
    Write-Host "El monitor se abrirá, pero mostrará un error hasta que el sistema comience a ejecutarse.`n" -ForegroundColor Yellow
}

Write-Host "✅ Abriendo monitor en vivo..." -ForegroundColor Green
Write-Host "`n📊 Características del monitor:" -ForegroundColor White
Write-Host "  • Se actualiza automáticamente cada 3 segundos" -ForegroundColor White
Write-Host "  • Muestra el estado de todos los agentes en tiempo real" -ForegroundColor White
Write-Host "  • Timeline de fases con indicadores visuales" -ForegroundColor White
Write-Host "  • Logs en tiempo real (últimos 20)" -ForegroundColor White
Write-Host "  • Métricas de éxito/fallo actualizadas" -ForegroundColor White
Write-Host "`n💡 Tip: Deja esta ventana abierta mientras ejecutas el sistema`n" -ForegroundColor Cyan

# Abrir el monitor
Start-Process $monitorFile

Write-Host "✨ Monitor abierto en el navegador`n" -ForegroundColor Green
Write-Host "Presiona Ctrl+C para cerrar este script (el monitor seguirá abierto)`n" -ForegroundColor Gray
