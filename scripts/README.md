# Scripts del Sistema de Generación de Cursos

## Scripts Principales (En Uso)

### 1. `generate_course.js` ⭐

**Propósito**: Generación automática completa de cursos  
**Uso**: `node scripts/generate_course.js cursos/teach-laoz-curso-<nombre>`

**Características**:

- Lee plan curricular JSON automáticamente
- Genera 4 archivos por subtema (contenido, ejercicios, guión, evaluación)
- Logging integrado con API
- Velocidad: ~2,000 archivos/minuto

**Requisitos**:

- Plan curricular con bloque JSON
- Estructura de directorios creada

---

### 2. `log_event.js` ⭐

**Propósito**: Cliente de logging para registrar eventos  
**Uso**: `node scripts/log_event.js "<agente>" "<fase>" "<mensaje>" "<nivel>"`

**Características**:

- Envía logs a API REST (<http://localhost:3001>)
- Fallback automático a archivos JSON si API no disponible
- Gestión automática de sesiones
- Niveles: info, success, warning, error

**Ejemplo**:

```bash
node scripts/log_event.js "Agente-2" "generacion" "Contenido generado" "success"
```

---

### 3. `migrate-logs.js` ⭐

**Propósito**: Migrar logs JSON existentes a SQLite  
**Uso**: `npm run migrate` o `npm run migrate:dry-run`

**Características**:

- Modo dry-run para previsualización
- Migra archivos `logs-*.json` y `metrics-*.json`
- Crea sesiones, agentes y fases automáticamente
- Reporte detallado de migración

---

### 4. `cleanup-old-logs.js` ⭐

**Propósito**: Limpieza de datos antiguos en SQLite  
**Uso**: `npm run cleanup` o `npm run cleanup:dry-run`

**Características**:

- Backup automático antes de eliminar
- Snapshots de métricas
- Configuración de días de retención (default: 30)
- Optimización de BD con VACUUM

**Opciones**:

```bash
node scripts/cleanup-old-logs.js --days=60  # Retención personalizada
node scripts/cleanup-old-logs.js --no-backup  # Sin backup
```

---

## Scripts de Utilidad

### PowerShell Scripts

#### `start-api.ps1`

**Propósito**: Iniciar servidor API con verificaciones  
**Uso**: `.\start-api.ps1`

**Características**:

- Verifica Node.js instalado
- Instala dependencias si es necesario
- Crea archivo .env
- Inicializa base de datos
- Abre dashboard automáticamente

#### `open_live_monitor.ps1`

**Propósito**: Abrir dashboard de monitoreo en vivo  
**Uso**: `.\scripts\open_live_monitor.ps1`

#### `view_metrics.ps1`

**Propósito**: Ver métricas de sesión actual  
**Uso**: `.\scripts\view_metrics.ps1`

---

## Scripts Deprecados (Eliminados)

Los siguientes scripts fueron eliminados por estar obsoletos o no documentados:

- `clean_optimized_scripts.js` - Funcionalidad integrada en generate_course.js
- `ejemplo-metricas.js` - Ejemplo antiguo, reemplazado por documentación
- `extract_communication_plan.js` - Específico de un curso, no genérico
- `extract_plan_json.js` - Funcionalidad integrada en generate_course.js
- `find_missing_scripts.js` - Utilidad temporal
- `generate_all_content.js` - Reemplazado por generate_course.js
- `generate_audio_scripts.js` - Funcionalidad integrada en generate_course.js
- `integrate_communication_course.js` - Específico de un curso
- `integrate_course.js` - Reemplazado por generate_course.js
- `integrate_github_course.js` - Específico de un curso
- `optimize_scripts_bulk.js` - Funcionalidad pendiente de implementar
- `test-live-monitor.js` - Script de prueba temporal
- `verify_course_quality.js` - Pendiente de integración

---

## Estructura de Directorios

```
scripts/
├── generate_course.js          # ⭐ Generación automática
├── log_event.js                # ⭐ Cliente de logging
├── migrate-logs.js             # ⭐ Migración a SQLite
├── cleanup-old-logs.js         # ⭐ Limpieza de datos
├── start-api.ps1               # Inicio de API
├── open_live_monitor.ps1       # Abrir dashboard
├── view_metrics.ps1            # Ver métricas
├── audio/                      # Scripts de generación de audio
│   └── generate_audio.ps1
├── pdf/                        # Scripts de generación de PDF
│   └── generate_pdf.js
└── util/                       # Utilidades varias
    ├── file_utils.js
    ├── markdown_utils.js
    └── validation_utils.js
```

---

## Workflows de Integración

### Workflow Completo de Generación de Curso

1. **Planificación**:

   ```bash
   # El Manager (Agente 0) genera plan curricular
   # Resultado: plan_curricular.md con JSON al final
   ```

2. **Generación Automática**:

   ```bash
   node scripts/generate_course.js cursos/teach-laoz-curso-<nombre>
   ```

3. **Monitoreo**:
   - Abrir <http://localhost:3001/reports/live-monitor.html>
   - Ver progreso en tiempo real

4. **Verificación**:

   ```bash
   # Verificar archivos generados
   Get-ChildItem -Path cursos/teach-laoz-curso-<nombre>/modulos -Recurse -File
   ```

### Workflow de Logging

1. **Iniciar API**:

   ```bash
   npm run api:start
   # o
   .\start-api.ps1
   ```

2. **Registrar eventos**:

   ```javascript
   const { execSync } = require('child_process');
   execSync(`node scripts/log_event.js "Agente" "fase" "mensaje" "nivel"`);
   ```

3. **Ver dashboards**:
   - Monitor en vivo: <http://localhost:3001/reports/live-monitor.html>
   - Reportes: <http://localhost:3001/reports/reports-dashboard.html>

---

## Comandos npm Disponibles

```json
{
  "api:start": "Iniciar servidor API",
  "api:dev": "Modo desarrollo con nodemon",
  "api:init-db": "Inicializar base de datos",
  "migrate": "Migrar logs JSON a SQLite",
  "migrate:dry-run": "Previsualizar migración",
  "cleanup": "Limpiar datos antiguos",
  "cleanup:dry-run": "Previsualizar limpieza"
}
```

---

## Notas de Desarrollo

### Agregar Nuevo Script

1. Crear archivo en `scripts/`
2. Documentar en este README
3. Agregar comando npm si es necesario
4. Integrar logging con `log_event.js`

### Modificar Generación de Contenido

Editar funciones en `generate_course.js`:

- `generateContenido()` - Contenido teórico
- `generateEjercicios()` - Ejercicios graduados
- `generateGuion()` - Guiones de audio
- `generateEvaluacion()` - Evaluaciones

### Debugging

**Ver logs de API**:

```bash
# Terminal donde corre npm run api:start
```

**Ver logs en base de datos**:

```bash
node -e "const db = require('./api/database'); db.getAllLogs().then(console.log)"
```

---

## Soporte

Para problemas o preguntas:

1. Revisar [api/README.md](../api/README.md) para documentación de API
2. Revisar logs en `logs/` o base de datos
3. Verificar que API esté corriendo en puerto 3001
