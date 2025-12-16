/**
 * Ejemplo de uso del sistema de métricas y logging
 * Demuestra cómo integrar MetricsLogger en el workflow del Manager
 */

const MetricsLogger = require('./util/metrics-logger');
const DashboardGenerator = require('./util/generate-dashboard');

// Simulación de un flujo de trabajo del sistema multi-agente
async function ejemploSistemaMultiAgente() {
  // 1. Inicializar el logger de métricas
  const logger = new MetricsLogger('./logs');
  
  console.log('\n🚀 Iniciando sistema de generación de curso...\n');

  try {
    // 2. FASE 1: PLANIFICACIÓN
    logger.startPhase('FASE_1_PLANIFICACION', 'Diseño curricular y estructura del curso');
    
    // Agente 1: Estratega
    const a1ExecId = logger.startAgent('A1', 'Estratega', 'FASE_1_PLANIFICACION', {
      tema: 'SOLID en JavaScript',
      complejidad: 'Media',
      duracion: 40
    });
    
    await simularTrabajo(3000); // Simular 3 segundos de trabajo
    
    logger.endAgent(a1ExecId, 'A1', 'success', {
      plan_generado: true,
      modulos: 10,
      temas: 45
    });

    // Agente 12: Analista Preconceptos
    const a12ExecId = logger.startAgent('A12', 'Analista Preconceptos', 'FASE_1_PLANIFICACION', {
      conceptos_base: ['JavaScript', 'Programación Orientada a Objetos', 'Patrones de diseño']
    });
    
    await simularTrabajo(2500);
    
    logger.endAgent(a12ExecId, 'A12', 'success', {
      modulo_0_generado: true,
      conceptos_cubiertos: 15
    });

    logger.endPhase('FASE_1_PLANIFICACION', 'success');

    // 3. FASE 2: PRODUCCIÓN
    logger.startPhase('FASE_2_PRODUCCION', 'Generación de contenido educativo');

    // Agente 2: Sintetizador (con un reintento)
    const a2ExecId = logger.startAgent('A2', 'Sintetizador', 'FASE_2_PRODUCCION', {
      modulo: 1,
      tema: 'Single Responsibility Principle'
    });
    
    await simularTrabajo(2000);
    
    // Simular un error que requiere reintento
    logger.endAgent(a2ExecId, 'A2', 'failed', null, 'Timeout en la generación de contenido');
    logger.recordRetry(a2ExecId, 'A2', 1, 'Timeout - reintentando con mayor timeout');
    
    const a2ExecId2 = logger.startAgent('A2', 'Sintetizador', 'FASE_2_PRODUCCION', {
      modulo: 1,
      tema: 'Single Responsibility Principle',
      retry: 1
    });
    
    await simularTrabajo(3000);
    
    logger.endAgent(a2ExecId2, 'A2', 'success', {
      contenido_generado: true,
      palabras: 3500,
      ejemplos: 8
    });

    // Agente 11: Editor Cognitivo
    const a11ExecId = logger.startAgent('A11', 'Editor Cognitivo', 'FASE_2_PRODUCCION', {
      contenido_input: 'contenido_sintetizador.md'
    });
    
    await simularTrabajo(1800);
    
    logger.endAgent(a11ExecId, 'A11', 'success', {
      optimizado: true,
      analogias_agregadas: 5,
      simplificaciones: 12
    });

    // Agente 3: Diseñador de Ejercicios
    const a3ExecId = logger.startAgent('A3', 'Diseñador de Ejercicios', 'FASE_2_PRODUCCION', {
      tema: 'Single Responsibility Principle'
    });
    
    await simularTrabajo(2200);
    
    logger.endAgent(a3ExecId, 'A3', 'success', {
      ejercicios_generados: 6,
      dificultad: ['básico', 'intermedio', 'avanzado']
    });

    logger.endPhase('FASE_2_PRODUCCION', 'success');

    // 4. FASE 3: ENRIQUECIMIENTO
    logger.startPhase('FASE_3_ENRIQUECIMIENTO', 'Recursos visuales e interactivos');

    // Agente 4: Simulador
    const a4ExecId = logger.startAgent('A4', 'Simulador', 'FASE_3_ENRIQUECIMIENTO', {
      tipo: 'visualizacion_interactiva',
      tema: 'Refactoring con SRP'
    });
    
    await simularTrabajo(4000);
    
    logger.endAgent(a4ExecId, 'A4', 'success', {
      simulacion_generada: true,
      archivo: 'simulacion_srp.html',
      interactivo: true
    });

    // Agente 6: Diseñador Gráfico
    const a6ExecId = logger.startAgent('A6', 'Diseñador Gráfico', 'FASE_3_ENRIQUECIMIENTO', {
      diagramas_requeridos: 5
    });
    
    await simularTrabajo(3500);
    
    logger.endAgent(a6ExecId, 'A6', 'success', {
      diagramas_generados: 5,
      prompts_imagen: 3
    });

    logger.endPhase('FASE_3_ENRIQUECIMIENTO', 'success');

    // 5. FASE 4: VERIFICACIÓN
    logger.startPhase('FASE_4_VERIFICACION', 'Verificación de integridad y referencias');

    // Agente 13: Verificador de Integridad
    const a13ExecId = logger.startAgent('A13', 'Verificador de Integridad', 'FASE_4_VERIFICACION', {
      contenido_path: './cursos/teach-laoz-curso-solid-javascript'
    });
    
    await simularTrabajo(5000);
    
    // Simular una advertencia de inconsistencia
    logger.recordWarning('Referencia potencialmente desactualizada detectada en Módulo 3', {
      agente: 'A13',
      severidad: 'warning',
      tema: 'Liskov Substitution Principle',
      referencia: 'https://example.com/old-article-2018'
    });
    
    logger.endAgent(a13ExecId, 'A13', 'success', {
      referencias_encontradas: 135,
      referencias_por_tema: 3,
      inconsistencias_criticas: 0,
      inconsistencias_advertencia: 1,
      inconsistencias_informativas: 3,
      reporte_generado: 'REPORTE_VERIFICACION.md',
      referencias_generadas: 'REFERENCIAS.md'
    });

    logger.endPhase('FASE_4_VERIFICACION', 'success');

    // 6. FASE 4.2: INTEGRACIÓN
    logger.startPhase('FASE_4_2_INTEGRACION', 'Compilación y generación de PDFs');

    // Agente 5: Integrador
    const a5ExecId = logger.startAgent('A5', 'Integrador', 'FASE_4_2_INTEGRACION', {
      modulos: 10
    });
    
    await simularTrabajo(2000);
    
    logger.endAgent(a5ExecId, 'A5', 'success', {
      curso_completo_generado: true,
      archivo: 'CURSO_COMPLETO.md',
      total_palabras: 45000
    });

    // Agente 10: Generador PDF
    const a10ExecId = logger.startAgent('A10', 'Generador PDF', 'FASE_4_2_INTEGRACION', {
      input: 'CURSO_COMPLETO.md'
    });
    
    await simularTrabajo(6000);
    
    logger.endAgent(a10ExecId, 'A10', 'success', {
      pdf_generado: true,
      archivo: 'Manual_SOLID_JavaScript.pdf',
      paginas: 285
    });

    logger.endPhase('FASE_4_2_INTEGRACION', 'success');

    // 7. Finalizar sesión
    logger.endSession('completed');

    // 8. Mostrar resumen
    const summary = logger.getSummary();
    console.log('\n📊 RESUMEN DE EJECUCIÓN:');
    console.log('═══════════════════════════════════════');
    console.log(`Sesión ID: ${summary.sessionId}`);
    console.log(`Duración: ${formatDuration(summary.duration)}`);
    console.log(`Total de llamadas: ${summary.totalCalls}`);
    console.log(`Tasa de éxito: ${summary.successRate}%`);
    console.log(`Agentes activos: ${summary.activeAgents}`);
    console.log(`Fases completadas: ${summary.phases}`);
    console.log(`Errores: ${summary.errors}`);
    console.log(`Advertencias: ${summary.warnings}`);
    console.log('═══════════════════════════════════════\n');

    // 9. Generar dashboard
    console.log('🎨 Generando dashboard estático...');
    const dashboardGenerator = new DashboardGenerator(
      './logs/metrics-current.json',
      './logs/logs-current.json',
      './logs/dashboard.html'
    );
    
    dashboardGenerator.generate();

    console.log('\n✅ Proceso completado exitosamente!\n');
    console.log('Archivos generados:');
    console.log('  📊 Métricas: ./logs/metrics-current.json');
    console.log('  📋 Logs: ./logs/logs-current.json');
    console.log('  🎨 Dashboard: ./logs/dashboard.html');
    console.log('\nAbre el dashboard en tu navegador para visualizar las métricas.\n');

  } catch (error) {
    console.error('❌ Error en el sistema:', error);
    logger.endSession('failed');
  }
}

// Función auxiliar para simular trabajo asíncrono
function simularTrabajo(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función auxiliar para formatear duración
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

// Ejecutar ejemplo si se llama directamente
if (require.main === module) {
  ejemploSistemaMultiAgente()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = ejemploSistemaMultiAgente;
