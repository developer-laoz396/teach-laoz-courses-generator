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

## 🔗 Documentación Relacionada

- **[Workflows de Agentes](../.agent/workflows/)**: Especificaciones individuales de cada agente (A0-A12)
- **[README Principal](../README.md)**: Visión general del proyecto

## 🎯 Navegación Rápida

| Si necesitas... | Consulta... |
|----------------|-------------|
| Entender la arquitectura general | [ARQUITECTURA.md](./ARQUITECTURA.md) |
| Ver cómo interactúan los agentes | [WORKFLOWS.md](./WORKFLOWS.md) |
| Seguir un ejemplo real completo | [EJEMPLOS_INTERACCIONES.md](./EJEMPLOS_INTERACCIONES.md) |
| Especificación de un agente específico | [../.agent/workflows/](../.agent/workflows/) |

## 📊 Diagramas Disponibles

- **15+ Diagramas Mermaid** distribuidos en los documentos
- Sequence Diagrams, Flowcharts, State Machines
- Diagramas C4, ER Diagrams, Gantt Charts
- Todos renderizables en GitHub y editores compatibles

---

**Última actualización**: Diciembre 2025  
**Versión del sistema**: 1.0
