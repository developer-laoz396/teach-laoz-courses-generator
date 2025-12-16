# 📊 Sistema de Métricas y Dashboard

Herramientas para capturar métricas del sistema multi-agente y visualizarlas en un dashboard interactivo.

## 🚀 Inicio Rápido

### 1. Ejecutar Ejemplo Completo

```powershell
.\scripts\generate_metrics_dashboard.ps1
```

Este script:
- ✅ Ejecuta una simulación completa del sistema multi-agente
- ✅ Captura todas las métricas en tiempo real
- ✅ Genera archivos JSON de métricas y logs
- ✅ Crea un dashboard HTML interactivo
- ✅ Opcionalmente abre el dashboard en tu navegador

**Archivos generados:**
- `logs/metrics-current.json` - Métricas de la sesión
- `logs/logs-current.json` - Logs estructurados
- `logs/dashboard.html` - Dashboard visual
- `logs/live-monitor.html` - Monitor en vivo

### 2. Monitor en Vivo (Recomendado para Tiempo Real)

```powershell
.\scripts\open_live_monitor.ps1
```

Abre un **monitor en vivo** que:
- 🔴 Se actualiza automáticamente cada **3 segundos**
- 📊 Lee directamente los archivos JSON sin regenerar HTML
- ⚡ Muestra agentes activos con animaciones
- 📈 Timeline de fases en progreso
- 📋 Stream de logs en tiempo real
- 🎨 Tema oscuro optimizado para monitoreo continuo

**Ideal para:**
- Monitorear ejecuciones largas
- Debugging en tiempo real
- Ver el progreso mientras trabajas en otra ventana

### 3. Ver Sesiones Anteriores

```powershell
.\scripts\list_metrics_sessions.ps1
```

Muestra todas las sesiones guardadas con:
- Fecha y hora
- Duración total
- Número de llamadas
- Tasa de éxito
- Estado de la sesión

Permite seleccionar una sesión para generar su dashboard.

### 3. Generar Dashboard Personalizado

```powershell
.\scripts\view_metrics.ps1 [metrics-file] [logs-file] [output-file]
```

**Ejemplos:**

```powershell
# Usar archivos actuales (por defecto)
.\scripts\view_metrics.ps1

# Especificar archivos específicos
.\scripts\view_metrics.ps1 `
  .\logs\metrics-2025-12-15-10-00.json `
  .\logs\logs-2025-12-15-10-00.json `
  .\logs\dashboard-analisis.html
```

## 📖 Documentación Completa

Ver [docs/METRICAS_Y_DASHBOARD.md](../docs/METRICAS_Y_DASHBOARD.md) para:

- API completa de `MetricsLogger`
- Ejemplos de integración en workflows
- Estructura de archivos JSON
- Personalización del dashboard
- Casos de uso avanzados

## 🛠️ Integración en tu Código

### Ejemplo Básico

```javascript
const MetricsLogger = require('./scripts/util/metrics-logger');

// Inicializar
const logger = new MetricsLogger('./logs');

// Iniciar fase
logger.startPhase('FASE_1', 'Planificación del curso');

// Ejecutar agente
const execId = logger.startAgent('A1', 'Estratega', 'FASE_1', {
  tema: 'JavaScript Avanzado'
});

// Tu código aquí...

// Finalizar agente
logger.endAgent(execId, 'A1', 'success', {
  plan_generado: true
});

// Finalizar fase
logger.endPhase('FASE_1', 'success');

// Finalizar sesión
logger.endSession('completed');
```

### Generar Dashboard Programáticamente

```javascript
const DashboardGenerator = require('./scripts/util/generate-dashboard');

const generator = new DashboardGenerator(
  './logs/metrics-current.json',
  './logs/logs-current.json',
  './logs/dashboard.html'
);

generator.generate();
```

## 📊 Características del Dashboard

El dashboard HTML generado incluye:

- **📈 Resumen General**: Estadísticas clave de la sesión
- **🤖 Desempeño por Agente**: Métricas individuales de cada agente
- **🔄 Fases de Ejecución**: Timeline de fases completadas
- **⏱️ Línea de Tiempo**: Visualización cronológica de eventos
- **⚠️ Errores y Advertencias**: Lista detallada de problemas
- **📋 Logs Recientes**: Últimos 50 logs con detalles expandibles

### Auto-refresh

El dashboard se actualiza automáticamente cada 30 segundos cuando visualizas `metrics-current.json`, perfecto para monitoreo en tiempo real.

## 🎯 Métricas Capturadas

### Por Agente
- Total de llamadas
- Llamadas exitosas/fallidas
- Número de reintentos
- Duración total y promedio
- Tasa de éxito

### Por Fase
- Duración de cada fase
- Número de agentes ejecutados
- Estado (success/failed)

### Globales
- Duración total de la sesión
- Tasa de éxito general
- Total de errores y advertencias
- Distribución de reintentos

## 🔍 Estructura de Archivos

```
logs/
├── metrics-current.json          # Métricas de última sesión
├── logs-current.json             # Logs de última sesión
├── metrics-2025-12-15-10-00.json # Sesión con timestamp
├── logs-2025-12-15-10-00.json    # Logs con timestamp
└── dashboard.html                # Dashboard visual
```

## 💡 Casos de Uso

### 1. Debugging
- Identificar qué agentes fallan
- Ver errores con contexto completo
- Analizar patrones de reintentos

### 2. Optimización
- Encontrar agentes lentos
- Comparar duraciones entre sesiones
- Identificar cuellos de botella

### 3. Monitoreo
- Dashboard en tiempo real durante ejecución
- Alertas de errores críticos
- Tracking de tasa de éxito

### 4. Análisis Post-Mortem
- Revisar sesiones anteriores
- Comparar métricas históricas
- Documentar incidentes

## 🤝 Soporte

¿Problemas? Verifica:

1. ✅ Node.js instalado (`node --version`)
2. ✅ Directorio `logs/` existe
3. ✅ Permisos de escritura
4. ✅ Archivos JSON válidos

Para más ayuda, consulta la [documentación completa](../docs/METRICAS_Y_DASHBOARD.md).

---

**Parte del proyecto:** Teach Laoz Course Generator  
**Última actualización:** Diciembre 2025
