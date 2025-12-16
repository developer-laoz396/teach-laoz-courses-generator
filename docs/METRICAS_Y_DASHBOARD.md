# Sistema de Métricas y Dashboard

Sistema completo de captura de métricas, logging y visualización mediante dashboard estático para el sistema multi-agente de generación de cursos.

## 📋 Características

- ✅ **Captura de métricas en tiempo real** por agente y fase
- ✅ **Logging estructurado** con múltiples niveles (info, success, warning, error)
- ✅ **Detección de reintentos** y tracking de errores
- ✅ **Dashboard HTML estático** con visualizaciones interactivas
- ✅ **Monitor en vivo** con auto-refresh cada 3 segundos
- ✅ **Visualización en tiempo real** sin regenerar HTML
- ✅ **Exportación a JSON** para análisis posterior
- ✅ **Auto-refresh** del dashboard para métricas en tiempo real

## 🚀 Instalación

No requiere dependencias adicionales, solo Node.js:

```bash
# Los archivos ya están en scripts/util/
# No se requiere npm install
```

## 📖 Uso

### 1. Integrar en tu workflow

```javascript
const MetricsLogger = require('./scripts/util/metrics-logger');

// Inicializar el logger
const logger = new MetricsLogger('./logs');

// Iniciar una fase
logger.startPhase('FASE_1_PLANIFICACION', 'Diseño curricular');

// Iniciar un agente
const execId = logger.startAgent('A1', 'Estratega', 'FASE_1_PLANIFICACION', {
  tema: 'SOLID en JavaScript',
  complejidad: 'Media'
});

// ... trabajo del agente ...

// Finalizar el agente
logger.endAgent(execId, 'A1', 'success', {
  plan_generado: true,
  modulos: 10
});

// Finalizar la fase
logger.endPhase('FASE_1_PLANIFICACION', 'success');

// Registrar reintentos si es necesario
logger.recordRetry(execId, 'A1', 1, 'Timeout - reintentando');

// Registrar advertencias
logger.recordWarning('Referencia desactualizada', {
  agente: 'A13',
  severidad: 'warning'
});

// Finalizar sesión
logger.endSession('completed');
```

### 2. Generar Dashboard

```bash
# Desde la línea de comandos
node scripts/util/generate-dashboard.js ./logs/metrics-current.json ./logs/logs-current.json ./logs/dashboard.html

# O programáticamente
const DashboardGenerator = require('./scripts/util/generate-dashboard');

const generator = new DashboardGenerator(
  './logs/metrics-current.json',
  './logs/logs-current.json',
  './logs/dashboard.html'
);

generator.generate();
```

### 3. Ver el Dashboard

Simplemente abre el archivo HTML generado en tu navegador:

```bash
# Windows
start ./logs/dashboard.html

# macOS
open ./logs/dashboard.html

# Linux
xdg-open ./logs/dashboard.html
```

### 4. Monitor en Vivo (Tiempo Real)

Para ver el progreso en tiempo real mientras el sistema se ejecuta:

```powershell
# Abrir el monitor en vivo
.\scripts\open_live_monitor.ps1

# O directamente
start logs\live-monitor.html
```

El **monitor en vivo** se diferencia del dashboard en que:
- ✅ **Auto-carga JSON cada 3 segundos** (no regenera HTML)
- ✅ **Muestra estado "RUNNING" en tiempo real**
- ✅ **Timeline de fases con animaciones**
- ✅ **Agentes activos resaltados**
- ✅ **Logs fluyendo en directo**
- ✅ **Indicador visual de actualización**
- ✅ **Tema oscuro optimizado para monitoreo**

## 🧪 Ejemplo Completo

Ejecuta el ejemplo de demostración:

```bash
node scripts/ejemplo-metricas.js
```

Este ejemplo simula un flujo completo del sistema multi-agente y genera:
- `./logs/metrics-current.json` - Métricas de la sesión
- `./logs/logs-current.json` - Logs estructurados
- `./logs/dashboard.html` - Dashboard visual

## 📊 Estructura de Métricas

