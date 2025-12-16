/**
 * Script de Migración de Logs JSON a SQLite
 * 
 * Migra archivos logs-*.json y metrics-*.json existentes a la base de datos SQLite
 * 
 * Uso: node scripts/migrate-logs.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { getDatabase } = require('../api/database');

const LOGS_DIR = path.join(__dirname, '..', 'logs');
const DRY_RUN = process.argv.includes('--dry-run');

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

function log(color, ...args) {
    console.log(color, ...args, colors.reset);
}

/**
 * Encuentra todos los archivos JSON de logs y métricas
 */
function findLogFiles() {
    if (!fs.existsSync(LOGS_DIR)) {
        log(colors.red, '❌ Directorio de logs no encontrado:', LOGS_DIR);
        return { logFiles: [], metricFiles: [] };
    }

    const files = fs.readdirSync(LOGS_DIR);
    
    const logFiles = files
        .filter(f => f.startsWith('logs-') && f.endsWith('.json'))
        .map(f => path.join(LOGS_DIR, f));
    
    const metricFiles = files
        .filter(f => f.startsWith('metrics-') && f.endsWith('.json'))
        .map(f => path.join(LOGS_DIR, f));

    return { logFiles, metricFiles };
}

/**
 * Extrae el timestamp del nombre del archivo
 */
function extractTimestamp(filename) {
    const match = filename.match(/-([\d-TZ]+)\.json$/);
    if (match) {
        return new Date(match[1]).toISOString();
    }
    return new Date().toISOString();
}

/**
 * Migra un archivo de métricas
 */
