const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'logs.db');
const SCHEMA_PATH = path.join(__dirname, '..', 'database', 'schema.sql');

class LogDatabase {
    constructor() {
        this.db = null;
        this.SQL = null;
    }

    /**
     * Inicializa la base de datos y aplica el schema
     */
    async initialize() {
        try {
            // Asegurar que el directorio existe
            const dbDir = path.dirname(DB_PATH);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            // Inicializar SQL.js
            this.SQL = await initSqlJs();

            // Cargar o crear base de datos
            if (fs.existsSync(DB_PATH)) {
                const buffer = fs.readFileSync(DB_PATH);
                this.db = new this.SQL.Database(buffer);
                console.log(`✅ Base de datos cargada: ${DB_PATH}`);
            } else {
                this.db = new this.SQL.Database();
                console.log(`✅ Nueva base de datos creada: ${DB_PATH}`);
            }

            // Aplicar schema
            const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
            this.db.exec(schema);

            // Habilitar foreign keys
            this.db.run('PRAGMA foreign_keys = ON');

            console.log(`✅ Base de datos inicializada correctamente`);
            return true;
        } catch (error) {
            console.error('❌ Error inicializando base de datos:', error);
            throw error;
        }
    }

    /**
     * Guarda la base de datos en disco
     */
    save() {
        if (this.db) {
            const data = this.db.export();
            const buffer = Buffer.from(data);
            fs.writeFileSync(DB_PATH, buffer);
        }
    }

    /**
     * Cierra la conexión a la base de datos
     */
    close() {
        if (this.db) {
            this.save();
            this.db.close();
            console.log('🔒 Conexión a base de datos cerrada');
        }
    }

    /**
     * Ejecuta una consulta y devuelve los resultados
     */
    query(sql, params = []) {
        const stmt = this.db.prepare(sql);
        stmt.bind(params);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }

