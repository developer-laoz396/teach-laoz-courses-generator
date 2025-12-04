# SISTEMA DE AGENTES PARA CREACIÓN DE CURSOS TÉCNICOS

Sistema de 5 agentes especializados que generan cursos técnicos y científicos de complejidad media-alta con aprendizaje adaptativo.

## ARQUITECTURA DEL SISTEMA

```
INPUT: Tema específico
    ↓
┌─────────────────────────────────────────────────┐
│ AGENTE 1: ESTRATEGA CURRICULAR                  │
│ - Análisis del tema                             │
│ - Arquitectura curricular completa              │
│ - 3 rutas de aprendizaje (Básica/Inter/Avanz)   │
│ - Mapa de dependencias conceptuales             │
│ Output: Plan curricular (2000-3000 palabras)    │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ AGENTE 2: SINTETIZADOR DE CONTENIDO             │
│ - Material teórico-práctico denso               │
│ - Progresión: Intuitivo → Formal → Aplicado     │
│ - Código ejecutable + visualizaciones           │
│ - Adaptado por nivel de ruta                    │
│ Output: Módulo completo (2500-3000 palabras)    │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ AGENTE 3: DISEÑADOR DE EJERCICIOS               │
│ - Banco de ejercicios graduados (⭐→⭐⭐⭐⭐) │
│ - Casos de prueba + soluciones modelo           │
│ - Rúbricas técnicas objetivas                   │
│ - Diagnóstico de errores comunes                │
│ Output: Banco ejercicios (3000-4000 palabras)   │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ AGENTE 4: GENERADOR DE SIMULACIONES             │
│ - Artifacts React/HTML interactivos             │
│ - Visualizaciones de algoritmos/conceptos       │
│ - Controles + feedback inmediato                │
│ - Métricas en tiempo real                       │
│ Output: Artifact funcional (.jsx/.html)         │
└─────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────┐
│ AGENTE 5: INTEGRADOR Y CONTROL DE CALIDAD       │
│ - Ensamblaje de todos los componentes           │
│ - Validación estructural/técnica/pedagógica     │
│ - Detección de gaps/redundancias                │
│ - Matriz de trazabilidad completa               │
│ Output: Curso completo integrado (15k-20k pal)  │
└─────────────────────────────────────────────────┘
    ↓
CURSO COMPLETO VALIDADO Y LISTO PARA USO
```

## ARCHIVOS DEL SISTEMA

### Archivos de Especificación (para referencia)

- `1_estratega_curricular.md` (8.5 KB)
- `2_sintetizador_contenido.md` (12 KB)
- `3_disenador_ejercicios.md` (15 KB)
- `4_generador_simulaciones.md` (21 KB)
- `5_integrador_calidad.md` (17 KB)

## USO DEL SISTEMA

### 🚀 Generación de Curso Completo (Agente 0)

El **Agente 0 (Manager)** es el orquestador principal. Su función es coordinar a todos los demás agentes para producir un curso completo desde cero.

**Comando:**
```bash
/0-manager-curso
```

**Flujo de Trabajo Automático:**
1.  **Planificación**: Llama al Agente 1 para crear el Plan Curricular.
2.  **Producción**: Itera por cada módulo llamando a los Agentes 2 (Contenido) y 3 (Ejercicios).
3.  **Enriquecimiento**:
    - Agente 4: Genera simulaciones interactivas.
    - Agente 6: Crea recursos gráficos y diagramas.
    - Agente 7: Escribe guiones de video/audio.
    - Agente 8: Genera archivos de audio (TTS).
    - Agente 9: Crea evaluaciones y solucionarios.
4.  **Integración**: Llama al Agente 5 para ensamblar el `CURSO_COMPLETO.md` y verificar la calidad.

---

### 🛠️ Uso Individual de Agentes

Puedes invocar a cada agente por separado para tareas específicas o para regenerar partes de un curso.

