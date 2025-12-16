/**
 * GENERADOR AUTOMÁTICO DE CURSOS
 * 
 * Script genérico que lee el plan curricular de cualquier curso y genera
 * automáticamente todo el contenido usando los agentes especializados.
 * 
 * Uso: node scripts/generate_course.js <ruta-al-directorio-del-curso>
 * Ejemplo: node scripts/generate_course.js cursos/teach-laoz-curso-algebra-preuniversitaria
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración
const COURSE_DIR = process.argv[2];
if (!COURSE_DIR) {
    console.error('❌ Error: Debes proporcionar la ruta al directorio del curso');
    console.error('Uso: node scripts/generate_course.js <ruta-al-directorio-del-curso>');
    process.exit(1);
}

const PLAN_CURRICULAR_PATH = path.join(COURSE_DIR, 'plan_curricular.md');
const MODULOS_DIR = path.join(COURSE_DIR, 'modulos');
const MEDIA_DIR = path.join(COURSE_DIR, 'media');

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

function log(color, ...args) {
    console.log(color, ...args, colors.reset);
}

function logEvent(agent, phase, message, status = 'info') {
    try {
        execSync(`node scripts/log_event.js "${agent}" "${phase}" "${message}" "${status}"`, {
            cwd: process.cwd(),
            stdio: 'inherit'
        });
    } catch (error) {
        console.warn('⚠️  No se pudo registrar el evento en el sistema de logging');
    }
}

/**
 * Extrae el bloque JSON del plan curricular
 */
function extractCurricularStructure() {
    log(colors.blue, '\n📖 Leyendo plan curricular...');
    
    const planContent = fs.readFileSync(PLAN_CURRICULAR_PATH, 'utf8');
    
    // Buscar el bloque JSON al final del archivo
    const jsonMatch = planContent.match(/```json\s*([\s\S]*?)\s*```/);
    
    if (!jsonMatch) {
        throw new Error('No se encontró el bloque JSON en el plan curricular');
    }
    
    const structure = JSON.parse(jsonMatch[1]);
    log(colors.green, `✅ Plan curricular cargado: ${structure.length} módulos`);
    
    return structure;
}

/**
 * Cuenta total de subtemas
 */
function countSubtemas(structure) {
    let total = 0;
    structure.forEach(modulo => {
        modulo.temas.forEach(tema => {
            total += tema.subtemas.length;
        });
    });
    return total;
}

/**
 * Genera contenido teórico para un subtema (Agente 2)
 */
function generateContenido(moduloId, temaId, subtemaId, subtema, courseInfo) {
    const filename = `tema_${temaId}_subtema_${subtemaId}_contenido.md`;
    const filepath = path.join(MODULOS_DIR, `modulo_${moduloId}`, filename);
    
    log(colors.cyan, `\n  📝 Generando contenido: ${subtema.titulo}`);
    
    // Aquí iría la lógica del Agente 2 (Sintetizador de Contenido)
    // Por ahora, generamos contenido estructurado básico
    
    const content = `# ${subtema.titulo}

## Introducción

Este subtema forma parte del módulo ${moduloId} y aborda ${subtema.titulo.toLowerCase()}.

## Objetivos de Aprendizaje

Al finalizar este subtema, serás capaz de:

1. Comprender los conceptos fundamentales de ${subtema.titulo.toLowerCase()}
2. Aplicar técnicas y métodos relacionados
3. Resolver problemas prácticos del tema

## Contenido Teórico

### 1. Conceptos Fundamentales

[Contenido teórico detallado sobre ${subtema.titulo}]

### 2. Propiedades y Características

[Propiedades clave del tema]

### 3. Métodos y Técnicas

[Métodos de resolución y técnicas aplicables]

## Ejemplos Resueltos

### Ejemplo 1
[Problema resuelto paso a paso]

### Ejemplo 2
[Problema resuelto paso a paso]

### Ejemplo 3
[Problema resuelto paso a paso]

## Errores Comunes

❌ **Error 1**: [Descripción del error común]
✅ **Correcto**: [Forma correcta]

❌ **Error 2**: [Descripción del error común]
✅ **Correcto**: [Forma correcta]

## Estrategias de Resolución

1. [Estrategia 1]
2. [Estrategia 2]
3. [Estrategia 3]

## Aplicaciones

[Aplicaciones prácticas del tema en contextos reales]

## Resumen

- [Punto clave 1]
- [Punto clave 2]
- [Punto clave 3]

## Práctica Recomendada

Para dominar este tema:
1. Practica los ejercicios propuestos
2. Revisa los ejemplos resueltos
3. Identifica y corrige tus errores
`;

    fs.writeFileSync(filepath, content, 'utf8');
    log(colors.green, `  ✅ Contenido generado: ${filename}`);
    
    return filepath;
}