async function migrateMetricsFile(db, filePath) {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const fileTimestamp = extractTimestamp(filePath);
        
        log(colors.blue, `\n📊 Migrando métricas: ${path.basename(filePath)}`);

        // Crear o actualizar sesión
        const sessionId = data.sessionId || `migrated-${Date.now()}`;
        
        if (!DRY_RUN) {
            // Verificar si la sesión ya existe
            const existingSession = db.getSession(sessionId);
            
            if (!existingSession) {
                db.createSession(sessionId);
                log(colors.green, `  ✅ Sesión creada: ${sessionId}`);
            } else {
                log(colors.yellow, `  ⚠️  Sesión ya existe: ${sessionId}`);
            }

            // Actualizar datos de sesión
            db.updateSession(sessionId, {
                status: data.status || 'completed',
                end_time: fileTimestamp,
                total_duration: data.totalDuration || 0
            });

            // Actualizar contadores
            if (data.summary) {
                db.incrementSessionCounters(sessionId, {
                    total_agent_calls: data.summary.totalAgentCalls || 0,
                    successful_calls: data.summary.successfulCalls || 0,
                    failed_calls: data.summary.failedCalls || 0
                });
            }
        }

        // Migrar agentes
        let agentCount = 0;
        if (data.agents) {
            for (const [agentId, agent] of Object.entries(data.agents)) {
                if (!DRY_RUN) {
                    db.upsertAgent(agentId, agent.name || agentId);
                    
                    // Migrar ejecuciones del agente
                    if (agent.executions && Array.isArray(agent.executions)) {
                        for (const exec of agent.executions) {
                            const execId = exec.executionId || `${agentId}-${Date.now()}-${Math.random()}`;
                            
                            db.createExecution({
                                id: execId,
                                session_id: sessionId,
                                agent_id: agentId,
                                phase: exec.phase || 'unknown'
                            });

                            db.completeExecution(execId, {
                                duration: exec.duration || 0,
                                status: exec.status || 'success',
                                output: exec.output || null,
                                error_message: exec.error || null
                            });
                        }
                    }

                    // Actualizar estadísticas del agente
                    if (agent.totalCalls) {
                        db.updateAgentStats(agentId, {
                            success: true,
                            duration: agent.averageDuration || 0
                        });
                    }
                }
                agentCount++;
            }
        }
        log(colors.green, `  ✅ ${agentCount} agentes migrados`);

        // Migrar fases
        let phaseCount = 0;
        if (data.phases) {
            for (const [phaseName, phase] of Object.entries(data.phases)) {
                if (!DRY_RUN) {
                    db.upsertPhase(sessionId, phaseName);
                    if (phase.status && phase.status !== 'running') {
                        db.updatePhase(sessionId, phaseName, phase.status);
                    }
                }
                phaseCount++;
            }
        }
        log(colors.green, `  ✅ ${phaseCount} fases migradas`);

        return {
            success: true,
            sessionId,
            agents: agentCount,
            phases: phaseCount
        };

    } catch (error) {
        log(colors.red, `  ❌ Error migrando ${path.basename(filePath)}:`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Migra un archivo de logs
 */
async function migrateLogsFile(db, filePath) {
    try {
        const logs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        if (!Array.isArray(logs)) {
            log(colors.yellow, `  ⚠️  Archivo no contiene array de logs: ${path.basename(filePath)}`);
            return { success: false, count: 0 };
        }

        log(colors.blue, `\n📋 Migrando logs: ${path.basename(filePath)}`);
        log(colors.cyan, `  Total de logs: ${logs.length}`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const logEntry of logs) {
            if (!DRY_RUN) {
                try {
                    // Asegurar que existe una sesión
                    const sessionId = logEntry.sessionId || logEntry.data?.sessionId || 'migrated-default';
                    
                    const existingSession = db.getSession(sessionId);
                    if (!existingSession) {
                        db.createSession(sessionId);
                    }

                    db.insertLog({
                        session_id: sessionId,
                        timestamp: logEntry.timestamp || new Date().toISOString(),
                        level: logEntry.level || 'info',
                        message: logEntry.message || '',
                        agent_id: logEntry.data?.agentId || null,
                        phase: logEntry.data?.phase || null,
                        execution_id: null,
                        data: logEntry.data ? logEntry.data : null
                    });

                    migratedCount++;
                } catch (err) {
                    skippedCount++;
                }
            } else {
                migratedCount++;
            }
        }

        log(colors.green, `  ✅ ${migratedCount} logs migrados`);
        if (skippedCount > 0) {
            log(colors.yellow, `  ⚠️  ${skippedCount} logs omitidos (duplicados o errores)`);
        }

        return {
            success: true,
            count: migratedCount,
            skipped: skippedCount
        };

    } catch (error) {
        log(colors.red, `  ❌ Error migrando ${path.basename(filePath)}:`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Genera reporte de migración
 */
function generateReport(results) {
    log(colors.cyan, '\n' + '='.repeat(70));
    log(colors.cyan, '📊 REPORTE DE MIGRACIÓN');
    log(colors.cyan, '='.repeat(70));

    const totalSessions = results.metrics.filter(r => r.success).length;
    const totalAgents = results.metrics.reduce((sum, r) => sum + (r.agents || 0), 0);
    const totalPhases = results.metrics.reduce((sum, r) => sum + (r.phases || 0), 0);
    const totalLogs = results.logs.reduce((sum, r) => sum + (r.count || 0), 0);
    const totalSkipped = results.logs.reduce((sum, r) => sum + (r.skipped || 0), 0);

    log(colors.green, `\n✅ Sesiones migradas: ${totalSessions}`);
    log(colors.green, `✅ Agentes migrados: ${totalAgents}`);
    log(colors.green, `✅ Fases migradas: ${totalPhases}`);
    log(colors.green, `✅ Logs migrados: ${totalLogs}`);
    
    if (totalSkipped > 0) {
        log(colors.yellow, `⚠️  Logs omitidos: ${totalSkipped}`);
    }

    const failedMetrics = results.metrics.filter(r => !r.success).length;
    const failedLogs = results.logs.filter(r => !r.success).length;

    if (failedMetrics > 0 || failedLogs > 0) {
        log(colors.red, `\n❌ Archivos con errores:`);
        log(colors.red, `   Métricas: ${failedMetrics}`);
        log(colors.red, `   Logs: ${failedLogs}`);
    }

    log(colors.cyan, '\n' + '='.repeat(70) + '\n');
}

/**
 * Main
 */
async function main() {
    log(colors.cyan, '\n╔════════════════════════════════════════════════════════════════╗');
    log(colors.cyan, '║                                                                ║');
    log(colors.cyan, '║   📦 Migración de Logs JSON a SQLite                          ║');
    log(colors.cyan, '║                                                                ║');
    log(colors.cyan, '╚════════════════════════════════════════════════════════════════╝\n');

    if (DRY_RUN) {
        log(colors.yellow, '⚠️  MODO DRY-RUN: No se realizarán cambios en la base de datos\n');
    }

    // Encontrar archivos
    const { logFiles, metricFiles } = findLogFiles();
    
    log(colors.blue, `📁 Archivos encontrados:`);
    log(colors.blue, `   Métricas: ${metricFiles.length}`);
    log(colors.blue, `   Logs: ${logFiles.length}`);

    if (metricFiles.length === 0 && logFiles.length === 0) {
        log(colors.yellow, '\n⚠️  No se encontraron archivos para migrar');
        return;
    }

    // Inicializar base de datos
    let db;
    if (!DRY_RUN) {
        log(colors.blue, '\n🗄️  Inicializando base de datos...');
        db = await getDatabase();
        log(colors.green, '✅ Base de datos lista');
    }

    const results = {
        metrics: [],
        logs: []
    };

    // Migrar archivos de métricas
    for (const file of metricFiles) {
        const result = await migrateMetricsFile(db, file);
        results.metrics.push(result);
    }

    // Migrar archivos de logs
    for (const file of logFiles) {
        const result = await migrateLogsFile(db, file);
        results.logs.push(result);
    }

    // Generar reporte
    generateReport(results);

    if (!DRY_RUN) {
        db.close();
        log(colors.green, '✅ Migración completada');
    } else {
        log(colors.yellow, '⚠️  Ejecuta sin --dry-run para realizar la migración');
    }
}

// Ejecutar
main().catch(error => {
    log(colors.red, '\n❌ Error fatal:', error);
    process.exit(1);
});