#### 1. Estratega Curricular
**Comando**: `/1-estratega-curricular`
**Función**: Diseña la arquitectura del curso, mapa de dependencias y rutas de aprendizaje.
**Input**: Tema, Audiencia, Complejidad.
**Output**: `plan_curricular.md`

#### 2. Sintetizador de Contenido
**Comando**: `/2-sintetizador-contenido`
**Función**: Redacta el contenido teórico y práctico de un módulo específico.
**Input**: Título del módulo, Objetivos.
**Output**: `modulo_X_contenido.md`

#### 3. Diseñador de Ejercicios
**Comando**: `/3-disenador-ejercicios`
**Función**: Crea ejercicios, retos y rúbricas de evaluación.
**Input**: Contenido del módulo.
**Output**: `modulo_X_ejercicios.md`

#### 4. Generador de Simulaciones
**Comando**: `/4-generador-simulaciones`
**Función**: Programa visualizaciones interactivas en React/HTML.
**Input**: Concepto técnico a visualizar.
**Output**: Archivos `.html` o `.jsx` en `simulaciones/`.

#### 5. Integrador de Calidad
**Comando**: `/5-integrador-calidad`
**Función**: Ensambla el curso, genera el menú de navegación y valida la coherencia.
**Input**: Todos los archivos del curso.
**Output**: `CURSO_COMPLETO.md`, `MENU.md`.

#### 6. Diseñador Gráfico
**Comando**: `/6-disenador-grafico`
**Función**: Genera diagramas (Mermaid) e ilustraciones (DALL-E/Stable Diffusion) para enriquecer el contenido.
**Input**: Contenido del módulo.
**Output**: Imágenes en `media/` e inserción en `modulo_X_contenido.md`.

#### 7. Guionista
**Comando**: `/7-guionista`
**Función**: Adapta el contenido técnico a guiones narrativos para audio/video.
**Input**: Contenido del módulo.
**Output**: `guiones/modulo_X_guion.md`

#### 8. Locutor (Audio Generator)
**Comando**: `/8-locutor`
**Función**: Convierte los guiones en archivos de audio `.wav` usando síntesis de voz.
**Input**: Guiones de texto.
**Output**: Archivos de audio en `media/` e inserción de reproductores en el contenido.

#### 9. Evaluador
**Comando**: `/9-evaluador`
**Función**: Genera bancos de preguntas y respuestas explicadas (Rationale) alineadas pedagógicamente.
**Input**: Contenido del módulo.
**Output**: `modulo_X_preguntas.md` y `modulo_X_respuestas.md`.

## CARACTERÍSTICAS DEL SISTEMA

### Fortalezas

**Agente 1: Estratega**

- Mapa conceptual con dependencias (Mermaid)
- 3 rutas diferenciadas desde diseño
- Estimación temporal realista (factor 1.5)
- Matriz de trazabilidad

**Agente 2: Contenido**

- Estructura 11 secciones (intuitivo→formal→aplicado)
- Código 100% ejecutable con tests
- Adaptación automática por nivel
- Comparación con alternativas técnicas

**Agente 3: Ejercicios**

- Graduación por dificultad (⭐→⭐⭐⭐⭐)
- Rúbricas objetivas (% por criterio)
- Casos de prueba en 3 niveles
- Diagnóstico de errores con causa raíz

**Agente 4: Simulaciones**

- Artifacts interactivos React/HTML
- Controles estándar (Play/Pause/Step/Reset)
- Métricas en tiempo real
- Explicaciones dinámicas

**Agente 5: Integrador**

- Validación estructural/técnica/pedagógica
- Detección automática de gaps/redundancias
- Matriz de trazabilidad completa
- Guías para estudiante e instructor

### Validaciones Automáticas

**Estructurales:**

- Grafo de dependencias acíclico
- Completitud de módulos (contenido + ejercicios)
- Duración dentro de rango objetivo (±15%)