/**
 * Genera ejercicios para un subtema (Agente 3)
 */
function generateEjercicios(moduloId, temaId, subtemaId, subtema) {
    const filename = `tema_${temaId}_subtema_${subtemaId}_ejercicios.md`;
    const filepath = path.join(MODULOS_DIR, `modulo_${moduloId}`, filename);
    
    log(colors.cyan, `  📚 Generando ejercicios: ${subtema.titulo}`);
    
    const content = `# Ejercicios: ${subtema.titulo}

## Nivel Básico (60-74%)

### Ejercicio 1
**Enunciado**: [Problema básico relacionado con ${subtema.titulo}]

**Solución**:
\`\`\`
[Paso 1]
[Paso 2]
[Paso 3]
Respuesta: [resultado]
\`\`\`

**Rúbrica**:
- Procedimiento correcto: 50%
- Respuesta correcta: 30%
- Notación apropiada: 20%

### Ejercicio 2
[Similar estructura]

### Ejercicio 3
[Similar estructura]

### Ejercicio 4
[Similar estructura]

### Ejercicio 5
[Similar estructura]

---

## Nivel Intermedio (75-89%)

### Ejercicio 6
**Enunciado**: [Problema intermedio que requiere múltiples pasos]

**Solución**:
\`\`\`
[Solución detallada]
\`\`\`

**Rúbrica**:
- Análisis del problema: 30%
- Procedimiento: 40%
- Respuesta: 20%
- Verificación: 10%

### Ejercicio 7-10
[Ejercicios intermedios adicionales]

---

## Nivel Avanzado (90-100%)

### Ejercicio 11
**Enunciado**: [Problema complejo que requiere pensamiento crítico]

**Solución**:
\`\`\`
[Solución con justificación]
\`\`\`

**Rúbrica**:
- Planteamiento: 25%
- Desarrollo: 40%
- Justificación: 20%
- Optimización: 15%

### Ejercicio 12-15
[Ejercicios avanzados adicionales]

---

## Problemas Desafiantes

### Desafío 1
[Problema tipo olimpiada o examen de admisión]

### Desafío 2
[Problema que integra múltiples conceptos]

---

## Autoevaluación

Resuelve los siguientes problemas sin consultar las soluciones:

1. [Problema de autoevaluación 1]
2. [Problema de autoevaluación 2]
3. [Problema de autoevaluación 3]

**Criterio de dominio**:
- 3/3 correctos: Excelente dominio
- 2/3 correctos: Buen dominio, revisar errores
- 1/3 o menos: Requiere más práctica
`;

    fs.writeFileSync(filepath, content, 'utf8');
    log(colors.green, `  ✅ Ejercicios generados: ${filename}`);
    
    return filepath;
}

/**
 * Genera guión de audio para un subtema (Agente 7)
 */
