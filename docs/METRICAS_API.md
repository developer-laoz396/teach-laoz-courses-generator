# API del Sistema de Métricas

## Visión General

El sistema de métricas proporciona monitoreo en tiempo real de la ejecución de agentes a través de dos mecanismos:

1. **Guardado en tiempo real** (`saveRealTime()`): Actualiza archivos `*-current.json` durante la ejecución
2. **Guardado con timestamp** (`save()`): Crea archivos con fecha al finalizar la sesión para historial

## API Simplificada

### Inicialización

```javascript
const MetricsLogger = require('./scripts/util/metrics-logger');
const metrics = new MetricsLogger(courseTitle, outputDir);
```

### Ciclo de Vida de Sesión

```javascript
// Iniciar sesión
const sessionId = metrics.startSession();

// ... ejecución de agentes ...

// Finalizar sesión
metrics.endSession();
```

### Gestión de Fases

```javascript
// Iniciar fase
metrics.startPhase(phaseNumber, phaseName);

// ... ejecución de agentes en la fase ...

// Finalizar fase
metrics.endPhase(phaseNumber, status);  // status: 'completed' | 'failed'
```

### Gestión de Agentes

#### startAgent(agentId, input)

Inicia la ejecución de un agente.

**Parámetros:**
- `agentId` (string): Identificador en formato `A#_NombreAgente` (ej: `'A1_Estratega'`)
- `input` (object): Parámetros de entrada del agente

**Auto-extrae:**
- `agentName`: Del agentId usando split `'_'` → `'A1_Estratega'` → `'Estratega'`
- `phase`: Detecta automáticamente la fase actual con status `'running'`

**Retorna:**
- `executionId` (string): ID único en formato `{agentId}-{timestamp}` para tracking

**Ejemplo:**
```javascript
const executionId = metrics.startAgent('A1_Estratega', {
  courseTitle: 'Sun Tzu',
  targetLevel: 'intermediate'
});
```

#### endAgent(executionId, status, output, error)

Finaliza la ejecución de un agente.

**Parámetros:**
- `executionId` (string): ID retornado por `startAgent()`
- `status` (string): Estado final: `'success'` | `'error'` | `'warning'`
- `output` (object): Resultado de la ejecución
- `error` (object, opcional): Información del error si status es `'error'`

**Auto-extrae:**
- `agentId`: Del executionId usando `substring(0, executionId.lastIndexOf('-'))`

**Ejemplo:**
```javascript
metrics.endAgent(executionId, 'success', {
  modulesGenerated: 12,
  totalWords: 25000
});

// En caso de error
metrics.endAgent(executionId, 'error', null, {
  message: 'API rate limit exceeded',
  code: 'RATE_LIMIT'
});
```

### Gestión de Reintentos

#### recordRetry(executionId, retryNumber, reason)

Registra un intento de reintento.

**Parámetros:**
- `executionId` (string): ID del agente que reintenta
- `retryNumber` (number): Número de intento (1, 2, 3...)
- `reason` (string): Motivo del reintento

**Auto-extrae:**
- `agentId`: Del executionId

**Ejemplo:**
```javascript
metrics.recordRetry(executionId, 1, 'Network timeout - retrying with exponential backoff');
```

### Logging

```javascript
// Logs automáticos con auto-save cada 5 entradas
metrics.log('INFO', 'Módulo 1 generado correctamente');
metrics.log('WARNING', 'Respuesta de API más lenta de lo esperado');
metrics.log('ERROR', 'Fallo al generar ejercicios');
```

Niveles: `'INFO'` | `'WARNING'` | `'ERROR'` | `'SUCCESS'`

## Actualización en Tiempo Real

### saveRealTime()

Guarda los archivos actuales sin timestamp para lectura inmediata por el live monitor:

- `logs/metrics-current.json`
- `logs/logs-current.json`

**Triggering Automático:**
- Después de `endAgent()`
- Después de `endPhase()`
- Después de `startPhase()`
- Cada 5 llamadas a `log()`

**No requiere llamada manual** - el sistema lo hace automáticamente.

### save()

Guarda archivos con timestamp para historial permanente:

- `logs/metrics-{timestamp}.json`
- `logs/logs-{timestamp}.json`

Llamado automáticamente en `endSession()`.

## Patrón de Uso Completo

```javascript
const MetricsLogger = require('./scripts/util/metrics-logger');

async function generateCourse(courseTitle) {
  const metrics = new MetricsLogger(courseTitle, './logs');
  
  try {
    // 1. Iniciar sesión
    const sessionId = metrics.startSession();
    
    // 2. Fase de planificación
    metrics.startPhase(1, 'PLANIFICACION');
    
    const execId1 = metrics.startAgent('A1_Estratega', { courseTitle });
    const plan = await estratega.generate(courseTitle);
    metrics.endAgent(execId1, 'success', { modulesPlanned: plan.modules.length });
    
    metrics.endPhase(1, 'completed');
    
    // 3. Fase de producción
    metrics.startPhase(2, 'PRODUCCION');
    
    for (const module of plan.modules) {
      const execId2 = metrics.startAgent('A2_Sintetizador', { module });
      
      try {
        const content = await sintetizador.generate(module);
        metrics.endAgent(execId2, 'success', { wordsGenerated: content.length });
      } catch (error) {
        metrics.endAgent(execId2, 'error', null, { message: error.message });
        
        // Reintentar
        metrics.recordRetry(execId2, 1, 'Error de API - reintentando');
        const retryId = metrics.startAgent('A2_Sintetizador', { module });
        const content = await sintetizador.generate(module);
        metrics.endAgent(retryId, 'success', { wordsGenerated: content.length });
      }
    }
    
    metrics.endPhase(2, 'completed');
    
    // 4. Finalizar
    metrics.endSession();
    
  } catch (error) {
    metrics.log('ERROR', `Error fatal: ${error.message}`);
    throw error;
  }
}
```

