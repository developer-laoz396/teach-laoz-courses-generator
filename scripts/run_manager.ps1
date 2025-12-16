# Script para ejecutar el Manager del Curso con métricas integradas
# Uso: .\run_manager.ps1 [modo]
#   - interactive: Modo interactivo (default)
#   - ejemplo: Ejecutar con parámetros de ejemplo

param(
    [Parameter(Position = 0)]
    [string]$Modo = "interactive"
)

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              COURSE MANAGER - AGENTE 0                         ║" -ForegroundColor Cyan
Write-Host "║              Director de Producción Educativa                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar que Node.js está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    Write-Host "   Descárgalo desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar que el archivo manager.js existe
$managerPath = Join-Path $PSScriptRoot "manager.js"
if (-not (Test-Path $managerPath)) {
    Write-Host "❌ Error: No se encuentra manager.js" -ForegroundColor Red
    Write-Host "   Ruta esperada: $managerPath" -ForegroundColor Yellow
    exit 1
}

# Verificar que MetricsLogger existe
$metricsPath = Join-Path $PSScriptRoot "util\metrics-logger.js"
if (-not (Test-Path $metricsPath)) {
    Write-Host "❌ Error: No se encuentra metrics-logger.js" -ForegroundColor Red
    Write-Host "   Ruta esperada: $metricsPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Node.js instalado: $(node --version)" -ForegroundColor Green
Write-Host "✓ Manager ubicado: $managerPath" -ForegroundColor Green
Write-Host "✓ Sistema de métricas disponible" -ForegroundColor Green
Write-Host ""

# Ejecutar según el modo
switch ($Modo.ToLower()) {
    "ejemplo" {
        Write-Host "🚀 Ejecutando con parámetros de ejemplo..." -ForegroundColor Yellow
        Write-Host ""
        
        # Parámetros de ejemplo
        $tema = "Principios SOLID en JavaScript"
        $complejidad = "intermedio"
        $duracion = "40h"
        $audiencia = "Desarrolladores Principiante con 1 año de experiencia"
        $prerequisitos = "JavaScript ES6+, POO básica"
        
        Write-Host "📋 Parámetros:" -ForegroundColor Cyan
        Write-Host "   Tema: $tema" -ForegroundColor Gray
        Write-Host "   Complejidad: $complejidad" -ForegroundColor Gray
        Write-Host "   Duración: $duracion" -ForegroundColor Gray
        Write-Host "   Audiencia: $audiencia" -ForegroundColor Gray
        Write-Host "   Prerrequisitos: $prerequisitos" -ForegroundColor Gray
        Write-Host ""
        
        node $managerPath $tema $complejidad $duracion $audiencia $prerequisitos
    }
    
    "interactive" {
        Write-Host "📝 Modo interactivo activado" -ForegroundColor Yellow
        Write-Host "   El sistema te guiará paso a paso..." -ForegroundColor Gray
        Write-Host ""
        
        node $managerPath
    }
    
    default {
        Write-Host "❌ Modo desconocido: $Modo" -ForegroundColor Red
        Write-Host ""
        Write-Host "Modos disponibles:" -ForegroundColor Yellow
        Write-Host "  interactive - Modo interactivo (default)" -ForegroundColor Gray
        Write-Host "  ejemplo     - Ejecutar con parámetros de ejemplo" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Uso:" -ForegroundColor Cyan
        Write-Host "  .\run_manager.ps1                  # Modo interactivo" -ForegroundColor Gray
        Write-Host "  .\run_manager.ps1 ejemplo          # Modo ejemplo" -ForegroundColor Gray
        Write-Host ""
        exit 1
    }
}

# Resultado final
$exitCode = $LASTEXITCODE

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

if ($exitCode -eq 0) {
    Write-Host "✅ Ejecución completada exitosamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Ver métricas en tiempo real:" -ForegroundColor Cyan
    Write-Host "   .\scripts\open_live_monitor.ps1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📈 Ver dashboard de análisis:" -ForegroundColor Cyan
    Write-Host "   .\scripts\view_metrics.ps1" -ForegroundColor Gray
}
else {
    Write-Host "❌ Ejecución terminó con errores" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔍 Revisar logs:" -ForegroundColor Yellow
    Write-Host "   logs\logs-current.json" -ForegroundColor Gray
}

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

exit $exitCode
