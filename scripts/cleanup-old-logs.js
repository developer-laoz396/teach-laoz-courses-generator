/**
 * Script de Limpieza de Logs Antiguos
 * 
 * Elimina logs y sesiones antiguas de la base de datos SQLite
 * Genera backups antes de eliminar
 * 
 * Uso: node scripts/cleanup-old-logs.js [--days=30] [--no-backup] [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { getDatabase } = require('../api/database');

// Parsear argumentos
const args = process.argv.slice(2);
const daysToKeep = parseInt(args.find(a => a.startsWith('--days='))?.split('=')[1] || '30');
const noBackup = args.includes('--no-backup');
const dryRun = args.includes('--dry-run');

const DB_PATH = path.join(__dirname, '..', 'database', 'logs.db');
const BACKUP_DIR = path.join(__dirname, '..', 'database', 'backups');

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

function log(color, ...args) {
    console.log(color, ...args, colors.reset);
}

/**
 * Crea un backup de la base de datos
 */
function createBackup() {
    try {
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(BACKUP_DIR, `logs-backup-${timestamp}.db`);

        fs.copyFileSync(DB_PATH, backupPath);

        const stats = fs.statSync(backupPath);
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

        log(colors.green, `✅ Backup creado: ${path.basename(backupPath)} (${sizeMB} MB)`);
        return backupPath;
    } catch (error) {
        log(colors.red, `❌ Error creando backup: ${error.message}`);
        throw error;
    }
}

/**
 * Limpia backups antiguos (mantiene solo los últimos 10)
 */
function cleanupOldBackups() {
    try {
        if (!fs.existsSync(BACKUP_DIR)) {
            return;
        }

        const backups = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.startsWith('logs-backup-') && f.endsWith('.db'))
            .map(f => ({
                name: f,
                path: path.join(BACKUP_DIR, f),
                time: fs.statSync(path.join(BACKUP_DIR, f)).mtime
            }))
            .sort((a, b) => b.time - a.time);

        if (backups.length > 10) {
            const toDelete = backups.slice(10);
            log(colors.yellow, `\n🧹 Limpiando backups antiguos (manteniendo últimos 10)...`);
            
            for (const backup of toDelete) {
                if (!dryRun) {
                    fs.unlinkSync(backup.path);
                }
                log(colors.yellow, `   Eliminado: ${backup.name}`);
            }
            
            log(colors.green, `✅ ${toDelete.length} backups antiguos eliminados`);
        }
    } catch (error) {
        log(colors.yellow, `⚠️  Error limpiando backups antiguos: ${error.message}`);
    }
}

/**
 * Obtiene estadísticas antes de la limpieza
 */
function getPreCleanupStats(db) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffISO = cutoffDate.toISOString();

    const stats = {
        totalLogs: db.query('SELECT COUNT(*) as count FROM logs')[0].count,
        totalSessions: db.query('SELECT COUNT(*) as count FROM sessions')[0].count,
        oldLogs: db.query(
            'SELECT COUNT(*) as count FROM logs WHERE timestamp < ?',
            [cutoffISO]
        )[0].count,
        oldSessions: db.query(
            'SELECT COUNT(*) as count FROM sessions WHERE start_time < ?',
            [cutoffISO]
        )[0].count,
        cutoffDate: cutoffISO
    };

    return stats;
}

/**
 * Genera snapshot de métricas antes de eliminar
 */
