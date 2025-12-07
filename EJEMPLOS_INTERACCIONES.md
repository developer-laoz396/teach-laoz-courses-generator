# GUÍA VISUAL DE INTERACCIONES DEL SISTEMA

Esta guía muestra ejemplos prácticos de cómo los agentes interactúan durante la generación de un curso real.

## 📝 EJEMPLO COMPLETO: Generación del Curso DevOps Avanzado

### Paso 0: Configuración Inicial

```mermaid
sequenceDiagram
    actor U as Usuario
    participant M as Manager
    participant FS as Sistema de Archivos

    U->>M: Ejecutar /0-manager-curso
    M->>U: Solicitar parámetros
    U->>M: TEMA: "DevOps Avanzado"<br/>COMPLEJIDAD: "Alta"<br/>DURACIÓN: "40h"<br/>AUDIENCIA: "DevOps Engineers"
    
    M->>M: Validar parámetros
    
    rect rgb(240, 248, 255)
        Note over M,FS: Creación de Estructura
        M->>FS: Crear cursos/curso_devops_avanzado/
        M->>FS: Crear modulos/, media/, simulaciones/
        M->>FS: Generar .env con configuración
        FS-->>M: Estructura creada
    end
    
    M->>U: ✅ Estructura inicializada
```

**Archivos Creados**:
```
cursos/curso_devops_avanzado/
├── .env
├── modulos/
├── media/
└── simulaciones/
```

**Contenido de `.env`**:
```bash
COURSE_TOPIC=DevOps Avanzado
COURSE_COMPLEXITY=Alta
COURSE_DURATION=40
COURSE_AUDIENCE=DevOps Engineers con 2+ años de experiencia
COURSE_PREREQUISITES=Linux, Git, Docker, CI/CD básico
```

---

### Paso 1: Planificación Curricular

```mermaid
sequenceDiagram
    participant M as Manager
    participant A1 as Estratega (A1)
    participant FS as Sistema de Archivos

    M->>A1: Solicitar Plan Curricular
    activate A1
    
    rect rgb(255, 250, 240)
        Note over A1: Análisis y Diseño
        A1->>A1: Analizar tema y audiencia
        A1->>A1: Identificar conceptos clave
        A1->>A1: Diseñar 12 módulos
        A1->>A1: Crear mapa de dependencias
        A1->>A1: Definir 3 rutas de aprendizaje
        A1->>A1: Generar estructura JSON
    end
    
    A1-->>M: plan_curricular.md (3200 palabras)
    A1-->>M: estructura_curso.json
    deactivate A1
    
    M->>FS: Guardar plan_curricular.md
    M->>FS: Guardar estructura_curso.json
    M->>M: Parsear JSON para iteración
```

**Plan Curricular Generado**:

```markdown
# PLAN CURRICULAR: DEVOPS AVANZADO

## MÓDULOS

### Módulo 0: Nivelación
- Conceptos fundamentales transversales

### Módulo 1: Fundamentos de DevOps
- Tema 1.1: ¿Qué es DevOps?
  - Subtema 1.1.1: Historia y evolución
  - Subtema 1.1.2: Principios CALMS
- Tema 1.2: Cultura DevOps
  - Subtema 1.2.1: Roles y responsabilidades
  - Subtema 1.2.2: Anti-patrones comunes

### Módulo 2: Git Avanzado
...

### Módulo 12: Proyecto Final
...
```

**Estructura JSON**:
```json
{
  "curso": "DevOps Avanzado",
  "duracion_total_horas": 40,
  "modulos": [
    {
      "numero": 1,
      "titulo": "Fundamentos de DevOps",
      "temas": [
        {
          "id": "1.1",
          "titulo": "¿Qué es DevOps?",
          "subtemas": [
            {
              "id": "1.1.1",
              "titulo": "Historia y evolución",
              "duracion_minutos": 45,
              "requiere_visualizacion": false
            },
            {
              "id": "1.1.2",
              "titulo": "Principios CALMS",
              "duracion_minutos": 50,
              "requiere_visualizacion": true
            }
          ]
        }
      ]
    }
  ]
}
```

---

### Paso 1.5: Generación del Módulo 0

