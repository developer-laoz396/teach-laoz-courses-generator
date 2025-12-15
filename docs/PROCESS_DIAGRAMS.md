# 🗺️ MAPA DE PROCESOS: ARQUITECTURA DE AGENTES TEACH-LAOZ

Este documento detalla el flujo de trabajo orquestado para la generación masiva y de alta calidad de cursos educativos. Describe cómo interactúan los 12 agentes especializados para transformar una idea abstracta en un producto educativo completo.

---

## 1. DIAGRAMA DE FLUJO: EL PIPELINE DE PRODUCCIÓN

Este modelo (BPMN-style) ilustra la cadena de valor. El proceso no es lineal, es incremental e iterativo, con compuertas de calidad estrictas.

### 🟢 Fase 1: Estrategia y Definición (El Cerebro)

Todo comienza con el **Agente 0 (Manager)** y el **Agente 1 (Estratega)**. Aquí no se produce contenido, se define la _estructura_ y el _propósito_.

- **Plan Curricular**: El esqueleto del curso. Si falla aquí, todo falla.
- **Pensum**: Define qué competencias tendrá el estudiante al final.

### 🔵 Fase 2: Producción Core (El Cuerpo)

Es el bucle principal. Por cada tema definido en la Fase 1, se activa una célula de producción:

1. **A12 (Analista)**: Prepara el terreno identificando preconceptos y analogías. Evita que el contenido sea muy difícil o muy trivial.
2. **A2 (Sintetizador)**: Genera la "verdad" del curso (el archivo `_contenido.md`).
3. **Satélites (A3, A9, A7)**: Generan los artefactos derivados (Ejercicios, Evaluaciones, Guiones) basados _únicamente_ en el contenido validado por A2. Esto asegura coherencia.

### 🟡 Fase 3: Especialistas Multimedia (Los Sentidos)

Una vez el texto es sólido, entran los especialistas bajo demanda (Lazy Loading).

- **A4 (Simulaciones)**: Crea interactividad (HTML/JS) para conceptos complejos.
- **A6 (Gráfico)**: Traduce texto a diagramas (Mermaid/SVG).
- **A8 (Voz)**: Convierte los guiones de A7 en audio real.

### 🔴 Fase 4: Integración y Calidad (El Auditor)

El **Agente 5** es el guardián.

- **Checklist**: Verifica que no falte nada (Fase 0 validation).
- **Inyección**: Incrusta los medios (Fase 3) dentro del texto (Fase 2).
- **Empaquetado**: Genera la navegación, índices y guías de estudio. Solo entonces el curso es "Shippable".

```mermaid
graph TD
    %% Roles / Carriles
    subgraph FASE_1_ESTRATEGIA [Fase 1: Estrategia y Definición]
        Start((Inicio)) --> A0[A0: Manager]
        A0 --> |Define Tópico & Audiencia| A1[A1: Estratega Curricular]
        A1 --> |Genera| Plan[Plan Curricular]
        A1 --> |Genera| Pensum[Pensum Competencias]
        A1 --> |Genera| Crono[Cronograma]
    end

    subgraph FASE_2_PRODUCCION_CORE [Fase 2: Producción de Contenido Base]
        Plan --> LoopModulos{Iterar por Módulo}
        LoopModulos --> |Nuevo Tema| A12[A12: Analista Preconceptos]
        A12 --> |Output: _preconceptos.md| A2[A2: Sintetizador Contenido]
        A2 --> |Output: _contenido.md| A11[A11: Editor Cognitivo]
        A11 --> |Valida Tono/Claridad| A3[A3: Diseñador Ejercicios]
        A3 --> |Output: _ejercicios.md| A9[A9: Evaluador]
        A9 --> |Output: _evaluacion.md| A7[A7: Guionista]
        A7 --> |Output: _guion.md & .txt| CheckArtifacts
    end

    subgraph FASE_3_ESPECIALISTAS [Fase 3: Producción Multimedia]
        CheckArtifacts{¿Artifacts Requeridos?}
        CheckArtifacts --> |Simulación Necesaria| A4[A4: Generador Simulaciones]
        CheckArtifacts --> |Gráficos Necesarios| A6[A6: Diseñador Gráfico]
        CheckArtifacts --> |Audio Requerido| A8[A8: Locutor TTS]

        A4 --> |Output: .html| A5_Int
        A6 --> |Output: .svg/mermaid| A5_Int
        A8 --> |Output: .wav| A5_Int
    end

    subgraph FASE_4_INTEGRACION [Fase 4: Integración y Calidad]
        A5_Int[A5: Integrador Calidad] --> Validar{¿Checklist Completo?}
        Validar --> |No| LoopModulos
        Validar --> |Sí| Inyectar[Inyección de Medios en Contenido]
        Inyectar --> Nav[Generar Navegación e Índices]
        Nav --> Final((Curso Empaquetado))
    end

    style Start fill:#2ecc71,stroke:#333
    style Final fill:#e74c3c,stroke:#333
    style A5_Int fill:#f1c40f,stroke:#333
```

---

## 2. DIAGRAMA DE SECUENCIA: ORQUESTACIÓN TEMPORAL

Este diagrama detalla el _protocolo de comunicación_. Muestra quién llama a quién y en qué orden.

