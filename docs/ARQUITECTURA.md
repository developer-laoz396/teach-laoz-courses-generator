# ARQUITECTURA DEL SISTEMA - DIAGRAMA DE COMPONENTES

Este documento presenta diferentes vistas arquitectónicas del sistema de generación de cursos.

## 📐 VISTA DE COMPONENTES

```mermaid
C4Context
    title Sistema de Generación de Cursos - Vista de Contexto

    Person(usuario, "Usuario/Instructor", "Proporciona especificaciones del curso")
    
    System_Boundary(sistema, "Sistema Multi-Agente") {
        Container(manager, "Manager (A0)", "Orquestador", "Coordina todos los agentes")
        Container(planificacion, "Agentes de Planificación", "A1, A12", "Diseño curricular")
        Container(produccion, "Agentes de Producción", "A2, A3, A7, A8, A9, A11", "Generación de contenido")
        Container(enriquecimiento, "Agentes de Enriquecimiento", "A4, A6", "Recursos visuales")
        Container(integracion, "Agentes de Integración", "A5, A10", "Compilación final")
    }
    
    System_Ext(tts, "Sistema TTS", "Microsoft Speech API")
    System_Ext(pdf, "Generador PDF", "Node.js + Paged.js")
    
    Rel(usuario, manager, "Especifica curso")
    Rel(manager, planificacion, "Solicita plan")
    Rel(manager, produccion, "Solicita contenido")
    Rel(manager, enriquecimiento, "Solicita recursos")
    Rel(manager, integracion, "Solicita compilación")
    
    Rel(produccion, tts, "Genera audio")
    Rel(integracion, pdf, "Genera PDF")
    
    Rel(manager, usuario, "Entrega curso completo")
```

---

## 🏛️ ARQUITECTURA DE CAPAS

```mermaid
graph TB
    subgraph "CAPA DE PRESENTACIÓN"
        CLI[Interfaz CLI]
        UI[Dashboard Web futuro]
    end
    
    subgraph "CAPA DE ORQUESTACIÓN"
        Manager[Manager A0]
        Workflow[Motor de Workflows]
        ErrorHandler[Manejador de Errores]
    end
    
    subgraph "CAPA DE SERVICIOS - Planificación"
        A1[Estratega]
        A12[Analista Preconceptos]
    end
    
    subgraph "CAPA DE SERVICIOS - Producción"
        A2[Sintetizador]
        A11[Editor Cognitivo]
        A3[Diseñador Ejercicios]
        A7[Guionista]
        A8[Locutor]
        A9[Evaluador]
    end
    
    subgraph "CAPA DE SERVICIOS - Enriquecimiento"
        A4[Simulador]
        A6[Diseñador Gráfico]
    end
    
    subgraph "CAPA DE SERVICIOS - Integración"
        A5[Integrador]
        A10[Generador PDF]
    end
    
    subgraph "CAPA DE DATOS"
        FileSystem[Sistema de Archivos]
        Config[Configuración .env]
        Templates[Plantillas]
    end
    
    CLI --> Manager
    UI -.-> Manager
    
    Manager --> Workflow
    Manager --> ErrorHandler
    
    Workflow --> A1
    Workflow --> A12
    Workflow --> A2
    Workflow --> A11
    Workflow --> A3
    Workflow --> A7
    Workflow --> A8
    Workflow --> A9
    Workflow --> A4
    Workflow --> A6
    Workflow --> A5
    Workflow --> A10
    
    A1 --> FileSystem
    A2 --> FileSystem
    A3 --> FileSystem
    A4 --> FileSystem
    A5 --> FileSystem
    A6 --> FileSystem
    A7 --> FileSystem
    A8 --> FileSystem
    A9 --> FileSystem
    A10 --> FileSystem
    A11 --> FileSystem
    A12 --> FileSystem
    
    Manager --> Config
    A1 -.-> Templates
    A2 -.-> Templates
    
    style Manager fill:#ff6b6b,stroke:#c92a2a,stroke-width:3px,color:#fff
    style FileSystem fill:#e9ecef,stroke:#495057
```

---

## 🔄 FLUJO DE DATOS

```mermaid
graph LR
    subgraph "INPUT"
        I1[Tema]
        I2[Complejidad]
        I3[Duración]
        I4[Audiencia]
    end
    
    subgraph "PROCESAMIENTO"
        P1[Plan Curricular]
        P2[Estructura JSON]
        P3[Módulo 0]
        P4[Contenidos]
        P5[Ejercicios]
        P6[Guiones]
        P7[Audios]
        P8[Evaluaciones]
        P9[Simulaciones]
        P10[Diagramas]
    end
    
    subgraph "OUTPUT"
        O1[CURSO_COMPLETO.md]
        O2[Manual.pdf]
        O3[Archivos WAV]
        O4[Simulaciones HTML/JSX]
        O5[Reportes de Validación]
    end
    
    I1 --> P1
    I2 --> P1
    I3 --> P1
    I4 --> P1
    
    P1 --> P2
    P1 --> P3
    P2 --> P4
    P2 --> P5
    P2 --> P6
    P2 --> P8
    
    P4 --> P5
    P4 --> P6
    P4 --> P8
    P4 --> P9
    P4 --> P10
    
    P6 --> P7
    
    P3 --> O1
    P4 --> O1
    P5 --> O1
    P7 --> O3
    P8 --> O1
    P9 --> O4
    P10 --> O1
    
    O1 --> O2
    O1 --> O5
    
    style P1 fill:#4ecdc4
    style O1 fill:#fd79a8
    style O2 fill:#ff7675
```

