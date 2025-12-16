/**
 * Generador de Dashboard Estático de Métricas
 * Lee archivos JSON de métricas y genera un dashboard HTML interactivo
 */

const fs = require('fs');
const path = require('path');

class DashboardGenerator {
  constructor(metricsFile, logsFile, outputFile = './dashboard.html') {
    this.metricsFile = metricsFile;
    this.logsFile = logsFile;
    this.outputFile = outputFile;
    this.metrics = null;
    this.logs = null;
  }

  /**
   * Carga los datos de métricas y logs
   */
  loadData() {
    try {
      this.metrics = JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'));
      this.logs = JSON.parse(fs.readFileSync(this.logsFile, 'utf8'));
      return true;
    } catch (error) {
      console.error('❌ Error cargando datos:', error.message);
      return false;
    }
  }

  /**
   * Genera el dashboard HTML
   */
  generate() {
    if (!this.loadData()) {
      return false;
    }

    const html = this.generateHTML();
    fs.writeFileSync(this.outputFile, html);
    console.log(`\n✅ Dashboard generado: ${this.outputFile}`);
    return true;
  }

  /**
   * Genera el HTML completo del dashboard
   */
  generateHTML() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Métricas - Sistema Multi-Agente</title>
    <style>
        ${this.getStyles()}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📊 Dashboard de Métricas</h1>
            <p class="subtitle">Sistema Multi-Agente de Generación de Cursos</p>
            <div class="session-info">
                <span><strong>Sesión:</strong> ${this.metrics.sessionId}</span>
                <span><strong>Fecha:</strong> ${new Date(this.metrics.startTime).toLocaleString('es-ES')}</span>
                <span><strong>Duración:</strong> ${this.formatDuration(this.metrics.totalDuration)}</span>
                <span class="status status-${this.metrics.status}">${this.metrics.status?.toUpperCase() || 'RUNNING'}</span>
            </div>
        </header>

        ${this.generateSummarySection()}
        ${this.generateAgentsSection()}
        ${this.generatePhasesSection()}
        ${this.generateTimelineSection()}
        ${this.generateErrorsSection()}
        ${this.generateLogsSection()}
    </div>

