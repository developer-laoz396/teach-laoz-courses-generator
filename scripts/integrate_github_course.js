const fs = require('fs');
const path = require('path');

const courseDir = path.join(__dirname, '..', 'cursos', 'teach-laoz-curso_github_Principiantes');
const modulesDir = path.join(courseDir, 'modulos');

// Estructura del curso
const structure = [
  {
    module: 'modulo_0',
    title: 'Módulo 0: Diagnóstico y Configuración',
    topics: [
      { file: 'tema_0_glosario.md', title: 'Glosario de Preconceptos' },
      { file: 'tema_0.1_configuracion_contenido.md', title: 'Configuración de Entorno y Autenticación' },
      { file: 'tema_0.2_git_local_contenido.md', title: 'Repaso de Git Local' },
      { file: 'tema_0_ejercicios.md', title: 'Ejercicios Prácticos' },
      { file: 'tema_0_evaluacion.md', title: 'Evaluación' }
    ]
  },
  {
    module: 'modulo_1',
    title: 'Módulo 1: Flujos Colaborativos',
    topics: [
      { file: 'tema_1.1_github_flow_contenido.md', title: 'El GitHub Flow' },
      { file: 'tema_1.2_code_review_contenido.md', title: 'Code Review y Resolución de Conflictos' },
      { file: 'tema_1.3_branch_protection_contenido.md', title: 'Protección de Ramas' },
      { file: 'tema_1_ejercicios.md', title: 'Ejercicios Prácticos' },
      { file: 'tema_1_evaluacion.md', title: 'Evaluación' }
    ]
  },
  {
    module: 'modulo_2',
    title: 'Módulo 2: Gestión de Proyectos',
    topics: [
      { file: 'tema_2.1_issues_contenido.md', title: 'Issues, Labels y Milestones' },
      { file: 'tema_2.2_projects_contenido.md', title: 'GitHub Projects (Kanban)' },
      { file: 'tema_2.3_documentacion_contenido.md', title: 'README Profesional y Documentación' },
      { file: 'tema_2_ejercicios.md', title: 'Ejercicios Prácticos' },
      { file: 'tema_2_evaluacion.md', title: 'Evaluación' }
    ]
  },
  {
    module: 'modulo_3',
    title: 'Módulo 3: Automatización (GitHub Actions)',
    topics: [
      { file: 'tema_3.1_actions_fundamentos_contenido.md', title: 'Fundamentos de GitHub Actions' },
      { file: 'tema_3.2_ci_implementacion_contenido.md', title: 'Implementación de CI' },
      { file: 'tema_3_ejercicios.md', title: 'Ejercicios Prácticos' },
      { file: 'tema_3_evaluacion.md', title: 'Evaluación' }
    ]
  },
  {
    module: 'modulo_4',
    title: 'Módulo 4: Proyecto Final',
    topics: [
      { file: 'proyecto_final.md', title: 'Proyecto Final Integrador' }
    ]
  }
];

let cursoCompleto = `# GitHub para Ingenieros Principiante - Curso Completo

**Duración:** 2 Semanas (20-25 horas)  
**Nivel:** Básico-Intermedio  
**Audiencia:** Ingenieros Principiante

---

`;

let indice = `# Índice del Curso

## Tabla de Contenidos

`;

let sectionNumber = 0;

for (const mod of structure) {
  sectionNumber++;
  
  // Añadir al índice
  indice += `\n### ${sectionNumber}. ${mod.title}\n`;
  
  // Añadir al curso completo
  cursoCompleto += `\n---\n\n# ${mod.title}\n\n`;
  
  let topicNumber = 0;
  for (const topic of mod.topics) {
    topicNumber++;
    const filePath = path.join(modulesDir, mod.module, topic.file);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Añadir al índice
      indice += `   ${sectionNumber}.${topicNumber}. ${topic.title}\n`;
      
      // Añadir al curso completo
      cursoCompleto += `\n## ${sectionNumber}.${topicNumber}. ${topic.title}\n\n`;
      cursoCompleto += content.replace(/^#\s+/gm, '### ') + '\n\n';
      
      console.log(`✓ Integrado: ${mod.module}/${topic.file}`);
    } else {
      console.warn(`⚠ No encontrado: ${filePath}`);
    }
  }
}

// Añadir referencias al final
const refPath = path.join(courseDir, 'REFERENCIAS.md');
if (fs.existsSync(refPath)) {
  const refContent = fs.readFileSync(refPath, 'utf8');
  cursoCompleto += `\n---\n\n${refContent}\n`;
  indice += `\n### Referencias y Bibliografía\n`;
  console.log(`✓ Integrado: REFERENCIAS.md`);
}

// Guardar archivos
fs.writeFileSync(path.join(courseDir, 'CURSO_COMPLETO.md'), cursoCompleto);
fs.writeFileSync(path.join(courseDir, 'INDICE.md'), indice);

console.log(`\n📊 Integración completada:`);
console.log(`   - CURSO_COMPLETO.md: ${Math.round(cursoCompleto.length / 1024)} KB`);
console.log(`   - INDICE.md: ${Math.round(indice.length / 1024)} KB`);
