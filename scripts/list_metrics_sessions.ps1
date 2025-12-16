# Script para listar todas las sesiones de métricas disponibles
# Uso: .\list_metrics_sessions.ps1

Write-Host "`n📊 Sesiones de Métricas Disponibles" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════`n" -ForegroundColor Cyan

# Verificar que el directorio logs existe
if (-not (Test-Path "./logs")) {
    Write-Host "❌ No se encontró el directorio ./logs" -ForegroundColor Red
    Write-Host "Ejecuta primero: .\generate_metrics_dashboard.ps1`n" -ForegroundColor Yellow
    exit 1
}

# Buscar archivos de métricas
$metricsFiles = Get-ChildItem -Path "./logs" -Filter "metrics-*.json" | Sort-Object LastWriteTime -Descending

if ($metricsFiles.Count -eq 0) {
    Write-Host "❌ No se encontraron archivos de métricas en ./logs" -ForegroundColor Red
    Write-Host "Ejecuta primero: .\generate_metrics_dashboard.ps1`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "Se encontraron $($metricsFiles.Count) sesión(es):`n" -ForegroundColor Green

$index = 1
foreach ($file in $metricsFiles) {
    # Leer el contenido del archivo JSON
    $content = Get-Content $file.FullName -Raw | ConvertFrom-Json
    
    $sessionId = $content.sessionId
    $startTime = [DateTime]::Parse($content.startTime).ToString("yyyy-MM-dd HH:mm:ss")
    $duration = [math]::Round($content.totalDuration / 1000, 2)
    $status = $content.status
    $totalCalls = $content.summary.totalAgentCalls
    $successRate = $content.summary.successRate
    
    # Color según estado
    $statusColor = if ($status -eq "completed") { "Green" } else { "Red" }
    
    Write-Host "[$index] " -NoNewline -ForegroundColor White
    Write-Host "$($file.Name)" -ForegroundColor Cyan
    Write-Host "    📅 Fecha: $startTime" -ForegroundColor White
    Write-Host "    ⏱️  Duración: $duration segundos" -ForegroundColor White
    Write-Host "    📞 Llamadas: $totalCalls" -ForegroundColor White
    Write-Host "    ✅ Éxito: $successRate%" -ForegroundColor White
    Write-Host "    📊 Estado: " -NoNewline -ForegroundColor White
    Write-Host "$status" -ForegroundColor $statusColor
    Write-Host "    🆔 ID: $sessionId" -ForegroundColor Gray
    Write-Host ""
    
    $index++
}

Write-Host "═══════════════════════════════════════`n" -ForegroundColor Cyan

# Preguntar si quiere generar dashboard de alguna sesión
Write-Host "¿Deseas generar un dashboard para alguna sesión? (Número/N): " -ForegroundColor Yellow -NoNewline
$respuesta = Read-Host

if ($respuesta -match '^\d+$') {
    $selectedIndex = [int]$respuesta - 1
    
    if ($selectedIndex -ge 0 -and $selectedIndex -lt $metricsFiles.Count) {
        $selectedFile = $metricsFiles[$selectedIndex]
        $metricsPath = $selectedFile.FullName
        
        # Buscar el archivo de logs correspondiente
        $logsFileName = $selectedFile.Name -replace "metrics-", "logs-"
        $logsPath = Join-Path $selectedFile.DirectoryName $logsFileName
        
        if (Test-Path $logsPath) {
            $dashboardPath = Join-Path $selectedFile.DirectoryName "dashboard-$($selectedFile.BaseName).html"
            
            Write-Host "`n🎨 Generando dashboard para sesión $($selectedIndex + 1)..." -ForegroundColor Cyan
            node scripts/util/generate-dashboard.js $metricsPath $logsPath $dashboardPath
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Dashboard generado: $dashboardPath`n" -ForegroundColor Green
                
                Write-Host "¿Deseas abrirlo en el navegador? (S/N): " -ForegroundColor Yellow -NoNewline
                $openResponse = Read-Host
                
                if ($openResponse -eq "S" -or $openResponse -eq "s") {
                    Start-Process $dashboardPath
                }
            }
        } else {
            Write-Host "`n❌ No se encontró el archivo de logs correspondiente: $logsPath" -ForegroundColor Red
        }
    } else {
        Write-Host "`n❌ Número de sesión inválido" -ForegroundColor Red
    }
} else {
    Write-Host "`n👋 Hasta luego!`n" -ForegroundColor Cyan
}