function generateGuion(moduloId, temaId, subtemaId, subtema) {
    const filename = `tema_${temaId}_subtema_${subtemaId}_guion.md`;
    const filepath = path.join(MODULOS_DIR, `modulo_${moduloId}`, filename);
    
    log(colors.cyan, `  🎙️  Generando guión: ${subtema.titulo}`);
    
    const content = `# Guión de Audio: ${subtema.titulo}

## Metadata
- **Duración estimada**: 3-5 minutos
- **Tono**: Educativo, claro, motivador
- **Velocidad**: 150-160 palabras por minuto
- **Audiencia**: Estudiantes pre-universitarios

---

## INTRODUCCIÓN (30 segundos)

Hola, bienvenido a este tema sobre ${subtema.titulo}.

En los próximos minutos, vamos a explorar [concepto principal], entender [objetivo clave], y aprender [habilidad específica].

Este tema es fundamental porque [razón de importancia].

---

## DESARROLLO (2-3 minutos)

### Concepto Principal

Comencemos definiendo qué es [concepto]. 

[Explicación clara y concisa del concepto principal]

Para entenderlo mejor, imagina [analogía o ejemplo cotidiano].

### Propiedades Clave

Ahora, veamos las características más importantes:

Primero, [propiedad 1]. Esto significa que [explicación].

Segundo, [propiedad 2]. Por ejemplo, [ejemplo concreto].

Tercero, [propiedad 3]. Recuerda que [punto clave].

### Método de Aplicación

¿Cómo aplicamos esto en la práctica?

El procedimiento es el siguiente:

Paso uno: [acción 1]
Paso dos: [acción 2]
Paso tres: [acción 3]

Veamos un ejemplo rápido: [ejemplo breve y claro]

---

## ERRORES COMUNES (30 segundos)

Antes de terminar, ten cuidado con estos errores frecuentes:

Error número uno: [error común]. La forma correcta es [corrección].

Error número dos: [error común]. Recuerda siempre [consejo].

---

## CIERRE (30 segundos)

Para resumir:

[Punto clave 1]
[Punto clave 2]
[Punto clave 3]

Practica los ejercicios propuestos para dominar este tema.

En el próximo tema, veremos [adelanto del siguiente tema].

¡Éxito en tu aprendizaje!

---

## NOTAS DE PRODUCCIÓN

- Pausas: Insertar pausa de 1 segundo después de cada sección
- Énfasis: Resaltar palabras clave y fórmulas
- Ritmo: Mantener ritmo constante, no acelerar en explicaciones complejas
- Tono: Subir tono en preguntas retóricas, bajar en conclusiones
`;

    fs.writeFileSync(filepath, content, 'utf8');
    log(colors.green, `  ✅ Guión generado: ${filename}`);
    
    return filepath;
}

/**
 * Genera evaluación para un subtema (Agente 9)
 */