function saveMetricsSnapshot(db, stats) {
    try {
        const sessions = db.query(`
            SELECT * FROM sessions 
            WHERE start_time < ?
            ORDER BY start_time DESC
        `, [stats.cutoffDate]);

        const snapshotData = {
            cleanup_date: new Date().toISOString(),
            days_kept: daysToKeep,
            cutoff_date: stats.cutoffDate,
            sessions_deleted: sessions.length,
            logs_deleted: stats.oldLogs,
            sessions_summary: sessions.map(s => ({
                id: s.id,
                start_time: s.start_time,
                total_calls: s.total_agent_calls,
                successful: s.successful_calls,
                failed: s.failed_calls
            }))
        };

        const snapshotPath = path.join(
            BACKUP_DIR,
            `cleanup-snapshot-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
        );

        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }

        if (!dryRun) {
            fs.writeFileSync(snapshotPath, JSON.stringify(snapshotData, null, 2));
            log(colors.green, `✅ Snapshot de métricas guardado: ${path.basename(snapshotPath)}`);
        }

        return snapshotData;
    } catch (error) {
        log(colors.yellow, `⚠️  Error guardando snapshot: ${error.message}`);
        return null;
    }
}

/**
 * Realiza la limpieza
 */
function performCleanup(db, stats) {
    log(colors.blue, '\n🧹 Iniciando limpieza...\n');

    // Eliminar logs antiguos
    if (stats.oldLogs > 0) {
        if (!dryRun) {
            const result = db.cleanupOldLogs(daysToKeep);
            log(colors.green, `✅ Logs eliminados: ${result.changes}`);
        } else {
            log(colors.yellow, `[DRY-RUN] Se eliminarían ${stats.oldLogs} logs`);
        }
    } else {
        log(colors.cyan, '   No hay logs antiguos para eliminar');
    }

    // Eliminar sesiones antiguas
    if (stats.oldSessions > 0) {
        if (!dryRun) {
            const result = db.cleanupOldSessions(daysToKeep);
            log(colors.green, `✅ Sesiones eliminadas: ${result.changes}`);
        } else {
            log(colors.yellow, `[DRY-RUN] Se eliminarían ${stats.oldSessions} sesiones`);
        }
    } else {
        log(colors.cyan, '   No hay sesiones antiguas para eliminar');
    }

    // Vacuum para recuperar espacio
    if (!dryRun && (stats.oldLogs > 0 || stats.oldSessions > 0)) {
        log(colors.blue, '\n🔧 Optimizando base de datos (VACUUM)...');
        db.db.exec('VACUUM');
        log(colors.green, '✅ Base de datos optimizada');
    }
}

/**
 * Genera reporte final
 */
function generateReport(preStats, postStats) {
    log(colors.cyan, '\n' + '='.repeat(70));
    log(colors.cyan, '📊 REPORTE DE LIMPIEZA');
    log(colors.cyan, '='.repeat(70));

    log(colors.blue, `\n📅 Configuración:`);
    log(colors.blue, `   Días de retención: ${daysToKeep}`);
    log(colors.blue, `   Fecha de corte: ${new Date(preStats.cutoffDate).toLocaleString('es-ES')}`);

    log(colors.magenta, `\n📊 Antes de la limpieza:`);
    log(colors.magenta, `   Total de logs: ${preStats.totalLogs.toLocaleString()}`);
    log(colors.magenta, `   Total de sesiones: ${preStats.totalSessions.toLocaleString()}`);
    log(colors.magenta, `   Logs antiguos: ${preStats.oldLogs.toLocaleString()}`);
    log(colors.magenta, `   Sesiones antiguas: ${preStats.oldSessions.toLocaleString()}`);

    if (postStats) {
        log(colors.green, `\n✅ Después de la limpieza:`);
        log(colors.green, `   Total de logs: ${postStats.totalLogs.toLocaleString()}`);
        log(colors.green, `   Total de sesiones: ${postStats.totalSessions.toLocaleString()}`);
        
        const logsDeleted = preStats.totalLogs - postStats.totalLogs;
        const sessionsDeleted = preStats.totalSessions - postStats.totalSessions;
        
        log(colors.green, `\n🗑️  Eliminados:`);
        log(colors.green, `   Logs: ${logsDeleted.toLocaleString()}`);
        log(colors.green, `   Sesiones: ${sessionsDeleted.toLocaleString()}`);

        // Calcular espacio liberado (estimado)
        const avgLogSize = 200; // bytes estimados por log
        const spaceSavedMB = ((logsDeleted * avgLogSize) / 1024 / 1024).toFixed(2);
        log(colors.green, `   Espacio liberado (estimado): ${spaceSavedMB} MB`);
    }

    log(colors.cyan, '\n' + '='.repeat(70) + '\n');
}

/**
 * Main
 */
async function main() {
    log(colors.cyan, '\n╔════════════════════════════════════════════════════════════════╗');
    log(colors.cyan, '║                                                                ║');
    log(colors.cyan, '║   🧹 Limpieza de Logs Antiguos                                ║');
    log(colors.cyan, '║                                                                ║');
    log(colors.cyan, '╚════════════════════════════════════════════════════════════════╝\n');

    if (dryRun) {
        log(colors.yellow, '⚠️  MODO DRY-RUN: No se realizarán cambios\n');
    }

    if (noBackup) {
        log(colors.yellow, '⚠️  Modo --no-backup: No se creará backup de la BD\n');
    }

    // Verificar que existe la base de datos
    if (!fs.existsSync(DB_PATH)) {
        log(colors.red, '❌ Base de datos no encontrada:', DB_PATH);
        process.exit(1);
    }

    // Inicializar base de datos
    log(colors.blue, '🗄️  Conectando a la base de datos...');
    const db = await getDatabase();
    log(colors.green, '✅ Conectado\n');

    // Obtener estadísticas pre-limpieza
    const preStats = getPreCleanupStats(db);

    log(colors.blue, `📊 Estado actual:`);
    log(colors.blue, `   Total de logs: ${preStats.totalLogs.toLocaleString()}`);
    log(colors.blue, `   Total de sesiones: ${preStats.totalSessions.toLocaleString()}`);
    log(colors.blue, `   Logs antiguos (>${daysToKeep} días): ${preStats.oldLogs.toLocaleString()}`);
    log(colors.blue, `   Sesiones antiguas (>${daysToKeep} días): ${preStats.oldSessions.toLocaleString()}`);

    if (preStats.oldLogs === 0 && preStats.oldSessions === 0) {
        log(colors.green, '\n✅ No hay datos antiguos para limpiar');
        db.close();
        return;
    }

    // Crear backup
    if (!noBackup && !dryRun) {
        log(colors.blue, '\n💾 Creando backup de la base de datos...');
        createBackup();
    }

    // Guardar snapshot de métricas
    if (!dryRun) {
        log(colors.blue, '\n📸 Guardando snapshot de métricas...');
        saveMetricsSnapshot(db, preStats);
    }

    // Realizar limpieza
    performCleanup(db, preStats);

    // Obtener estadísticas post-limpieza
    let postStats = null;
    if (!dryRun) {
        postStats = {
            totalLogs: db.query('SELECT COUNT(*) as count FROM logs')[0].count,
            totalSessions: db.query('SELECT COUNT(*) as count FROM sessions')[0].count
        };
    }

    // Limpiar backups antiguos
    if (!noBackup && !dryRun) {
        cleanupOldBackups();
    }

    // Generar reporte
    generateReport(preStats, postStats);

    db.close();

    if (dryRun) {
        log(colors.yellow, '⚠️  Ejecuta sin --dry-run para realizar la limpieza');
    } else {
        log(colors.green, '✅ Limpieza completada exitosamente');
    }
}

// Ejecutar
main().catch(error => {
    log(colors.red, '\n❌ Error fatal:', error);
    process.exit(1);
});