### Puntos Clave de la Secuencia

1. **Paralelismo Satélite**: Notar que A3 (Ejercicios), A9 (Evaluador) y A7 (Guionista) pueden trabajar en paralelo una vez A2 (Contenido) ha terminado. No tienen dependencias entre sí, solo dependen de A2.
2. **Validación Tardía**: A5 (Integrador) entra al final. Esto es intencional. Permite velocidad en la producción y rigor en el cierre.
3. **Bucle de Feedback**: Si A5 detecta "Gaps" (brechas), reactiva a los agentes específicos (A4, A6, A8) para llenar los huecos sin detener al resto del sistema.

```mermaid
sequenceDiagram
    participant User as Usuario
    participant A0 as A0 Manager
    participant A1 as A1 Estratega
    participant A2 as A2 Contenido
    participant Sats as Agentes Satélite (A3, A7, A9)
    participant Specs as Agentes Esp. (A4, A6, A8)
    participant A5 as A5 Integrador

    Note over User, A5: FASE 1: DEFINICIÓN
    User->>A0: Solicita nuevo curso
    A0->>A1: Define parámetros (Tema, Nivel)
    A1->>A1: Genera Plan Curricular & Metadata
    A1-->>User: Entrega Estructura Base

    Note over User, A5: FASE 2: PRODUCCIÓN (Iterativa)
    loop Para cada Tema
        User->>A2: Solicita Contenido Tema X
        A2->>A2: Genera _contenido.md

        par Producción Satélite
            User->>Sats: Solicita Ejercicios (A3)
            Sats->>Sats: Genera _ejercicios.md
            User->>Sats: Solicita Evaluación (A9)
            Sats->>Sats: Genera _evaluacion.md
            User->>Sats: Solicita Guión (A7)
            Sats->>Sats: Genera _guion.md
        end
    end

    Note over User, A5: FASE 3: ENRIQUECIMIENTO
    User->>A5: Solicita Checklist de Calidad
    A5->>A5: Detecta Gaps (Gráficos, Sims, Audio)

    rect rgb(240, 248, 255)
        Note right of Specs: Ejecución bajo demanda según Checklist
        User->>Specs: Generar Simulaciones (A4)
        Specs-->>A2: Artifacts HTML
        User->>Specs: Generar Gráficos (A6)
        Specs-->>A2: Artifacts Mermaid/SVG
        User->>Specs: Generar Audio (A8)
        Specs-->>A2: Archivos WAV
    end

    Note over User, A5: FASE 4: INTEGRACIÓN FINAL
    User->>A5: Solicita Integración
    A5->>A2: Inyecta Simulaciones/Gráficos en Markdown
    A5->>A5: Genera Presentaciones de Módulo
    A5->>A5: Genera Índice Global
    A5-->>User: Reporte Final "Ready to Ship"
```

## 3. DIRECTORIO DE AGENTES

A continuación se listan los especialistas que componen el sistema, con enlaces a su definición operativa (workflows):

| Agente  | Rol                                                                       | Responsabilidad Principal                                     | Definición |
| :-----: | :------------------------------------------------------------------------ | :------------------------------------------------------------ | :--------: |
| **A0**  | [Manager de Curso](../.agent/workflows/0-manager-curso.md)                   | Orquestación global y definición de parámetros iniciales.     |     📜     |
| **A1**  | [Estratega Curricular](../.agent/workflows/1-estratega-curricular.md)        | Diseño de arquitectura pedagógica (Plan, Pensum, Cronograma). |     📜     |
| **A12** | [Analista de Preconceptos](../.agent/workflows/12-analista-preconceptos.md)  | Detección de barreras cognitivas y analogías base.            |     📜     |
| **A2**  | [Sintetizador de Contenido](../.agent/workflows/2-sintetizador-contenido.md) | Generación del contenido teórica central (`_contenido.md`).   |     📜     |
| **A11** | [Editor Cognitivo](../.agent/workflows/11-editor-cognitivo.md)               | Refinamiento de tono, claridad y estilo Socrático.            |     📜     |
| **A3**  | [Diseñador de Ejercicios](../.agent/workflows/3-disenador-ejercicios.md)     | Creación de prácticas graduadas y casos de estudio.           |     ��     |
| **A9**  | [Evaluador](../.agent/workflows/9-evaluador.md)                              | Diseño de quizzes y validación de conocimientos.              |     📜     |
| **A7**  | [Guionista](../.agent/workflows/7-guionista.md)                              | Adaptación del contenido técnico a narrativa de audio.        |     📜     |
| **A4**  | [Generador de Simulaciones](../.agent/workflows/4-generador-simulaciones.md) | Desarrollo de artifacts interactivos (HTML/JS/React).         |     📜     |
| **A6**  | [Diseñador Gráfico](../.agent/workflows/6-disenador-grafico.md)              | Visualización de conceptos mediante diagramas (Mermaid/SVG).  |     📜     |
| **A8**  | [Locutor](../.agent/workflows/8-locutor.md)                                  | Conversión de guiones a audio (TTS).                          |     📜     |
| **A5**  | [Integrador de Calidad](../.agent/workflows/5-integrador-calidad.md)         | Auditoría, ensamblaje y empaquetado final del curso.          |     📜     |