    <script>
        ${this.getScripts()}
    </script>
</body>
</html>`;
  }

  /**
   * Genera la sección de resumen
   */
  generateSummarySection() {
    const summary = this.metrics.summary;
    return `
        <section class="summary">
            <h2>📈 Resumen General</h2>
            <div class="cards">
                <div class="card card-primary">
                    <div class="card-icon">📞</div>
                    <div class="card-content">
                        <div class="card-value">${summary.totalAgentCalls}</div>
                        <div class="card-label">Total Llamadas</div>
                    </div>
                </div>
                <div class="card card-success">
                    <div class="card-icon">✅</div>
                    <div class="card-content">
                        <div class="card-value">${summary.successfulCalls}</div>
                        <div class="card-label">Exitosas (${summary.successRate || 0}%)</div>
                    </div>
                </div>
                <div class="card card-error">
                    <div class="card-icon">❌</div>
                    <div class="card-content">
                        <div class="card-value">${summary.failedCalls}</div>
                        <div class="card-label">Fallidas (${summary.failureRate || 0}%)</div>
                    </div>
                </div>
                <div class="card card-warning">
                    <div class="card-icon">🔄</div>
                    <div class="card-content">
                        <div class="card-value">${summary.retriedCalls}</div>
                        <div class="card-label">Reintentos (${summary.totalRetries} total)</div>
                    </div>
                </div>
            </div>
        </section>`;
  }

  /**
   * Genera la sección de agentes
   */
  generateAgentsSection() {
    const agents = Object.values(this.metrics.agents);
    const agentRows = agents.map(agent => `
        <tr>
            <td><strong>${agent.name}</strong> <span class="badge">${agent.id}</span></td>
            <td>${agent.totalCalls}</td>
            <td><span class="badge badge-success">${agent.successfulCalls}</span></td>
            <td><span class="badge badge-error">${agent.failedCalls}</span></td>
            <td><span class="badge badge-warning">${agent.retries}</span></td>
            <td>${this.formatDuration(agent.totalDuration)}</td>
            <td>${this.formatDuration(agent.averageDuration)}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${this.calculateSuccessRate(agent)}%"></div>
                </div>
                <span class="progress-label">${this.calculateSuccessRate(agent)}%</span>
            </td>
        </tr>
    `).join('');

    return `
        <section>
            <h2>🤖 Desempeño por Agente</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Agente</th>
                            <th>Llamadas</th>
                            <th>Exitosas</th>
                            <th>Fallidas</th>
                            <th>Reintentos</th>
                            <th>Duración Total</th>
                            <th>Promedio</th>
                            <th>Tasa de Éxito</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${agentRows}
                    </tbody>
                </table>
            </div>
            <div class="chart-container">
                <canvas id="agentChart"></canvas>
            </div>
        </section>`;
  }

  /**
   * Genera la sección de fases
   */
  generatePhasesSection() {
    const phases = Object.values(this.metrics.phases);
    if (phases.length === 0) {
      return '';
    }

    const phaseRows = phases.map(phase => `
        <tr>
            <td><strong>${phase.name}</strong></td>
            <td>${phase.description || '-'}</td>
            <td>${phase.agentCalls}</td>
            <td>${this.formatDuration(phase.duration)}</td>
            <td><span class="status status-${phase.status}">${phase.status}</span></td>
        </tr>
    `).join('');

    return `
        <section>
            <h2>🔄 Fases de Ejecución</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Fase</th>
                            <th>Descripción</th>
                            <th>Llamadas</th>
                            <th>Duración</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${phaseRows}
                    </tbody>
                </table>
            </div>
        </section>`;
  }

  /**
   * Genera la línea de tiempo
   */
  generateTimelineSection() {
    const allExecutions = [];
    Object.values(this.metrics.agents).forEach(agent => {
      agent.executions.forEach(exec => {
        allExecutions.push({
          ...exec,
          agentName: agent.name,
          agentId: agent.id
        });
      });
    });

    allExecutions.sort((a, b) => a.startTimestamp - b.startTimestamp);

    const timelineItems = allExecutions.map(exec => `
        <div class="timeline-item timeline-${exec.status}">
            <div class="timeline-time">${new Date(exec.startTime).toLocaleTimeString('es-ES')}</div>
            <div class="timeline-content">
                <strong>${exec.agentName}</strong> (${exec.agentId})
                <span class="badge">${exec.phase}</span>
                <div class="timeline-meta">
                    Duración: ${this.formatDuration(exec.duration)} | 
                    Estado: <span class="status status-${exec.status}">${exec.status}</span>
                    ${exec.retryCount > 0 ? `| Reintentos: ${exec.retryCount}` : ''}
                </div>
            </div>
        </div>
    `).join('');

    return `
        <section>
            <h2>⏱️ Línea de Tiempo</h2>
            <div class="timeline">
                ${timelineItems}
            </div>
        </section>`;
  }

  /**
   * Genera la sección de errores
   */
  generateErrorsSection() {
    if (this.metrics.errors.length === 0 && this.metrics.warnings.length === 0) {
      return `
        <section>
            <h2>⚠️ Errores y Advertencias</h2>
            <div class="alert alert-success">
                <strong>✅ Sin errores ni advertencias registradas</strong>
            </div>
        </section>`;
    }

    const errorItems = this.metrics.errors.map(error => `
        <div class="alert alert-error">
            <div class="alert-header">
                <strong>❌ Error en ${error.agentName} (${error.agentId})</strong>
                <span class="timestamp">${new Date(error.timestamp).toLocaleString('es-ES')}</span>
            </div>
            <pre>${JSON.stringify(error.error, null, 2)}</pre>
        </div>
    `).join('');

    const warningItems = this.metrics.warnings.map(warning => `
        <div class="alert alert-warning">
            <div class="alert-header">
                <strong>⚠️ ${warning.message}</strong>
                <span class="timestamp">${new Date(warning.timestamp).toLocaleString('es-ES')}</span>
            </div>
            ${warning.context && Object.keys(warning.context).length > 0 ? 
              `<pre>${JSON.stringify(warning.context, null, 2)}</pre>` : ''}
        </div>
    `).join('');

    return `
        <section>
            <h2>⚠️ Errores y Advertencias</h2>
            ${errorItems}
            ${warningItems}
        </section>`;
  }

  /**
   * Genera la sección de logs
   */
  generateLogsSection() {
    const logItems = this.logs.slice(-50).reverse().map(log => `
        <tr class="log-${log.level}">
            <td>${new Date(log.timestamp).toLocaleTimeString('es-ES')}</td>
            <td><span class="badge badge-${log.level}">${log.level}</span></td>
            <td>${log.message}</td>
            <td class="log-data">${Object.keys(log.data).length > 0 ? 
              `<details><summary>Ver datos</summary><pre>${JSON.stringify(log.data, null, 2)}</pre></details>` : 
              '-'}</td>
        </tr>
    `).join('');

    return `
        <section>
            <h2>📋 Logs Recientes (últimos 50)</h2>
            <div class="table-container">
                <table class="logs-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Nivel</th>
                            <th>Mensaje</th>
                            <th>Datos</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${logItems}
                    </tbody>
                </table>
            </div>
        </section>`;
  }

  /**
   * Estilos CSS
   */
  getStyles() {
    return `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .subtitle { font-size: 1.2em; opacity: 0.9; margin-bottom: 20px; }
        
        .session-info {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 20px;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
        }
        
        .session-info span { font-size: 0.9em; }
        
        section {
            padding: 40px;
            border-bottom: 1px solid #eee;
        }
        
        section:last-child { border-bottom: none; }
        
        h2 {
            font-size: 1.8em;
            margin-bottom: 20px;
            color: #667eea;
        }
        
        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 20px;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .card-icon {
            font-size: 3em;
            line-height: 1;
        }
        
