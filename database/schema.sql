-- Schema para Sistema de Logging y Reportería
-- Base de datos SQLite para almacenar logs, métricas y sesiones de ejecución

-- ============================================================================
-- TABLA: sessions
-- Almacena información de sesiones de ejecución
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    status TEXT NOT NULL DEFAULT 'running', -- running, completed, failed
    total_duration INTEGER, -- en milisegundos
    total_agent_calls INTEGER DEFAULT 0,
    successful_calls INTEGER DEFAULT 0,
    failed_calls INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

-- ============================================================================
-- TABLA: agents
-- Registro de agentes con estadísticas agregadas
-- ============================================================================
CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    total_calls INTEGER DEFAULT 0,
    successful_calls INTEGER DEFAULT 0,
    failed_calls INTEGER DEFAULT 0,
    total_duration INTEGER DEFAULT 0, -- en milisegundos
    average_duration INTEGER DEFAULT 0, -- en milisegundos
    last_execution_time DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);
CREATE INDEX IF NOT EXISTS idx_agents_last_execution ON agents(last_execution_time DESC);

-- ============================================================================
-- TABLA: executions
-- Ejecuciones individuales de agentes
-- ============================================================================
CREATE TABLE IF NOT EXISTS executions (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    phase TEXT NOT NULL,
    start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    duration INTEGER, -- en milisegundos
    status TEXT NOT NULL DEFAULT 'running', -- running, success, failed
    output TEXT,
    error_message TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_executions_session ON executions(session_id);
CREATE INDEX IF NOT EXISTS idx_executions_agent ON executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_executions_phase ON executions(phase);
CREATE INDEX IF NOT EXISTS idx_executions_start_time ON executions(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_executions_status ON executions(status);

-- ============================================================================
-- TABLA: logs
-- Logs detallados del sistema
-- ============================================================================
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    level TEXT NOT NULL, -- info, warning, error, success
    message TEXT NOT NULL,
    agent_id TEXT,
    phase TEXT,
    execution_id TEXT,
    data TEXT, -- JSON adicional
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL,
    FOREIGN KEY (execution_id) REFERENCES executions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_logs_session ON logs(session_id);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_agent ON logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_logs_phase ON logs(phase);

-- ============================================================================
-- TABLA: phases
-- Fases de ejecución del sistema
-- ============================================================================
CREATE TABLE IF NOT EXISTS phases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    name TEXT NOT NULL,
    start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    status TEXT NOT NULL DEFAULT 'running', -- running, success, failed
    agent_calls INTEGER DEFAULT 0,
    duration INTEGER, -- en milisegundos
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    UNIQUE(session_id, name)
);

CREATE INDEX IF NOT EXISTS idx_phases_session ON phases(session_id);
CREATE INDEX IF NOT EXISTS idx_phases_name ON phases(name);
CREATE INDEX IF NOT EXISTS idx_phases_status ON phases(status);

-- ============================================================================
-- TABLA: metrics_snapshot
-- Snapshots periódicos de métricas para reportería histórica
-- ============================================================================
CREATE TABLE IF NOT EXISTS metrics_snapshot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    snapshot_data TEXT NOT NULL, -- JSON con métricas completas
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_metrics_session ON metrics_snapshot(session_id);
CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON metrics_snapshot(timestamp DESC);

-- ============================================================================
-- TRIGGERS
-- Actualización automática de timestamps
-- ============================================================================

-- Trigger para actualizar updated_at en sessions
CREATE TRIGGER IF NOT EXISTS update_sessions_timestamp 
AFTER UPDATE ON sessions
BEGIN
    UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para actualizar updated_at en agents
CREATE TRIGGER IF NOT EXISTS update_agents_timestamp 
AFTER UPDATE ON agents
BEGIN
    UPDATE agents SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger para actualizar updated_at en phases
CREATE TRIGGER IF NOT EXISTS update_phases_timestamp 
AFTER UPDATE ON phases
BEGIN
    UPDATE phases SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- ============================================================================
-- VISTAS
-- Vistas útiles para reportería
-- ============================================================================

-- Vista: Resumen de sesiones con estadísticas
CREATE VIEW IF NOT EXISTS v_sessions_summary AS
SELECT 
    s.id,
    s.start_time,
    s.end_time,
    s.status,
    s.total_duration,
    s.total_agent_calls,
    s.successful_calls,
    s.failed_calls,
    s.error_count,
    s.warning_count,
    ROUND(CAST(s.successful_calls AS REAL) / NULLIF(s.total_agent_calls, 0) * 100, 2) as success_rate,
    COUNT(DISTINCT e.agent_id) as unique_agents,
    COUNT(DISTINCT p.name) as total_phases
FROM sessions s
LEFT JOIN executions e ON s.id = e.session_id
LEFT JOIN phases p ON s.id = p.session_id
GROUP BY s.id;

-- Vista: Rendimiento de agentes
CREATE VIEW IF NOT EXISTS v_agent_performance AS
SELECT 
    a.id,
    a.name,
    a.total_calls,
    a.successful_calls,
    a.failed_calls,
    ROUND(CAST(a.successful_calls AS REAL) / NULLIF(a.total_calls, 0) * 100, 2) as success_rate,
    a.average_duration,
    a.last_execution_time,
    COUNT(DISTINCT e.session_id) as sessions_participated
FROM agents a
LEFT JOIN executions e ON a.id = e.agent_id
GROUP BY a.id;

-- Vista: Logs recientes con contexto
CREATE VIEW IF NOT EXISTS v_logs_recent AS
SELECT 
    l.id,
    l.timestamp,
    l.level,
    l.message,
    l.agent_id,
    a.name as agent_name,
    l.phase,
    l.session_id,
    s.status as session_status
FROM logs l
LEFT JOIN agents a ON l.agent_id = a.id
LEFT JOIN sessions s ON l.session_id = s.id
ORDER BY l.timestamp DESC
LIMIT 100;
