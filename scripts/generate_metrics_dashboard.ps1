# Script para ejecutar el ejemplo de métricas y generar dashboard
# Uso: .\generate_metrics_dashboard.ps1

Write-Host "`n🚀 Sistema de Métricas y Dashboard" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════`n" -ForegroundColor Cyan

# Verificar que Node.js esté instalado
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    Write-Host "Por favor instala Node.js desde https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js detectado: $nodeVersion`n" -ForegroundColor Green

# Crear directorio de logs si no existe
if (-not (Test-Path "./logs")) {
    Write-Host "📁 Creando directorio ./logs..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "./logs" -Force | Out-Null
}

# Ejecutar ejemplo de métricas
Write-Host "📊 Ejecutando ejemplo de captura de métricas...`n" -ForegroundColor Cyan
node scripts/ejemplo-metricas.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Métricas capturadas exitosamente!`n" -ForegroundColor Green
    
    # Verificar archivos generados
    $metricsFile = "./logs/metrics-current.json"
    $logsFile = "./logs/logs-current.json"
    $dashboardFile = "./logs/dashboard.html"
    
    if (Test-Path $metricsFile) {
        $metricsSize = (Get-Item $metricsFile).Length
        Write-Host "  📊 Métricas: $metricsFile ($metricsSize bytes)" -ForegroundColor White
    }
    
    if (Test-Path $logsFile) {
        $logsSize = (Get-Item $logsFile).Length
        Write-Host "  📋 Logs: $logsFile ($logsSize bytes)" -ForegroundColor White
    }
    
    if (Test-Path $dashboardFile) {
        $dashboardSize = (Get-Item $dashboardFile).Length
        Write-Host "  🎨 Dashboard: $dashboardFile ($dashboardSize bytes)" -ForegroundColor White
        
        # Preguntar si abrir el dashboard
        Write-Host "`n¿Deseas abrir el dashboard en el navegador? (S/N): " -ForegroundColor Yellow -NoNewline
        $respuesta = Read-Host
        
        if ($respuesta -eq "S" -or $respuesta -eq "s") {
            Write-Host "`n🌐 Abriendo dashboard..." -ForegroundColor Cyan
            Start-Process $dashboardFile
        }
    }
    
    Write-Host "`n✨ Proceso completado exitosamente!`n" -ForegroundColor Green
    
} else {
    Write-Host "`n❌ Error al ejecutar el ejemplo de métricas" -ForegroundColor Red
    exit 1
}
