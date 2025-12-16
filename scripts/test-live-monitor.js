#!/usr/bin/env node

/**
 * Script de prueba para verificar que el live monitor funciona correctamente
 * Simula la ejecución de un curso para validar la actualización en tiempo real
 */

const MetricsLogger = require('./util/metrics-logger');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testLiveMonitor() {
  console.log('\n🧪 INICIANDO TEST DEL LIVE MONITOR\n');
  console.log('👀 Abre el live monitor en otra ventana para ver las actualizaciones:');
  console.log('   .\\scripts\\open_live_monitor.ps1\n');
  
  const metrics = new MetricsLogger('logs');
  
  console.log('✓ MetricsLogger inicializado\n');
  
  // FASE 1: PREPARACIÓN
  console.log('📦 Iniciando FASE 0: PREPARACIÓN...');
  metrics.startPhase('PREPARACION', 'Creando estructura de directorios');
  await sleep(2000);
  metrics.log('info', 'Directorio principal creado');
  await sleep(1000);
  metrics.log('info', 'Subdirectorios creados');
  metrics.endPhase('PREPARACION', 'success');
  console.log('✅ Fase 0 completada\n');
  await sleep(2000);
  
  // FASE 2: PLANIFICACIÓN
  console.log('📋 Iniciando FASE 1: PLANIFICACIÓN...');
  metrics.startPhase('PLANIFICACION', 'Generando plan curricular');
  
  const a1Id = metrics.startAgent('A1_Estratega', {
    tema: 'Test de Live Monitor',
    complejidad: 'intermedio'
  });
  
  metrics.log('info', 'Llamando a Agente 1: Estratega Curricular');
  await sleep(3000);
  metrics.log('success', 'Plan curricular generado');
  metrics.endAgent(a1Id, 'success', { modulos: 3 });
  
  metrics.endPhase('PLANIFICACION', 'success');
  console.log('✅ Fase 1 completada\n');
  await sleep(2000);
  
  // FASE 3: PRODUCCIÓN (simular múltiples agentes)
  console.log('🏭 Iniciando FASE 2: PRODUCCIÓN...');
  metrics.startPhase('PRODUCCION', 'Generando contenido de módulos');
  
  for (let i = 1; i <= 3; i++) {
    metrics.log('info', `Procesando Módulo ${i}/3`);
    
    // Sintetizador
    const a2Id = metrics.startAgent('A2_Sintetizador', {
      modulo: i,
      tema: 1,
      subtema: 1
    });
    await sleep(1500);
    metrics.endAgent(a2Id, 'success', { contenido: 'generado' });
    
    // Editor Cognitivo
    const a11Id = metrics.startAgent('A11_EditorCognitivo', {
      modulo: i
    });
    await sleep(1000);
    metrics.endAgent(a11Id, 'success', { optimizado: true });
    
    // Simular error ocasional
    if (i === 2) {
      const a3Id = metrics.startAgent('A3_DisenadorEjercicios', {
        modulo: i
      });
      await sleep(500);
      metrics.endAgent(a3Id, 'error', {}, 'Timeout en generación');
      metrics.log('warning', 'Error en ejercicios del módulo 2, reintentando...');
      
      const a3IdRetry = metrics.startAgent('A3_DisenadorEjercicios', {
        modulo: i,
        retry: 1
      });
      await sleep(1000);
      metrics.endAgent(a3IdRetry, 'success', { ejercicios: 5 });
    } else {
      const a3Id = metrics.startAgent('A3_DisenadorEjercicios', {
        modulo: i
      });
      await sleep(1200);
      metrics.endAgent(a3Id, 'success', { ejercicios: 5 });
    }
    
    await sleep(500);
  }
  
  metrics.endPhase('PRODUCCION', 'success');
  console.log('✅ Fase 2 completada\n');
  await sleep(2000);
  
  // FASE 4: INTEGRACIÓN
  console.log('🔗 Iniciando FASE 4: INTEGRACIÓN...');
  metrics.startPhase('INTEGRACION', 'Ensamblando curso completo');
  
  const a5Id = metrics.startAgent('A5_Integrador', {
    artifacts: 15
  });
  await sleep(2000);
  metrics.log('info', 'Integrando todos los módulos');
  await sleep(1000);
  metrics.endAgent(a5Id, 'success', { cursoCompleto: true });
  
  const a13Id = metrics.startAgent('A13_VerificadorIntegridad', {
    curso: 'CURSO_COMPLETO.md'
  });
  await sleep(1500);
  metrics.log('success', 'Verificación de integridad completada');
  metrics.endAgent(a13Id, 'success', { erroresCriticos: 0 });
  
  metrics.endPhase('INTEGRACION', 'success');
  console.log('✅ Fase 4 completada\n');
  await sleep(2000);
  
  // FINALIZAR
  console.log('🎉 Finalizando sesión...');
  metrics.endSession('completed');
  await metrics.save();
  
  const summary = metrics.getSummary();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DEL TEST');
  console.log('='.repeat(60));
  console.log(`Session ID: ${summary.sessionId}`);
  console.log(`Duración: ${(summary.duration / 1000).toFixed(2)}s`);
  console.log(`Total de llamadas: ${summary.totalCalls}`);
  console.log(`Tasa de éxito: ${summary.successRate}%`);
  console.log(`Errores: ${summary.errors}`);
  console.log(`Warnings: ${summary.warnings}`);
  console.log('='.repeat(60));
  console.log('\n✅ Test completado exitosamente\n');
  console.log('📈 Revisa el live monitor para ver las actualizaciones en tiempo real');
  console.log('📁 Archivos generados en: logs/\n');
}

// Ejecutar test
testLiveMonitor().catch(error => {
  console.error('\n❌ Error en el test:', error);
  process.exit(1);
});