function generateEvaluacion(moduloId, temaId, subtemaId, subtema) {
    const filename = `tema_${temaId}_subtema_${subtemaId}_evaluacion.md`;
    const filepath = path.join(MODULOS_DIR, `modulo_${moduloId}`, filename);
    
    log(colors.cyan, `  📋 Generando evaluación: ${subtema.titulo}`);
    
    const content = `# Evaluación: ${subtema.titulo}

## Instrucciones

- Tiempo estimado: 15-20 minutos
- Puntaje total: 100 puntos
- Puntaje mínimo aprobatorio: 75 puntos
- Puedes usar calculadora científica
- Muestra todo tu procedimiento

---

## Parte 1: Selección Múltiple (40 puntos)

Cada pregunta vale 10 puntos. Selecciona la respuesta correcta.

### Pregunta 1
[Pregunta sobre concepto fundamental]

a) [Opción A]
b) [Opción B]
c) [Opción C]
d) [Opción D]

**Respuesta correcta**: [Letra]
**Justificación**: [Explicación de por qué es correcta]

### Pregunta 2
[Pregunta sobre aplicación]

a) [Opción A]
b) [Opción B]
c) [Opción C]
d) [Opción D]

**Respuesta correcta**: [Letra]
**Justificación**: [Explicación]

### Pregunta 3
[Pregunta sobre análisis]

a) [Opción A]
b) [Opción B]
c) [Opción C]
d) [Opción D]

**Respuesta correcta**: [Letra]
**Justificación**: [Explicación]

### Pregunta 4
[Pregunta integradora]

a) [Opción A]
b) [Opción B]
c) [Opción C]
d) [Opción D]

**Respuesta correcta**: [Letra]
**Justificación**: [Explicación]

---

## Parte 2: Desarrollo (60 puntos)

Resuelve los siguientes problemas mostrando todo tu procedimiento.

### Problema 1 (20 puntos)
**Enunciado**: [Problema que requiere aplicación directa]

**Solución**:
\`\`\`
Paso 1: [Análisis]
Paso 2: [Desarrollo]
Paso 3: [Cálculo]
Paso 4: [Verificación]

Respuesta: [Resultado final]
\`\`\`

**Rúbrica**:
- Planteamiento correcto (5 pts)
- Procedimiento adecuado (8 pts)
- Cálculos correctos (5 pts)
- Respuesta final (2 pts)

### Problema 2 (20 puntos)
**Enunciado**: [Problema que requiere múltiples pasos]

**Solución**:
\`\`\`
[Solución detallada paso a paso]
\`\`\`

**Rúbrica**:
- Identificación de estrategia (6 pts)
- Ejecución del método (8 pts)
- Precisión en cálculos (4 pts)
- Presentación clara (2 pts)

### Problema 3 (20 puntos)
**Enunciado**: [Problema aplicado o integrador]

**Solución**:
\`\`\`
[Solución completa]
\`\`\`

**Rúbrica**:
- Modelado del problema (7 pts)
- Resolución matemática (8 pts)
- Interpretación de resultados (3 pts)
- Verificación (2 pts)

---

## Criterios de Evaluación

### Excelente (90-100 puntos)
- Dominio completo de conceptos
- Procedimientos impecables
- Respuestas correctas y bien justificadas
- Notación matemática precisa

### Bueno (75-89 puntos)
- Comprensión sólida de conceptos
- Procedimientos correctos con errores menores
- Mayoría de respuestas correctas
- Notación adecuada

### Requiere Refuerzo (60-74 puntos)
- Comprensión parcial
- Errores en procedimientos
- Algunas respuestas incorrectas
- Notación inconsistente

### No Aprobado (<60 puntos)
- Comprensión insuficiente
- Procedimientos incorrectos
- Mayoría de respuestas incorrectas
- Requiere reestudio del tema

---

## Retroalimentación

Después de completar la evaluación:

1. Revisa las respuestas correctas
2. Identifica tus errores más frecuentes
3. Repasa los conceptos donde fallaste
4. Practica ejercicios similares
5. Solicita ayuda si es necesario

---

## Autoevaluación

¿Cómo te sentiste con esta evaluación?

- [ ] Muy confiado - Dominé el tema
- [ ] Confiado - Entendí la mayoría
- [ ] Inseguro - Necesito más práctica
- [ ] Confundido - Requiero ayuda

**Próximos pasos según tu autoevaluación**:
- Muy confiado: Avanza al siguiente tema
- Confiado: Revisa errores y avanza
- Inseguro: Practica ejercicios adicionales
- Confundido: Repasa contenido teórico y busca ayuda
`;

    fs.writeFileSync(filepath, content, 'utf8');
    log(colors.green, `  ✅ Evaluación generada: ${filename}`);
    
    return filepath;
}

/**
 * Procesa un subtema completo
 */
function processSubtema(moduloId, temaId, subtemaId, subtema, courseInfo, progress) {
    log(colors.magenta, `\n🔄 Procesando: Módulo ${moduloId} - Tema ${temaId} - Subtema ${subtemaId}`);
    log(colors.blue, `   ${subtema.titulo}`);
    
    const startTime = Date.now();
    
    try {
        // Generar todos los archivos del subtema
        generateContenido(moduloId, temaId, subtemaId, subtema, courseInfo);
        generateEjercicios(moduloId, temaId, subtemaId, subtema);
        generateGuion(moduloId, temaId, subtemaId, subtema);
        generateEvaluacion(moduloId, temaId, subtemaId, subtema);
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        progress.completed++;
        const percentage = ((progress.completed / progress.total) * 100).toFixed(1);
        
        log(colors.green, `\n✅ Subtema completado en ${duration}s`);
        log(colors.cyan, `📊 Progreso: ${progress.completed}/${progress.total} (${percentage}%)`);
        
        // Registrar progreso
        logEvent(
            'Generador-Automatico',
            `modulo_${moduloId}`,
            `Subtema ${subtemaId} completado: ${subtema.titulo}`,
            'success'
        );
        
        return true;
    } catch (error) {
        log(colors.red, `❌ Error procesando subtema ${subtemaId}: ${error.message}`);
        logEvent(
            'Generador-Automatico',
            `modulo_${moduloId}`,
            `Error en subtema ${subtemaId}: ${error.message}`,
            'error'
        );
        return false;
    }
}

/**
 * Procesa un módulo completo
 */
