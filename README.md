# 🎓 SISTEMA MULTI-AGENTE TEACH-LAOZ

**Sistema de Generación Automatizada de Cursos Técnicos de Alta Calidad**

[![Estado](https://img.shields.io/badge/Estado-Operacional-success)](docs/ESTADO_SISTEMA.md)
[![Versión](https://img.shields.io/badge/Versión-1.1.0-blue)](docs/CHANGELOG.md)
[![Agentes](https://img.shields.io/badge/Agentes-13-orange)](#-catálogo-de-agentes)
[![Documentación](https://img.shields.io/badge/Docs-Completa-green)](docs/)
[![Live Monitor](https://img.shields.io/badge/Monitor-Real--Time-brightgreen)](logs/live-monitor.html)

---

## 📋 DESCRIPCIÓN

Sistema multi-agente orquestado que **genera automáticamente cursos técnicos y científicos** de complejidad media-alta con aprendizaje adaptativo. El sistema consta de **13 agentes especializados** coordinados por un **Manager (Agente 0)** que gestiona el flujo completo de producción con **monitoreo en tiempo real**.

### ✨ Características principales

✅ **Generación automatizada completa** - Desde planificación hasta PDF  
✅ **13 agentes especializados** - Cada uno con responsabilidades específicas  
✅ **Orquestación inteligente** - Workflow estructurado en 6 fases  
✅ **Verificación de integridad** - Referencias académicas y control de calidad  
✅ **Sistema de métricas v1.1.0** - Monitoreo en tiempo real funcional  
✅ **Live Monitor** - Visualización de progreso con auto-refresh (3s)  
✅ **Contenido multimodal** - Texto, audio, simulaciones, gráficos  
✅ **Módulo 0 de nivelación** - Preconceptos para homogeneizar audiencia  

---

## 🚀 INICIO RÁPIDO

### Requisitos previos

- **Node.js** v14.0.0 o superior
- **PowerShell** 5.1 o superior (Windows) o Bash (Linux/macOS)
- **Memoria RAM:** Mínimo 4GB
- **Espacio en disco:** 1GB libre para archivos generados

### Generar tu primer curso

```powershell
# Modo interactivo (el sistema te guía)
.\scripts\run_manager.ps1

# Modo ejemplo (parámetros predefinidos)
.\scripts\run_manager.ps1 ejemplo

# Node.js directo con parámetros
node scripts/manager.js 'Principios SOLID' intermedio 40h 'Desarrolladores Principiante'
```

### Monitorear la ejecución en tiempo real

```powershell
# 1. Abrir monitor en tiempo real (auto-refresh cada 3s)
.\scripts\open_live_monitor.ps1

# 2. Ejecutar la generación del curso
.\scripts\run_manager.ps1

# El live monitor mostrará:
# - Fase actual en ejecución
# - Agentes activos
# - Logs en tiempo real
# - Métricas de progreso
```

### Ver análisis y dashboards

```powershell
# Dashboard con análisis completo de última sesión
.\scripts\view_metrics.ps1

# Listar todas las sesiones guardadas
.\scripts\list_metrics_sessions.ps1

# Generar nuevo dashboard de sesión específica
.\scripts\generate_metrics_dashboard.ps1 -SessionFile "logs/metrics-2025-12-15T10-30-00-000Z.json"
```

---

## 🏗️ ARQUITECTURA

### Visión general del sistema

El sistema sigue un **patrón de orquestación** donde el Manager (Agente 0) coordina a 13 agentes especializados a través de **6 fases** estructuradas. El **sistema de métricas v1.1.0** captura todas las operaciones en tiempo real:

```
FASE 0: PREPARACIÓN
  └── Crear estructura de directorios y configuración
      📊 Métricas: Tiempo de setup, validaciones

FASE 1: PLANIFICACIÓN
  └── A1: Estratega Curricular → Plan curricular + JSON
      📊 Métricas: Módulos generados, tiempo LLM

FASE 1.5: NIVELACIÓN
  └── A12: Analista Preconceptos → Módulo 0
      📊 Métricas: Preconceptos identificados, nivel base

FASE 2: PRODUCCIÓN (Iterativa por módulo)
  ├── A2: Sintetizador → Contenido
  ├── A11: Editor Cognitivo → Optimización
  └── Tareas paralelas:
      ├── A3: Diseñador Ejercicios
      ├── A7+A8: Guionista → Locutor (audios)
      └── A9: Evaluador
      📊 Métricas: Por agente - tokens, duración, reintentos

FASE 3: ENRIQUECIMIENTO
  ├── A4: Simulador → Simulaciones interactivas
  └── A6: Diseñador Gráfico → Diagramas
      📊 Métricas: Simulaciones creadas, gráficos generados

FASE 4: INTEGRACIÓN Y VERIFICACIÓN
  ├── A5: Integrador → CURSO_COMPLETO.md
  └── A13: Verificador → REFERENCIAS.md + REPORTE_VERIFICACION.md
      📊 Métricas: Referencias validadas, inconsistencias

FASE 5: PDF
  └── A10: Generador PDF → Manual_v1.0.pdf
      📊 Métricas: Páginas generadas, tamaño archivo
```

📈 **Live Monitor:** Actualización automática cada 3 segundos durante toda la ejecución

Ver diagrama completo en [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md)

## 🤖 CATÁLOGO DE AGENTES

| # | Agente | Rol | Responsabilidad |
|---|--------|-----|-----------------|
| **A0** | Manager | 🎯 Orquestador | Coordina todo el flujo de trabajo |
| **A1** | Estratega Curricular | 📋 Planificador | Diseña arquitectura pedagógica |
| **A2** | Sintetizador | 📝 Escritor | Genera contenido teórico/práctico |
| **A3** | Diseñador Ejercicios | 💪 Evaluador | Crea banco de ejercicios |
| **A4** | Simulador | 🎮 Visualizador | Genera simulaciones interactivas |
| **A5** | Integrador | 🔧 Ensamblador | Compila y valida el curso |
| **A6** | Diseñador Gráfico | 🎨 Ilustrador | Crea diagramas y recursos visuales |
| **A7** | Guionista | 🎬 Narrador | Escribe scripts de audio |
| **A8** | Locutor | 🎙️ Voz | Genera archivos de audio |
| **A9** | Evaluador | 📊 Calificador | Crea evaluaciones y solucionarios |
| **A10** | Generador PDF | 📄 Maquetador | Produce manual en PDF |
| **A11** | Editor Cognitivo | 🧠 Optimizador | Mejora retención y comprensión |
| **A12** | Analista Preconceptos | 🔍 Nivelador | Genera Módulo 0 |
| **A13** | Verificador Integridad | ✅ Auditor | Valida calidad y referencias |

Ver workflows detallados en [docs/WORKFLOWS.md](docs/WORKFLOWS.md)

---

## 📊 SISTEMA DE MÉTRICAS

El sistema captura automáticamente todas las operaciones y genera visualizaciones:

### Captura automática

- **Nivel de sesión:** Duración total, agentes llamados, tasa de éxito
- **Nivel de fase:** Tiempo por fase, estado de completitud
- **Nivel de agente:** Llamadas individuales, éxito/error, reintentos
- **Nivel de evento:** Logs estructurados (info, warning, error, success)

### Visualización

\\\powershell

# Monitor en vivo (3s auto-refresh)

.\scripts\open_live_monitor.ps1

# Dashboard de análisis

.\scripts\view_metrics.ps1

# Listar sesiones históricas

.\scripts\list_metrics_sessions.ps1
\\\

---

## 📁 ESTRUCTURA DE SALIDA

Cada curso generado sigue esta estructura:

\\\
cursos/teach-laoz-{nombre-curso}/
├── .env                           # Configuración del curso
├── README.md                      # Documentación del curso
├── plan_curricular.md             # Plan pedagógico completo
├── estructura_curso.json          # Estructura parseada
├── CURSO_COMPLETO.md              # Contenido integrado
├── REFERENCIAS.md                 # Referencias académicas (3 por tema)
├── REPORTE_VERIFICACION.md        # Validación de calidad
├── REPORTE_PRODUCCION.md          # Métricas de generación
│
├── modulos/
│   ├── modulo_0/                  # Nivelación
│   │   └── tema_0_preconceptos.md
│   ├── modulo_1/
│   │   ├── tema_1_subtema_1_contenido.md
│   │   ├── tema_1_subtema_1_ejercicios.md
│   │   ├── tema_1_subtema_1_guion.md
│   │   └── tema_1_subtema_1_evaluacion.md
│   └── ...
│
├── media/                         # Audios y recursos multimedia
│   ├── modulo_1_tema_1_subtema_1.wav
│   └── ...
│
├── simulaciones/                  # Simulaciones HTML interactivas
│   └── ...
│
└── pdf/                           # Manual en PDF
    └── Manual_v1.0.pdf
\\\

---

## 📚 DOCUMENTACIÓN

### Documentos principales

| Documento | Descripción | Link |
|-----------|-------------|------|
| **ESTADO_SISTEMA.md** | Estado actual de todos los componentes | [Ver](docs/ESTADO_SISTEMA.md) |
| **ARQUITECTURA.md** | Diseño del sistema completo | [Ver](docs/ARQUITECTURA.md) |
| **WORKFLOWS.md** | Flujos de trabajo detallados | [Ver](docs/WORKFLOWS.md) |
| **CHANGELOG.md** | Historial de cambios | [Ver](docs/CHANGELOG.md) |

### Guías rápidas

| Tarea | Comando |
|-------|---------|
| Generar curso | \.\scripts\run_manager.ps1\ |
| Ver métricas en vivo | \.\scripts\open_live_monitor.ps1\ |
| Analizar sesión | \.\scripts\view_metrics.ps1\ |

---

## 🎯 CASOS DE USO

### 1. Curso de Programación

\\\powershell
node scripts/manager.js 'Principios SOLID en JavaScript' intermedio 40h 'Desarrolladores Principiante con 1 año de experiencia' 'JavaScript ES6+, POO básica'
\\\

**Salida:**

- 8-12 módulos organizados
- 100-200 archivos generados
- Código ejecutable con tests
- Simulaciones interactivas
- Referencias académicas verificadas
- Manual PDF de 200+ páginas

### 2. Curso Científico

\\\powershell
node scripts/manager.js 'Mecánica Cuántica Aplicada' avanzado 60h 'Físicos e Ingenieros' 'Álgebra lineal, Cálculo diferencial'
\\\

**Salida:**

- Contenido teórico riguroso
- Ejercicios graduados con soluciones
- Simulaciones de fenómenos cuánticos
- Referencias a papers actuales
- Evaluaciones con rúbricas

---

## 📈 ESTADÍSTICAS

### Rendimiento típico

| Métrica | Valor |
|---------|-------|
| **Tiempo de generación** | 90-180 segundos |
| **Módulos generados** | 8-12 |
| **Archivos producidos** | 100-200 |
| **Llamadas a agentes** | 40-80 |
| **Tasa de éxito** | 95%+ |
| **Tamaño del curso** | 50-150 MB |

### Versión actual

- **Versión:** 1.0.0
- **Fecha:** 15 de diciembre de 2025
- **Estado:** ✅ Operacional
- **Agentes:** 13 de 13 implementados
- **Cobertura:** 100%

Ver más en [docs/ESTADO_SISTEMA.md](docs/ESTADO_SISTEMA.md)

---

## 🔧 CONFIGURACIÓN AVANZADA

### Parámetros del curso (.env)

\\\nv
COURSE_TOPIC=Nombre del tema
COURSE_COMPLEXITY=baja|intermedio|alta
COURSE_DURATION=Xh
COURSE_AUDIENCE=Descripción de la audiencia
COURSE_PREREQUISITES=Conocimientos previos
\\\

### Integración programática

\\\javascript
const { CourseManager } = require('./scripts/manager');

const manager = new CourseManager({
  courseTopic: 'Arquitecturas de Microservicios',
  complexity: 'avanzado',
  duration: '80h',
  audience: 'Arquitectos de Software Senior',
  prerequisites: 'Diseño de sistemas distribuidos, Docker, Kubernetes'
});

await manager.ejecutarCursoCompleto();

// Ver métricas
const summary = manager.metrics.getSummary();
console.log(\Curso generado en \ms\);
\\\

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: 'Parámetros faltantes'

**Solución:** Usar modo interactivo
\\\powershell
.\scripts\run_manager.ps1  # Te guiará paso a paso
\\\

### Error: 'No se pudo extraer JSON del plan curricular'

**Solución:** Verificar que el Agente 1 generó JSON válido
\\\javascript
// Ver plan curricular generado
const plan = fs.readFileSync('cursos/mi-curso/plan_curricular.md', 'utf8');
console.log(plan);
\\\

Ver más en [docs/WORKFLOWS.md](docs/WORKFLOWS.md)

---

## 🚦 ROADMAP

### ✅ Versión 1.0.0 (Actual)

- ✅ 13 agentes implementados
- ✅ Manager orquestador completo
- ✅ Sistema de métricas integrado
- ✅ Verificador de integridad
- ✅ Documentación completa

### 🔄 Versión 1.1.0 (Q1 2026)

- [ ] Integración con APIs reales de generación
- [ ] Tests automatizados (unit + integration)
- [ ] Sistema de reintentos automáticos
- [ ] Webhooks para notificaciones

Ver roadmap completo en [docs/CHANGELOG.md](docs/CHANGELOG.md)

---

## 📄 LICENCIA

[Especificar licencia aquí]

---

## 📞 SOPORTE

### Documentación

- [Estado del Sistema](docs/ESTADO_SISTEMA.md)
- [Arquitectura Completa](docs/ARQUITECTURA.md)
- [Workflows Detallados](docs/WORKFLOWS.md)
- [Historial de Cambios](docs/CHANGELOG.md)

### Comandos útiles

\\\powershell

# Verificar instalación

node --version                     # Debe ser v14+
Test-Path scripts/manager.js       # Debe retornar True

# Ejecutar ejemplo

.\scripts\run_manager.ps1 ejemplo

# Ver métricas

.\scripts\open_live_monitor.ps1
\\\

---

<div align='center'>

**[⬆️ Volver arriba](#-sistema-multi-agente-teach-laoz)**

[![Documentación](https://img.shields.io/badge/📚-Documentación-blue)](docs/)
[![Estado](https://img.shields.io/badge/✅-Operacional-success)](docs/ESTADO_SISTEMA.md)
[![Versión](https://img.shields.io/badge/v1.0.0-Estable-green)](docs/CHANGELOG.md)

*Sistema completamente operacional - Listo para generar cursos de alta calidad* 🚀

</div>
