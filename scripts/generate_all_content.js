const fs = require('fs');
const path = require('path');

// Cargar la estructura del curso
const structurePath = 'e:\\repositories\\teach-laoz-courses-generator\\temp_structure.json';
const structure = JSON.parse(fs.readFileSync(structurePath, 'utf8'));

const baseDir = 'e:\\repositories\\teach-laoz-courses-generator\\cursos\\curso_arquitectura_software';

// Función para generar contenido básico
function generateContenido(modulo, tema) {
  return `# TEMA ${tema.id}: ${tema.nombre.toUpperCase()}

**Tiempo estimado**: 45 minutos  
**Nivel**: Intermedio  
**Prerrequisitos**: Conceptos del módulo anterior

## ¿Por qué importa este concepto?

Este tema es fundamental para comprender ${tema.nombre.toLowerCase()}. En sistemas de producción, dominar estos conceptos permite tomar decisiones arquitectónicas informadas.

## Comprensión intuitiva

${tema.nombre} es un concepto clave en arquitectura de software que...

## Definición formal

> **${tema.nombre}**: [Definición técnica precisa]

### Propiedades fundamentales

${tema.subtemas.map((st, i) => `${i + 1}. **${st}**: Descripción detallada`).join('\n')}

## Implementación práctica

### Conceptos clave

${tema.subtemas.map(st => `#### ${st}\n\n[Explicación detallada del subtema]\n`).join('\n')}

## Casos de uso en producción

### Aplicación 1: Caso Real
**Contexto**: Descripción del escenario
**Solución**: Cómo se aplica este concepto
**Resultado**: Impacto medible

## Errores frecuentes

### ❌ Error 1: [Descripción]
**Por qué falla**: Explicación técnica
**Solución correcta**: Enfoque correcto

## Resumen del concepto

**En una frase**: ${tema.nombre} es...

**Cuándo usarlo**: Criterios de aplicación

**Prerequisito crítico**: Conceptos que deben dominarse antes

**Siguiente paso**: Enlace al próximo tema

## Puntos clave

${tema.subtemas.map((st, i) => `${i + 1}. ✅ ${st}`).join('\n')}
`;
}

function generateEjercicios(modulo, tema) {
  return `# EJERCICIOS: TEMA ${tema.id} - ${tema.nombre}

## Ejercicios Conceptuales

### Ejercicio 1: Comprensión ⭐
**Objetivo**: Verificar comprensión de conceptos básicos

**Pregunta**: Explica con tus propias palabras qué es ${tema.nombre} y por qué es importante.

**Criterios de evaluación**:
- [ ] Define correctamente el concepto
- [ ] Identifica casos de uso
- [ ] Explica beneficios y trade-offs

---

### Ejercicio 2: Análisis ⭐⭐
**Objetivo**: Analizar un escenario real

**Escenario**: [Descripción de un caso práctico]

**Tareas**:
1. Identifica los elementos clave de ${tema.nombre}
2. Analiza las decisiones tomadas
3. Propón mejoras

**Solución modelo**: [Incluida al final]

---

## Ejercicios Prácticos

### Ejercicio 3: Implementación ⭐⭐⭐
**Objetivo**: Implementar ${tema.nombre} en un proyecto real

**Requisitos**:
${tema.subtemas.map((st, i) => `${i + 1}. Implementar ${st}`).join('\n')}

**Criterios de aceptación**:
- [ ] Código funcional
- [ ] Tests unitarios
- [ ] Documentación

---

## Ejercicio Desafío

### Ejercicio 4: Optimización ⭐⭐⭐⭐
**Objetivo**: Optimizar una implementación existente

**Contexto**: Sistema con problemas de [aspecto relevante]

**Desafío**: Aplicar ${tema.nombre} para resolver el problema

**Rúbrica**:
- Análisis del problema (25%)
- Diseño de solución (25%)
- Implementación (30%)
- Testing y validación (20%)

---

## Soluciones Modelo

### Solución Ejercicio 2
[Solución detallada con explicación]

### Solución Ejercicio 3
\`\`\`javascript
// Código de ejemplo
\`\`\`

**Explicación**: [Rationale de las decisiones]
`;
}

function generateGuion(modulo, tema) {
  return `# GUIÓN DE AUDIO: TEMA ${tema.id} - ${tema.nombre}

## Ficha Técnica
- **Duración estimada**: 8-10 minutos
- **Tono**: Profesional, didáctico
- **Ritmo**: Moderado con pausas para reflexión

---

## [00:00 - 00:30] INTRODUCCIÓN

Bienvenido al tema ${tema.id}: ${tema.nombre}.

En este módulo vamos a explorar uno de los conceptos más importantes en arquitectura de software. ${tema.nombre} es fundamental para diseñar sistemas robustos y escalables.

*[Pausa 2 segundos]*

---

## [00:30 - 02:00] CONTEXTO Y MOTIVACIÓN

Imagina que estás diseñando un sistema de producción. Una de las decisiones más críticas que enfrentarás es cómo aplicar ${tema.nombre}.

*[Pausa 1 segundo]*

Este concepto te permite:
${tema.subtemas.slice(0, 3).map(st => `- ${st}`).join('\n')}

*[Pausa 2 segundos]*

---

## [02:00 - 05:00] CONCEPTOS CLAVE

Vamos a desglosar los elementos fundamentales:

${tema.subtemas.map((st, i) => `
### ${st}

[Explicación clara y concisa del subtema]

*[Pausa 1 segundo]*
`).join('\n')}

---

## [05:00 - 07:00] EJEMPLO PRÁCTICO

Veamos cómo se aplica esto en un caso real.

[Descripción de ejemplo concreto]

*[Pausa 2 segundos]*

---

## [07:00 - 08:30] ERRORES COMUNES

Antes de terminar, quiero advertirte sobre los errores más frecuentes:

1. [Error común 1]
2. [Error común 2]

*[Pausa 1 segundo]*

---

## [08:30 - 10:00] RESUMEN Y CIERRE

Para resumir, ${tema.nombre} es esencial porque...

Los puntos clave que debes recordar son:
${tema.subtemas.slice(0, 3).map((st, i) => `${i + 1}. ${st}`).join('\n')}

En el próximo tema, exploraremos cómo estos conceptos se conectan con...

¡Nos vemos en la siguiente lección!

---

## NOTAS DE PRODUCCIÓN
- Insertar música de fondo sutil durante introducción
- Enfatizar palabras clave: ${tema.subtemas.slice(0, 2).join(', ')}
- Pausas más largas antes de ejemplos prácticos
`;
}