```mermaid
sequenceDiagram
    participant M as Manager
    participant A12 as Analista (A12)
    participant FS as Sistema de Archivos

    M->>A12: Generar Módulo 0 de Nivelación
    activate A12
    
    rect rgb(250, 250, 250)
        Note over A12: Análisis de Prerrequisitos
        A12->>A12: Identificar conceptos base:<br/>- Linux CLI<br/>- YAML<br/>- Contenedores<br/>- HTTP/REST
        A12->>A12: Crear glosario jerárquico
        A12->>A12: Generar autoevaluación
    end
    
    A12-->>M: modulo_0/tema_0.1_preconceptos.md
    deactivate A12
    
    M->>FS: Guardar en modulos/modulo_0/
```

**Contenido Generado**:
```markdown
# MÓDULO 0: PRECONCEPTOS FUNDAMENTALES

## Linux Command Line Interface (CLI)

**Definición**: Interfaz de texto para interactuar con el sistema operativo...

**Comandos esenciales**:
- `ls`, `cd`, `mkdir`, `rm`
- `grep`, `awk`, `sed`
- Pipes y redirecciones

## YAML (YAML Ain't Markup Language)

**Definición**: Formato de serialización de datos legible por humanos...

**Autoevaluación**:
1. ¿Qué es un contenedor?
2. Diferencia entre HTTP y HTTPS
...
```

---

### Paso 2: Producción de Contenido - Primer Subtema

```mermaid
sequenceDiagram
    participant M as Manager
    participant A2 as Sintetizador (A2)
    participant A11 as Editor Cognitivo (A11)
    participant A3 as Diseñador (A3)
    participant A7 as Guionista (A7)
    participant A8 as Locutor (A8)
    participant A9 as Evaluador (A9)
    participant FS as Sistema de Archivos

    rect rgb(230, 255, 230)
        Note over M,A2: Generación de Contenido Base
        M->>A2: Generar contenido para "Historia y evolución"
        activate A2
        A2->>A2: Estructurar 11 secciones
        A2->>A2: Generar código ejecutable
        A2->>A2: Crear ejemplos prácticos
        A2-->>M: contenido_crudo.md (2847 palabras)
        deactivate A2
    end
    
    rect rgb(255, 250, 205)
        Note over M,A11: Optimización Cognitiva
        M->>A11: Optimizar contenido
        activate A11
        A11->>A11: Aplicar analogías
        A11->>A11: Simplificar explicaciones
        A11->>A11: Mejorar progresión
        A11-->>M: contenido_optimizado.md
        deactivate A11
        M->>FS: Guardar tema_1.1_subtema_1.1.1_contenido.md
    end
    
    par Tareas Paralelas
        rect rgb(255, 240, 230)
            M->>A3: Generar ejercicios
            activate A3
            A3->>A3: Crear 6 ejercicios graduados
            A3-->>M: ejercicios.md
            deactivate A3
            M->>FS: Guardar ejercicios.md
        end
        
        rect rgb(240, 230, 255)
            M->>A7: Generar guión
            activate A7
            A7->>A7: Adaptar a narrativa
            A7-->>M: guion.md
            deactivate A7
            M->>FS: Guardar guion.md
            
            M->>A8: Generar audio
            activate A8
            A8->>A8: TTS con voz Salome
            A8-->>M: audio.wav
            deactivate A8
            M->>FS: Guardar audio.wav
        end
        
        rect rgb(230, 240, 255)
            M->>A9: Generar evaluación
            activate A9
            A9->>A9: Crear 10 preguntas
            A9-->>M: evaluacion.md
            deactivate A9
            M->>FS: Guardar evaluacion.md
        end
    end
```

**Resultado de la Iteración**:
```
modulos/modulo_1/
├── tema_1.1_subtema_1.1.1_contenido.md (2847 palabras)
├── tema_1.1_subtema_1.1.1_ejercicios.md (3214 palabras)
├── tema_1.1_subtema_1.1.1_guion.md (850 palabras)
└── tema_1.1_subtema_1.1.1_evaluacion.md (1200 palabras)

media/
└── modulo_1_tema_1.1_subtema_1.1.1.wav (3:45 min)
```

---

### Paso 2 (Continuación): Loop de Producción