    /**
     * Ejecuta una consulta y devuelve el primer resultado
     */
    queryOne(sql, params = []) {
        const results = this.query(sql, params);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Ejecuta una consulta de modificación (INSERT, UPDATE, DELETE)
     */
    run(sql, params = []) {
        this.db.run(sql, params);
        this.save();
        return {
            changes: this.db.getRowsModified(),
            lastInsertRowid: this.db.exec('SELECT last_insert_rowid() as id')[0]?.values[0]?.[0]
        };
    }

    // ========================================================================
    // SESSIONS
    // ========================================================================

    createSession(id) {
        return this.run(`
            INSERT INTO sessions (id, start_time, status)
            VALUES (?, datetime('now'), 'running')
        `, [id]);
    }

    getCurrentSession() {
        return this.queryOne(`
            SELECT * FROM sessions 
            WHERE status = 'running' 
            ORDER BY start_time DESC 
            LIMIT 1
        `);
    }

    getSession(id) {
        return this.queryOne('SELECT * FROM sessions WHERE id = ?', [id]);
    }

    listSessions(limit = 50, offset = 0) {
        return this.query(`
            SELECT * FROM v_sessions_summary 
            ORDER BY start_time DESC 
            LIMIT ? OFFSET ?
        `, [limit, offset]);
    }

    updateSession(id, updates) {
        const fields = [];
        const values = [];

        if (updates.status) {
            fields.push('status = ?');
            values.push(updates.status);
        }
        if (updates.end_time) {
            fields.push('end_time = ?');
            values.push(updates.end_time);
        }
        if (updates.total_duration !== undefined) {
            fields.push('total_duration = ?');
            values.push(updates.total_duration);
        }

        if (fields.length === 0) return;

        values.push(id);
        return this.run(`UPDATE sessions SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    incrementSessionCounters(sessionId, counters) {
        const updates = [];
        const values = [];

        if (counters.total_agent_calls) {
            updates.push('total_agent_calls = total_agent_calls + ?');
            values.push(counters.total_agent_calls);
        }
        if (counters.successful_calls) {
            updates.push('successful_calls = successful_calls + ?');
            values.push(counters.successful_calls);
        }
        if (counters.failed_calls) {
            updates.push('failed_calls = failed_calls + ?');
            values.push(counters.failed_calls);
        }
        if (counters.error_count) {
            updates.push('error_count = error_count + ?');
            values.push(counters.error_count);
        }
        if (counters.warning_count) {
            updates.push('warning_count = warning_count + ?');
            values.push(counters.warning_count);
        }

        if (updates.length === 0) return;

        values.push(sessionId);
        return this.run(`UPDATE sessions SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    // ========================================================================
    // AGENTS
    // ========================================================================

    upsertAgent(id, name) {
        return this.run(`
            INSERT INTO agents (id, name, total_calls)
            VALUES (?, ?, 0)
            ON CONFLICT(id) DO UPDATE SET name = excluded.name
        `, [id, name]);
    }

    getAgent(id) {
        return this.queryOne('SELECT * FROM agents WHERE id = ?', [id]);
    }

    listAgents() {
        return this.query('SELECT * FROM v_agent_performance ORDER BY total_calls DESC');
    }

    updateAgentStats(agentId, stats) {
        return this.run(`
            UPDATE agents SET
                total_calls = total_calls + 1,
                successful_calls = successful_calls + ?,
                failed_calls = failed_calls + ?,
                total_duration = total_duration + ?,
                average_duration = (total_duration + ?) / (total_calls + 1),
                last_execution_time = datetime('now')
            WHERE id = ?
        `, [
            stats.success ? 1 : 0,
            stats.success ? 0 : 1,
            stats.duration || 0,
            stats.duration || 0,
            agentId
        ]);
    }

    // ========================================================================
    // EXECUTIONS
    // ========================================================================

    createExecution(data) {
        return this.run(`
            INSERT INTO executions (id, session_id, agent_id, phase, start_time, status)
            VALUES (?, ?, ?, ?, datetime('now'), 'running')
        `, [data.id, data.session_id, data.agent_id, data.phase]);
    }

    completeExecution(id, data) {
        return this.run(`
            UPDATE executions SET
                end_time = datetime('now'),
                duration = ?,
                status = ?,
                output = ?,
                error_message = ?
            WHERE id = ?
        `, [data.duration, data.status, data.output || null, data.error_message || null, id]);
    }

    getAgentExecutions(agentId, limit = 50) {
        return this.query(`
            SELECT * FROM executions 
            WHERE agent_id = ? 
            ORDER BY start_time DESC 
            LIMIT ?
        `, [agentId, limit]);
    }

    // ========================================================================
    // LOGS
    // ========================================================================

    insertLog(data) {
        return this.run(`
            INSERT INTO logs (session_id, timestamp, level, message, agent_id, phase, execution_id, data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            data.session_id,
            data.timestamp || new Date().toISOString(),
            data.level,
            data.message,
            data.agent_id || null,
            data.phase || null,
            data.execution_id || null,
            data.data ? JSON.stringify(data.data) : null
        ]);
    }

    getLogs(filters = {}) {
        let query = 'SELECT * FROM logs WHERE 1=1';
        const params = [];

        if (filters.session_id) {
            query += ' AND session_id = ?';
            params.push(filters.session_id);
        }
        if (filters.level) {
            query += ' AND level = ?';
            params.push(filters.level);
        }
        if (filters.agent_id) {
            query += ' AND agent_id = ?';
            params.push(filters.agent_id);
        }
        if (filters.phase) {
            query += ' AND phase = ?';
            params.push(filters.phase);
        }
        if (filters.start_date) {
            query += ' AND timestamp >= ?';
            params.push(filters.start_date);
        }
        if (filters.end_date) {
            query += ' AND timestamp <= ?';
            params.push(filters.end_date);
        }

        query += ' ORDER BY timestamp DESC';

        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(filters.limit);
        }

        return this.query(query, params);
    }

    deleteSessionLogs(sessionId) {
        return this.run('DELETE FROM logs WHERE session_id = ?', [sessionId]);
    }

    // ========================================================================
    // PHASES
    // ========================================================================

    upsertPhase(sessionId, name) {
        return this.run(`
            INSERT INTO phases (session_id, name, start_time, status)
            VALUES (?, ?, datetime('now'), 'running')
            ON CONFLICT(session_id, name) DO UPDATE SET
                status = 'running',
                agent_calls = agent_calls + 1
        `, [sessionId, name]);
    }

    updatePhase(sessionId, name, status) {
        return this.run(`
            UPDATE phases SET
                status = ?,
                end_time = datetime('now'),
                duration = (julianday(datetime('now')) - julianday(start_time)) * 86400000
            WHERE session_id = ? AND name = ?
        `, [status, sessionId, name]);
    }

    getSessionPhases(sessionId) {
        return this.query(`
            SELECT * FROM phases 
            WHERE session_id = ? 
            ORDER BY start_time ASC
        `, [sessionId]);
    }

    // ========================================================================
    // METRICS & REPORTS
    // ========================================================================

    saveMetricsSnapshot(sessionId, metricsData) {
        return this.run(`
            INSERT INTO metrics_snapshot (session_id, timestamp, snapshot_data)
            VALUES (?, datetime('now'), ?)
        `, [sessionId, JSON.stringify(metricsData)]);
    }

    getCurrentMetrics() {
        const session = this.getCurrentSession();
        if (!session) return null;

        // Get agents with their executions
        const agentsData = this.query(`
            SELECT DISTINCT a.* FROM agents a
            LEFT JOIN executions e ON a.id = e.agent_id
            WHERE e.session_id = ? OR a.id IS NOT NULL
        `, [session.id]);

        const agents = agentsData.map(agent => {
            const executions = this.query(`
                SELECT id, phase, start_time, duration, status
                FROM executions
                WHERE agent_id = ? AND session_id = ?
                ORDER BY start_time DESC
            `, [agent.id, session.id]);

            return {
                ...agent,
                executions
            };
        });

        const phases = this.getSessionPhases(session.id);
        const recentLogs = this.getLogs({ session_id: session.id, limit: 20 });

        return {
            session,
            agents,
            phases,
            logs: recentLogs
        };
    }

    getPerformanceReport() {
        return this.query(`
            SELECT * FROM v_agent_performance
            ORDER BY total_calls DESC
        `);
    }

    getErrorReport(limit = 100) {
        return this.query(`
            SELECT * FROM logs 
            WHERE level IN ('error', 'warning')
            ORDER BY timestamp DESC
            LIMIT ?
        `, [limit]);
    }

    getExecutionTimeline(sessionId = null) {
        if (sessionId) {
            return this.query(`
                SELECT 
                    e.id,
                    e.start_time,
                    e.end_time,
                    e.duration,
                    e.status,
                    e.phase,
                    a.name as agent_name,
                    s.id as session_id
                FROM executions e
                JOIN agents a ON e.agent_id = a.id
                JOIN sessions s ON e.session_id = s.id
                WHERE e.session_id = ?
                ORDER BY e.start_time ASC
            `, [sessionId]);
        } else {
            return this.query(`
                SELECT 
                    e.id,
                    e.start_time,
                    e.end_time,
                    e.duration,
                    e.status,
                    e.phase,
                    a.name as agent_name,
                    s.id as session_id
                FROM executions e
                JOIN agents a ON e.agent_id = a.id
                JOIN sessions s ON e.session_id = s.id
                ORDER BY e.start_time ASC
            `);
        }
    }

    // ========================================================================
    // CLEANUP
    // ========================================================================

    cleanupOldLogs(daysToKeep = 30) {
        const result = this.run(`
            DELETE FROM logs 
            WHERE timestamp < datetime('now', '-' || ? || ' days')
        `, [daysToKeep]);
        console.log(`🧹 Eliminados ${result.changes} logs antiguos (>${daysToKeep} días)`);
        return result;
    }

    cleanupOldSessions(daysToKeep = 30) {
        const result = this.run(`
            DELETE FROM sessions 
            WHERE start_time < datetime('now', '-' || ? || ' days')
        `, [daysToKeep]);
        console.log(`🧹 Eliminadas ${result.changes} sesiones antiguas (>${daysToKeep} días)`);
        return result;
    }
}

// Singleton instance
let instance = null;

async function getDatabase() {
    if (!instance) {
        instance = new LogDatabase();
        await instance.initialize();
    }
    return instance;
}

module.exports = {
    LogDatabase,
    getDatabase
};

// Si se ejecuta directamente, inicializar la BD
if (require.main === module) {
    (async () => {
        const db = new LogDatabase();
        await db.initialize();
        console.log('✅ Base de datos inicializada correctamente');
        db.close();
    })();
}