### Archivo `metrics-current.json`

```json
{
  "sessionId": "session-1734302400000-abc123",
  "startTime": "2025-12-15T10:00:00.000Z",
  "endTime": "2025-12-15T10:15:30.000Z",
  "totalDuration": 930000,
  "agents": {
    "A1": {
      "id": "A1",
      "name": "Estratega",
      "executions": [...],
      "totalCalls": 1,
      "successfulCalls": 1,
      "failedCalls": 0,
      "totalDuration": 3000,
      "averageDuration": 3000,
      "retries": 0
    }
  },
  "summary": {
    "totalAgentCalls": 13,
    "successfulCalls": 12,
    "failedCalls": 1,
    "retriedCalls": 1,
    "totalRetries": 1,
    "successRate": "92.31",
    "failureRate": "7.69",
    "retryRate": "7.69"
  },
  "phases": {
    "FASE_1_PLANIFICACION": {
      "name": "FASE_1_PLANIFICACION",
      "description": "Diseño curricular y estructura",
      "duration": 5500,
      "status": "success",
      "agentCalls": 2
    }
  },
  "errors": [],
  "warnings": []
}
```

### Archivo `logs-current.json`

```json
[
  {
    "timestamp": "2025-12-15T10:00:00.000Z",
    "level": "info",
    "message": "Agente Estratega (A1) iniciado en FASE_1_PLANIFICACION",
    "data": {
      "executionId": "A1-1734302400000",
      "agentId": "A1",
      "phase": "FASE_1_PLANIFICACION"
    },
    "sessionId": "session-1734302400000-abc123"
  }
]
```

## 🎨 Dashboard

El dashboard generado incluye:

### Secciones

1. **📈 Resumen General**
   - Total de llamadas
   - Llamadas exitosas
   - Llamadas fallidas
   - Reintentos

2. **🤖 Desempeño por Agente**
   - Tabla con métricas de cada agente
   - Duración total y promedio
   - Tasa de éxito
   - Número de reintentos

3. **🔄 Fases de Ejecución**
   - Estado de cada fase
   - Duración
   - Número de llamadas de agentes

4. **⏱️ Línea de Tiempo**
   - Visualización cronológica de ejecuciones
   - Estados y duraciones
   - Reintentos marcados

5. **⚠️ Errores y Advertencias**
   - Lista de errores con contexto
   - Advertencias del sistema
   - Timestamp y agente responsable

6. **📋 Logs Recientes**
   - Últimos 50 logs
   - Filtrados por nivel
   - Datos expandibles

### Características del Dashboard

- ✨ **Diseño responsive** - Se adapta a móviles y tablets
- 🎨 **Animaciones suaves** - Números animados y transiciones
- 🔄 **Auto-refresh** - Se actualiza cada 30 segundos para `metrics-current.json`
- 📊 **Visualización clara** - Códigos de color para estados
- 🔍 **Detalles expandibles** - Click para ver más información

## 🔧 API del MetricsLogger

### Constructor

```javascript
new MetricsLogger(outputDir = './logs')
```

### Métodos Principales

#### `startAgent(agentId, agentName, phase, input)`
Registra el inicio de un agente.

**Parámetros:**
- `agentId` (string): ID del agente (ej: 'A1', 'A13')
- `agentName` (string): Nombre del agente (ej: 'Estratega')
- `phase` (string): Fase actual (ej: 'FASE_1_PLANIFICACION')
- `input` (object): Datos de entrada del agente

**Retorna:** `executionId` (string) - ID único de la ejecución

#### `endAgent(executionId, agentId, status, output, error)`
Registra el fin de un agente.

**Parámetros:**
- `executionId` (string): ID de la ejecución
- `agentId` (string): ID del agente
- `status` (string): 'success' | 'failed'
- `output` (object): Resultado del agente
- `error` (any): Error si falló

#### `recordRetry(executionId, agentId, retryNumber, reason)`
Registra un reintento.

#### `startPhase(phaseName, phaseDescription)`
Inicia una fase del workflow.