## Live Monitor

El live monitor ([logs/live-monitor.html](../logs/live-monitor.html)) se actualiza automáticamente cada 3 segundos leyendo:

- `logs/metrics-current.json`
- `logs/logs-current.json`

**Para usar:**

```powershell
# Opción 1: PowerShell helper
.\scripts\open_live_monitor.ps1

# Opción 2: Abrir manualmente
# Navegar a logs/live-monitor.html en el navegador
```

## Ventajas de la Nueva API

### ✅ Simplicidad

**Antes:**
```javascript
metrics.startAgent('A1_Estratega', 'Estratega', 'PLANIFICACION', input);
```

**Ahora:**
```javascript
metrics.startAgent('A1_Estratega', input);
// Auto-extrae: name='Estratega', phase='PLANIFICACION'
```

### ✅ Menos Errores

No más desincronización entre parámetros redundantes:
- `agentId` contiene toda la información necesaria
- `executionId` auto-genera el agentId en `endAgent()`

### ✅ Monitoreo en Tiempo Real

Actualizaciones automáticas sin overhead:
- `saveRealTime()` es ligero (solo 2 archivos sin timestamp)
- No impacta performance (escritura asíncrona)
- Live monitor siempre tiene datos frescos

## Estructura de Datos

### metrics-current.json

```json
{
  "sessionId": "session-1234567890-abc123",
  "courseTitle": "Sun Tzu para Líderes Modernos",
  "startTime": "2025-12-15T10:00:00.000Z",
  "endTime": null,
  "status": "running",
  "phases": [
    {
      "phaseNumber": 1,
      "phaseName": "PLANIFICACION",
      "status": "running",
      "startTime": "2025-12-15T10:00:05.000Z",
      "endTime": null
    }
  ],
  "agents": [
    {
      "executionId": "A1_Estratega-1734260405123",
      "agentId": "A1_Estratega",
      "agentName": "Estratega",
      "phase": "PLANIFICACION",
      "startTime": "2025-12-15T10:00:05.123Z",
      "endTime": null,
      "status": "running",
      "input": { "courseTitle": "Sun Tzu para Líderes Modernos" },
      "output": null,
      "error": null,
      "retries": []
    }
  ]
}
```

### logs-current.json

```json
{
  "sessionId": "session-1234567890-abc123",
  "logs": [
    {
      "timestamp": "2025-12-15T10:00:05.123Z",
      "level": "INFO",
      "message": "Agente Estratega iniciado"
    },
    {
      "timestamp": "2025-12-15T10:00:08.456Z",
      "level": "SUCCESS",
      "message": "Plan curricular generado con 12 módulos"
    }
  ]
}
```

## Testing

### Test Manual

```powershell
# Ejecutar test con live monitor
.\scripts\test-live-monitor.ps1

# Ejecutar test sin abrir navegador
.\scripts\test-live-monitor.ps1 -NoOpen
```

### Test Programático

```javascript
const MetricsLogger = require('./scripts/util/metrics-logger');
const metrics = new MetricsLogger('Test Course', './logs');

// Simular workflow completo
const sessionId = metrics.startSession();
metrics.startPhase(1, 'TEST_PHASE');

const execId = metrics.startAgent('A1_Test', { param: 'value' });
// ... simular trabajo ...
metrics.endAgent(execId, 'success', { result: 'ok' });

metrics.endPhase(1, 'completed');
metrics.endSession();
```

## Migración desde API Anterior

### Cambios en startAgent

```javascript
// ❌ Antiguo (4 parámetros)
metrics.startAgent('A1_Estratega', 'Estratega', 'PLANIFICACION', input);

// ✅ Nuevo (2 parámetros)
metrics.startAgent('A1_Estratega', input);
```

### Cambios en endAgent

```javascript
// ❌ Antiguo (5 parámetros)
metrics.endAgent(executionId, 'A1_Estratega', 'success', output, null);

// ✅ Nuevo (4 parámetros)
metrics.endAgent(executionId, 'success', output);
```

### Cambios en recordRetry

```javascript
// ❌ Antiguo (4 parámetros)
metrics.recordRetry(executionId, 'A2_Sintetizador', 1, 'API error');

// ✅ Nuevo (3 parámetros)
metrics.recordRetry(executionId, 1, 'API error');
```

## Troubleshooting

### Live monitor no se actualiza

1. Verificar que el servidor live está corriendo (Live Server de VS Code)
2. Verificar que existen `logs/metrics-current.json` y `logs/logs-current.json`
3. Revisar consola del navegador para errores de fetch
4. Verificar que `saveRealTime()` se llama automáticamente (check código fuente)

### Métricas no se guardan

1. Verificar que `endSession()` se llama al final
2. Verificar permisos de escritura en carpeta `logs/`
3. Revisar errores en consola de Node.js

### Performance degradado

- `saveRealTime()` solo se llama en puntos estratégicos
- Escritura es asíncrona (no bloquea)
- Si hay problemas, revisar frecuencia de `log()` calls

## Referencias

- [Arquitectura del Sistema](./ARQUITECTURA.md)
- [Workflows](./WORKFLOWS.md)
- [Live Monitor](../logs/live-monitor.html)
- [Código Fuente](../scripts/util/metrics-logger.js)
