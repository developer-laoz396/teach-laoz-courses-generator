# API de Logging y Reportería

Sistema de logging y reportería basado en SQLite con API REST para el generador de cursos Teach Laoz.

## 🚀 Inicio Rápido

### Opción 1: Script PowerShell (Recomendado)

```powershell
# Iniciar en modo producción
.\start-api.ps1

# Iniciar en modo desarrollo (con auto-reload)
.\start-api.ps1 -Dev

# Iniciar sin abrir el navegador
.\start-api.ps1 -NoBrowser
```

### Opción 2: NPM Scripts

```bash
# Inicializar base de datos
npm run api:init-db

# Iniciar servidor en producción
npm run api:start

# Iniciar en modo desarrollo (desde directorio api/)
cd api
npm run dev
```

## 📊 Acceso al Dashboard

Una vez iniciado el servidor, accede al dashboard en:

**<http://localhost:3001/reports/live-monitor.html>**

## 🗄️ Base de Datos

### Ubicación

La base de datos SQLite se almacena en: `database/logs.db`

### Esquema

El sistema utiliza las siguientes tablas:

- **sessions**: Sesiones de ejecución
- **agents**: Agentes registrados con estadísticas
- **executions**: Ejecuciones individuales de agentes
- **logs**: Logs detallados del sistema
- **phases**: Fases de ejecución
- **metrics_snapshot**: Snapshots de métricas para reportería

### Inicialización Manual

```bash
node api/database.js
```

## 🔌 API Endpoints

### Logs

- `GET /api/logs` - Obtener logs con filtros
  - Query params: `session_id`, `level`, `agent_id`, `phase`, `start_date`, `end_date`, `limit`
- `POST /api/logs` - Registrar nuevo log
  - Body: `{ session_id, level, message, agent_id?, phase?, execution_id?, data? }`
- `DELETE /api/logs/:sessionId` - Eliminar logs de una sesión

### Sesiones

- `GET /api/sessions` - Listar sesiones
  - Query params: `limit`, `offset`
- `GET /api/sessions/current` - Obtener sesión activa
- `GET /api/sessions/:id` - Detalles de sesión específica
- `POST /api/sessions` - Crear nueva sesión
  - Body: `{ id }`
- `PATCH /api/sessions/:id` - Actualizar sesión
  - Body: `{ status?, end_time?, total_duration? }`

### Métricas

- `GET /api/metrics/current` - Métricas de sesión actual
- `GET /api/metrics/session/:id` - Métricas de sesión específica
- `GET /api/metrics/summary` - Resumen agregado de todas las sesiones

### Agentes

- `GET /api/agents` - Listar agentes con estadísticas
- `GET /api/agents/:id/executions` - Historial de ejecuciones
  - Query params: `limit`

### Reportes

- `GET /api/reports/performance` - Reporte de rendimiento por agente
- `GET /api/reports/errors` - Análisis de errores y warnings
  - Query params: `limit`
- `GET /api/reports/timeline` - Timeline de ejecuciones
  - Query params: `session_id`

### Utilidades

- `GET /health` - Health check del servidor
- `POST /api/cleanup` - Limpiar logs y sesiones antiguas
  - Body: `{ days? }`

## 📝 Uso del Cliente de Logging

### Desde Scripts

```javascript
// Usar la API (por defecto)
node scripts/log_event.js "AgentName" "phase" "Mensaje" "info"

// Forzar uso de archivos JSON
USE_API=false node scripts/log_event.js "AgentName" "phase" "Mensaje" "info"
```

### Niveles de Log

- `info` - Información general
- `success` - Operación exitosa
- `warning` - Advertencia
- `error` - Error

### Fallback Automático

El cliente de logging intentará usar la API primero. Si no está disponible, automáticamente guardará en archivos JSON (`logs/logs-current.json`, `logs/metrics-current.json`).

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en el directorio `api/` (o copia `.env.example`):

```env
PORT=3001
DB_PATH=../database/logs.db
LOG_RETENTION_DAYS=30
CORS_ORIGIN=*
NODE_ENV=development
LOG_LEVEL=dev
```

### Configuración del Cliente

Variables de entorno para `log_event.js`:

```bash
API_URL=http://localhost:3001  # URL de la API
USE_API=true                    # true/false para habilitar/deshabilitar API
```

## 🧹 Mantenimiento

### Limpiar Logs Antiguos

```bash
# Vía API
curl -X POST http://localhost:3001/api/cleanup -H "Content-Type: application/json" -d '{"days": 30}'

# O desde PowerShell
Invoke-RestMethod -Method Post -Uri "http://localhost:3001/api/cleanup" -ContentType "application/json" -Body '{"days": 30}'
```

### Backup de Base de Datos

```powershell
# Copiar archivo de base de datos
Copy-Item database\logs.db database\logs.backup.db
```

## 🐛 Troubleshooting

### El servidor no inicia

1. Verifica que el puerto 3001 no esté en uso
2. Asegúrate de que las dependencias estén instaladas: `cd api && npm install`
3. Revisa los logs de error en la consola

### Los logs no se registran

1. Verifica que el servidor API esté corriendo
2. Comprueba la conectividad: `curl http://localhost:3001/health`
3. Revisa que la sesión esté creada: `curl http://localhost:3001/api/sessions/current`

### El dashboard no carga datos

1. Abre la consola del navegador (F12) y revisa errores
2. Verifica que la API responda: `http://localhost:3001/api/metrics/current`
3. Comprueba que CORS esté configurado correctamente

## 📦 Dependencias

### API Server

- `express` - Framework web
- `sql.js` - Driver SQLite
- `cors` - Manejo de CORS
- `morgan` - Logging HTTP
- `dotenv` - Variables de entorno

### Cliente

- Node.js built-in modules (`http`, `fs`, `path`)

## 🔒 Seguridad

> **Nota**: Esta API está diseñada para uso local. No incluye autenticación por defecto.

Si necesitas exponer la API en una red, considera:

1. Agregar autenticación (JWT, API keys)
2. Configurar CORS restrictivo
3. Usar HTTPS
4. Implementar rate limiting

## 📄 Licencia

Parte del proyecto Teach Laoz Courses Generator.