#### `endPhase(phaseName, status)`
Finaliza una fase del workflow.

#### `recordWarning(message, context)`
Registra una advertencia.

#### `log(level, message, data)`
Registra un log manual.

**Niveles:** 'info', 'success', 'warning', 'error'

#### `endSession(status)`
Finaliza la sesión y guarda los archivos.

#### `getSummary()`
Obtiene un resumen de las métricas actuales.

## 📁 Estructura de Archivos

```
logs/
├── metrics-current.json          # Métricas de la última sesión
├── logs-current.json             # Logs de la última sesión
├── metrics-2025-12-15-10-00.json # Métricas con timestamp
├── logs-2025-12-15-10-00.json    # Logs con timestamp
└── dashboard.html                # Dashboard visual
```

## 🎯 Casos de Uso

### 1. Monitoreo en Tiempo Real

```javascript
const logger = new MetricsLogger('./logs');
// ... ejecutar workflow ...
logger.endSession('completed');

// Generar dashboard automáticamente
const DashboardGenerator = require('./scripts/util/generate-dashboard');
new DashboardGenerator(
  './logs/metrics-current.json',
  './logs/logs-current.json',
  './logs/dashboard.html'
).generate();
```

Abre `dashboard.html` y se actualizará automáticamente cada 30 segundos.

### 2. Análisis Post-Mortem

```javascript
// Generar dashboard de una sesión anterior
node scripts/util/generate-dashboard.js \
  ./logs/metrics-2025-12-15-10-00.json \
  ./logs/logs-2025-12-15-10-00.json \
  ./analysis/dashboard-session-123.html
```

### 3. Debugging de Errores

El dashboard muestra:
- Qué agente falló
- En qué fase
- Cuántos reintentos se hicieron
- El error exacto
- El contexto de entrada

### 4. Optimización de Performance

Usa las métricas para:
- Identificar agentes lentos
- Ver patrones de fallo
- Optimizar reintentos
- Balancear carga entre fases

## 🔐 Seguridad

El sistema sanitiza automáticamente:
- Passwords
- Tokens
- API Keys
- Secrets

Estos valores aparecerán como `***REDACTED***` en los logs.

## ⚙️ Configuración

### Personalizar Output

```javascript
const logger = new MetricsLogger('./custom-logs-dir');
```

### Modificar Sanitización

Edita el método `sanitizeInput` en `metrics-logger.js`:

```javascript
sanitizeInput(input) {
  const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'myCustomKey'];
  // ... resto del código
}
```

### Cambiar Límite de Logs en Dashboard

Edita `generateLogsSection` en `generate-dashboard.js`:

```javascript
const logItems = this.logs.slice(-100).reverse() // Cambiar de 50 a 100
```

## 📚 Integración con Manager (Agente 0)

Para integrar en el Manager principal:

```javascript
// En .agent/workflows/0-manager-curso.md
const MetricsLogger = require('./scripts/util/metrics-logger');
const logger = new MetricsLogger('./logs');

// Al inicio del workflow
logger.startPhase('FASE_0_PREPARACION', 'Preparación del entorno');

// Antes de llamar cada agente
const execId = logger.startAgent(
  agenteId, 
  agenteNombre, 
  faseActual, 
  inputData
);

// Después de la respuesta del agente
logger.endAgent(execId, agenteId, 'success', outputData);

// Al final
logger.endSession('completed');
```

## 🤝 Contribuir

Para agregar nuevas métricas:

1. Agrega el campo en `this.metrics` en el constructor
2. Actualiza el método correspondiente
3. Modifica `generateHTML()` en `generate-dashboard.js`
4. Actualiza esta documentación

## 📄 Licencia

MIT - Parte del proyecto Teach Laoz Course Generator

## 🆘 Soporte

Si encuentras problemas:

1. Verifica que Node.js esté instalado
2. Asegúrate de que el directorio `./logs` exista
3. Revisa que los archivos JSON sean válidos
4. Consulta los logs en consola

---

**Creado por:** Sistema Multi-Agente Teach Laoz  
**Última actualización:** Diciembre 2025