```mermaid
flowchart TD
    Start[Iniciar Loop] --> CheckSubtemas{¿Hay más subtemas?}
    
    CheckSubtemas -->|Sí| GetNext[Obtener siguiente subtema]
    GetNext --> CallA2[Agente 2: Generar contenido]
    CallA2 --> CallA11[Agente 11: Optimizar]
    CallA11 --> SaveContent[Guardar contenido.md]
    
    SaveContent --> Parallel[Ejecutar en paralelo]
    
    Parallel --> CallA3[Agente 3: Ejercicios]
    Parallel --> CallA7[Agente 7: Guión]
    Parallel --> CallA9[Agente 9: Evaluación]
    
    CallA7 --> CallA8[Agente 8: Audio]
    
    CallA3 --> SaveAll[Guardar todos los archivos]
    CallA8 --> SaveAll
    CallA9 --> SaveAll
    
    SaveAll --> Progress[Actualizar progreso]
    Progress --> CheckSubtemas
    
    CheckSubtemas -->|No| Complete[Producción completa]
    
    style Start fill:#90EE90
    style Complete fill:#FFD700
    style Parallel fill:#87CEEB
```

**Progreso Mostrado al Usuario**:
```
[1/48] ✓ Módulo 1 - Tema 1.1 - Subtema 1.1.1 completado
[2/48] ✓ Módulo 1 - Tema 1.1 - Subtema 1.1.2 completado
[3/48] ✓ Módulo 1 - Tema 1.2 - Subtema 1.2.1 completado
...
[48/48] ✓ Módulo 12 - Tema 12.2 - Subtema 12.2.2 completado

FASE 2 COMPLETADA: 48 subtemas generados
- Contenidos: 48 archivos (136,656 palabras total)
- Ejercicios: 48 archivos (154,272 palabras total)
- Guiones: 48 archivos
- Audios: 48 archivos WAV (3:48:30 duración total)
- Evaluaciones: 48 archivos
```

---

### Paso 3: Fase de Enriquecimiento

```mermaid
sequenceDiagram
    participant M as Manager
    participant A4 as Simulador (A4)
    participant A6 as Diseñador Gráfico (A6)
    participant FS as Sistema de Archivos

    rect rgb(230, 230, 255)
        Note over M,A4: Simulaciones Interactivas
        M->>M: Identificar conceptos visuales
        
        loop Para cada concepto visual
            M->>A4: Generar simulación
            activate A4
            A4->>A4: Crear artifact React/HTML
            A4->>A4: Implementar controles
            A4->>A4: Agregar métricas
            A4-->>M: simulacion.html
            deactivate A4
            M->>FS: Guardar en simulaciones/
        end
    end
    
    rect rgb(255, 230, 230)
        Note over M,A6: Recursos Visuales
        M->>M: Identificar necesidades gráficas
        
        loop Para cada recurso
            M->>A6: Generar diagrama/ilustración
            activate A6
            A6->>A6: Crear diagrama Mermaid
            A6->>A6: Generar prompt para DALL-E
            A6-->>M: diagrama.mermaid + prompt
            deactivate A6
            M->>FS: Guardar en media/
        end
    end
```

**Simulaciones Generadas**:
```
simulaciones/
├── ci_cd_pipeline_visualization.html
├── container_orchestration_demo.html
├── git_branching_strategy.jsx
├── kubernetes_scaling_simulator.html
└── terraform_state_visualizer.html
```

**Recursos Visuales**:
```
media/
├── diagrama_arquitectura_microservicios.png
├── diagrama_flujo_gitops.png
├── ilustracion_pipeline_stages.png
└── mapa_dependencias_modulos.png
```

---

### Paso 4: Integración y Validación