function generateEvaluacion(modulo, tema) {
  return `# EVALUACIÓN: TEMA ${tema.id} - ${tema.nombre}

## Instrucciones
- Tiempo estimado: 15 minutos
- Todas las preguntas deben responderse
- Consulta el solucionario al final para verificar tus respuestas

---

## CUESTIONARIO

### Pregunta 1: Opción Múltiple
**¿Cuál de las siguientes afirmaciones sobre ${tema.nombre} es correcta?**

a) ${tema.subtemas[0] || 'Opción A'}  
b) ${tema.subtemas[1] || 'Opción B'}  
c) ${tema.subtemas[2] || 'Opción C'}  
d) Todas las anteriores

---

### Pregunta 2: Verdadero/Falso
**${tema.nombre} siempre mejora el rendimiento del sistema.**

- [ ] Verdadero
- [ ] Falso

**Justifica tu respuesta:**
_______________________________________

---

### Pregunta 3: Análisis de Caso
**Escenario**: Un equipo está implementando ${tema.nombre} en su sistema.

**Pregunta**: ¿Qué consideraciones arquitectónicas deben tener en cuenta?

**Tu respuesta**:
_______________________________________
_______________________________________

---

### Pregunta 4: Aplicación Práctica
**Diseña una solución** que utilice ${tema.nombre} para resolver el siguiente problema:

[Descripción del problema]

**Elementos que debe incluir tu diseño**:
${tema.subtemas.map((st, i) => `${i + 1}. ${st}`).join('\n')}

---

## SOLUCIONARIO

### Respuesta 1
**Correcta: d) Todas las anteriores**

**Explicación**: ${tema.nombre} abarca todos estos aspectos porque...

---

### Respuesta 2
**Correcta: Falso**

**Justificación**: ${tema.nombre} no siempre mejora el rendimiento. Existen trade-offs como...

---

### Respuesta 3
**Elementos clave a considerar**:
1. ${tema.subtemas[0] || 'Aspecto 1'}
2. ${tema.subtemas[1] || 'Aspecto 2'}
3. ${tema.subtemas[2] || 'Aspecto 3'}

**Explicación detallada**: [Rationale completo]

---

### Respuesta 4
**Solución modelo**:

[Diseño completo con diagramas y explicación]

**Criterios de evaluación**:
- Correcta aplicación de ${tema.nombre} (40%)
- Consideración de trade-offs (30%)
- Claridad de la solución (30%)
`;
}

// Generar archivos para todos los módulos
let filesCreated = 0;
let errors = [];

structure.forEach(modulo => {
  // Saltar módulo 0 (ya existe)
  if (modulo.id === 0) {
    console.log(`Saltando módulo ${modulo.id} (ya existe)`);
    return;
  }

  const moduloDir = path.join(baseDir, 'modulos', modulo.modulo);
  
  // Crear directorio del módulo
  if (!fs.existsSync(moduloDir)) {
    fs.mkdirSync(moduloDir, { recursive: true });
    console.log(`✓ Creado directorio: ${modulo.modulo}`);
  }

  modulo.temas.forEach(tema => {
    // Verificar si ya existen archivos para este tema
    const temaBase = `tema_${tema.id}_${tema.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    
    const archivos = [
      { tipo: 'contenido', generador: generateContenido },
      { tipo: 'ejercicios', generador: generateEjercicios },
      { tipo: 'guion', generador: generateGuion },
      { tipo: 'evaluacion', generador: generateEvaluacion }
    ];

    archivos.forEach(({ tipo, generador }) => {
      const filename = `${temaBase}_${tipo}.md`;
      const filepath = path.join(moduloDir, filename);

      // Solo crear si no existe
      if (!fs.existsSync(filepath)) {
        try {
          const contenido = generador(modulo, tema);
          fs.writeFileSync(filepath, contenido, 'utf8');
          filesCreated++;
          console.log(`✓ Creado: ${modulo.modulo}/${filename}`);
        } catch (error) {
          errors.push({ file: filename, error: error.message });
          console.error(`✗ Error en ${filename}: ${error.message}`);
        }
      } else {
        console.log(`- Ya existe: ${modulo.modulo}/${filename}`);
      }
    });
  });
});

console.log('\n=== RESUMEN ===');
console.log(`Archivos creados: ${filesCreated}`);
console.log(`Errores: ${errors.length}`);

if (errors.length > 0) {
  console.log('\nErrores encontrados:');
  errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`));
}
