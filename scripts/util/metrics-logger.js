/**
 * Sistema de Métricas y Logging para el Sistema Multi-Agente
 * Captura métricas de ejecución y genera logs estructurados
 */

const fs = require('fs');
const path = require('path');

class MetricsLogger {
  constructor(outputDir = './logs') {
    this.outputDir = outputDir;
    this.sessionId = this.generateSessionId();
    this.metrics = {
      sessionId: this.sessionId,
      startTime: new Date().toISOString(),
      endTime: null,
      totalDuration: 0,
      agents: {},
      summary: {
        totalAgentCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        retriedCalls: 0,
        totalRetries: 0
      },
      phases: {},
      errors: [],
      warnings: []
    };
    this.logs = [];
    
    // Crear directorio si no existe
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    
    // Generar el monitor en vivo si no existe
    this.ensureLiveMonitor();
  }

  generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `session-${timestamp}-${random}`;
  }

  /**
   * Asegura que el archivo live-monitor.html existe
   */
  ensureLiveMonitor() {
    const monitorPath = path.join(this.outputDir, 'live-monitor.html');
    if (fs.existsSync(monitorPath)) {
      return; // Ya existe
    }

    // Copiar desde la plantilla o crear uno nuevo
    const templatePath = path.join(__dirname, '..', '..', 'logs', 'live-monitor.html');
    if (fs.existsSync(templatePath)) {
      fs.copyFileSync(templatePath, monitorPath);
    }
  }

  /**
   * Registra el inicio de ejecución de un agente
   * @param {string} agentId - ID del agente (ej: 'A1_Estratega')
   * @param {object} input - Parámetros de entrada para el agente
   * @returns {string} ID de ejecución único
   */
  startAgent(agentId, input = {}) {
    const executionId = `${agentId}-${Date.now()}`;
    
    // Extraer nombre del agente del ID (ej: 'A1_Estratega' -> 'Estratega')
    const agentName = agentId.includes('_') ? agentId.split('_')[1] : agentId;
    
    // Obtener fase actual
    const currentPhase = Object.values(this.metrics.phases).find(p => p.status === 'running');
    const phase = currentPhase ? currentPhase.name : 'UNKNOWN';
    
    if (!this.metrics.agents[agentId]) {
      this.metrics.agents[agentId] = {
        id: agentId,
        name: agentName,
        executions: [],
        totalCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        totalDuration: 0,
        averageDuration: 0,
        retries: 0
      };
    }

    const execution = {
      executionId,
      phase,
      startTime: new Date().toISOString(),
      startTimestamp: Date.now(),
      endTime: null,
      duration: 0,
      status: 'running',
      input: this.sanitizeInput(input),
      output: null,
      error: null,
      retryCount: 0
    };

    this.metrics.agents[agentId].executions.push(execution);
    this.metrics.agents[agentId].totalCalls++;
    this.metrics.summary.totalAgentCalls++;

    this.log('info', `Agente ${agentName} (${agentId}) iniciado en ${phase}`, {
      executionId,
      agentId,
      phase
    });

    return executionId;
  }

  /**
   * Registra el fin de ejecución de un agente
   * @param {string} executionId - ID de ejecución retornado por startAgent
   * @param {string} status - 'success' o 'error'
   * @param {object} output - Resultado de la ejecución (opcional)
   * @param {string} error - Mensaje de error si status es 'error' (opcional)
   */
  endAgent(executionId, status = 'success', output = {}, error = null) {
    // Extraer agentId del executionId
    const agentId = executionId.substring(0, executionId.lastIndexOf('-'));
    const agent = this.metrics.agents[agentId];
    if (!agent) {
      this.log('error', `Agente ${agentId} no encontrado`, { executionId });
      return;
    }

    const execution = agent.executions.find(e => e.executionId === executionId);
    if (!execution) {
      this.log('error', `Ejecución ${executionId} no encontrada`, { executionId, agentId });
      return;
    }

    const endTimestamp = Date.now();
    execution.endTime = new Date().toISOString();
    execution.duration = endTimestamp - execution.startTimestamp;
    execution.status = status;
    execution.output = this.sanitizeOutput(output);
    execution.error = error;

    // Actualizar estadísticas del agente
    agent.totalDuration += execution.duration;
    agent.averageDuration = agent.totalDuration / agent.executions.length;

    if (status === 'success') {
      agent.successfulCalls++;
      this.metrics.summary.successfulCalls++;
      this.log('success', `Agente ${agent.name} completado exitosamente`, {
        executionId,
        agentId,
        duration: execution.duration
      });
    } else {
      agent.failedCalls++;
      this.metrics.summary.failedCalls++;
      this.log('error', `Agente ${agent.name} falló`, {
        executionId,
        agentId,
        error,
        duration: execution.duration
      });
      this.metrics.errors.push({
        timestamp: execution.endTime,
        agentId,
        agentName: agent.name,
        executionId,
        error
      });
    }

    // Guardar en tiempo real para live monitor
    this.saveRealTime();

    return execution;
  }

  /**
   * Registra un reintento de agente
   */
  recordRetry(executionId, retryNumber, reason) {
    // Extraer agentId del executionId
    const agentId = executionId.substring(0, executionId.lastIndexOf('-'));
    const agent = this.metrics.agents[agentId];
    if (!agent) return;

    const execution = agent.executions.find(e => e.executionId === executionId);
    if (!execution) return;

    execution.retryCount = retryNumber;
    agent.retries++;
    this.metrics.summary.totalRetries++;
    
    if (execution.retryCount === 1) {
      this.metrics.summary.retriedCalls++;
    }

    this.log('warning', `Reintento ${retryNumber} para agente ${agent.name}`, {
      executionId,
      agentId,
      retryNumber,
      reason
    });
  }

  /**
   * Registra el inicio de una fase
   */
  startPhase(phaseName, phaseDescription) {
    if (!this.metrics.phases[phaseName]) {
      this.metrics.phases[phaseName] = {
        name: phaseName,
        description: phaseDescription,
        startTime: new Date().toISOString(),
        startTimestamp: Date.now(),
        endTime: null,
        duration: 0,
        status: 'running',
        agentCalls: 0
      };
    }

    this.log('info', `Fase iniciada: ${phaseName}`, { phaseName, phaseDescription });
    
    // Guardar en tiempo real para live monitor
    this.saveRealTime();
    
    return phaseName;
  }

  /**
   * Registra el fin de una fase
   */
  endPhase(phaseName, status = 'success') {
    const phase = this.metrics.phases[phaseName];
    if (!phase) return;

    const endTimestamp = Date.now();
    phase.endTime = new Date().toISOString();
    phase.duration = endTimestamp - phase.startTimestamp;
    phase.status = status;

    // Contar llamadas de agentes en esta fase
    Object.values(this.metrics.agents).forEach(agent => {
      agent.executions.forEach(exec => {
        if (exec.phase === phaseName) {
          phase.agentCalls++;
        }
      });
    });

    this.log('success', `Fase completada: ${phaseName}`, {
      phaseName,
      duration: phase.duration,
      agentCalls: phase.agentCalls
    });

    // Guardar en tiempo real para live monitor
    this.saveRealTime();
  }

  /**
   * Registra una advertencia
   */
  recordWarning(message, context = {}) {
    this.metrics.warnings.push({
      timestamp: new Date().toISOString(),
      message,
      context
    });
    this.log('warning', message, context);
  }

  /**
   * Registra un log
   */
  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      sessionId: this.sessionId
    };

    this.logs.push(logEntry);

    // Log en consola con colores
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'
    };

    const color = colors[level] || colors.reset;
    console.log(`${color}[${level.toUpperCase()}]${colors.reset} ${message}`);

    // Guardar en tiempo real cada 5 logs para no saturar I/O
    if (this.logs.length % 5 === 0) {
      this.saveRealTime();
    }
  }

  /**
   * Finaliza la sesión y guarda las métricas
   */
  endSession(status = 'completed') {
    this.metrics.endTime = new Date().toISOString();
    this.metrics.totalDuration = Date.now() - new Date(this.metrics.startTime).getTime();
    this.metrics.status = status;

    // Calcular tasas de éxito
    if (this.metrics.summary.totalAgentCalls > 0) {
      this.metrics.summary.successRate = 
        (this.metrics.summary.successfulCalls / this.metrics.summary.totalAgentCalls * 100).toFixed(2);
      this.metrics.summary.failureRate = 
        (this.metrics.summary.failedCalls / this.metrics.summary.totalAgentCalls * 100).toFixed(2);
      this.metrics.summary.retryRate = 
        (this.metrics.summary.retriedCalls / this.metrics.summary.totalAgentCalls * 100).toFixed(2);
    }

    this.log('info', `Sesión finalizada: ${this.sessionId}`, {
      status,
      duration: this.metrics.totalDuration,
      totalCalls: this.metrics.summary.totalAgentCalls
    });

    this.save();
  }

  /**
   * Guarda métricas en tiempo real (solo archivos current)
   * Usado para actualizar el live monitor sin crear archivos timestamped
   */
  saveRealTime() {
    try {
      // Actualizar métricas actuales (para live monitor)
      const currentMetricsFile = path.join(this.outputDir, 'metrics-current.json');
      fs.writeFileSync(currentMetricsFile, JSON.stringify(this.metrics, null, 2));

      const currentLogsFile = path.join(this.outputDir, 'logs-current.json');
      fs.writeFileSync(currentLogsFile, JSON.stringify(this.logs, null, 2));
    } catch (error) {
      console.error('Error guardando métricas en tiempo real:', error.message);
    }
  }

  /**
   * Guarda métricas y logs en archivos
   */
  save() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Guardar métricas
    const metricsFile = path.join(this.outputDir, `metrics-${timestamp}.json`);
    fs.writeFileSync(metricsFile, JSON.stringify(this.metrics, null, 2));
    console.log(`\n✅ Métricas guardadas en: ${metricsFile}`);

    // Guardar logs
    const logsFile = path.join(this.outputDir, `logs-${timestamp}.json`);
    fs.writeFileSync(logsFile, JSON.stringify(this.logs, null, 2));
    console.log(`✅ Logs guardados en: ${logsFile}`);

    // Guardar métricas actuales (siempre la última)
    const currentMetricsFile = path.join(this.outputDir, 'metrics-current.json');
    fs.writeFileSync(currentMetricsFile, JSON.stringify(this.metrics, null, 2));

    const currentLogsFile = path.join(this.outputDir, 'logs-current.json');
    fs.writeFileSync(currentLogsFile, JSON.stringify(this.logs, null, 2));

    return {
      metricsFile,
      logsFile,
      currentMetricsFile,
      currentLogsFile
    };
  }

  /**
   * Sanitiza el input para evitar información sensible
   */
  sanitizeInput(input) {
    if (typeof input !== 'object') return input;
    
    const sanitized = { ...input };
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret'];
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = '***REDACTED***';
      }
    });
    
    return sanitized;
  }

  /**
   * Sanitiza el output limitando el tamaño
   */
  sanitizeOutput(output) {
    if (typeof output === 'string' && output.length > 500) {
      return output.substring(0, 500) + '... [truncated]';
    }
    return output;
  }

  /**
   * Obtiene un resumen de las métricas actuales
   */
  getSummary() {
    return {
      sessionId: this.sessionId,
      duration: this.metrics.totalDuration || (Date.now() - new Date(this.metrics.startTime).getTime()),
      totalCalls: this.metrics.summary.totalAgentCalls,
      successRate: this.metrics.summary.successRate || 0,
      failureRate: this.metrics.summary.failureRate || 0,
      activeAgents: Object.keys(this.metrics.agents).length,
      phases: Object.keys(this.metrics.phases).length,
      errors: this.metrics.errors.length,
      warnings: this.metrics.warnings.length
    };
  }
}

module.exports = MetricsLogger;
