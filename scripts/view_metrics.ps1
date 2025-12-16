# Script para generar dashboard desde archivos de métricas existentes
# Uso: .\view_metrics.ps1 [metrics-file] [logs-file] [output-file]

param(
    [string]$MetricsFile = "./logs/metrics-current.json",
    [string]$LogsFile = "./logs/logs-current.json",
    [string]$OutputFile = "./logs/dashboard.html"
)

Write-Host "`n📊 Generador de Dashboard de Métricas" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════`n" -ForegroundColor Cyan

# Verificar que los archivos existen
if (-not (Test-Path $MetricsFile)) {
    Write-Host "❌ Error: Archivo de métricas no encontrado: $MetricsFile" -ForegroundColor Red
    Write-Host "Ejecuta primero: .\generate_metrics_dashboard.ps1" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $LogsFile)) {
    Write-Host "❌ Error: Archivo de logs no encontrado: $LogsFile" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Archivos encontrados:" -ForegroundColor Green
Write-Host "  📊 Métricas: $MetricsFile" -ForegroundColor White
Write-Host "  📋 Logs: $LogsFile" -ForegroundColor White
Write-Host "  🎨 Output: $OutputFile`n" -ForegroundColor White

# Generar dashboard
Write-Host "🎨 Generando dashboard..." -ForegroundColor Cyan
node scripts/util/generate-dashboard.js $MetricsFile $LogsFile $OutputFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Dashboard generado exitosamente!`n" -ForegroundColor Green
    
    # Verificar tamaño del archivo
    if (Test-Path $OutputFile) {
        $size = (Get-Item $OutputFile).Length
        $sizeKB = [math]::Round($size / 1KB, 2)
        Write-Host "  📊 Tamaño: $sizeKB KB" -ForegroundColor White
        
        # Preguntar si abrir el dashboard
        Write-Host "`n¿Deseas abrir el dashboard en el navegador? (S/N): " -ForegroundColor Yellow -NoNewline
        $respuesta = Read-Host
        
        if ($respuesta -eq "S" -or $respuesta -eq "s") {
            Write-Host "`n🌐 Abriendo dashboard..." -ForegroundColor Cyan
            Start-Process $OutputFile
        } else {
            Write-Host "`nPuedes abrir manualmente: $OutputFile`n" -ForegroundColor White
        }
    }
    
} else {
    Write-Host "`n❌ Error al generar el dashboard" -ForegroundColor Red
    exit 1
}
