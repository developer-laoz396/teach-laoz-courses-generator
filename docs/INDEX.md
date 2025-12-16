# 📚 ÍNDICE DE DOCUMENTACIÓN DEL SISTEMA TEACH-LAOZ

**Versión:** 1.1.0  
**Última actualización:** 15 de diciembre de 2025

---

## 📖 NAVEGACIÓN RÁPIDA

### 🚀 Empezar aquí

1. **[README Principal](../README.md)** - Inicio rápido y visión general del sistema
   - Instalación y configuración
   - Primer curso en 5 minutos
   - Comandos básicos

### 📊 Estado y Seguimiento

2. **[ESTADO_SISTEMA.md](./ESTADO_SISTEMA.md)** - Estado actual de todos los componentes
   - Tabla de componentes con estado
   - Implementaciones recientes (v1.1.0)
   - Capacidades operacionales
   - Próximos pasos

3. **[CHANGELOG.md](./CHANGELOG.md)** - Historial completo de cambios
   - v1.1.0: Live Monitor y API simplificada
   - v1.0.0: Sistema completo operacional
   - Registro cronológico de features, bugfixes, refactors

### 🏛️ Arquitectura y Diseño

4. **[ARQUITECTURA.md](./ARQUITECTURA.md)** - Diagramas y componentes del sistema
   - Vista de componentes (C4 Model)
   - Arquitectura de capas
   - Flujo de datos entre agentes
   - Patrones de diseño utilizados

5. **[WORKFLOWS.md](./WORKFLOWS.md)** - Flujos de trabajo detallados
   - Workflow completo del Manager
   - Workflows de cada agente individual
   - Diagramas de secuencia
   - Puntos de integración

### 📈 Métricas y Monitoreo

6. **[METRICAS_API.md](./METRICAS_API.md)** ⭐ **NUEVO v1.1.0** - API completa del sistema de métricas
   - API simplificada (startAgent, endAgent, recordRetry)
   - Ejemplos de uso
   - Migración desde v1.0.0
   - Patrones y mejores prácticas
   - **Lectura recomendada para desarrolladores**

7. **[METRICAS_Y_DASHBOARD.md](./METRICAS_Y_DASHBOARD.md)** - Sistema de métricas y dashboards
   - Visión general del sistema de métricas
   - Live Monitor (monitoreo en tiempo real)
   - Dashboard de análisis estático
   - Scripts PowerShell disponibles

---

## 🎯 GUÍAS POR ROL

### Para Usuarios

**¿Quieres generar un curso?**
→ Lee [README Principal](../README.md) sección "Inicio Rápido"

**¿Necesitas ver el progreso de generación?**
→ Ejecuta `.\scripts\open_live_monitor.ps1` y sigue [METRICAS_Y_DASHBOARD.md](./METRICAS_Y_DASHBOARD.md)

**¿Quieres analizar métricas de ejecución?**
→ Ejecuta `.\scripts\view_metrics.ps1` y consulta [METRICAS_Y_DASHBOARD.md](./METRICAS_Y_DASHBOARD.md)

### Para Desarrolladores

**¿Vas a modificar el código?**
→ Lee [ARQUITECTURA.md](./ARQUITECTURA.md) + [WORKFLOWS.md](./WORKFLOWS.md)

**¿Vas a integrar métricas?**
→ Lee [METRICAS_API.md](./METRICAS_API.md) - **API completa documentada**

**¿Necesitas entender un agente específico?**
→ Lee [WORKFLOWS.md](./WORKFLOWS.md) + archivo del agente en `.agent/workflows/`

**¿Quieres contribuir?**
→ Lee [ESTADO_SISTEMA.md](./ESTADO_SISTEMA.md) + [CHANGELOG.md](./CHANGELOG.md)

---

## 🔍 TABLA DE REFERENCIA RÁPIDA

| Quiero saber... | Archivo |
|-----------------|---------|
| ¿Cómo usar el sistema? | [README Principal](../README.md) |
| ¿Qué componentes están listos? | [ESTADO_SISTEMA.md](./ESTADO_SISTEMA.md) |
| ¿Cómo funciona internamente? | [ARQUITECTURA.md](./ARQUITECTURA.md) |
| ¿Qué hace cada agente? | [WORKFLOWS.md](./WORKFLOWS.md) |
| ¿Qué cambió en cada versión? | [CHANGELOG.md](./CHANGELOG.md) |
| ¿Cómo usar métricas? | [METRICAS_API.md](./METRICAS_API.md) |
| ¿Cómo monitorear ejecución? | [METRICAS_Y_DASHBOARD.md](./METRICAS_Y_DASHBOARD.md) |

