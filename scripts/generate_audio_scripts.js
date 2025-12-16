const fs = require('fs');
const path = require('path');

// Configuración de temas a procesar
const topics = [
  { module: 'modulo_0', file: 'tema_0.2_git_local_contenido.md', output: 'tema_0.2_git_local' },
  { module: 'modulo_1', file: 'tema_1.1_github_flow_contenido.md', output: 'tema_1.1_github_flow' },
  { module: 'modulo_1', file: 'tema_1.2_code_review_contenido.md', output: 'tema_1.2_code_review' },
  { module: 'modulo_1', file: 'tema_1.3_branch_protection_contenido.md', output: 'tema_1.3_branch_protection' },
  { module: 'modulo_2', file: 'tema_2.1_issues_contenido.md', output: 'tema_2.1_issues' },
  { module: 'modulo_2', file: 'tema_2.2_projects_contenido.md', output: 'tema_2.2_projects' },
  { module: 'modulo_2', file: 'tema_2.3_documentacion_contenido.md', output: 'tema_2.3_documentacion' },
  { module: 'modulo_3', file: 'tema_3.1_actions_fundamentos_contenido.md', output: 'tema_3.1_actions_fundamentos' },
  { module: 'modulo_3', file: 'tema_3.2_ci_implementacion_contenido.md', output: 'tema_3.2_ci_implementacion' }
];

const baseDir = path.join(__dirname, '..', 'cursos', 'teach-laoz-curso_github_Principiantes', 'modulos');

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : 'Tema';
}

function extractDuration(content) {
  const match = content.match(/\*\*Tiempo estimado\*\*:\s*(\d+)\s*minutos/);
  if (match) {
    const mins = parseInt(match[1]);
    return `${Math.floor(mins * 0.15)}-${Math.floor(mins * 0.20)} minutos`;
  }
  return '8-10 minutos';
}

function generateGuionMD(title, duration, content) {
  return `# GUIÓN: ${title}

## FICHA TÉCNICA
- **Duración**: ${duration}
- **Tono**: Profesional, didáctico
- **Audiencia**: Ingenieros Principiante

---

### 00:00 - INTRODUCCIÓN

**[LOCUTOR]**: (Entusiasta)

${extractIntro(content)}

### DESARROLLO

**[LOCUTOR]**: (Didáctico)

${extractMainContent(content)}

### CIERRE

**[LOCUTOR]**: (Conclusivo)

${extractConclusion(content)}
`;
}

function extractIntro(content) {
  const match = content.match(/##\s+¿Por qué importa este concepto\?[\s\S]*?(?=##)/);
  if (match) {
    return cleanText(match[0].replace(/##\s+¿Por qué importa este concepto\?/, '').trim());
  }
  return 'Bienvenido a este tema del curso GitHub para Ingenieros Principiante.';
}

function extractMainContent(content) {
  const sections = content.split(/##\s+/);
  let mainContent = '';
  
  for (let section of sections) {
    if (section.includes('Comprensión intuitiva') || 
        section.includes('Implementación práctica') ||
        section.includes('Definición formal')) {
      mainContent += cleanText(section) + '\n\n';
    }
  }
  
  return mainContent.trim() || 'Contenido principal del tema.';
}

function extractConclusion(content) {
  const match = content.match(/##\s+Resumen del concepto[\s\S]*$/);
  if (match) {
    return cleanText(match[0].replace(/##\s+Resumen del concepto/, '').trim());
  }
  return 'Esto concluye este tema. Nos vemos en el siguiente.';
}

function cleanText(text) {
  return text
    .replace(/###\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '[código omitido en audio]')
    .replace(/^\s*[-*]\s+/gm, '')
    .trim();
}

function generateOptimizedTXT(guionMD) {
  return guionMD
    .replace(/^#.*$/gm, '')
    .replace(/^##.*$/gm, '')
    .replace(/^###.*$/gm, '')
    .replace(/\*\*\[LOCUTOR\]\*\*:\s*\([^)]+\)/gm, '')
    .replace(/^-{3,}$/gm, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Procesar todos los temas
let processed = 0;
let errors = [];

for (const topic of topics) {
  try {
    const inputPath = path.join(baseDir, topic.module, topic.file);
    const content = fs.readFileSync(inputPath, 'utf8');
    
    const title = extractTitle(content);
    const duration = extractDuration(content);
    
    const guionMD = generateGuionMD(title, duration, content);
    const guionTXT = generateOptimizedTXT(guionMD);
    
    const outputMDPath = path.join(baseDir, topic.module, `${topic.output}_guion.md`);
    const outputTXTPath = path.join(baseDir, topic.module, `${topic.output}_guion_optimizada.txt`);
    
    fs.writeFileSync(outputMDPath, guionMD);
    fs.writeFileSync(outputTXTPath, guionTXT);
    
    processed++;
    console.log(`✓ Generado: ${topic.output}`);
  } catch (error) {
    errors.push({ topic: topic.output, error: error.message });
    console.error(`✗ Error en ${topic.output}:`, error.message);
  }
}

console.log(`\n📊 Resumen:`);
console.log(`   Procesados: ${processed}/${topics.length}`);
console.log(`   Errores: ${errors.length}`);

if (errors.length > 0) {
  console.log(`\n❌ Errores:`);
  errors.forEach(e => console.log(`   - ${e.topic}: ${e.error}`));
}
