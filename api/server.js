require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { getDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan(process.env.LOG_LEVEL || 'dev'));

// Servir archivos estáticos (dashboard)
app.use('/reports', express.static(path.join(__dirname, '..', 'reports')));

// Variable para almacenar la instancia de BD
let db = null;

// Inicializar base de datos de forma asíncrona
(async () => {
    db = await getDatabase();
    console.log('✅ Base de datos lista');
})();

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// LOGS ENDPOINTS
// ============================================================================

/**
 * GET /api/logs
 * Obtiene logs con filtros opcionales
 * Query params: session_id, level, agent_id, phase, start_date, end_date, limit
 */
app.get('/api/logs', (req, res) => {
    try {
        const filters = {
            session_id: req.query.session_id,
            level: req.query.level,
            agent_id: req.query.agent_id,
            phase: req.query.phase,
            start_date: req.query.start_date,
            end_date: req.query.end_date,
            limit: req.query.limit ? parseInt(req.query.limit) : 100
        };

        const logs = db.getLogs(filters);
        res.json({ success: true, count: logs.length, data: logs });
    } catch (error) {
        console.error('Error obteniendo logs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/logs
 * Registra un nuevo log
 * Body: { session_id, level, message, agent_id?, phase?, execution_id?, data? }
 */
app.post('/api/logs', (req, res) => {
    try {
        const { session_id, level, message, agent_id, phase, execution_id, data } = req.body;

        if (!session_id || !level || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Faltan campos requeridos: session_id, level, message' 
            });
        }

        const result = db.insertLog({
            session_id,
            level,
            message,
            agent_id,
            phase,
            execution_id,
            data,
            timestamp: new Date().toISOString()
        });

        // Actualizar contadores de sesión
        if (level === 'error') {
            db.incrementSessionCounters(session_id, { error_count: 1 });
        } else if (level === 'warning') {
            db.incrementSessionCounters(session_id, { warning_count: 1 });
        }

        res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        console.error('Error insertando log:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/logs/:sessionId
 * Elimina todos los logs de una sesión
 */
app.delete('/api/logs/:sessionId', (req, res) => {
    try {
        const result = db.deleteSessionLogs(req.params.sessionId);
        res.json({ success: true, deleted: result.changes });
    } catch (error) {
        console.error('Error eliminando logs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================================================
// SESSIONS ENDPOINTS
// ============================================================================

/**
 * GET /api/sessions
 * Lista todas las sesiones con paginación
 * Query params: limit, offset
 */
app.get('/api/sessions', (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 50;
        const offset = req.query.offset ? parseInt(req.query.offset) : 0;

        const sessions = db.listSessions(limit, offset);
        res.json({ success: true, count: sessions.length, data: sessions });
    } catch (error) {
        console.error('Error listando sesiones:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/sessions/current
 * Obtiene la sesión activa actual
 */
app.get('/api/sessions/current', (req, res) => {
    try {
        const session = db.getCurrentSession();
        if (!session) {
            return res.status(404).json({ success: false, error: 'No hay sesión activa' });
        }
        res.json({ success: true, data: session });
    } catch (error) {
        console.error('Error obteniendo sesión actual:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/sessions/:id
 * Obtiene detalles de una sesión específica
 */
app.get('/api/sessions/:id', (req, res) => {
    try {
        const session = db.getSession(req.params.id);
        if (!session) {
            return res.status(404).json({ success: false, error: 'Sesión no encontrada' });
        }

        const phases = db.getSessionPhases(req.params.id);
        const logs = db.getLogs({ session_id: req.params.id, limit: 100 });

        res.json({ 
            success: true, 
            data: { 
                ...session, 
                phases, 
                recent_logs: logs 
            } 
        });
    } catch (error) {
        console.error('Error obteniendo sesión:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/sessions
 * Crea una nueva sesión
 * Body: { id }
 */
app.post('/api/sessions', (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, error: 'Se requiere ID de sesión' });
        }

        db.createSession(id);
        res.status(201).json({ success: true, id });
    } catch (error) {
        console.error('Error creando sesión:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/sessions/:id
 * Actualiza una sesión
 * Body: { status?, end_time?, total_duration? }
 */
app.patch('/api/sessions/:id', (req, res) => {
    try {
        const updates = {};
        if (req.body.status) updates.status = req.body.status;
        if (req.body.end_time) updates.end_time = req.body.end_time;
        if (req.body.total_duration !== undefined) updates.total_duration = req.body.total_duration;

        db.updateSession(req.params.id, updates);
        res.json({ success: true });
    } catch (error) {
        console.error('Error actualizando sesión:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================================================
// METRICS ENDPOINTS
// ============================================================================

/**
 * GET /api/metrics/current
 * Obtiene métricas de la sesión actual
 */
app.get('/api/metrics/current', (req, res) => {
    try {
        const metrics = db.getCurrentMetrics();
        if (!metrics) {
            return res.status(404).json({ success: false, error: 'No hay sesión activa' });
        }

        // Formatear para compatibilidad con el dashboard existente
        const formatted = {
            sessionId: metrics.session.id,
            startTime: metrics.session.start_time,
            status: metrics.session.status,
            totalDuration: metrics.session.total_duration,
            summary: {
                totalAgentCalls: metrics.session.total_agent_calls,
                successfulCalls: metrics.session.successful_calls,
                failedCalls: metrics.session.failed_calls,
                successRate: metrics.session.total_agent_calls > 0 
                    ? Math.round((metrics.session.successful_calls / metrics.session.total_agent_calls) * 100)
                    : 100
            },
            agents: metrics.agents.reduce((acc, agent) => {
                acc[agent.id] = {
                    id: agent.id,
                    name: agent.name,
                    totalCalls: agent.total_calls,
                    successfulCalls: agent.successful_calls,
                    failedCalls: agent.failed_calls,
                    averageDuration: agent.average_duration,
                    executions: agent.executions.map(e => ({
                        executionId: e.id,
                        phase: e.phase,
                        startTime: e.start_time,
                        startTimestamp: new Date(e.start_time).getTime(),
                        duration: e.duration,
                        status: e.status
                    }))
                };
                return acc;
            }, {}),
            phases: metrics.phases.reduce((acc, phase) => {
                acc[phase.name] = {
                    name: phase.name,
                    startTime: phase.start_time,
                    status: phase.status,
                    agentCalls: phase.agent_calls,
                    duration: phase.duration
                };
                return acc;
            }, {}),
            errors: metrics.logs.filter(l => l.level === 'error'),
            warnings: metrics.logs.filter(l => l.level === 'warning')
        };

        res.json(formatted);
    } catch (error) {
        console.error('Error obteniendo métricas actuales:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/metrics/session/:id
 * Obtiene métricas de una sesión específica
 */
app.get('/api/metrics/session/:id', (req, res) => {
    try {
        const session = db.getSession(req.params.id);
        if (!session) {
            return res.status(404).json({ success: false, error: 'Sesión no encontrada' });
        }

        const phases = db.getSessionPhases(req.params.id);
        const logs = db.getLogs({ session_id: req.params.id });

        res.json({
            success: true,
            data: {
                session,
                phases,
                logs_summary: {
                    total: logs.length,
                    errors: logs.filter(l => l.level === 'error').length,
                    warnings: logs.filter(l => l.level === 'warning').length,
                    info: logs.filter(l => l.level === 'info').length
                }
            }
        });
    } catch (error) {
        console.error('Error obteniendo métricas de sesión:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/metrics/summary
 * Resumen agregado de todas las sesiones
 */
app.get('/api/metrics/summary', (req, res) => {
    try {
        const sessions = db.listSessions(1000, 0);
        const agents = db.listAgents();

        const summary = {
            total_sessions: sessions.length,
            total_agent_calls: sessions.reduce((sum, s) => sum + (s.total_agent_calls || 0), 0),
            total_successful: sessions.reduce((sum, s) => sum + (s.successful_calls || 0), 0),
            total_failed: sessions.reduce((sum, s) => sum + (s.failed_calls || 0), 0),
            total_errors: sessions.reduce((sum, s) => sum + (s.error_count || 0), 0),
            total_warnings: sessions.reduce((sum, s) => sum + (s.warning_count || 0), 0),
            agents: agents.length,
            top_agents: agents.slice(0, 10)
        };

        res.json({ success: true, data: summary });
    } catch (error) {
        console.error('Error obteniendo resumen de métricas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================================================
// AGENTS ENDPOINTS
// ============================================================================

/**
 * GET /api/agents
 * Lista todos los agentes con estadísticas
 */
app.get('/api/agents', (req, res) => {
    try {
        const agents = db.listAgents();
        res.json({ success: true, count: agents.length, data: agents });
    } catch (error) {
        console.error('Error listando agentes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/agents/:id/executions
 * Obtiene historial de ejecuciones de un agente
 * Query params: limit
 */
app.get('/api/agents/:id/executions', (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 50;
        const executions = db.getAgentExecutions(req.params.id, limit);
        res.json({ success: true, count: executions.length, data: executions });
    } catch (error) {
        console.error('Error obteniendo ejecuciones de agente:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================================================
// REPORTS ENDPOINTS
// ============================================================================

/**
 * GET /api/reports/performance
 * Reporte de rendimiento por agente
 */
app.get('/api/reports/performance', (req, res) => {
    try {
        const report = db.getPerformanceReport();
        res.json({ success: true, data: report });
    } catch (error) {
        console.error('Error generando reporte de rendimiento:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/reports/errors
 * Análisis de errores y warnings
 * Query params: limit
 */
app.get('/api/reports/errors', (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 100;
        const errors = db.getErrorReport(limit);
        
        const analysis = {
            total_errors: errors.filter(e => e.level === 'error').length,
            total_warnings: errors.filter(e => e.level === 'warning').length,
            by_agent: {},
            by_phase: {},
            recent: errors.slice(0, 20)
        };

        errors.forEach(err => {
            if (err.agent_id) {
                analysis.by_agent[err.agent_id] = (analysis.by_agent[err.agent_id] || 0) + 1;
            }
            if (err.phase) {
                analysis.by_phase[err.phase] = (analysis.by_phase[err.phase] || 0) + 1;
            }
        });

        res.json({ success: true, data: analysis });
    } catch (error) {
        console.error('Error generando reporte de errores:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/reports/timeline
 * Timeline de ejecuciones
 * Query params: session_id
 */
app.get('/api/reports/timeline', (req, res) => {
    try {
        const sessionId = req.query.session_id || null;
        const timeline = db.getExecutionTimeline(sessionId);
        res.json({ success: true, count: timeline.length, data: timeline });
    } catch (error) {
        console.error('Error generando timeline:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================================================
// UTILITY ENDPOINTS
// ============================================================================

/**
 * POST /api/cleanup
 * Limpia logs y sesiones antiguas
 * Body: { days? }
 */
app.post('/api/cleanup', (req, res) => {
    try {
        const days = req.body.days || parseInt(process.env.LOG_RETENTION_DAYS) || 30;
        
        const logsResult = db.cleanupOldLogs(days);
        const sessionsResult = db.cleanupOldSessions(days);

        res.json({
            success: true,
            deleted: {
                logs: logsResult.changes,
                sessions: sessionsResult.changes
            }
        });
    } catch (error) {
        console.error('Error en limpieza:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint no encontrado' });
});

app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
});

// ============================================================================
// START SERVER
// ============================================================================

const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🚀 Servidor API de Logging iniciado                         ║
║                                                                ║
║   📍 URL: http://localhost:${PORT}                              ║
║   📊 Dashboard: http://localhost:${PORT}/reports/live-monitor.html ║
║   🗄️  Base de datos: ${process.env.DB_PATH || 'database/logs.db'}                    ║
║   🌍 Entorno: ${process.env.NODE_ENV || 'development'}                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('⚠️  SIGTERM recibido, cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado');
        db.close();
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n⚠️  SIGINT recibido, cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado');
        db.close();
        process.exit(0);
    });
});

module.exports = app;
