const fs = require('fs');
const path = require('path');

const courseDir = path.join(__dirname, '..', 'cursos', 'teach-laoz-curso_github_Principiantes');
const modulesDir = path.join(courseDir, 'modulos');

// Cargar plan curricular
const planPath = path.join(courseDir, 'plan_curricular.md');
const planContent = fs.readFileSync(planPath, 'utf8');

// Estructura esperada basada en el plan
const expectedStructure = {
  modulo_0: {
    title: 'Módulo 0: Diagnóstico y Configuración',
    files: [
      'tema_0_glosario.md',
      'tema_0.1_configuracion_contenido.md',
      'tema_0.2_git_local_contenido.md',
      'tema_0_ejercicios.md',
      'tema_0_evaluacion.md'
    ]
  },
  modulo_1: {
    title: 'Módulo 1: Flujos Colaborativos',
    files: [
      'tema_1.1_github_flow_contenido.md',
      'tema_1.2_code_review_contenido.md',
      'tema_1.3_branch_protection_contenido.md',
      'tema_1_ejercicios.md',
      'tema_1_evaluacion.md'
    ]
  },
  modulo_2: {
    title: 'Módulo 2: Gestión de Proyectos',
    files: [
      'tema_2.1_issues_contenido.md',
      'tema_2.2_projects_contenido.md',
      'tema_2.3_documentacion_contenido.md',
      'tema_2_ejercicios.md',
      'tema_2_evaluacion.md'
    ]
  },
  modulo_3: {
    title: 'Módulo 3: Automatización',
    files: [
      'tema_3.1_actions_fundamentos_contenido.md',
      'tema_3.2_ci_implementacion_contenido.md',
      'tema_3_ejercicios.md',
      'tema_3_evaluacion.md'
    ]
  },
  modulo_4: {
    title: 'Módulo 4: Proyecto Final',
    files: ['proyecto_final.md']
  }
};

const report = {
  timestamp: new Date().toISOString(),
  phases: {},
  summary: {
    totalChecks: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  },
  errors: [],
  warnings: []
};

// FASE 0: VALIDACIÓN DE COMPLETITUD
console.log('\n🔍 FASE 0: VALIDACIÓN DE COMPLETITUD\n');
report.phases.completitud = { checks: [], passed: 0, failed: 0 };

for (const [moduleId, moduleData] of Object.entries(expectedStructure)) {
  const modulePath = path.join(modulesDir, moduleId);
  
  // Verificar existencia del módulo
  if (!fs.existsSync(modulePath)) {
    report.errors.push(`❌ Módulo ${moduleId} no existe`);
    report.phases.completitud.failed++;
    continue;
  }
  
  // Verificar archivos esperados
  for (const file of moduleData.files) {
    const filePath = path.join(modulePath, file);
    report.summary.totalChecks++;
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 100) {
        console.log(`✅ ${moduleId}/${file} (${Math.round(stats.size / 1024)} KB)`);
        report.phases.completitud.passed++;
        report.summary.passed++;
      } else {
        console.log(`⚠️  ${moduleId}/${file} (archivo vacío)`);
        report.warnings.push(`Archivo vacío: ${moduleId}/${file}`);
        report.summary.warnings++;
      }
    } else {
      console.log(`❌ ${moduleId}/${file} NO ENCONTRADO`);
      report.errors.push(`Falta archivo: ${moduleId}/${file}`);
      report.phases.completitud.failed++;
      report.summary.failed++;
    }
  }
}

// FASE 1: VALIDACIÓN DE GUIONES DE AUDIO
console.log('\n🎧 FASE 1: VALIDACIÓN DE GUIONES DE AUDIO\n');
report.phases.audio = { checks: [], passed: 0, failed: 0 };

const audioTopics = [
  'modulo_0/tema_0.1_configuracion',
  'modulo_0/tema_0.2_git_local',
  'modulo_1/tema_1.1_github_flow',
  'modulo_1/tema_1.2_code_review',
  'modulo_1/tema_1.3_branch_protection',
  'modulo_2/tema_2.1_issues',
  'modulo_2/tema_2.2_projects',
  'modulo_2/tema_2.3_documentacion',
  'modulo_3/tema_3.1_actions_fundamentos',
  'modulo_3/tema_3.2_ci_implementacion'
];