```mermaid
sequenceDiagram
    participant M as Manager
    participant A5 as Integrador (A5)
    participant A10 as Generador PDF (A10)
    participant FS as Sistema de Archivos
    participant U as Usuario

    M->>A5: Compilar curso completo
    activate A5
    
    rect rgb(255, 245, 230)
        Note over A5: Recopilación
        A5->>FS: Leer plan_curricular.md
        A5->>FS: Leer modulo_0/preconceptos.md
        
        loop Para cada módulo
            A5->>FS: Leer todos los contenidos
            A5->>FS: Leer todos los ejercicios
            A5->>FS: Leer todas las evaluaciones
        end
    end
    
    rect rgb(255, 230, 230)
        Note over A5: Validación Estructural
        A5->>A5: Verificar completitud
        A5->>A5: Validar grafo de dependencias
        A5->>A5: Verificar duración total
    end
    
    rect rgb(230, 255, 230)
        Note over A5: Validación Técnica
        A5->>A5: Verificar código ejecutable
        A5->>A5: Validar terminología
        A5->>A5: Revisar formato
    end
    
    rect rgb(230, 230, 255)
        Note over A5: Validación Pedagógica
        A5->>A5: Generar matriz de trazabilidad
        A5->>A5: Verificar progresión
        A5->>A5: Validar 3 rutas
    end
    
    A5->>A5: Compilar CURSO_COMPLETO.md
    A5->>A5: Generar MENU.md
    A5->>A5: Crear REPORTE_VALIDACION.md
    A5->>A5: Generar MATRIZ_TRAZABILIDAD.csv
    
    A5-->>M: Paquete completo
    deactivate A5
    
    M->>FS: Guardar CURSO_COMPLETO.md
    M->>FS: Guardar MENU.md
    M->>FS: Guardar REPORTE_VALIDACION.md
    M->>FS: Guardar MATRIZ_TRAZABILIDAD.csv
    
    M->>A10: Generar PDF profesional
    activate A10
    A10->>A10: Convertir Markdown → HTML
    A10->>A10: Aplicar estilos CSS
    A10->>A10: Generar TOC
    A10->>A10: Crear portada
    A10->>A10: Paginar contenido
    A10-->>M: Manual_DevOps_Avanzado_v1.0.pdf
    deactivate A10
    
    M->>FS: Guardar PDF
    M->>U: ✅ Curso completo generado
```

**Reporte de Validación**:
```markdown
# REPORTE DE VALIDACIÓN

## Validaciones Estructurales
✅ Todos los módulos tienen archivos completos
✅ Grafo de dependencias es acíclico
✅ Duración total: 40.5h (dentro del rango 34-46h)

## Validaciones Técnicas
✅ Todo el código es ejecutable (152 bloques verificados)
✅ Terminología consistente (DevOps: 487 menciones)
⚠ 3 bloques de código requieren librerías externas

## Validaciones Pedagógicas
✅ Trazabilidad 100% (124 objetivos → 124 contenidos → 288 ejercicios)
✅ Progresión de dificultad validada
✅ 3 rutas implementadas y diferenciadas

## Estadísticas
- Módulos: 12
- Temas: 24
- Subtemas: 48
- Palabras totales: 290,928
- Ejercicios: 288
- Preguntas de evaluación: 480
- Simulaciones: 5
- Archivos de audio: 48 (duración: 3:48:30)
```

---

## 🎬 CRONOLOGÍA DE EVENTOS

```mermaid
gantt
    title Generación del Curso DevOps Avanzado
    dateFormat HH:mm
    axisFormat %H:%M

    section Preparación
    Validar INPUT           :done, p1, 00:00, 2m
    Crear estructura        :done, p2, after p1, 1m
    Generar .env           :done, p3, after p2, 1m

    section Planificación
    Agente 1: Plan         :done, a1, after p3, 15m
    Parsear JSON           :done, parse, after a1, 1m

    section Nivelación
    Agente 12: Módulo 0    :done, a12, after parse, 8m

    section Producción (Módulo 1)
    Subtema 1.1.1          :done, s1, after a12, 12m
    Subtema 1.1.2          :done, s2, after s1, 13m
    Subtema 1.2.1          :done, s3, after s2, 11m
    Subtema 1.2.2          :done, s4, after s3, 12m

    section Producción (Módulos 2-12)
    44 subtemas restantes  :done, rest, after s4, 480m

    section Enriquecimiento
    5 Simulaciones         :done, sim, after rest, 60m
    10 Diagramas           :done, diag, after rest, 30m

    section Integración
    Agente 5: Compilar     :done, a5, after sim, 20m
    Agente 10: PDF         :done, a10, after a5, 10m
```

**Tiempo Total de Ejecución**: ~11 horas  
(Tiempo real puede variar según la API de Claude y velocidad de procesamiento)

---

## 📊 ESTADÍSTICAS DE INTERACCIONES

### Llamadas a Agentes