function processModulo(modulo, progress, courseInfo) {
    log(colors.yellow, `\n${'='.repeat(70)}`);
    log(colors.yellow, `📦 MÓDULO ${modulo.modulo_id}: ${modulo.titulo}`);
    log(colors.yellow, `${'='.repeat(70)}`);
    
    logEvent(
        'Generador-Automatico',
        `modulo_${modulo.modulo_id}`,
        `Iniciando generación del módulo: ${modulo.titulo}`,
        'info'
    );
    
    modulo.temas.forEach(tema => {
        log(colors.blue, `\n📑 Tema ${tema.tema_id}: ${tema.titulo}`);
        
        tema.subtemas.forEach(subtema => {
            processSubtema(
                modulo.modulo_id,
                tema.tema_id,
                subtema.subtema_id,
                subtema,
                courseInfo,
                progress
            );
        });
    });
    
    logEvent(
        'Generador-Automatico',
        `modulo_${modulo.modulo_id}`,
        `Módulo completado: ${modulo.titulo}`,
        'success'
    );
}

/**
 * Función principal
 */
async function main() {
    const startTime = Date.now();
    
    log(colors.cyan, '\n╔════════════════════════════════════════════════════════════════╗');
    log(colors.cyan, '║                                                                ║');
    log(colors.cyan, '║   🚀 GENERADOR AUTOMÁTICO DE CURSOS                           ║');
    log(colors.cyan, '║                                                                ║');
    log(colors.cyan, '╚════════════════════════════════════════════════════════════════╝\n');
    
    // Verificar que existe el directorio del curso
    if (!fs.existsSync(COURSE_DIR)) {
        log(colors.red, `❌ Error: No existe el directorio ${COURSE_DIR}`);
        process.exit(1);
    }
    
    // Verificar que existe el plan curricular
    if (!fs.existsSync(PLAN_CURRICULAR_PATH)) {
        log(colors.red, `❌ Error: No se encontró plan_curricular.md en ${COURSE_DIR}`);
        process.exit(1);
    }
    
    // Cargar estructura curricular
    const structure = extractCurricularStructure();
    const totalSubtemas = countSubtemas(structure);
    
    log(colors.blue, `\n📊 Resumen del curso:`);
    log(colors.blue, `   Módulos: ${structure.length}`);
    log(colors.blue, `   Subtemas totales: ${totalSubtemas}`);
    log(colors.blue, `   Archivos a generar: ${totalSubtemas * 4} (contenido + ejercicios + guión + evaluación)`);
    
    // Leer información del curso desde CONFIG.md
    const courseInfo = {
        name: path.basename(COURSE_DIR),
        dir: COURSE_DIR
    };
    
    // Objeto de progreso
    const progress = {
        total: totalSubtemas,
        completed: 0,
        errors: 0
    };
    
    logEvent(
        'Generador-Automatico',
        'inicio',
        `Iniciando generación automática: ${totalSubtemas} subtemas`,
        'info'
    );
    
    log(colors.green, `\n🎬 Iniciando generación...\n`);
    
    // Procesar cada módulo
    structure.forEach(modulo => {
        processModulo(modulo, progress, courseInfo);
    });
    
    // Resumen final
    const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
    
    log(colors.cyan, '\n' + '='.repeat(70));
    log(colors.cyan, '📊 RESUMEN DE GENERACIÓN');
    log(colors.cyan, '='.repeat(70));
    log(colors.green, `\n✅ Subtemas completados: ${progress.completed}/${progress.total}`);
    log(colors.green, `✅ Archivos generados: ${progress.completed * 4}`);
    log(colors.blue, `⏱️  Tiempo total: ${totalTime} minutos`);
    
    if (progress.errors > 0) {
        log(colors.yellow, `⚠️  Errores encontrados: ${progress.errors}`);
    }
    
    logEvent(
        'Generador-Automatico',
        'finalizacion',
        `Generación completada: ${progress.completed}/${progress.total} subtemas en ${totalTime} min`,
        'success'
    );
    
    log(colors.green, '\n✨ Generación completada exitosamente!\n');
}

// Ejecutar
main().catch(error => {
    log(colors.red, '\n❌ Error fatal:', error.message);
    console.error(error);
    process.exit(1);
});