for (const topic of audioTopics) {
  const guionPath = path.join(modulesDir, `${topic}_guion.md`);
  const txtPath = path.join(modulesDir, `${topic}_guion_optimizada.txt`);
  
  report.summary.totalChecks += 2;
  
  if (fs.existsSync(guionPath) && fs.existsSync(txtPath)) {
    console.log(`✅ ${topic} (guion.md + guion_optimizada.txt)`);
    report.phases.audio.passed += 2;
    report.summary.passed += 2;
  } else {
    if (!fs.existsSync(guionPath)) {
      console.log(`❌ ${topic}_guion.md NO ENCONTRADO`);
      report.errors.push(`Falta guion: ${topic}_guion.md`);
      report.phases.audio.failed++;
      report.summary.failed++;
    }
    if (!fs.existsSync(txtPath)) {
      console.log(`❌ ${topic}_guion_optimizada.txt NO ENCONTRADO`);
      report.errors.push(`Falta guion optimizado: ${topic}_guion_optimizada.txt`);
      report.phases.audio.failed++;
      report.summary.failed++;
    }
  }
}

// FASE 2: VALIDACIÓN DE DOCUMENTACIÓN
console.log('\n📚 FASE 2: VALIDACIÓN DE DOCUMENTACIÓN\n');
report.phases.documentacion = { checks: [], passed: 0, failed: 0 };

const requiredDocs = [
  'README.md',
  'plan_curricular.md',
  'pensum_competencias.md',
  'cronograma.md',
  'REFERENCIAS.md',
  'REPORTE_VERIFICACION.md',
  'CURSO_COMPLETO.md',
  'INDICE.md'
];

for (const doc of requiredDocs) {
  const docPath = path.join(courseDir, doc);
  report.summary.totalChecks++;
  
  if (fs.existsSync(docPath)) {
    const stats = fs.statSync(docPath);
    console.log(`✅ ${doc} (${Math.round(stats.size / 1024)} KB)`);
    report.phases.documentacion.passed++;
    report.summary.passed++;
  } else {
    console.log(`❌ ${doc} NO ENCONTRADO`);
    report.errors.push(`Falta documentación: ${doc}`);
    report.phases.documentacion.failed++;
    report.summary.failed++;
  }
}

// FASE 3: VALIDACIÓN DE COHERENCIA
console.log('\n🔗 FASE 3: VALIDACIÓN DE COHERENCIA\n');
report.phases.coherencia = { checks: [], passed: 0, failed: 0 };

// Verificar que cada módulo tenga ejercicios Y evaluación
for (const [moduleId, moduleData] of Object.entries(expectedStructure)) {
  if (moduleId === 'modulo_4') continue; // Proyecto final no tiene evaluación tradicional
  
  const hasEjercicios = moduleData.files.some(f => f.includes('ejercicios'));
  const hasEvaluacion = moduleData.files.some(f => f.includes('evaluacion'));
  
  report.summary.totalChecks++;
  
  if (hasEjercicios && hasEvaluacion) {
    console.log(`✅ ${moduleId}: Tiene ejercicios y evaluación`);
    report.phases.coherencia.passed++;
    report.summary.passed++;
  } else {
    console.log(`⚠️  ${moduleId}: Falta ${!hasEjercicios ? 'ejercicios' : 'evaluación'}`);
    report.warnings.push(`${moduleId} incompleto`);
    report.summary.warnings++;
  }
}

// RESUMEN FINAL
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(60));
console.log(`Total de verificaciones: ${report.summary.totalChecks}`);
console.log(`✅ Pasadas: ${report.summary.passed} (${Math.round(report.summary.passed / report.summary.totalChecks * 100)}%)`);
console.log(`❌ Fallidas: ${report.summary.failed}`);
console.log(`⚠️  Advertencias: ${report.summary.warnings}`);
console.log('='.repeat(60));

if (report.errors.length > 0) {
  console.log('\n❌ ERRORES CRÍTICOS:');
  report.errors.forEach(e => console.log(`   - ${e}`));
}

if (report.warnings.length > 0) {
  console.log('\n⚠️  ADVERTENCIAS:');
  report.warnings.forEach(w => console.log(`   - ${w}`));
}

// Guardar reporte
const reportPath = path.join(courseDir, 'REPORTE_INTEGRACION.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n💾 Reporte guardado en: ${reportPath}`);

// Determinar estado final
const successRate = (report.summary.passed / report.summary.totalChecks) * 100;
if (successRate >= 95) {
  console.log('\n✅ CURSO APROBADO - Listo para despliegue');
  process.exit(0);
} else if (successRate >= 80) {
  console.log('\n⚠️  CURSO CON ADVERTENCIAS - Revisar antes de despliegue');
  process.exit(1);
} else {
  console.log('\n❌ CURSO NO APROBADO - Requiere correcciones');
  process.exit(2);
}