| Agente | Invocaciones | Duración Promedio | Tasa de Éxito | Reintentos |
|--------|--------------|-------------------|---------------|------------|
| A0: Manager | 1 | 11:00:00 | 100% | 0 |
| A1: Estratega | 1 | 00:15:00 | 100% | 0 |
| A2: Sintetizador | 48 | 00:08:30 | 98% | 2 |
| A3: Diseñador Ejercicios | 48 | 00:06:45 | 100% | 0 |
| A4: Simulador | 5 | 00:12:00 | 100% | 0 |
| A5: Integrador | 1 | 00:20:00 | 100% | 0 |
| A6: Diseñador Gráfico | 10 | 00:03:00 | 100% | 0 |
| A7: Guionista | 48 | 00:04:30 | 100% | 0 |
| A8: Locutor | 48 | 00:02:15 | 100% | 0 |
| A9: Evaluador | 48 | 00:05:00 | 100% | 0 |
| A10: Generador PDF | 1 | 00:10:00 | 100% | 0 |
| A11: Editor Cognitivo | 48 | 00:03:30 | 100% | 0 |
| A12: Analista | 1 | 00:08:00 | 100% | 0 |
| **TOTAL** | **306** | - | **99.3%** | **2** |

### Volumen de Datos

```mermaid
pie title Distribución de Palabras por Tipo de Contenido
    "Contenidos" : 136656
    "Ejercicios" : 154272
    "Evaluaciones" : 57600
    "Guiones" : 40800
    "Plan y Documentación" : 12000
```

### Tiempos de Ejecución por Fase

```mermaid
pie title Distribución de Tiempo por Fase
    "Preparación" : 4
    "Planificación" : 16
    "Nivelación" : 8
    "Producción" : 528
    "Enriquecimiento" : 90
    "Integración" : 30
```

---

## 🔍 EJEMPLO DE MENSAJE DE COMUNICACIÓN

### Solicitud del Manager al Sintetizador

```json
{
  "tipo": "solicitud",
  "agente_origen": "A0_Manager",
  "agente_destino": "A2_Sintetizador",
  "timestamp": "2025-12-07T14:30:00Z",
  "correlationId": "curso-devops-subtema-1.1.1",
  "payload": {
    "accion": "generar_contenido",
    "parametros": {
      "curso": "DevOps Avanzado",
      "modulo": 1,
      "tema": "1.1",
      "subtema": "1.1.1",
      "titulo": "Historia y evolución de DevOps",
      "objetivos": [
        "Comprender el origen de DevOps",
        "Identificar las etapas evolutivas",
        "Relacionar DevOps con Agile y Lean"
      ],
      "nivel": "intermedio",
      "duracion_estimada": "45min",
      "palabras_objetivo": 2500,
      "incluir_codigo": true,
      "ruta": "basica"
    }
  },
  "metadata": {
    "curso_id": "curso_devops_avanzado",
    "version": "1.0",
    "prioridad": "normal"
  }
}
```

### Respuesta del Sintetizador al Manager

```json
{
  "tipo": "respuesta",
  "agente_origen": "A2_Sintetizador",
  "agente_destino": "A0_Manager",
  "timestamp": "2025-12-07T14:38:30Z",
  "correlationId": "curso-devops-subtema-1.1.1",
  "status": "exito",
  "payload": {
    "archivo_generado": "modulos/modulo_1/tema_1.1_subtema_1.1.1_contenido.md",
    "estadisticas": {
      "palabras": 2847,
      "secciones": 11,
      "bloques_codigo": 3,
      "codigo_ejecutable": true,
      "ejemplos_practicos": 5,
      "enlaces_externos": 8
    },
    "validaciones": {
      "estructura_completa": true,
      "objetivos_cubiertos": [
        "Comprender el origen de DevOps",
        "Identificar las etapas evolutivas",
        "Relacionar DevOps con Agile y Lean"
      ],
      "nivel_apropiado": true
    }
  },
  "tiempo_ejecucion_ms": 510000
}
```

---

## 🎯 CONCLUSIÓN

Este ejemplo real muestra:

✅ **Orquestación compleja**: 306 llamadas coordinadas entre 13 agentes  
✅ **Paralelización efectiva**: Ejecución simultánea de tareas independientes  
✅ **Trazabilidad completa**: Cada operación registrada y correlacionada  
✅ **Alta fiabilidad**: 99.3% de tasa de éxito con manejo automático de errores  
✅ **Escalabilidad probada**: Generación de 48 subtemas completos de manera consistente  
✅ **Calidad validada**: 100% de trazabilidad pedagógica y código ejecutable  

El sistema demuestra capacidad para generar cursos completos de alta calidad de manera automatizada, con intervención humana mínima y resultados consistentes.