---

## 🆕 NOVEDADES v1.1.0

### Live Monitor Funcional ✅

El problema de **"no veo que el live monitor muestre el estado"** ha sido completamente resuelto:

**Solución implementada:**
- Nuevo método `saveRealTime()` en MetricsLogger
- Auto-save después de cada operación crítica
- Archivos `*-current.json` actualizados en tiempo real
- Live monitor recibe datos frescos cada 3 segundos

**API simplificada:**
- Menos parámetros (4→2, 5→4, 4→3)
- Auto-extracción de agentId, agentName, phase
- Menos errores, código más limpio

📖 **Documentación completa:** [METRICAS_API.md](./METRICAS_API.md)

### Breaking Changes

Si estás usando la API de métricas v1.0.0, debes migrar:

```javascript
// ❌ v1.0.0 (DEPRECADO)
metrics.startAgent('A1_Estratega', 'Estratega', 'PLANIFICACION', input);
metrics.endAgent(execId, 'A1_Estratega', 'success', output, null);

// ✅ v1.1.0 (ACTUAL)
metrics.startAgent('A1_Estratega', input);
metrics.endAgent(execId, 'success', output);
```

Ver guía completa de migración en [METRICAS_API.md](./METRICAS_API.md#migración-desde-api-anterior)

---

## 📦 ESTRUCTURA DE DOCUMENTACIÓN

```
docs/
├── INDEX.md                     ← Estás aquí (navegación principal)
├── README.md                    ← Índice alternativo
├── ESTADO_SISTEMA.md            ← Estado actual de componentes
├── ARQUITECTURA.md              ← Diagramas y estructura
├── WORKFLOWS.md                 ← Flujos de trabajo detallados
├── CHANGELOG.md                 ← Historial de cambios
├── METRICAS_API.md             ← ⭐ API de métricas (v1.1.0)
└── METRICAS_Y_DASHBOARD.md     ← Sistema de monitoreo

.agent/workflows/
├── 00-manager.md                ← Orquestador principal
├── 01-estratega-curricular.md
├── 02-sintetizador-contenidos.md
├── 03-disenador-ejercicios.md
├── 04-simulador.md
├── 05-integrador.md
├── 06-disenador-grafico.md
├── 07-guionista.md
├── 08-locutor.md
├── 09-evaluador.md
├── 10-generador-pdf.md
├── 11-editor-cognitivo.md
├── 12-analista-preconceptos.md
└── 13-verificador-integridad.md

scripts/
├── manager.js                   ← Manager (Agente 0) - 1,142 líneas
├── util/
│   ├── metrics-logger.js        ← Sistema de métricas - 386 líneas
│   └── generate-dashboard.js    ← Generador de dashboards - 534 líneas
└── [otros scripts de utilidad]

logs/
├── live-monitor.html            ← Monitor en tiempo real (auto-refresh 3s)
├── dashboard.html               ← Dashboard de análisis generado
├── metrics-current.json         ← Métricas en tiempo real
├── logs-current.json            ← Logs en tiempo real
└── [archivos históricos con timestamp]
```

---

## 🤝 CONTRIBUIR

Para contribuir al proyecto:

1. Lee [ESTADO_SISTEMA.md](./ESTADO_SISTEMA.md) para conocer el estado actual
2. Revisa [ARQUITECTURA.md](./ARQUITECTURA.md) para entender el diseño
3. Consulta [WORKFLOWS.md](./WORKFLOWS.md) para flujos de trabajo
4. Sigue los patrones de [METRICAS_API.md](./METRICAS_API.md) para integración
5. Documenta tus cambios en [CHANGELOG.md](./CHANGELOG.md)

---

## 📞 SOPORTE

- **Issues técnicos:** Consulta primero [ESTADO_SISTEMA.md](./ESTADO_SISTEMA.md)
- **Dudas de arquitectura:** [ARQUITECTURA.md](./ARQUITECTURA.md) + [WORKFLOWS.md](./WORKFLOWS.md)
- **Dudas de métricas:** [METRICAS_API.md](./METRICAS_API.md)
- **Historial de versiones:** [CHANGELOG.md](./CHANGELOG.md)

---

**📌 Nota:** Esta documentación refleja el estado del sistema al 15 de diciembre de 2025 (v1.1.0). Para cambios futuros, consulta [CHANGELOG.md](./CHANGELOG.md).