        .card-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #333;
        }
        
        .card-label {
            color: #666;
            font-size: 0.9em;
            margin-top: 5px;
        }
        
        .card-primary { border-left: 5px solid #667eea; }
        .card-success { border-left: 5px solid #48bb78; }
        .card-error { border-left: 5px solid #f56565; }
        .card-warning { border-left: 5px solid #ed8936; }
        
        .table-container {
            overflow-x: auto;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        
        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        tbody tr:hover {
            background: #f7fafc;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            background: #e2e8f0;
            color: #4a5568;
        }
        
        .badge-success { background: #c6f6d5; color: #22543d; }
        .badge-error { background: #fed7d7; color: #742a2a; }
        .badge-warning { background: #feebc8; color: #7c2d12; }
        .badge-info { background: #bee3f8; color: #2c5282; }
        
        .status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-success, .status-completed { background: #48bb78; color: white; }
        .status-running { background: #4299e1; color: white; }
        .status-failed, .status-error { background: #f56565; color: white; }
        
        .progress-bar {
            width: 100px;
            height: 8px;
            background: #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #48bb78, #38a169);
            transition: width 0.3s;
        }
        
        .progress-label {
            font-size: 0.9em;
            color: #666;
        }
        
        .timeline {
            position: relative;
            padding-left: 30px;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        }
        
        .timeline-item {
            position: relative;
            padding: 15px;
            margin-bottom: 15px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-left: 20px;
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -27px;
            top: 20px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #667eea;
            border: 3px solid white;
            box-shadow: 0 0 0 3px #667eea;
        }
        
        .timeline-success::before { background: #48bb78; box-shadow: 0 0 0 3px #48bb78; }
        .timeline-failed::before { background: #f56565; box-shadow: 0 0 0 3px #f56565; }
        
        .timeline-time {
            font-size: 0.85em;
            color: #999;
            margin-bottom: 5px;
        }
        
        .timeline-meta {
            font-size: 0.9em;
            color: #666;
            margin-top: 5px;
        }
        
        .alert {
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 15px;
        }
        
        .alert-success {
            background: #c6f6d5;
            color: #22543d;
            border-left: 5px solid #48bb78;
        }
        
        .alert-error {
            background: #fed7d7;
            color: #742a2a;
            border-left: 5px solid #f56565;
        }
        
        .alert-warning {
            background: #feebc8;
            color: #7c2d12;
            border-left: 5px solid #ed8936;
        }
        
        .alert-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .timestamp {
            font-size: 0.85em;
            opacity: 0.8;
        }
        
        pre {
            background: rgba(0,0,0,0.05);
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
            font-size: 0.85em;
            margin-top: 10px;
        }
        
        .logs-table tbody tr.log-error {
            background: #fff5f5;
        }
        
        .logs-table tbody tr.log-warning {
            background: #fffaf0;
        }
        
        .log-data details {
            cursor: pointer;
        }
        
        .log-data summary {
            color: #667eea;
            font-weight: 600;
        }
        
        .chart-container {
            margin-top: 30px;
            padding: 20px;
            background: #f7fafc;
            border-radius: 10px;
        }
        
        @media (max-width: 768px) {
            .cards { grid-template-columns: 1fr; }
            .session-info { flex-direction: column; text-align: left; }
            section { padding: 20px; }
        }
    `;
  }

  /**
   * Scripts JavaScript para interactividad
   */
  getScripts() {
    return `
        // Auto-reload cada 30 segundos si es metrics-current.json
        const isCurrentMetrics = window.location.href.includes('current');
        if (isCurrentMetrics) {
            setTimeout(() => location.reload(), 30000);
        }
        
        // Animación de números
        const animateValue = (element, start, end, duration) => {
            const range = end - start;
            const increment = range / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= end) {
                    current = end;
                    clearInterval(timer);
                }
                element.textContent = Math.round(current);
            }, 16);
        };
        
        document.querySelectorAll('.card-value').forEach(el => {
            const value = parseInt(el.textContent);
            el.textContent = '0';
            animateValue(el, 0, value, 1000);
        });
        
        console.log('📊 Dashboard cargado correctamente');
    `;
  }

  /**
   * Formatea duración en ms a formato legible
   */
  formatDuration(ms) {
    if (!ms) return '0s';
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Calcula la tasa de éxito de un agente
   */
  calculateSuccessRate(agent) {
    if (agent.totalCalls === 0) return 0;
    return Math.round((agent.successfulCalls / agent.totalCalls) * 100);
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
Uso: node generate-dashboard.js <metrics.json> <logs.json> [output.html]

Ejemplo:
  node generate-dashboard.js ./logs/metrics-current.json ./logs/logs-current.json ./dashboard.html
    `);
    process.exit(1);
  }

  const [metricsFile, logsFile, outputFile = './dashboard.html'] = args;
  
  const generator = new DashboardGenerator(metricsFile, logsFile, outputFile);
  const success = generator.generate();
  
  if (success) {
    console.log('\n✨ Dashboard generado exitosamente');
    console.log(`\nAbre el archivo en tu navegador:\n  ${path.resolve(outputFile)}`);
  } else {
    process.exit(1);
  }
}

module.exports = DashboardGenerator;