**Técnicas:**

- Código ejecutable sin errores
- Terminología estandarizada
- Rúbricas objetivas y medibles

**Pedagógicas:**

- Trazabilidad 100% (objetivo→contenido→ejercicio)
- Progresión de dificultad validada
- 3 rutas implementadas y diferenciadas

## PERSONALIZACIÓN

### Tipos de cursos soportados

**Técnicos:**

- Programación (algoritmos, estructuras, paradigmas)
- DevOps (CI/CD, containers, orquestación)
- Arquitectura de software
- Seguridad informática

**Científicos:**

- Matemáticas aplicadas
- Física computacional
- Machine Learning / Deep Learning
- Análisis numérico

**Complejidad:**

- Media: Fundamentos con aplicaciones
- Alta: Conceptos avanzados, papers recientes, optimización

**Duración:**

- Corta: 2-5 horas (workshops)
- Media: 10-20 horas (módulos intensivos)
- Extensa: 30-50 horas (cursos completos)
- Especialización: 100+ horas (programas)

## OUTPUTS GENERADOS

### Por Agente 1

- Plan curricular estructurado
- Mapa conceptual (Mermaid)
- 3 rutas de aprendizaje
- Estimación temporal por módulo

### Por Agente 2 (por cada módulo)

- Contenido teórico-práctico (2500-3000 palabras)
- Código ejecutable con tests
- Visualizaciones (descripciones)
- Casos de uso reales

### Por Agente 3 (por cada módulo)

- 5-8 ejercicios graduados
- Soluciones modelo completas
- Casos de prueba en 3 niveles
- Rúbricas técnicas

### Por Agente 4 (por concepto que requiere visualización)

- Artifact React (.jsx) o HTML
- Controles interactivos
- Métricas en tiempo real
- Código 100% funcional

### Por Agente 5

- Curso completo integrado (15k-20k palabras)
- Tabla de contenidos navegable
- Matriz de trazabilidad
- Guías de uso
- Registro de validaciones

## RECOMENDACIONES DE USO

### Para cursos cortos (2-5h)

- Usar solo Agentes 1, 2, 3
- Omitir simulaciones complejas
- Ruta única (no diferenciación)

### Para cursos medios (10-20h)

- Usar todos los agentes
- 2-3 simulaciones clave
- 2 rutas (Básica e Intermedia)

### Para cursos extensos (30-50h)

- Usar todos los agentes
- Múltiples simulaciones
- 3 rutas completas
- Proyectos integradores por sección

### Para especializaciones (100+h)

- Modularizar en sub-cursos
- Ejecutar sistema por cada módulo mayor
- Integración manual final de todos los sub-cursos

## LIMITACIONES Y CONSIDERACIONES

**Limitaciones:**

- Código debe ser revisado en dominios críticos (seguridad, finanzas)
- Ejercicios complejos pueden requerir ajuste manual
- Visualizaciones 3D avanzadas tienen restricciones técnicas

**Mejores prácticas:**

- Revisar código generado antes de producción
- Validar ejercicios con estudiantes piloto
- Actualizar contenido según feedback

## MANTENIMIENTO

**Actualización de contenido:**

- Re-ejecutar Agente 2 para módulos obsoletos
- Mantener Agente 1 (arquitectura) estable

**Mejora de ejercicios:**

- Re-ejecutar Agente 3 con feedback de estudiantes
- Agregar casos de prueba según errores reales

**Nuevas simulaciones:**

- Ejecutar Agente 4 según nuevos conceptos visuales necesarios

## SOPORTE

Para problemas o mejoras del sistema:

1. Revisar especificaciones completas en archivos `X_*.md`
2. Ajustar prompts en archivos `prompt_X_*.txt`
3. Validar outputs con criterios de calidad de Agente 5

## LICENCIA

Sistema diseñado para uso con Claude API o Claude CLI.
