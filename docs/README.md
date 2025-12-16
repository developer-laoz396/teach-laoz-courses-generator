# 📚 Documentación del Proyecto

Esta carpeta contiene la documentación técnica completa del sistema de generación de cursos Teach Laoz.

## 📑 Índice de Documentos

### [ARQUITECTURA.md](./ARQUITECTURA.md)

Documentación completa de la arquitectura del sistema:

- **Diagrama C4 de Contexto**: Vista general del sistema
- **Arquitectura por Capas**: Presentación, Orquestación, Servicios, Datos
- **Flujos de Datos**: Entrada, procesamiento y salida
- **Patrones de Diseño**: Orchestrator, Pipeline, Chain of Responsibility
- **Modelo de Datos**: Estructura de cursos, módulos y contenidos
- **Vista de Despliegue**: Configuración y estructura de archivos
- **Seguridad y Validación**: Flujos de control de calidad
- **Métricas y Observabilidad**: Sistema de logging y monitoreo

### [WORKFLOWS.md](./WORKFLOWS.md)

Flujos de trabajo detallados de todos los agentes:

- **Workflow del Manager (A0)**: Orquestación completa en 5 fases
- **Workflows de Producción**: Content Pipeline detallado
- **Workflow de Audio**: Generación de locuciones
- **Workflow de Integración**: Ensamblaje final
- **Protocolos de Comunicación**: Formato de mensajes JSON
- **Manejo de Errores**: Estrategias de retry y recuperación
- **Logging y Métricas**: Sistema de trazabilidad

### [EJEMPLOS_INTERACCIONES.md](./EJEMPLOS_INTERACCIONES.md)

Ejemplo completo de generación del curso "DevOps Avanzado":

- **Paso a Paso**: Todas las fases de ejecución
- **Diagramas de Secuencia**: Interacciones entre agentes en cada fase
- **Cronograma**: Timeline Gantt de 11 horas
- **Estadísticas Reales**: 306 invocaciones de agentes, 99.3% éxito
- **Mensajes JSON**: Ejemplos de request/response
- **Estructura de Archivos**: Outputs generados por cada agente

### [METRICAS_Y_DASHBOARD.md](./METRICAS_Y_DASHBOARD.md)

Sistema completo de métricas, logging y visualización:

- **Captura de Métricas**: Tracking en tiempo real por agente y fase
- **Logging Estructurado**: Niveles info, success, warning, error
- **Dashboard HTML**: Visualización interactiva con auto-refresh
- **Exportación JSON**: Métricas y logs para análisis posterior
- **API Completa**: Documentación de MetricsLogger y DashboardGenerator
- **Scripts PowerShell**: Herramientas para generar y visualizar métricas
- **Ejemplo Completo**: Simulación del flujo multi-agente

### [PROCESS_DIAGRAMS.md](./PROCESS_DIAGRAMS.md)

Diagramas detallados del sistema de verificación:

- **Flujo de Verificación**: Agente 13 en acción
- **Sistema de Alertas**: 3 niveles de severidad (Crítico, Advertencia, Informativo)
- **Estado de Alertas**: Ciclo de vida de detección a resolución
- **Clasificación**: Flowchart de decisiones
- **Matriz de Severidad**: Ejemplos y tiempos de respuesta

## 🔗 Documentación Relacionada

- **[Workflows de Agentes](../.agent/workflows/)**: Especificaciones individuales de cada agente (A0-A13)
- **[README Principal](../README.md)**: Visión general del proyecto
- **[Agente 13: Verificador de Integridad](../.agent/workflows/README_AGENTE_13.md)**: Sistema de verificación y referencias académicas
- **[Ejemplo del Agente 13](../.agent/workflows/EJEMPLO_AGENTE_13.md)**: Caso de uso completo del verificador

## 🎯 Navegación Rápida

| Si necesitas...                        | Consulta...                                              |
| -------------------------------------- | -------------------------------------------------------- |
| Entender la arquitectura general       | [ARQUITECTURA.md](./ARQUITECTURA.md)                     |
| Ver cómo interactúan los agentes       | [WORKFLOWS.md](./WORKFLOWS.md)                           |
| Seguir un ejemplo real completo        | [EJEMPLOS_INTERACCIONES.md](./EJEMPLOS_INTERACCIONES.md) |
| Sistema de métricas y dashboard        | [METRICAS_Y_DASHBOARD.md](./METRICAS_Y_DASHBOARD.md)    |
| Diagramas de verificación              | [PROCESS_DIAGRAMS.md](./PROCESS_DIAGRAMS.md)            |
| Especificación de un agente específico | [../.agent/workflows/](../.agent/workflows/)             |
| Sistema de verificación de referencias | [README_AGENTE_13.md](./README_AGENTE_13.md)             |
| Ejemplo de verificación completo       | [EJEMPLO_AGENTE_13.md](./EJEMPLO_AGENTE_13.md)           |

## 📊 Diagramas Disponibles

- **15+ Diagramas Mermaid** distribuidos en los documentos
- Sequence Diagrams, Flowcharts, State Machines
- Diagramas C4, ER Diagrams, Gantt Charts
- Todos renderizables en GitHub y editores compatibles

## 🛠️ Herramientas Disponibles

### Scripts de Métricas

- **generate_metrics_dashboard.ps1**: Ejecuta ejemplo y genera dashboard
- **view_metrics.ps1**: Genera dashboard de archivos existentes
- **list_metrics_sessions.ps1**: Lista todas las sesiones guardadas

### Utilidades Node.js

- **metrics-logger.js**: Clase para captura de métricas
- **generate-dashboard.js**: Generador de dashboard HTML
- **ejemplo-metricas.js**: Ejemplo completo de uso

---

**Última actualización**: Diciembre 2025  
**Versión del sistema**: 1.0 - Con sistema de métricas integrado