---

## 🎭 PATRONES DE DISEÑO UTILIZADOS

### 1. Patrón Orchestrator (Orquestador)

El Manager (A0) implementa el patrón Orchestrator:

```mermaid
classDiagram
    class Manager {
        +validarInput()
        +crearEstructura()
        +llamarAgente()
        +manejarRespuesta()
        +reintentar()
        +generarReporte()
    }
    
    class Agente {
        <<interface>>
        +ejecutar()
        +validar()
    }
    
    class Estratega {
        +ejecutar()
        +generarPlanCurricular()
    }
    
    class Sintetizador {
        +ejecutar()
        +generarContenido()
    }
    
    class Integrador {
        +ejecutar()
        +compilarCurso()
        +validar()
    }
    
    Manager --> Agente
    Estratega ..|> Agente
    Sintetizador ..|> Agente
    Integrador ..|> Agente
```

### 2. Patrón Pipeline

La producción de contenido sigue un pipeline:

```mermaid
graph LR
    A[Objetivos] -->|A2| B[Contenido Crudo]
    B -->|A11| C[Contenido Optimizado]
    C -->|A7| D[Guión]
    D -->|A8| E[Audio]
    
    C -->|A3| F[Ejercicios]
    C -->|A9| G[Evaluación]
    
    style A fill:#e3f2fd
    style E fill:#c8e6c9
    style F fill:#fff9c4
    style G fill:#ffe0b2
```

### 3. Patrón Chain of Responsibility

El manejo de errores utiliza cadena de responsabilidad:

```mermaid
graph TD
    Error[Error Ocurre] --> H1{Handler Nivel 1}
    H1 -->|Recuperable| Retry[Reintentar]
    H1 -->|No recuperable| H2{Handler Nivel 2}
    
    H2 -->|Escalable| Modify[Modificar Input]
    H2 -->|Crítico| H3{Handler Nivel 3}
    
    H3 -->|Reportable| Report[Reportar Error]
    H3 -->|Fatal| Stop[Detener Ejecución]
    
    Retry --> Success{¿Éxito?}
    Success -->|Sí| Continue[Continuar]
    Success -->|No| H1
    
    Modify --> Retry
    
    style Error fill:#ffcdd2
    style Continue fill:#c8e6c9
    style Stop fill:#f44336,color:#fff
```

---

## 🌐 VISTA DE DESPLIEGUE

```mermaid
graph TB
    subgraph "Entorno de Desarrollo"
        DevMachine[Máquina de Desarrollo]
        
        subgraph "Sistema de Archivos"
            Workspace[workspace/]
            Agents[.agent/workflows/]
            Scripts[scripts/]
            Courses[cursos/]
        end
        
        subgraph "Runtime"
            NodeJS[Node.js Runtime]
            PowerShell[PowerShell Runtime]
            Claude[Claude API/CLI]
        end
    end
    
    subgraph "Servicios Externos"
        TTS[Microsoft Speech API]
        ImageGen[DALL-E/Stable Diffusion]
    end
    
    DevMachine --> Workspace
    DevMachine --> Agents
    DevMachine --> Scripts
    DevMachine --> Courses
    
    Scripts --> NodeJS
    Scripts --> PowerShell
    
    Agents --> Claude
    
    PowerShell --> TTS
    Claude -.-> ImageGen
    
    style DevMachine fill:#e3f2fd
    style Claude fill:#fff9c4
    style TTS fill:#c8e6c9
```

---

## 📊 MODELO DE DATOS

```mermaid
erDiagram
    CURSO ||--o{ MODULO : contiene
    MODULO ||--o{ TEMA : contiene
    TEMA ||--o{ SUBTEMA : contiene
    
    SUBTEMA ||--|| CONTENIDO : tiene
    SUBTEMA ||--|| EJERCICIOS : tiene
    SUBTEMA ||--|| GUION : tiene
    SUBTEMA ||--o| AUDIO : tiene
    SUBTEMA ||--|| EVALUACION : tiene
    SUBTEMA ||--o{ SIMULACION : tiene
    
    CURSO {
        string id
        string titulo
        string complejidad
        int duracion_horas
        string audiencia
        string[] prerrequisitos
        date fecha_creacion
    }
    
    MODULO {
        int numero
        string titulo
        string descripcion
        int duracion_estimada
    }
    
    TEMA {
        string id
        string titulo
        string[] objetivos
    }
    
    SUBTEMA {
        string id
        string titulo
        string nivel
        int duracion_minutos
    }
    
    CONTENIDO {
        string archivo
        int palabras
        boolean codigo_ejecutable
        int secciones
    }
    
    EJERCICIOS {
        string archivo
        int cantidad
        string[] dificultades
    }
    
    GUION {
        string archivo
        int duracion_segundos
        string tono
    }
    
    AUDIO {
        string archivo_wav
        int duracion_segundos
        string voz
    }
    
    EVALUACION {
        string archivo
        int preguntas
        boolean solucionario
    }
    
    SIMULACION {
        string archivo_html_jsx
        string tipo
        boolean interactivo
    }
```

