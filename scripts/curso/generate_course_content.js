#!/usr/bin/env node

/**
 * Script de Generación Automatizada de Contenido del Curso
 *
 * Este script genera automáticamente el contenido completo del curso SOLID
 * usando los workflows de agentes especializados y la API de Anthropic.
 *
 * Uso:
 *   node scripts/curso/generate_course_content.js --module 1 --start-subtema 1
 */

const fs = require('fs').promises;
const path = require('path');

// Configuración
const COURSE_DIR = path.join(__dirname, '../../cursos/curso_solid_javascript');
const PLAN_CURRICULAR = path.join(COURSE_DIR, 'plan_curricular.json');
const WORKFLOWS_DIR = path.join(__dirname, '../../.agent/workflows');

// Leer el plan curricular
async function loadCurricularPlan() {
  try {
    const planContent = await fs.readFile(PLAN_CURRICULAR, 'utf-8');
    return JSON.parse(planContent);
  } catch (error) {
    console.error('Error loading curricular plan:', error);
    throw error;
  }
}

// Leer un workflow de agente
async function loadWorkflow(agentNumber) {
  const workflowPath = path.join(WORKFLOWS_DIR, `${agentNumber}-*.md`);
  // TODO: Implementar lectura de workflow
}

// Generar contenido para un subtema usando Agente 2 (Sintetizador)
async function generateSubtemaContent(moduloId, temaId, subtemaId, subtema) {
  console.log(`\nGenerando contenido: Módulo ${moduloId} - ${subtema.titulo}`);

  const outputPath = path.join(
    COURSE_DIR,
    'modulos',
    `modulo_${moduloId}`,
    `tema_${temaId}_${subtemaId}_contenido.md`
  );

  // Verificar si ya existe
  try {
    await fs.access(outputPath);
    console.log(`  ✓ Ya existe: ${outputPath}`);
    return { success: true, skipped: true };
  } catch {}

  // Preparar prompt para Agente 2
  const prompt = `
Actúa como el AGENTE 2: SINTETIZADOR DE CONTENIDO.

Genera contenido educativo completo para:

**SUBTEMA**: ${subtema.titulo}
**MÓDULO**: ${moduloId}
**TIPO**: ${subtema.tipo}
**TIEMPO ASIGNADO**: ${subtema.tiempo_minutos} minutos
**REQUIERE CÓDIGO**: ${subtema.requiere_codigo ? 'Sí' : 'No'}

**CONTEXTO**: Este subtema es parte del curso "SOLID aplicado en JavaScript" para desarrolladores con experiencia en programación.

Sigue la estructura definida en el workflow del Agente 2:
1. Encabezado y contexto
2. Comprensión intuitiva
3. Definición formal
4. Implementación práctica con código JavaScript
5. Casos de prueba
6. Errores frecuentes
7. Aplicaciones reales
8. Resumen

Genera ÚNICAMENTE el contenido markdown completo, listo para usar.
NO incluyas meta-comentarios ni TODOs.
El contenido debe ser denso, técnico y práctico.
  `.trim();

  // TODO: Aquí harías la llamada a la API de Anthropic
  // Por ahora, creamos un placeholder
  const content = `# ${subtema.titulo}

**Tiempo estimado**: ${subtema.tiempo_minutos} minutos
**Tipo**: ${subtema.tipo}
**Requiere código**: ${subtema.requiere_codigo ? 'Sí' : 'No'}

## Contenido

[CONTENIDO GENERADO AUTOMÁTICAMENTE]

Este subtema será generado por el sistema de agentes especializados.

**Temas a cubrir**:
- Conceptos fundamentales
- Ejemplos prácticos en JavaScript
- Casos de uso reales
- Ejercicios y validación

## Próximos pasos

Continúa con el siguiente subtema del módulo.
`;

  try {
    await fs.writeFile(outputPath, content, 'utf-8');
    console.log(`  ✓ Creado: ${outputPath}`);
    return { success: true, path: outputPath };
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Generar ejercicios para un subtema usando Agente 3
async function generateSubtemaExercises(moduloId, temaId, subtemaId, subtema) {
  console.log(`  Generando ejercicios: ${subtema.titulo}`);

  const outputPath = path.join(
    COURSE_DIR,
    'modulos',
    `modulo_${moduloId}`,
    `tema_${temaId}_${subtemaId}_ejercicios.md`
  );

  // Verificar si ya existe
  try {
    await fs.access(outputPath);
    console.log(`    ✓ Ejercicios ya existen`);
    return { success: true, skipped: true };
  } catch {}

  const content = `# Ejercicios: ${subtema.titulo}

**Tiempo estimado**: ${Math.ceil(subtema.tiempo_minutos * 0.5)} minutos

## Ejercicio 1: [Nombre]

[CONTENIDO GENERADO AUTOMÁTICAMENTE]

## Ejercicio 2: [Nombre]

[CONTENIDO GENERADO AUTOMÁTICAMENTE]

## Soluciones

[SOLUCIONES GENERADAS AUTOMÁTICAMENTE]
`;

  try {
    await fs.writeFile(outputPath, content, 'utf-8');
    console.log(`    ✓ Ejercicios creados`);
    return { success: true, path: outputPath };
  } catch (error) {
    console.error(`    ✗ Error en ejercicios: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Procesar un módulo completo
async function processModule(moduleData) {
  const moduloId = moduleData.modulo_id;
  console.log(`\n${'='.repeat(60)}`);
  console.log(`MÓDULO ${moduloId}: ${moduleData.titulo}`);
  console.log(`${'='.repeat(60)}`);

  const stats = {
    contentGenerated: 0,
    exercisesGenerated: 0,
    skipped: 0,
    errors: 0
  };

  for (const tema of moduleData.temas) {
    console.log(`\nTema ${tema.tema_id}: ${tema.titulo}`);

    for (const subtema of tema.subtemas) {
      // Generar contenido
      const contentResult = await generateSubtemaContent(
        moduloId,
        tema.tema_id,
        subtema.subtema_id,
        subtema
      );

      if (contentResult.skipped) {
        stats.skipped++;
      } else if (contentResult.success) {
        stats.contentGenerated++;
      } else {
        stats.errors++;
      }

      // Generar ejercicios
      const exercisesResult = await generateSubtemaExercises(
        moduloId,
        tema.tema_id,
        subtema.subtema_id,
        subtema
      );

      if (exercisesResult.skipped) {
        stats.skipped++;
      } else if (exercisesResult.success) {
        stats.exercisesGenerated++;
      } else {
        stats.errors++;
      }

      // Pequeña pausa para evitar rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return stats;
}

// Función principal
async function main() {
  console.log('🚀 Generador Automatizado de Contenido del Curso SOLID\n');

  try {
    // Cargar plan curricular desde el JSON generado por Agente 1
    console.log('📖 Cargando plan curricular...');
    const curricularPlan = await loadCurricularPlan();

    console.log(`\n✓ Plan cargado: ${curricularPlan.length} módulos encontrados`);

    // Argumentos de línea de comandos
    const args = process.argv.slice(2);
    const moduleArg = args.find(arg => arg.startsWith('--module='));
    const startModule = moduleArg ? parseInt(moduleArg.split('=')[1]) : 1;

    console.log(`\n⚙️  Configuración:`);
    console.log(`   - Módulo inicial: ${startModule}`);
    console.log(`   - Módulos a procesar: ${curricularPlan.length - startModule + 1}`);

    // Procesar módulos
    const totalStats = {
      contentGenerated: 0,
      exercisesGenerated: 0,
      skipped: 0,
      errors: 0
    };

    for (const moduleData of curricularPlan) {
      if (moduleData.modulo_id < startModule) {
        console.log(`\n⏭️  Saltando Módulo ${moduleData.modulo_id} (ya procesado)`);
        continue;
      }

      const stats = await processModule(moduleData);

      // Acumular estadísticas
      totalStats.contentGenerated += stats.contentGenerated;
      totalStats.exercisesGenerated += stats.exercisesGenerated;
      totalStats.skipped += stats.skipped;
      totalStats.errors += stats.errors;
    }

    // Reporte final
    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 REPORTE FINAL');
    console.log(`${'='.repeat(60)}`);
    console.log(`✓ Contenidos generados: ${totalStats.contentGenerated}`);
    console.log(`✓ Ejercicios generados: ${totalStats.exercisesGenerated}`);
    console.log(`⏭️  Archivos saltados: ${totalStats.skipped}`);
    console.log(`✗ Errores: ${totalStats.errors}`);
    console.log();

    if (totalStats.errors > 0) {
      console.log('⚠️  Revisa los errores arriba y vuelve a ejecutar el script.');
      process.exit(1);
    } else {
      console.log('✅ Generación completada exitosamente!');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar si es el script principal
if (require.main === module) {
  main();
}

module.exports = {
  generateSubtemaContent,
  generateSubtemaExercises,
  processModule
};