---

## 🔐 SEGURIDAD Y VALIDACIÓN

```mermaid
graph TB
    Input[Input del Usuario] --> V1{Validación de Input}
    
    V1 -->|Válido| V2[Sanitización]
    V1 -->|Inválido| Reject[Rechazar]
    
    V2 --> Process[Procesamiento]
    
    Process --> V3{Validación Estructural}
    V3 -->|Falla| Error1[Reportar Error Estructural]
    V3 -->|Pasa| V4{Validación Técnica}
    
    V4 -->|Falla| Error2[Reportar Error Técnico]
    V4 -->|Pasa| V5{Validación Pedagógica}
    
    V5 -->|Falla| Error3[Reportar Error Pedagógico]
    V5 -->|Pasa| Output[Output Validado]
    
    Error1 --> Retry{¿Reintentar?}
    Error2 --> Retry
    Error3 --> Retry
    
    Retry -->|Sí| Process
    Retry -->|No| Fail[Fallo Final]
    
    style V1 fill:#fff3cd
    style V3 fill:#fff3cd
    style V4 fill:#fff3cd
    style V5 fill:#fff3cd
    style Output fill:#d4edda
    style Fail fill:#f8d7da
```

---

## 📈 MÉTRICAS Y OBSERVABILIDAD

```mermaid
graph LR
    subgraph "Captura de Métricas"
        M1[Tiempo de Ejecución]
        M2[Tasa de Éxito]
        M3[Errores por Agente]
        M4[Tamaño de Outputs]
        M5[Uso de Reintentos]
    end
    
    subgraph "Agregación"
        Agg[Agregador de Métricas]
    end
    
    subgraph "Almacenamiento"
        Logs[Archivos de Log]
        Metrics[metrics.json]
    end
    
    subgraph "Visualización"
        Report[Reporte de Ejecución]
        Dashboard[Dashboard futuro]
    end
    
    M1 --> Agg
    M2 --> Agg
    M3 --> Agg
    M4 --> Agg
    M5 --> Agg
    
    Agg --> Logs
    Agg --> Metrics
    
    Logs --> Report
    Metrics --> Report
    Metrics -.-> Dashboard
    
    style Agg fill:#4ecdc4
    style Report fill:#95e1d3
```

---

## 🔄 CICLO DE VIDA DEL CURSO

```mermaid
stateDiagram-v2
    [*] --> Creacion
    
    Creacion --> Planificacion: Validar INPUT
    Planificacion --> Nivelacion: Plan aprobado
    Nivelacion --> Produccion: Módulo 0 creado
    
    state Produccion {
        [*] --> GenerarContenido
        GenerarContenido --> OptimizarContenido
        OptimizarContenido --> GenerarRecursos
        GenerarRecursos --> ValidarSubtema
        ValidarSubtema --> [*]: Subtema completo
    }
    
    Produccion --> Enriquecimiento: Todos los subtemas listos
    
    state Enriquecimiento {
        [*] --> Simulaciones
        [*] --> Visuales
        Simulaciones --> [*]
        Visuales --> [*]
    }
    
    Enriquecimiento --> Integracion: Recursos listos
    
    state Integracion {
        [*] --> Compilar
        Compilar --> ValidarCurso
        ValidarCurso --> GenerarPDF
        GenerarPDF --> [*]
    }
    
    Integracion --> Publicado: Validación exitosa
    Integracion --> Produccion: Errores encontrados
    
    Publicado --> Mantenimiento: Uso continuo
    
    state Mantenimiento {
        [*] --> Actualizar
        Actualizar --> Revisar
        Revisar --> [*]
    }
    
    Mantenimiento --> Publicado: Nueva versión
    Publicado --> [*]: Archivado
```

---

## 🎯 CONCLUSIÓN

Esta arquitectura proporciona:

✅ **Modularidad**: Cada agente es independiente y reutilizable  
✅ **Escalabilidad**: Fácil agregar nuevos agentes o funcionalidades  
✅ **Resiliencia**: Manejo robusto de errores con reintentos  
✅ **Observabilidad**: Métricas y logs en cada nivel  
✅ **Mantenibilidad**: Separación clara de responsabilidades  
✅ **Extensibilidad**: Arquitectura abierta para futuras mejoras  

El sistema está diseñado siguiendo principios SOLID y patrones de diseño reconocidos, garantizando calidad y sostenibilidad a largo plazo.
